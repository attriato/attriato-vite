import React from "react";
import { Link } from "react-router-dom";

export default function CTABand({
  title = "Need accurate tracking?",
  body = "Get expert help with Google Analytics, Google Tag Manager, reporting, and conversion tracking.",
}) {
  return (
    <section className="section section--dark">
      <div className="container cta-band">
        <h2>{title}</h2>
        <p style={{ maxWidth: 560, margin: "0 auto" }}>{body}</p>
        <div className="btn-row">
          <Link to="/contact" className="btn btn-primary">
            Book Now
          </Link>
        </div>
      </div>
    </section>
  );
}
