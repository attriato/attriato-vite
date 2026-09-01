import React from "react";
import { Link } from "react-router-dom";
import CTABand from "../components/CTABand.jsx";

const SERVICES = [
  { i: "01", title: "GA4 Setup", body: "Build a clean Google Analytics 4 foundation configured around your goals, channels, and reporting needs.", img: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path></svg>  },
  { i: "02", title: "Tag Manager", body: "Implement Google Tag Manager with a scalable structure that keeps tracking organized and easier to maintain.", img: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path></svg> },
  { i: "03", title: "Event Tracking", body: "Track the actions that matter most, from form submissions and clicks to key engagement and conversion events.", img: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>},
  { i: "04", title: "Conversion Tracking", body: "Measure leads and business outcomes accurately so your campaigns can be evaluated with confidence.", img: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z"></path></svg> },
  { i: "05", title: "Reporting", body: "Turn raw data into clear dashboards and reports that help teams understand performance quickly.", img: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v2h12v-2l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"></path></svg> },
  { i: "06", title: "Strategy Consulting", body: "Get expert guidance on measurement plans, attribution questions, and analytics decisions that support growth.", img: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"></path></svg> },
];

const PROCESS = [
  { n: "01", title: "Audit", body: "Review your current setup, identify gaps, and uncover tracking issues that affect reporting accuracy." },
  { n: "02", title: "Plan", body: "Define the measurement approach, event structure, and conversion goals that fit your business." },
  { n: "03", title: "Implement", body: "Configure GA4 and GTM carefully, test the setup, and make sure the right data is flowing." },
  { n: "04", title: "Optimize", body: "Refine reporting and tracking over time so your data keeps pace with campaigns, content, and growth." },
];

const TESTIMONIALS = [
  {
    quote: "Attriato helped us fix tracking gaps and finally trust the numbers we were using to guide campaign decisions.",
    name: "Maya Chen",
    role: "Marketing Director",
    imgBase: "951541862",
  },
  {
    quote: "The implementation was organized, thoughtful, and easy for our team to understand. Reporting became much clearer.",
    name: "Daniel Brooks",
    role: "Growth Lead",
    imgBase: "1355110818",
  },
  {
    quote: "We now have cleaner event tracking, better conversion visibility, and a much stronger foundation for optimization.",
    name: "Alicia Romero",
    role: "Operations Manager",
    imgBase: "2222619409",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-swap-layout">
          <div className="hero-grid">
            <h1>Clear tracking. Better decisions.</h1>
            <p style={{ fontSize: "1.15rem", maxWidth: 520 }}>
              Google Analytics and Google Tag Manager consulting for
              businesses that need accurate data, reliable reporting, and
              smarter marketing decisions.
            </p>
            <div className="btn-row">
              <Link to="/contact" className="btn btn-primary">Book Now</Link>
              <Link to="/services" className="btn btn-ghost">Explore Services</Link>
            </div>
          </div>

          <picture>
            <source srcSet="/images/2278418314.webp" type="image/webp" />
            <img
              className="hero-image-replacement"
              src="/images/2278418314.jpg"
              alt="Analytics and marketing team"
              width={600}
              height={450}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>
      </section>

      <section className="section">
        <div className="container">
  
          <h2>Analytics support that moves your business forward</h2>
          <div className="grid grid-3" style={{ marginTop: 46 }}>
            {SERVICES.map((s) => (
              <Link to="/services" key={s.i} className="card">
                <span className="icon">{s.img}</span>
                <h3>{s.title}</h3>
                <p style={{ marginBottom: 0 }}>{s.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--raised">
        <div className="container">
          <h2>A simple process for better data</h2>
          <p style={{ maxWidth: 560 }}>
            We make analytics implementation practical, transparent, and
            aligned with the decisions you need to make.
          </p>
          <div className="process-layout">
            <ol className="process-list process-list--left">
              {PROCESS.slice(0, 2).map((p) => (
                <li className="process-item" key={p.n}>
                  <span className="process-num">{p.n}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p style={{ marginBottom: 0 }}>{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <picture>
              <source srcSet="/images/1461603921.webp" type="image/webp" />
              <img
                className="process-visual"
                src="/images/1461603921.jpg"
                alt="Analytics team collaborating"
                width={640}
                height={360}
                loading="lazy"
                decoding="async"
              />
            </picture>

            <ol className="process-list process-list--right">
              {PROCESS.slice(2).map((p) => (
                <li className="process-item" key={p.n}>
                  <span className="process-num">{p.n}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p style={{ marginBottom: 0 }}>{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>Expert guidance for confident measurement</h2>
            <p>
              Attriato works with data-driven businesses that want dependable
              analytics, cleaner implementations, and reporting they can use
              with confidence.
            </p>
            <div className="stat-strip">
              <div className="stat-item"><span>Accurate Setup</span></div>
              <div className="stat-item"><span>Clear Reporting</span></div>
              <div className="stat-item"><span>Practical Strategy</span></div>
              <div className="stat-item"><span>Ongoing Improvement</span></div>
            </div>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Link to="/about" className="btn btn-ghost">Learn More</Link>
            </div>
          </div>
          <picture>
            <source srcSet="/images/604340916.webp" type="image/webp" />
            <img
              src="/images/604340916.jpg"
              alt=""
              width={600}
              height={450}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
      </section>

      <section className="section section--raised">
        <div className="container">
          <h2>Trusted by teams that need reliable data</h2>
          <p style={{ maxWidth: 560 }}>
            A strong analytics setup creates confidence across marketing,
            leadership, and operations.
          </p>
          <div className="grid grid-3" style={{ marginTop: 40 }}>
            {TESTIMONIALS.map((t) => (
              <div className="testimonial" key={t.name}>
                <div className="stars">★★★★★</div>
                <p style={{ marginBottom: 0 }}>{t.quote}</p>
                <div className="testimonial-person">
                  <picture>
                    <source srcSet={`/images/${t.imgBase}.webp`} type="image/webp" />
                    <img src={`/images/${t.imgBase}.jpg`} alt={t.name} width={44} height={44} loading="lazy" decoding="async" />
                  </picture>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 64 }}>
            <span className="eyebrow eyebrow--amber">Nonprofit Clients</span>
            <p style={{ maxWidth: 560, marginBottom: 24 }}>
              We believe in helping others through our non-profit work. Attriato has provided pro-bono analytics support to local organizations that are making a difference in the community.  
            </p>
            <div className="logo-row">
              <img
                src="/images/sacrd_logo.png"
                alt="Sacred logo"
                width={120}
                height={60}
                loading="lazy"
                decoding="async"
              />
              <img
                src="/images/Downtown-Partnership-Logo.png"
                alt="Downtown Colorado Springs"
                width={120}
                height={60}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
