import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";

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
