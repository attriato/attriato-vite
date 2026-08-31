/**
 * Google Tag Manager utilities for tracking page views and custom events
 */

/**
 * Push a page_view event to GTM dataLayer
 * @param {string} pageTitle - The title of the page (e.g., "Home", "About Attriato")
 * @param {string} pageLocation - The full URL of the page (e.g., "https://www.attriato.com/about")
 */
export const pushPageViewToGTM = (pageTitle, pageLocation) => {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: "page_view",
      page_title: pageTitle,
      page_location: pageLocation,
    });
  }
};

/**
 * Push a custom event to GTM dataLayer
 * @param {string} eventName - The name of the event (e.g., "contact_form_submit")
 * @param {object} eventData - Additional data to send with the event
 */
export const pushEventToGTM = (eventName, eventData = {}) => {
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData,
    });
  }
};
