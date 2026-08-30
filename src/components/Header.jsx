import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/search-jobs", label: "Search Jobs" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container">
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <img
            src="/public/images/attriato-logo.png"
            alt="site logo"
            style={{ maxWidth: 150 }}
          />
        </NavLink>

        <nav className="nav">
          <ul className="nav-links">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === "/"}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <button
            className="nav-toggle"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </div>
      <div className={`mobile-nav${open ? " open" : ""}`}>
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}>
            {l.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
