import React, { Suspense, lazy, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { pageMeta, pageSchemas } from "./utils/pageMeta.js";

const Home = lazy(() => import("./pages/Home.jsx"));
const Services = lazy(() => import("./pages/Services.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const SearchJobs = lazy(() => import("./pages/SearchJobs.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function InitializeTracking() {
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;

    // Defer tracking initialization until after first render
    // Use requestIdleCallback if available, otherwise defer with setTimeout
    const initTracking = async () => {
      try {
        const { initLinkTracking } = await import("./utils/gtmTracking.js");
        initLinkTracking();
      } catch (error) {
        console.warn("Failed to initialize link tracking:", error);
      }
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(initTracking, { timeout: 2000 });
    } else {
      setTimeout(initTracking, 1000);
    }

    initRef.current = true;
  }, []);

  return null;
}

function SEOUpdater() {
  const { pathname } = useLocation();
  const meta = pageMeta[pathname] || pageMeta["/"];
  const schema = pageSchemas[pathname] || pageSchemas["/"];

  useEffect(() => {
    const baseUrl = "https://www.attriato.com";
    const canonicalUrl = `${baseUrl}${pathname === "/" ? "" : pathname}`;

    const setMeta = (selector, attributes) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        document.head.appendChild(element);
      }
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    };

    document.title = meta.title;
    setMeta('meta[name="description"]', { name: "description", content: meta.description });
    setMeta('meta[property="og:title"]', { property: "og:title", content: meta.title });
    setMeta('meta[property="og:description"]', {
      property: "og:description",
      content: meta.description,
    });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    setMeta('link[rel="canonical"]', { rel: "canonical", href: canonicalUrl });

    let schemaScript = document.head.querySelector('#route-schema');
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = "route-schema";
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schema);
  }, [pathname, meta, schema]);

  return null;
}

function GTMTracker() {
  const { pathname } = useLocation();
  const meta = pageMeta[pathname] || pageMeta["/"];

  useEffect(() => {
    const baseUrl = "https://www.attriato.com";
    const pageLocation = `${baseUrl}${pathname === "/" ? "" : pathname}`;
    const pageTitle = meta.title;

    // Delay page_view event until DOM is loaded for the route
    const timer = setTimeout(async () => {
      try {
        const { pushPageView } = await import("./utils/gtmTracking.js");
        pushPageView(pageTitle, pageLocation);
      } catch (error) {
        console.warn("Failed to push page view:", error);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname, meta]);

  return null;
}

export default function App() {
  return (
    <>
      <InitializeTracking />
      <ScrollToTop />
      <SEOUpdater />
      <GTMTracker />
      <Header />
      <main>
        <Suspense fallback={<div aria-live="polite" style={{ minHeight: "40vh" }} /> }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search-jobs" element={<SearchJobs />} />
            <Route path="/privacy-policy" element={<Privacy />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
