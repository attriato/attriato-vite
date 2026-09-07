import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";

const loadGoogleTagManager = () => {
  if (document.querySelector('script[src*="kuitcqem.attriato.com/gtm.js"]')) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://kuitcqem.attriato.com/gtm.js?id=GTM-K7Z8RS6G";
  document.head.appendChild(script);
};

const scheduleGoogleTagManager = () => {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(loadGoogleTagManager, { timeout: 3000 });
  } else {
    setTimeout(loadGoogleTagManager, 2000);
  }
};

if (document.readyState === "complete") {
  scheduleGoogleTagManager();
} else {
  window.addEventListener("load", scheduleGoogleTagManager, { once: true });
}

const loadAppStyles = () => {
  import("./styles.css");
};

if ("requestIdleCallback" in window) {
  window.requestIdleCallback(loadAppStyles);
} else {
  setTimeout(loadAppStyles, 0);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
