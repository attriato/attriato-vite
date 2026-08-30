import React from "react";

// Signature visual: a rising trend line annotated with the real GA4 event
// names a visitor generates on this very page — the line literally traces
// "messy signal becoming a clear decision."
const POINTS = [
  { x: 20, y: 300, label: "page_view", delay: 0.3 },
  { x: 160, y: 260, label: "scroll", delay: 0.6 },
  { x: 300, y: 190, label: "view_services", delay: 0.9 },
  { x: 440, y: 150, label: "form_start", delay: 1.2 },
  { x: 560, y: 60, label: "generate_lead", delay: 1.5 },
];

export default function TrendChart() {
  const path = `M ${POINTS.map((p) => `${p.x} ${p.y}`).join(" L ")}`;

  return (
    <svg
      className="hero-chart"
      viewBox="0 0 600 340"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* grid */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={i}
          x1="0"
          x2="600"
          y1={i * 60}
          y2={i * 60}
          stroke="#0f1b2d"
          strokeOpacity="0.06"
        />
      ))}
      <path d={path} className="trend-path" stroke="#2f9e73" strokeWidth="2.5" />
      {POINTS.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r="5"
            fill="#3eb489"
            className="trend-dot"
            style={{ animationDelay: `${p.delay}s` }}
          />
          <text
            x={p.x + 10}
            y={p.y - 10}
            fontSize="11"
            fill="#5c6670"
            className="trend-label"
            style={{ animationDelay: `${p.delay + 0.1}s` }}
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
