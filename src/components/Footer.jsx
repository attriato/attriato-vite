import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p>
              Professional consulting services for Google Analytics and Google
              Tag Manager setup, tracking strategy, reporting, and
              optimization for data-driven businesses.
            </p>
          </div>
          <div>
            <h3>Company</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/search-jobs">Search Jobs</Link></li>
            </ul>
          </div>
          <div>
            <h3>Services</h3>
            <ul>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3>Need accurate tracking?</h3>
            <p style={{ marginBottom: 16 }}>
              Get expert help with Google Analytics, Google Tag Manager,
              reporting, and conversion tracking.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Book Now
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Attriato. All rights reserved. · Austin, Texas</span>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
