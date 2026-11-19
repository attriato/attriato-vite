import assert from "node:assert/strict";
import { test } from "node:test";
import { handleGa4 } from "./ga4.js";

test("returns a comparative GA4 report without an AI service", async (t) => {
  const env = { GA4_SESSION_SECRET: "test-session-secret-".repeat(3) };
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(env.GA4_SESSION_SECRET));
  const key = await crypto.subtle.importKey("raw", digest, "AES-GCM", false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify({ accessToken: "test-token", expiresAt: Date.now() + 3600000 }))
  );
  const cookie = `ga4_session=${Buffer.from(iv).toString("base64url")}.${Buffer.from(ciphertext).toString("base64url")}`;
  const calls = [];

  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.match(String(url), /^https:\/\/analyticsdata\.googleapis\.com\//);
    const request = JSON.parse(options.body);
    calls.push(request);
    const current = request.dateRanges[0].name === "current";
    return Response.json({
      dimensionHeaders: request.dimensions,
      metricHeaders: request.metrics,
      rows: [{
        dimensionValues: request.dimensions.map(({ name }) => ({
          value: name === "date" ? "20261117" : name === "landingPagePlusQueryString" ? "/pricing?source=ad" : "test",
        })),
        metricValues: request.metrics.map(({ name }) => ({
          value: String(name === "engagementRate" ? (current ? 0.425 : 0.385) : (current ? 100 : 80)),
        })),
      }],
    });
  });

  const response = await handleGa4(new Request("https://example.com/api/ga4/report", {
    method: "POST",
    headers: { Cookie: cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ propertyId: "12345" }),
  }), env);

  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(calls.length, 12);
  assert.deepEqual(result.dateRanges, [
    { name: "current", startDate: "7daysAgo", endDate: "yesterday" },
    { name: "comparison", startDate: "14daysAgo", endDate: "8daysAgo" },
  ]);
  assert.equal(result.report.totals.find((row) => row.dateRange === "current").engagementRate, 0.425);
  assert.equal(result.report.totals.find((row) => row.dateRange === "comparison").sessions, 80);
  assert.equal(result.report.landingPages[0].landingPagePlusQueryString, "/pricing");
  assert.equal("analysis" in result, false);
});
