import React, { useState } from "react";
import { Link } from "react-router-dom";
import CTABand from "../components/CTABand.jsx";

const CORE = [
  { i: "01", title: "GA4 Setup", body: "Clean Google Analytics 4 configuration built around your business goals, reporting needs, and measurement plan." },
  { i: "02", title: "Analytics Audits", body: "Detailed reviews of your current setup to uncover gaps, duplicate events, broken conversions, and reporting issues." },
  { i: "03", title: "Tag Manager", body: "Google Tag Manager implementation for flexible, organized deployment of tags, triggers, and custom events." },
  { i: "04", title: "Event Tracking", body: "Track the actions that matter most, including form submissions, clicks, downloads, video engagement, and user journeys." },
  { i: "05", title: "Conversion Tracking", body: "Measure leads and key actions accurately so marketing performance can be evaluated with confidence." },
  { i: "06", title: "Reporting Strategy", body: "Turn raw data into useful dashboards and reporting frameworks that support smarter business decisions." },
];

const TIERS = [
  { title: "Setup", items: ["GA4 property configuration", "Core event setup", "Conversion tracking", "Launch validation"] },
  { title: "Audit", items: ["Tracking review", "Issue identification", "Priority recommendations", "Action plan"] },
  { title: "Ongoing Support", items: ["Reporting guidance", "Optimization support", "Tag updates", "Strategy consulting"] },
];

const FAQ = [
  { q: "Do you work with existing analytics setups?", a: "Yes. Attriato can audit and improve an existing Google Analytics or Google Tag Manager setup, whether it needs small fixes or a full rebuild." },
  { q: "Can you help define what to track?", a: "Absolutely. Tracking should support real business goals, so we help identify the events, conversions, and reporting views that matter most." },
  { q: "Do you support Google Tag Manager?", a: "Yes. Tag Manager implementation and cleanup are core services, including tag structure, triggers, variables, and testing." },
  { q: "Is reporting included?", a: "Reporting support is available as part of strategy and optimization work, helping teams focus on useful metrics instead of noisy data." },
  { q: "How do we get started?", a: "Start with a consultation through the contact form. From there, Attriato can recommend the right setup, audit, or support engagement." },
];

export default function Services() {
  return (
    <>
      <section className="section services-hero-section" style={{ paddingBottom: 40 }}>
        <div className="container services-hero">
          <div className="services-hero-copy">
            <h1 style={{ maxWidth: 760 }}>Analytics services that create clarity</h1>
            <p style={{ maxWidth: 560, fontSize: "1.05rem" }}>
              From Google Analytics setup to reporting strategy, Attriato helps
              businesses build accurate tracking, trustworthy data, and better
              decision-making.
            </p>
            <div className="btn-row">
              <Link to="/contact" className="btn btn-primary">Book Now</Link>
            </div>
          </div>

          <img
            className="services-hero-image"
            src="/images/2285381238.jpg"
            alt="Analytics consulting team"
            width={600}
            height={450}
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </section>

      <section className="section section--raised">
        <div className="container">
          <h2 style={{ maxWidth: 620 }}>Core services</h2>
          <div className="grid grid-3" style={{ marginTop: 40 }}>
            {CORE.map((s) => (
              <Link to="/contact" key={s.i} className="card">
                <span className="index">{s.i}</span>
                <h3>{s.title}</h3>
                <p style={{ marginBottom: 0 }}>{s.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 style={{ maxWidth: 620 }}>Services that we provide</h2>
          <p style={{ maxWidth: 560 }}>
            Choose the level of support that fits your team. Final scope and
            pricing can be tailored to your setup and goals.
          </p>
          <div className="grid grid-3" style={{ marginTop: 36 }}>
            {TIERS.map((t) => (
              <div className="price-card" key={t.title}>
                <h3 style={{ marginBottom: 0 }}>{t.title}</h3>
                <ul>
                  {t.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                <Link to="/contact" className="btn btn-primary" style={{ justifyContent: "center" }}>
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--raised">
        <div className="container" style={{ maxWidth: 780 }}>
          <h2>Frequently asked questions</h2>
          <p>A few common questions about analytics consulting, implementation, and support.</p>
          <div style={{ marginTop: 20 }}>
            {FAQ.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}