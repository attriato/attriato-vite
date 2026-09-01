import React, { useState } from "react";


const FAQ = [
  { q: "What types of businesses do you work with?", a: "Attriato supports data-driven businesses that want more accurate analytics, stronger reporting, and better visibility into marketing performance." },
  { q: "Can you audit an existing GA4 setup?", a: "Yes. We review your current Google Analytics and Google Tag Manager implementation, identify tracking gaps, and recommend practical fixes." },
  { q: "Do you help with conversion tracking?", a: "Absolutely. We can set up and validate conversion tracking for forms, calls, purchases, lead actions, and other key business events." },
  { q: "How soon can we get started?", a: "Most projects begin with an initial consultation to understand your goals, current setup, and reporting needs." },
  { q: "What should I include in my message?", a: "Share your website, current tools, the main tracking issues you are facing, and what decisions you want your reporting to support." },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", help: "", details: "" });
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.help || !form.details) {
      setStatus("Please fill in all required fields before sending.");
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_pfylbn4";
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!templateId || !publicKey) {
      setStatus("EmailJS is not fully configured yet. Add VITE_EMAILJS_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY to your .env file.");
      return;
    }

    setIsSending(true);
    setStatus("Sending your message...");

    try {
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          from_email: form.email,
          phone: form.phone,
          help: form.help,
          details: form.details,
        },
        { publicKey }
      );

      // Lazy-load and push contact form submission event to GTM
      try {
        const { pushContactFormSubmission } = await import("../utils/gtmTracking.js");
        pushContactFormSubmission("contact-form");
      } catch (gtmError) {
        console.warn("Failed to track contact submission:", gtmError);
      }

      setStatus(`✓ Thanks, ${form.name}. Your inquiry has been sent successfully.`);
      setForm({ name: "", email: "", phone: "", help: "", details: "" });
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("Something went wrong while sending the form. Please email attriato@gmail.com directly.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <>
      <section className="section contact-hero-section" style={{ paddingBottom: 30 }}>
        <div className="container contact-hero">
          <div className="contact-hero-copy">
            <h1 style={{ maxWidth: 700 }}>Let's improve your tracking</h1>
            <p style={{ maxWidth: 560, fontSize: "1.05rem" }}>
              Reach out to Attriato for Google Analytics setup, GTM
              implementation, reporting support, and tracking strategy that
              helps you make clearer marketing decisions.
            </p>
            <div className="btn-row">
              <a href="#get-in-touch" className="btn btn-primary">Book Now</a>
            </div>
          </div>

          <img
            className="contact-hero-image"
            src="/images/1408262068.jpg"
            alt="Team discussing analytics and reporting"
            width={600}
            height={450}
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </section>

      <section className="section section--raised" id="get-in-touch">
        <div className="container split">
          <div>
            <h2>Start your consultation</h2>
            <p style={{ maxWidth: 480 }}>
              Whether you need a fresh analytics setup or help fixing
              unreliable data, Attriato can help you build a cleaner
              measurement foundation.
            </p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Full name*</label>
              <input id="name" required value={form.name} onChange={update("name")} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label htmlFor="email">Email address*</label>
                <input id="email" type="email" required value={form.email} onChange={update("email")} />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone number*</label>
                <input id="phone" type="tel" required value={form.phone} onChange={update("phone")} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="help">How can we help?*</label>
              <select id="help" required value={form.help} onChange={update("help")}>
                <option value="">— Select an option —</option>
                <option>GA4 setup</option>
                <option>GTM implementation</option>
                <option>Tracking audit</option>
                <option>Conversion tracking</option>
                <option>Reporting</option>
                <option>Strategy consulting</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="details">Project details*</label>
              <textarea id="details" required value={form.details} onChange={update("details")} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSending}>
              {isSending ? "Sending..." : "Send Inquiry"}
            </button>
            <div className="form-status">{status}</div>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <h2>A few quick answers before you reach out.</h2>
          <div style={{ marginTop: 20 }}>
            {FAQ.map((f) => (
              <details className="faq-item" key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
