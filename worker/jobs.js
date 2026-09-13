/**
 * Proxies GA4/GTM job search requests to Adzuna so the API credentials
 * stay server-side instead of being bundled into the client.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

function formatAdzunaJob(job) {
  const title = job.title || "Analytics role";
  const company = job.company?.display_name || "Unknown company";
  const location = job.location?.display_name || "Remote";
  const date = job.created || new Date().toISOString();

  return {
    title,
    company,
    location,
    date,
    url: job.redirect_url || "https://www.adzuna.com",
  };
}

export async function handleJobs(request, env) {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed. Use GET." }), {
      status: 405,
      headers: { ...corsHeaders, "Allow": "GET" },
    });
  }

  const appId = env.ADZUNA_APP_ID;
  const appKey = env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    return new Response(
      JSON.stringify({ error: "Adzuna API credentials are not configured on the server." }),
      { status: 503, headers: corsHeaders }
    );
  }

  const params = new URLSearchParams({
    app_id: appId,
    app_key: appKey,
    what: "GA4 Google Analytics Google Tag Manager",
    results_per_page: "10",
    sort_by: "date",
    max_days_old: "30",
  });

  try {
    const adzunaRes = await fetch(`https://api.adzuna.com/v1/api/jobs/us/search/1?${params.toString()}`);

    if (!adzunaRes.ok) {
      return new Response(
        JSON.stringify({ error: `Adzuna request failed: ${adzunaRes.status}` }),
        { status: 502, headers: corsHeaders }
      );
    }

    const data = await adzunaRes.json();

    const jobs = (data.results || [])
      .filter((job) => {
        const text = `${job.title || ""} ${job.description || ""}`.toLowerCase();
        return text.includes("ga4") || text.includes("google analytics") || text.includes("google tag manager") || text.includes("gtm");
      })
      .slice(0, 10)
      .map(formatAdzunaJob);

    return new Response(JSON.stringify({ jobs }), { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching Adzuna jobs:", error);
    return new Response(
      JSON.stringify({ error: "Unable to fetch live job results." }),
      { status: 500, headers: corsHeaders }
    );
  }
}
