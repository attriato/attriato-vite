import React from "react";
import { Link } from "react-router-dom";
import CTABand from "../components/CTABand.jsx";

export default function About() {
  return (
    <>
      <section className="section about-hero-section" style={{ paddingBottom: 40 }}>
        <div className="container about-hero">
          <div className="about-hero-copy">
            <h1 style={{ maxWidth: 760 }}>Built for clear tracking and better decisions</h1>
            <p style={{ maxWidth: 640, fontSize: "1.05rem" }}>
              Attriato helps businesses turn analytics into a reliable
              decision-making tool through thoughtful Google Analytics, Google
              Tag Manager, and reporting strategy. Founder,{" "}
              <a
                href="https://www.linkedin.com/in/richmorgan2026"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "underline" }}
              >
                Rich Morgan
              </a>
              , brings 20+ years of analytics experience and has worked at top
              brands including Discount Tire, Target, Caesars Entertainment,
              Allegiant Air, Hertz Car Rental, Honeywell Home, and First Alert.
            </p>
            <div className="btn-row">
              <Link to="/contact" className="btn btn-primary">Book Now</Link>
              <Link to="/services" className="btn btn-ghost">View Services</Link>
            </div>
          </div>

          <img
            className="about-hero-image"
            src="/images/2264360111.jpg"
            alt="Analytics and strategy professional"
            width={600}
            height={450}
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </section>

      <section className="section section--raised">
        <div className="container split">
          <img
            src="/images/2214727193.jpg"
            alt=""
            width={600}
            height={450}
            loading="lazy"
            decoding="async"
          />
          <div>
            <h2>A practical partner for analytics clarity</h2>
            <p>
              Attriato was built to solve a common problem: businesses often
              rely on reporting that looks polished but is powered by
              incomplete or inaccurate tracking. We believe better decisions
              start with cleaner data and a setup you can trust.
            </p>
            <p>
              From foundational analytics audits to advanced event and
              conversion tracking, our work is designed to remove guesswork,
              align teams, and give marketing leaders confidence in what the
              numbers are really saying.
            </p>
            <Link to="/contact" className="btn btn-ghost">Book Now</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>Strategy, setup, and ongoing insight</h2>
            <p>
              We combine technical implementation with business context,
              helping clients move from disconnected tags and uncertain
              attribution to dependable measurement systems that support
              growth.
            </p>
            <p>
              Whether the need is a GA4 migration, Google Tag Manager
              implementation, conversion tracking cleanup, or clearer
              reporting, Attriato focuses on solutions that are accurate,
              maintainable, and useful to the people making decisions every
              day.
            </p>
            <Link to="/services" className="btn btn-ghost">See Services</Link>
          </div>
          <img
            src="/images/1174300472.jpg"
            alt=""
            width={600}
            height={450}
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>

      <CTABand
        title="Ready for analytics you can trust?"
        body="If you need cleaner tracking, stronger reporting, and a clearer measurement strategy, Attriato is ready to help."
      />
    </>
  );
}
