import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FALLBACK_JOBS = [
  { title: "Business Data Scientist, Google Analytics", company: "Google", location: "Grand Central, Manhattan", date: "Aug 20, 2026", url: "https://www.adzuna.com" },
  { title: "Business Data Scientist, Google Analytics", company: "Google", location: "Mountain View, Santa Clara County", date: "Aug 20, 2026", url: "https://www.adzuna.com" },
  { title: "Tag Management System Engineer (Tealium iQ, Adobe Launch, GTM)", company: "K Anand Corporation", location: "Highland Park, Dallas", date: "Aug 20, 2026", url: "https://www.adzuna.com" },
  { title: "Analytics Implementation Specialist", company: "Acunor Inc", location: "New Jersey, US", date: "Aug 17, 2026", url: "https://www.adzuna.com" },
  { title: "Google Tag Manager (GTM) Implementation Engineer", company: "Insight Global", location: "Grand Central, Manhattan", date: "Jul 31, 2026", url: "https://www.adzuna.com" },
  { title: "Web Analytics Specialist (GA4 & Google Tag Manager)", company: "Smarty", location: "Orem, Utah County", date: "May 29, 2026", url: "https://www.adzuna.com" },
];

function formatJob(job) {
  return {
    title: job.title || "Analytics role",
    company: job.company || "Unknown company",
    location: job.location || "Remote",
    date: new Date(job.date || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    url: job.url || "https://www.adzuna.com",
  };
}

export default function SearchJobs() {
  const [jobs, setJobs] = useState(FALLBACK_JOBS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/jobs")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Job search request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const filtered = (data.jobs || []).map(formatJob);
        setJobs(filtered.length ? filtered : FALLBACK_JOBS);
        setError("");
      })
      .catch(() => {
        setJobs(FALLBACK_JOBS);
        setError("Live Adzuna results are temporarily unavailable, so the most recent fallback jobs are being shown.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="section" style={{ paddingBottom: 30 }}>
        <div className="container">
          <h1 style={{ maxWidth: 700 }}>GA4 &amp; GTM Jobs</h1>
          <p style={{ maxWidth: 620, fontSize: "1.05rem" }}>
            Recent openings from Adzuna that include GA4,
            Google Analytics, or Google Tag Manager experience.
          </p>
        </div>
      </section>

      <section className="section section--raised">
        <div className="container">
          <div className="job-list-head">
            <h2 style={{ marginBottom: 0, fontSize: "1.3rem" }}>GA4 + GTM · Recent roles</h2>
            <span className="job-meta">{jobs.length} jobs shown</span>
          </div>

          {error ? <p style={{ marginBottom: 18, color: "var(--slate)" }}>{error}</p> : null}

          {loading ? (
            <p style={{ marginTop: 18, color: "var(--slate)" }}>Loading recent Adzuna jobs…</p>
          ) : (
            <div>
              {jobs.map((j, idx) => (
                <div className="job-item" key={`${j.title}-${j.company}-${idx}`}>
                  <div>
                    <h3>{j.title}</h3>
                    <span className="job-meta">
                      {j.company} · {j.location} · {j.date}
                    </span>
                  </div>
                  <a href={j.url} target="_blank" rel="noreferrer" className="btn btn-ghost" data-gtm-id={`search-jobs-view-apply-${idx}`}>
                    View &amp; Apply
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--dark">
        <div className="container cta-band">
          <h2>Need Help With Analytics Hiring?</h2>
          <p style={{ maxWidth: 560, margin: "0 auto" }}>
            If you are hiring for a remote analytics or tag management role,
            Attriato can help you define the right implementation and
            measurement skill set.
          </p>
          <div className="btn-row">
            <Link to="/contact" className="btn btn-primary" data-gtm-id="search-jobs-cta-book-now">Book Now</Link>
          </div>
        </div>
      </section>
    </>
  );
}
