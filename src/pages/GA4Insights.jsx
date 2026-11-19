import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CTABand from "../components/CTABand.jsx";

const METRICS = [
  { key: "sessions", label: "Sessions", format: "number" },
  { key: "totalUsers", label: "Users", format: "number" },
  { key: "engagedSessions", label: "Engaged sessions", format: "number" },
  { key: "engagementRate", label: "Engagement rate", format: "percent" },
  { key: "bounceRate", label: "Bounce rate", format: "percent" },
  { key: "sessionConversionRate", label: "Session conversion rate", format: "percent" },
  { key: "conversions", label: "Conversions", format: "number" },
  { key: "screenPageViews", label: "Page views", format: "number" },
];

const SECTIONS = [
  {
    key: "channels",
    title: "Channel groups",
    dimension: "sessionDefaultChannelGroup",
    primaryMetric: "sessions",
    metrics: [
      { key: "conversions", label: "Conversions", format: "number" },
      { key: "engagementRate", label: "Engagement rate", format: "percent" },
      { key: "sessionConversionRate", label: "Session conversion rate", format: "percent" },
    ],
  },
  {
    key: "landingPages",
    title: "Landing pages",
    dimension: "landingPagePlusQueryString",
    primaryMetric: "sessions",
    metrics: [
      { key: "conversions", label: "Conversions", format: "number" },
      { key: "sessionConversionRate", label: "Session conversion rate", format: "percent" },
    ],
  },
  {
    key: "devices",
    title: "Devices",
    dimension: "deviceCategory",
    primaryMetric: "sessions",
    metrics: [
      { key: "conversions", label: "Conversions", format: "number" },
      { key: "engagementRate", label: "Engagement rate", format: "percent" },
      { key: "bounceRate", label: "Bounce rate", format: "percent" },
    ],
  },
  {
    key: "events",
    title: "Events",
    dimension: "eventName",
    primaryMetric: "eventCount",
    metrics: [
      { key: "totalUsers", label: "Users", format: "number" },
      { key: "conversions", label: "Conversions", format: "number" },
    ],
  },
];

const INSIGHTS = [
  {
    number: "01",
    title: "Start with the decisions",
    body: "Before adding events or dashboards, identify the business questions your reporting needs to answer. A clear measurement plan keeps tracking focused on useful outcomes.",
  },
  {
    number: "02",
    title: "Track meaningful actions",
    body: "Choose events that describe real customer behavior, such as a completed inquiry or a key step in a purchase journey. Consistent event definitions make results easier to interpret.",
  },
  {
    number: "03",
    title: "Make reporting actionable",
    body: "Connect traffic and engagement metrics to conversions and business goals. A useful report highlights what changed, where to investigate, and what action to consider next.",
  },
];

function formatValue(value, format = "number") {
  if (!Number.isFinite(value)) return "—";
  if (format === "percent") {
    return new Intl.NumberFormat(undefined, { style: "percent", maximumFractionDigits: 1 }).format(value);
  }
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}

function formatChange(current, comparison, format = "number") {
  if (format === "percent") {
    const difference = (current - comparison) * 100;
    if (!Number.isFinite(difference)) return "—";
    return `${difference > 0 ? "+" : ""}${difference.toFixed(1)} pp`;
  }
  if (!comparison) return current ? "New" : "0.0%";
  const change = ((current - comparison) / comparison) * 100;
  if (!Number.isFinite(change)) return "—";
  const prefix = change > 0 ? "+" : "";
  return `${prefix}${change.toFixed(1)}%`;
}

function formatDifference(current, comparison, format = "number") {
  if (format === "percent") return formatChange(current, comparison, format);
  const difference = current - comparison;
  const absolute = `${difference > 0 ? "+" : ""}${formatValue(difference)}`;
  const relative = formatChange(current, comparison, format);
  return relative === "New" ? `${absolute} (new)` : `${absolute} (${relative})`;
}

async function apiRequest(path, options) {
  const response = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "The request could not be completed.");
  return body;
}

function ComparisonSection({ rows, section }) {
  const segments = useMemo(() => {
    const segments = new Map();
    for (const row of rows || []) {
      const label = row[section.dimension] || "(not set)";
      const segment = segments.get(label) || { label, current: {}, comparison: {} };
      for (const [key, value] of Object.entries(row)) {
        if (typeof value === "number") segment[row.dateRange][key] = value;
      }
      segments.set(label, segment);
    }
    return [...segments.values()]
      .filter((segment) => Object.keys(segment.current).length && Object.keys(segment.comparison).length)
      .sort((left, right) => (right.current[section.primaryMetric] || 0) - (left.current[section.primaryMetric] || 0))
      .slice(0, 2);
  }, [rows, section]);

  return (
    <section className="ga4-comparison-section">
      <h3>{section.title}</h3>
      {segments.length ? (
        <div className="ga4-segment-list">
          {segments.map((segment) => (
            <article className="ga4-segment-card" key={segment.label}>
              <h4>{segment.label}</h4>
              <div className="ga4-segment-primary">
                <span>{section.primaryMetric === "eventCount" ? "Event count" : "Sessions"}</span>
                <strong>{formatValue(segment.current[section.primaryMetric])}</strong>
                <small>
                  Previous: {formatValue(segment.comparison[section.primaryMetric])}
                  {" · "}
                  {formatDifference(segment.current[section.primaryMetric], segment.comparison[section.primaryMetric])}
                </small>
              </div>
              <div className="ga4-segment-metrics">
                {section.metrics.map((metric) => {
                  const current = segment.current[metric.key];
                  const previous = segment.comparison[metric.key];
                  const difference = typeof current === "number" && typeof previous === "number"
                    ? formatDifference(current, previous, metric.format)
                    : "not comparable";
                  return (
                    <div className="ga4-segment-metric" key={metric.key}>
                      <span>{metric.label}</span>
                      <strong>{formatValue(current, metric.format)}</strong>
                      <small>
                        Previous: {formatValue(previous, metric.format)}
                        {" · "}
                        {difference}
                      </small>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      ) : <p>Not enough data for a like-for-like comparison.</p>}
    </section>
  );
}

function Analysis({ analysis }) {
  return (
    <section className="ga4-analysis" aria-labelledby="ga4-analysis-title">
      <p className="eyebrow">AI-assisted analysis</p>
      <h2 id="ga4-analysis-title">Key insights, user friction &amp; opportunities</h2>
      <p>{analysis.summary}</p>
      {analysis.findings.length ? (
        <div className="ga4-findings">
          {analysis.findings.map((finding, index) => (
            <article className="ga4-finding" key={`${finding.issue}-${index}`}>
              <span className={`ga4-priority ga4-priority--${finding.priority}`}>{finding.priority || "insight"} priority</span>
              <h3>{finding.issue}</h3>
              <p><strong>Evidence:</strong> {finding.evidence}</p>
              <p><strong>Recommended check:</strong> {finding.recommendation}</p>
            </article>
          ))}
        </div>
      ) : <p>No specific issues stood out in the available data.</p>}
      {analysis.limitations.length > 0 && (
        <div className="ga4-limitations">
          <h3>Interpretation notes</h3>
          <ul>{analysis.limitations.map((limitation, index) => <li key={`${limitation}-${index}`}>{limitation}</li>)}</ul>
        </div>
      )}
    </section>
  );
}

function ReportResults({ result }) {
  const currentLabel = "Last 7 complete days";
  const comparisonLabel = "Previous 7 days";
  const currentTotals = (result.report.totals || []).find((row) => row.dateRange === "current") || {};
  const comparisonTotals = (result.report.totals || []).find((row) => row.dateRange === "comparison") || {};

  return (
    <div className="ga4-results" aria-live="polite">
      <div className="ga4-results-heading">
        <div>
          <p className="eyebrow">Report complete</p>
          <h2>Performance overview</h2>
        </div>
        <p className="ga4-period-label">Current: {currentLabel}<br />Compare: {comparisonLabel}</p>
      </div>
      <div className="ga4-metrics">
        {METRICS.map((metric) => {
          const current = currentTotals[metric.key] || 0;
          const comparison = comparisonTotals[metric.key] || 0;
          return (
            <article className="ga4-metric" key={metric.key}>
              <span>{metric.label}</span>
              <strong>{formatValue(current, metric.format)}</strong>
              <small>{formatDifference(current, comparison, metric.format)} vs {formatValue(comparison, metric.format)}</small>
            </article>
          );
        })}
      </div>
      <Analysis analysis={result.analysis} />
      <div className="ga4-comparisons">
        {SECTIONS.map((section) => (
          <ComparisonSection
            key={section.key}
            rows={result.report[section.key]}
            section={section}
          />
        ))}
      </div>
    </div>
  );
}

export default function GA4Insights() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [connected, setConnected] = useState(false);
  const [properties, setProperties] = useState([]);
  const [propertyId, setPropertyId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [result, setResult] = useState(null);
  useEffect(() => {
    let active = true;
    const connectState = searchParams.get("ga4");
    const connectionError = searchParams.get("ga4_error");
    if (connectState === "connected") setNotice("Google Analytics is connected. Choose a property to continue.");
    if (connectionError) {
      const messages = {
        authorization_denied: "Google Analytics access was not granted.",
        invalid_state: "The sign-in session expired. Please try connecting again.",
        token_exchange_failed: "Google could not complete the connection. Please try again.",
        connection_failed: "We couldn't finish connecting this Google account.",
      };
      setError(messages[connectionError] || "Google Analytics connection failed.");
    }
    if (connectState || connectionError) setSearchParams({}, { replace: true });

    apiRequest("/api/ga4/status")
      .then(async (data) => {
        if (!active) return;
        setConnected(data.connected);
        if (data.connected) {
          const propertiesResponse = await apiRequest("/api/ga4/properties");
          if (active) setProperties(propertiesResponse.properties);
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => { active = false; };
  }, [searchParams, setSearchParams]);

  async function connectAccount() {
    setBusy(true);
    setError("");
    try {
      const { url } = await apiRequest("/api/ga4/connect");
      window.location.assign(url);
    } catch (requestError) {
      setError(requestError.message);
      setBusy(false);
    }
  }

  async function runReport(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    setResult(null);
    try {
      const data = await apiRequest("/api/ga4/report", {
        method: "POST",
        body: JSON.stringify({ propertyId }),
      });
      setResult(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function disconnectAccount() {
    setBusy(true);
    setError("");
    try {
      await apiRequest("/api/ga4/disconnect", { method: "POST" });
      setConnected(false);
      setProperties([]);
      setPropertyId("");
      setResult(null);
      setNotice("Google Analytics has been disconnected.");
    } catch (requestError) {
      setError(requestError.message);
      setConnected(false);
      setProperties([]);
      setPropertyId("");
      setResult(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <section className="section ga4-hero" style={{ paddingBottom: 52 }}>
        <div className="container">
          <p className="eyebrow">Practical analytics guidance</p>
          <h1 style={{ maxWidth: 760 }}>GA4 Insights</h1>
          <p style={{ maxWidth: 700, fontSize: "1.1rem" }}>
            Connect your Google Analytics property to compare performance and get evidence-based recommendations for traffic, engagement, and conversions.
          </p>
          <div className="btn-row">
            <Link to="/contact" className="btn btn-ghost" data-gtm-id="ga4-insights-hero-contact">Talk to an expert</Link>
            <Link to="/services" className="btn btn-ghost" data-gtm-id="ga4-insights-hero-services">Explore analytics services</Link>
          </div>

          <section className="ga4-tool" aria-labelledby="ga4-tool-title">
            <div className="ga4-tool-header">
              <div>
                <p className="eyebrow">Your analytics workspace</p>
                <h2 id="ga4-tool-title">Get a GA4 performance report</h2>
                <p>Reports cover the last 7 complete days and compare them with the 7 days before.</p>
              </div>
              {connected && (
                <button className="btn btn-ghost" type="button" onClick={disconnectAccount} disabled={busy}>
                  Disconnect
                </button>
              )}
            </div>

            {!connected ? (
              <div className="ga4-connect">
                <div>
                  <h3>Connect your Google Analytics account</h3>
                  <p>We request read-only access to list your properties and retrieve aggregate report data.</p>
                </div>
                <button className="btn btn-primary" type="button" onClick={connectAccount} disabled={busy}>
                  {busy ? "Connecting…" : "Connect to Google Analytics"}
                </button>
              </div>
            ) : (
              <form className="ga4-controls" onSubmit={runReport}>
                <div className="field">
                  <label htmlFor="ga4-property">GA4 property</label>
                  <select id="ga4-property" required value={propertyId} onChange={(event) => setPropertyId(event.target.value)}>
                    <option value="">Select a property</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>{property.name} · {property.accountName}</option>
                    ))}
                  </select>
                </div>
                {propertyId && (
                  <button className="btn btn-primary ga4-run-button" type="submit" disabled={busy}>
                    {busy ? "Analyzing report…" : "Run Report"}
                  </button>
                )}
              </form>
            )}

            {properties.length === 0 && connected && (
              <p className="ga4-empty-properties">No GA4 properties were found for this Google account. Check that you have at least Viewer access to a GA4 property.</p>
            )}
            <p className="ga4-privacy-note">
              Your Google access token is encrypted and stored in a secure, HTTP-only browser session. Cloudflare Workers AI receives aggregate metrics only; page URLs and event names are not sent.
            </p>
            {notice && <p className="ga4-notice" role="status">{notice}</p>}
            {error && <p className="ga4-error" role="alert">{error}</p>}
          </section>
        </div>
      </section>

      <section className="section section--raised">
        <div className="container">
          {result ? (
            <ReportResults result={result} />
          ) : (
            <>
              <h2 style={{ maxWidth: 700 }}>Turn your analytics into better decisions</h2>
              <p style={{ maxWidth: 680 }}>
                GA4 provides a lot of data. The value comes from measuring the
                right activity and giving your team the context to use it.
              </p>
              <div className="grid grid-3" style={{ marginTop: 40 }}>
                {INSIGHTS.map((insight) => (
                  <article className="card" key={insight.number}>
                    <span className="index">{insight.number}</span>
                    <h3>{insight.title}</h3>
                    <p style={{ marginBottom: 0 }}>{insight.body}</p>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 840 }}>
          <h2>Trust the measurement behind the numbers</h2>
          <p>
            Reports are only as dependable as the tracking behind them.
            Review event definitions, conversion settings, and data collection
            regularly so your team can distinguish meaningful changes from
            measurement issues. GA4 reports alone cannot confirm usability problems
            or journey drop-off without correctly configured funnel events.
          </p>
          <p>
            Need help auditing or improving your setup? Attriato can help
            build a measurement foundation that supports confident analysis.
          </p>
          <Link to="/contact" className="btn btn-ghost" data-gtm-id="ga4-insights-audit-contact">
            Get help with your GA4 setup
          </Link>
        </div>
      </section>

      <CTABand
        title="Ready to get more from GA4?"
        body="Build a measurement approach that gives your team clearer answers and more confidence in its decisions."
        gtmId="ga4-insights-cta-contact"
      />
    </>
  );
}
