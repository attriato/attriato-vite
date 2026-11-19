const COOKIE_NAME = "ga4_session";
const STATE_COOKIE_NAME = "ga4_oauth_state";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_REVOKE_URL = "https://oauth2.googleapis.com/revoke";
const GA4_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const METRICS = [
  "totalUsers",
  "sessions",
  "engagedSessions",
  "engagementRate",
  "sessionConversionRate",
  "conversions",
  "eventCount",
  "screenPageViews",
  "bounceRate",
];
const REPORTS = [
  { key: "totals", dimensions: [] },
  { key: "daily", dimensions: ["date"] },
  { key: "channels", dimensions: ["sessionDefaultChannelGroup"] },
  { key: "landingPages", dimensions: ["landingPagePlusQueryString"] },
  { key: "devices", dimensions: ["deviceCategory"] },
  { key: "events", dimensions: ["eventName"], metrics: ["eventCount", "totalUsers", "conversions"] },
];

const jsonHeaders = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };

function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...jsonHeaders, ...headers } });
}

function cookies(request) {
  return Object.fromEntries(
    (request.headers.get("Cookie") || "")
      .split(";")
      .map((part) => part.trim().split(/=(.*)/s).slice(0, 2))
      .filter(([name, value]) => name && value !== undefined)
  );
}

function cookieHeader(request, name, value, maxAge) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${name}=${value}; Path=/api/ga4; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`;
}

function base64UrlEncode(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function encryptionKey(env) {
  if (!env.GA4_SESSION_SECRET || env.GA4_SESSION_SECRET.length < 32) {
    throw new Error("GA4_SESSION_SECRET must be configured with at least 32 characters.");
  }
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(env.GA4_SESSION_SECRET));
  return crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function encryptSession(session, env) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    await encryptionKey(env),
    new TextEncoder().encode(JSON.stringify(session))
  );
  return `${base64UrlEncode(iv)}.${base64UrlEncode(new Uint8Array(ciphertext))}`;
}

async function decryptSession(request, env) {
  const value = cookies(request)[COOKIE_NAME];
  if (!value) return null;

  try {
    const [encodedIv, encodedCiphertext] = value.split(".");
    if (!encodedIv || !encodedCiphertext) throw new Error("Invalid session cookie.");
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: base64UrlDecode(encodedIv) },
      await encryptionKey(env),
      base64UrlDecode(encodedCiphertext)
    );
    return JSON.parse(new TextDecoder().decode(plaintext));
  } catch (error) {
    if (error.message === "GA4_SESSION_SECRET is not configured.") throw error;
    return null;
  }
}

function redirectUri(env) {
  if (!env.GA4_REDIRECT_URI) throw new Error("GA4_REDIRECT_URI is not configured.");
  return env.GA4_REDIRECT_URI;
}

function clientCredentials(env) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth client credentials are not configured.");
  }
  return { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET };
}

function missingConfigurationResponse(error) {
  return jsonResponse({ error: error.message }, 503);
}

async function readGoogleError(response) {
  const payload = await response.json().catch(() => ({}));
  return payload.error?.message || payload.error_description || `Google API request failed (${response.status}).`;
}

async function refreshSession(session, env) {
  if (session.expiresAt > Date.now() + 60_000) return { session, refreshed: false };
  if (!session.refreshToken) throw new Error("Google authorization has expired. Please reconnect your account.");

  const { clientId, clientSecret } = clientCredentials(env);
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: session.refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!response.ok) throw new Error(await readGoogleError(response));
  const token = await response.json();
  return {
    session: { ...session, accessToken: token.access_token, expiresAt: Date.now() + token.expires_in * 1000 },
    refreshed: true,
  };
}

async function withGoogleSession(request, env, action) {
  const session = await decryptSession(request, env);
  if (!session) return jsonResponse({ error: "Connect a Google Analytics account to continue." }, 401);

  try {
    const result = await refreshSession(session, env);
    const response = await action(result.session);
    if (!result.refreshed) return response;
    const headers = new Headers(response.headers);
    headers.append("Set-Cookie", cookieHeader(request, COOKIE_NAME, await encryptSession(result.session, env), SESSION_MAX_AGE));
    return new Response(response.body, { status: response.status, headers });
  } catch (error) {
    return jsonResponse({ error: error.message || "Unable to refresh Google authorization." }, 502);
  }
}

async function googleApi(url, accessToken, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok) throw new Error(await readGoogleError(response));
  return response.json();
}

async function listProperties(accessToken) {
  const properties = [];
  let pageToken;
  do {
    const url = new URL("https://analyticsadmin.googleapis.com/v1beta/accountSummaries");
    url.searchParams.set("pageSize", "200");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const page = await googleApi(url, accessToken);
    for (const account of page.accountSummaries || []) {
      for (const property of account.propertySummaries || []) {
        properties.push({
          id: property.property?.replace(/^properties\//, ""),
          name: property.displayName,
          accountName: account.displayName,
        });
      }
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  return properties.filter((property) => property.id && property.name);
}

function previousSevenDayRanges() {
  return [
    { name: "current", startDate: "7daysAgo", endDate: "yesterday" },
    { name: "comparison", startDate: "14daysAgo", endDate: "8daysAgo" },
  ];
}

function reportRows(report, dateRangeName) {
  const dimensionNames = (report.dimensionHeaders || []).map((header) => header.name);
  const metricNames = (report.metricHeaders || []).map((header) => header.name);
  return (report.rows || []).map((row) => {
    const dimensions = Object.fromEntries(dimensionNames.map((name, index) => {
      const value = row.dimensionValues[index]?.value;
      return [name, name === "landingPagePlusQueryString" ? value?.split("?")[0] : value];
    }));
    const metrics = Object.fromEntries(metricNames.map((name, index) => [name, Number(row.metricValues[index]?.value || 0)]));
    if (dimensions.date) {
      const date = dimensions.date;
      dimensions.date = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
    }
    return { ...dimensions, ...metrics, dateRange: dateRangeName };
  });
}

async function runAnalyticsReport(propertyId, accessToken, dateRange, dateRangeName, definition) {
  const metrics = definition.metrics || METRICS;
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const payload = await googleApi(url, accessToken, {
    method: "POST",
    body: JSON.stringify({
      dateRanges: [dateRange],
      dimensions: definition.dimensions.map((name) => ({ name })),
      metrics: metrics.map((name) => ({ name })),
      limit: definition.key === "daily" ? "400" : "25",
      orderBys: definition.key === "daily"
        ? [{ dimension: { dimensionName: "date" } }]
        : [{ metric: { metricName: metrics[0] }, desc: true }],
    }),
  });
  return reportRows(payload, dateRangeName);
}

async function handleConnect(request, env) {
  if (request.method !== "GET") return jsonResponse({ error: "Method not allowed." }, 405, { Allow: "GET" });
  try {
    const { clientId } = clientCredentials(env);
    const callback = redirectUri(env);
    await encryptionKey(env);
    const state = base64UrlEncode(crypto.getRandomValues(new Uint8Array(32)));
    const url = new URL(GOOGLE_AUTH_URL);
    url.search = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callback,
      response_type: "code",
      scope: GA4_SCOPE,
      access_type: "offline",
      prompt: "consent",
      state,
    });
    return jsonResponse({ url: url.toString() }, 200, {
      "Set-Cookie": cookieHeader(request, STATE_COOKIE_NAME, state, 600),
    });
  } catch (error) {
    return missingConfigurationResponse(error);
  }
}

async function handleCallback(request, env) {
  const url = new URL(request.url);
  const state = cookies(request)[STATE_COOKIE_NAME];
  const clearState = cookieHeader(request, STATE_COOKIE_NAME, "", 0);
  let appUrl;
  try {
    appUrl = `${new URL(redirectUri(env)).origin}/#/ga4-insights`;
  } catch (error) {
    return missingConfigurationResponse(error);
  }
  const redirect = (query) => new Response(null, {
    status: 302,
    headers: { Location: `${appUrl}?${query}`, "Set-Cookie": clearState },
  });
  if (url.searchParams.has("error")) return redirect("ga4_error=authorization_denied");
  if (!url.searchParams.get("code") || !state || state !== url.searchParams.get("state")) {
    return new Response(null, { status: 302, headers: { Location: `${appUrl}?ga4_error=invalid_state`, "Set-Cookie": clearState } });
  }

  try {
    const { clientId, clientSecret } = clientCredentials(env);
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: url.searchParams.get("code"),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri(env),
        grant_type: "authorization_code",
      }),
    });
    if (!response.ok) {
      console.error("Google OAuth token exchange failed:", await readGoogleError(response));
      return new Response(null, { status: 302, headers: { Location: `${appUrl}?ga4_error=token_exchange_failed`, "Set-Cookie": clearState } });
    }
    const token = await response.json();
    if (!token.access_token) throw new Error("Google OAuth did not return an access token.");
    const sessionCookie = cookieHeader(
      request,
      COOKIE_NAME,
      await encryptSession({
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        expiresAt: Date.now() + token.expires_in * 1000,
      }, env),
      SESSION_MAX_AGE
    );
    const headers = new Headers({ Location: `${appUrl}?ga4=connected` });
    headers.append("Set-Cookie", clearState);
    headers.append("Set-Cookie", sessionCookie);
    return new Response(null, { status: 302, headers });
  } catch (error) {
    console.error("Google OAuth callback failed:", error);
    return new Response(null, { status: 302, headers: { Location: `${appUrl}?ga4_error=connection_failed`, "Set-Cookie": clearState } });
  }
}

async function handleProperties(request, env) {
  if (request.method !== "GET") return jsonResponse({ error: "Method not allowed." }, 405, { Allow: "GET" });
  return withGoogleSession(request, env, async (session) => {
    try {
      return jsonResponse({ properties: await listProperties(session.accessToken) });
    } catch (error) {
      return jsonResponse({ error: error.message || "Unable to list GA4 properties." }, 502);
    }
  });
}

async function handleReport(request, env) {
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405, { Allow: "POST" });
  return withGoogleSession(request, env, async (session) => {
    try {
      const input = await request.json();
      if (typeof input.propertyId !== "string" || !/^\d{1,20}$/.test(input.propertyId)) {
        return jsonResponse({ error: "Choose a valid GA4 property." }, 400);
      }
      const dateRanges = previousSevenDayRanges();
      const reportData = {};
      await Promise.all(REPORTS.map(async (definition) => {
        const rows = [];
        for (const range of dateRanges) {
          rows.push(...await runAnalyticsReport(
            input.propertyId,
            session.accessToken,
            range,
            range.name,
            definition
          ));
        }
        reportData[definition.key] = rows;
      }));
      return jsonResponse({ dateRanges, report: reportData });
    } catch (error) {
      const status = error.message?.includes("Choose ") ? 400 : error.message?.includes("not configured") ? 503 : 502;
      return jsonResponse({ error: error.message || "Unable to run the GA4 report." }, status);
    }
  });
}

async function handleDisconnect(request, env) {
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405, { Allow: "POST" });
  const clearCookie = cookieHeader(request, COOKIE_NAME, "", 0);
  const session = await decryptSession(request, env);
  if (!session) return jsonResponse({ connected: false }, 200, { "Set-Cookie": clearCookie });

  if (session.refreshToken || session.accessToken) {
    try {
      const response = await fetch(GOOGLE_REVOKE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ token: session.refreshToken || session.accessToken }),
      });
      if (!response.ok) {
        return jsonResponse(
          { error: "Local access was cleared, but Google could not revoke the authorization. Revoke it from your Google Account settings." },
          502,
          { "Set-Cookie": clearCookie }
        );
      }
    } catch (error) {
      console.error("Google OAuth token revocation failed:", error);
      return jsonResponse(
        { error: "Local access was cleared, but Google could not revoke the authorization. Revoke it from your Google Account settings." },
        502,
        { "Set-Cookie": clearCookie }
      );
    }
  }
  return jsonResponse({ connected: false }, 200, { "Set-Cookie": clearCookie });
}

export async function handleGa4(request, env) {
  const { pathname } = new URL(request.url);
  if (pathname === "/api/ga4/connect") return handleConnect(request, env);
  if (pathname === "/api/ga4/callback") return handleCallback(request, env);
  if (pathname === "/api/ga4/status" && request.method === "GET") {
    try {
      return jsonResponse({ connected: Boolean(await decryptSession(request, env)) });
    } catch (error) {
      return missingConfigurationResponse(error);
    }
  }
  if (pathname === "/api/ga4/properties") return handleProperties(request, env);
  if (pathname === "/api/ga4/report") return handleReport(request, env);
  if (pathname === "/api/ga4/disconnect") return handleDisconnect(request, env);
  return jsonResponse({ error: "Not found." }, 404);
}
