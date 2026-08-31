import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Services from "./pages/Services.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import SearchJobs from "./pages/SearchJobs.jsx";
import Privacy from "./pages/Privacy.jsx";

const pageMeta = {
  "/": {
    title: "Attriato | GA4 & GTM Analytics Consulting",
    description:
      "Attriato helps businesses improve GA4 implementation, GTM setup, conversion tracking, and analytics reporting with clear, actionable insight.",
  },
  "/services": {
    title: "Analytics Services | GA4, GTM & Reporting Support | Attriato",
    description:
      "Explore Attriato's analytics services, including GA4 setup, GTM implementation, conversion tracking, and executive reporting for growth-focused teams.",
  },
  "/about": {
    title: "About Attriato | Analytics Strategy & Measurement Experts",
    description:
      "Learn about Attriato's approach to measuring marketing performance, improving tracking accuracy, and turning complex analytics data into business clarity.",
  },
  "/contact": {
    title: "Contact Attriato | Book a GA4 & GTM Consultation",
    description:
      "Book a consultation with Attriato for GA4 setup, GTM implementation, conversion tracking audits, and analytics strategy support.",
  },
  "/search-jobs": {
    title: "GA4 & GTM Jobs | Recent Analytics Roles | Attriato",
    description:
      "Browse recent GA4, Google Analytics, and Google Tag Manager job openings from the last 30 days and find relevant analytics opportunities.",
  },
  "/privacy-policy": {
    title: "Privacy Policy | Attriato",
    description:
      "Read Attriato's privacy policy for website analytics, cookies, advertising pixels, and data collection practices.",
  },
};

const pageSchemas = {
  "/": {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Attriato",
    url: "https://www.attriato.com/",
    description:
      "Attriato helps businesses improve GA4 implementation, GTM setup, conversion tracking, and analytics reporting.",
    email: "attriato@gmail.com",
    areaServed: "Worldwide",
    knowsAbout: [
      "GA4",
      "Google Analytics 4",
      "Google Tag Manager",
      "Conversion Tracking",
      "Analytics Reporting",
      "Marketing Attribution",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "attriato@gmail.com",
      availableLanguage: ["en"],
    },
  },
  "/services": {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Attriato Analytics Services",
    serviceType: [
      "GA4 Setup",
      "Google Tag Manager Implementation",
      "Conversion Tracking",
      "Analytics Reporting",
      "Dashboard Design",
    ],
    provider: {
      "@type": "Organization",
      name: "Attriato",
      url: "https://www.attriato.com/",
      email: "attriato@gmail.com",
    },
    areaServed: "Worldwide",
    description:
      "Attriato provides Google Analytics, GTM, conversion tracking, and reporting services to help businesses make better marketing decisions.",
  },
  "/about": {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Attriato",
    url: "https://www.attriato.com/about",
    description:
      "Attriato helps teams improve their measurement stack, reporting, and marketing performance through cleaner analytics foundations.",
    mainEntity: {
      "@type": "Organization",
      name: "Attriato",
      email: "attriato@gmail.com",
      url: "https://www.attriato.com/",
    },
  },
  "/contact": {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Attriato",
    url: "https://www.attriato.com/contact",
    description:
      "Contact Attriato for GA4 setup, GTM consulting, reporting support, and analytics strategy guidance.",
    mainEntity: {
      "@type": "Organization",
      name: "Attriato",
      email: "attriato@gmail.com",
      url: "https://www.attriato.com/",
    },
  },
  "/search-jobs": {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "GA4 & GTM Jobs",
    url: "https://www.attriato.com/search-jobs",
    description:
      "Recent GA4, Google Analytics, and Google Tag Manager job opportunities from the last 30 days.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "GA4 jobs" },
        { "@type": "ListItem", position: 2, name: "Google Analytics roles" },
        { "@type": "ListItem", position: 3, name: "Google Tag Manager jobs" },
      ],
    },
  },
  "/privacy-policy": {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy",
    url: "https://www.attriato.com/privacy-policy",
    description:
      "Attriato's privacy policy covering analytics, cookies, pixels, advertising data collection, and website tracking practices.",
    publisher: {
      "@type": "Organization",
      name: "Attriato",
      url: "https://www.attriato.com/",
    },
  },
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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

export default function App() {
  return (
    <>
      <ScrollToTop />
      <SEOUpdater />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search-jobs" element={<SearchJobs />} />
          <Route path="/privacy-policy" element={<Privacy />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
