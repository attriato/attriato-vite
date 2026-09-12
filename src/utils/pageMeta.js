/**
 * Page metadata and schema definitions
 * Separated for better code splitting and lazy loading
 */

export const pageMeta = {
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

export const pageSchemas = {
  "/": {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Attriato",
    url: "https://www.attriato.com/",
    description:
      "Attriato helps businesses improve GA4 implementation, GTM setup, conversion tracking, and analytics reporting.",
    email: "rich@attriato.com",
    areaServed: "United States",
    skills: [
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
      email: "rich@attriato.com",
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
    areaServed: "United States",
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
      email: "rich@attriato.com",
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
      email: "rich@attriato.com",
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
