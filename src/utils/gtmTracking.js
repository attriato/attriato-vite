/**
 * Google Tag Manager utilities for flexible event tracking
 */

/**
 * Get current US Central Time as a formatted string
 * @returns {string} Formatted timestamp in US Central Time with AM/PM
 */
const getUsCentralTime = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return formatter.format(now);
};

/**
 * Strip the HashRouter "/#" segment from a URL so GTM sees clean paths
 * @param {string} url - The URL to clean
 * @returns {string} URL without the "/#" hash routing segment
 */
const stripHashRouting = (url) => {
  if (!url) return url;
  return url.replace(/\/#(?=\/|$)/, "");
};

/**
 * Get the current route path, resolving HashRouter's "#" segment
 * @returns {string} Path without the "/#" hash routing segment
 */
const getPagePath = () => {
  const { pathname, hash } = window.location;
  return hash ? hash.replace(/^#/, "") || "/" : pathname;
};

/**
 * Check if a URL is outbound (exits the current domain)
 * @param {string} url - The URL to check
 * @returns {string} "Y" if outbound, "N" if same domain
 */
const isOutboundLink = (url) => {
  if (!url) return "N";
  try {
    const linkDomain = new URL(url, window.location.origin).hostname;
    const currentDomain = window.location.hostname;
    return linkDomain !== currentDomain ? "Y" : "N";
  } catch {
    return "N";
  }
};

/**
 * Extract and clean link text
 * @param {string} text - The raw text
 * @returns {string} Text truncated to 100 characters
 */
const cleanLinkText = (text) => {
  if (!text) return "";
  return text.trim().substring(0, 100);
};

/**
 * Generic event push to GTM dataLayer
 * Always includes: event, dl.page_title, dl.page_location, dl.page_path, dl.timestamp
 * @param {string} eventName - The name of the event
 * @param {object} additionalData - Additional properties to include
 */
export const pushToDataLayer = (eventName, additionalData = {}) => {
  if (!window.dataLayer) return;

  const pageTitle = document.title || "";
  const pageLocation = stripHashRouting(window.location.href);
  const pagePath = getPagePath();
  const timestamp = getUsCentralTime();

  window.dataLayer.push({
    event: eventName,
    page_title: pageTitle,
    page_location: pageLocation,
    page_path: pagePath,
    "dl.timestamp": timestamp,
    ...additionalData,
  });
};

/**
 * Push a page_view event (for route changes or initial page loads)
 * @param {string} pageTitle - Optional override for page title
 * @param {string} pageLocation - Optional override for page location
 */
export const pushPageView = (pageTitle, pageLocation) => {
  pushToDataLayer("page_view", {
    page_title: pageTitle || document.title,
    page_location: pageLocation || stripHashRouting(window.location.href),
    page_path: getPagePath(),
  });
};

/**
 * Push a link/button click event
 * @param {HTMLElement} element - The clicked link or button element
 * @param {string} customEventName - Optional custom event name (default: "link_click")
 */
export const pushLinkClick = (element, customEventName = "click") => {
  if (!element) return;

  const href = element.getAttribute("href") || "";
  const text = element.textContent || element.innerText || "";
  const classes = element.className || "";
  const tagName = element.tagName.toLowerCase();
  // Determine link type: button if tag is button or className contains 'btn'
  const linkType = tagName === "button" || classes.includes("btn") ? "button" : "link";
  const linkDomain = href ? new URL(href, window.location.origin).hostname : "";
  const outbound = isOutboundLink(href);

  pushToDataLayer(customEventName, {
    "dl.link_text": cleanLinkText(text),
    "dl.link_url": href,
    "dl.link_domain": linkDomain,
    "dl.link_classes": classes,
    "dl.outbound": outbound,
    "dl.link_type": linkType,
  });
};

/**
 * Push a contact form submission event
 * @param {string} formId - The ID of the form
 */
export const pushContactFormSubmission = (formId = "contact-form") => {
  pushToDataLayer("form_submit", {
    "dl.form_id": formId,
  });
};

/**
 * Setup automatic link click tracking
 * Attaches a listener to all links and buttons on the page
 */
export const initLinkTracking = () => {
  document.addEventListener("click", (e) => {
    const target = e.target.closest("a, button");
    if (target) {
      pushLinkClick(target);
    }
  });
};
