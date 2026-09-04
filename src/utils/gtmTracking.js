/**
 * Google Tag Manager utilities for flexible event tracking
 */

/**
 * Get the current Unix timestamp in seconds
 * @returns {number} Seconds since January 1, 1970 UTC
 */
const getUnixTime = () => Math.floor(Date.now() / 1000);

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
 * Read a cookie value by name
 * @param {string} name - The cookie name
 * @returns {string} The decoded cookie value, or an empty string if not found
 */
const getCookieValue = (name) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
};

/**
 * Get the CookieYes consent state, excluding the consentid/consent/action keys
 * @returns {string} Comma-separated "key:value" consent categories
 */
const getConsentMode = () => {
  const raw = getCookieValue("cookieyes-consent");
  if (!raw) return "";
  const excludedKeys = ["consentid", "consent", "action"];
  return raw
    .split(",")
    .filter((pair) => !excludedKeys.includes(pair.split(":")[0]))
    .join(",");
};

/**
 * Generic event push to GTM dataLayer
 * Always includes: event, dl.page_title, dl.page_location, dl.page_path, dl.timestamp, dl.consent_mode
 * @param {string} eventName - The name of the event
 * @param {object} additionalData - Additional properties to include
 */
export const pushToDataLayer = (eventName, additionalData = {}) => {
  if (!window.dataLayer) return;

  const pageTitle = document.title || "";
  const pageLocation = stripHashRouting(window.location.href);
  const pagePath = getPagePath();
  const timestamp = getUnixTime();

  window.dataLayer.push({
    event: eventName,
    "dl.page_title": pageTitle,
    "dl.page_location": pageLocation,
    "dl.page_path": pagePath,
    "dl.timestamp": timestamp,
    "dl.consent_mode": getConsentMode(),
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
    "dl.page_title": pageTitle || document.title,
    "dl.page_location": pageLocation || stripHashRouting(window.location.href),
    "dl.page_path": getPagePath(),
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
  pushToDataLayer("generate_lead", {
    "dl.form_id": formId,
  });
};

/**
 * Setup automatic link click tracking
 * Attaches a listener to all links and buttons on the page
 * Uses the capture phase so location is captured before React Router navigates
 */
export const initLinkTracking = () => {
  document.addEventListener(
    "click",
    (e) => {
      const target = e.target.closest("a, button");
      if (target) {
        pushLinkClick(target);
      }
    },
    true
  );
};
