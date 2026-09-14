import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/search-jobs", label: "Search Jobs" },
];

function slugify(label) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container">
        <NavLink to="/" className="brand" data-gtm-id="header-logo" onClick={() => setOpen(false)}>
          <picture>
            <source srcSet="/images/attriato-logo.webp" type="image/webp" />
            <img
              src="/images/attriato-logo.png"
              alt="site logo"
              width={150}
              height={60}
              style={{ maxWidth: 150 }}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </NavLink>

        <nav className="nav">
          <ul className="nav-links">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === "/"} data-gtm-id={`header-nav-${slugify(l.label)}`}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <button
            className="nav-toggle"
            aria-label="Toggle navigation"
            aria-expanded={open}
            data-gtm-id="header-nav-toggle"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>
        </nav>
      </div>
      <div className={`mobile-nav${open ? " open" : ""}`}>
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            data-gtm-id={`header-mobile-nav-${slugify(l.label)}`}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
