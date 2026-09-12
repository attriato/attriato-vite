/**
 * Cloudflare Pages Function: /api/contact
 * Handles contact form submissions and delivers emails directly to rich@attriato.com
 * using Cloudflare's native Send Email binding (env.MAIL, env.SEB, or env.EMAIL).
 */

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const body = await request.json();
    const { name, email, phone, help, details, turnstileToken } = body || {};

    if (!name || !email || !phone || !help || !details) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify Cloudflare Turnstile token if secret key is configured
    if (env.TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) {
        return new Response(
          JSON.stringify({ error: "Turnstile verification token is missing." }),
          { status: 400, headers: corsHeaders }
        );
      }

      const clientIp = request.headers.get("CF-Connecting-IP") || "";
      const formData = new FormData();
      formData.append("secret", env.TURNSTILE_SECRET_KEY);
      formData.append("response", turnstileToken);
      if (clientIp) formData.append("remoteip", clientIp);

      const turnstileRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          body: formData,
        }
      );
      const turnstileResult = await turnstileRes.json();

      if (!turnstileResult.success) {
        return new Response(
          JSON.stringify({ error: "Turnstile verification failed. Please try again." }),
          { status: 400, headers: corsHeaders }
        );
      }
    }

    const toEmail = env.CONTACT_TO_EMAIL || "rich@attriato.com";
    const fromEmail = env.CONTACT_FROM_EMAIL || "contact@attriato.com";
    const mailBinding = env.MAIL || env.SEB || env.EMAIL;

    if (!mailBinding || typeof mailBinding.send !== "function") {
      console.error("Cloudflare Send Email binding is not attached in Pages settings.");
      return new Response(
        JSON.stringify({
          error: "Email service is not bound in Cloudflare Pages. Please email rich@attriato.com directly.",
        }),
        { status: 503, headers: corsHeaders }
      );
    }

    const rawMimeMessage = buildMimeMessage({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New Attriato Inquiry: ${name} (${help})`,
      name,
      email,
      phone,
      help,
      details,
    });

    await mailBinding.send({
      from: fromEmail,
      to: toEmail,
      raw: rawMimeMessage,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Inquiry sent successfully." }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error processing contact submission:", error);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred. Please email rich@attriato.com directly.",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

function buildMimeMessage({ from, to, replyTo, subject, name, email, phone, help, details }) {
  const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  const dateStr = new Date().toUTCString();

  const textBody = `
New Attriato Contact Inquiry
----------------------------
Name: ${name}
Email: ${email}
Phone: ${phone}
Service / Topic: ${help}

Project Details:
${details}
`.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #0F1B2D; line-height: 1.6;">
  <div style="border-bottom: 2px solid #3EB489; padding-bottom: 12px; margin-bottom: 20px;">
    <h2 style="margin: 0; color: #0F1B2D;">New Attriato Contact Inquiry</h2>
    <p style="margin: 4px 0 0; color: #5C6670; font-size: 14px;">Received on ${escapeHtml(dateStr)}</p>
  </div>
  
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr>
      <td style="padding: 8px 0; font-weight: 600; width: 140px; color: #5C6670;">Name:</td>
      <td style="padding: 8px 0; color: #0F1B2D; font-size: 16px;"><strong>${escapeHtml(name)}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: 600; color: #5C6670;">Email:</td>
      <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #3EB489; text-decoration: none;">${escapeHtml(email)}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: 600; color: #5C6670;">Phone:</td>
      <td style="padding: 8px 0;"><a href="tel:${escapeHtml(phone)}" style="color: #0F1B2D; text-decoration: none;">${escapeHtml(phone)}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: 600; color: #5C6670;">Service / Topic:</td>
      <td style="padding: 8px 0; color: #0F1B2D;">${escapeHtml(help)}</td>
    </tr>
  </table>

  <div style="background-color: #EEF0EA; border-left: 4px solid #3EB489; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
    <h4 style="margin: 0 0 8px; color: #0F1B2D;">Project Details:</h4>
    <p style="margin: 0; white-space: pre-wrap; color: #0F1B2D;">${escapeHtml(details)}</p>
  </div>

  <p style="font-size: 12px; color: #5C6670; border-top: 1px solid #e0e0e0; padding-top: 12px; margin-top: 24px;">
    This message was sent from the Attriato contact form at attriato.com.
  </p>
</body>
</html>
`.trim();

  return [
    `From: Attriato Contact Form <${from}>`,
    `To: <${to}>`,
    `Reply-To: ${name} <${replyTo}>`,
    `Subject: ${subject}`,
    `Date: ${dateStr}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    textBody,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    htmlBody,
    ``,
    `--${boundary}--`,
  ].join("\r\n");
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Inquiry sent successfully." }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error processing contact submission:", error);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred. Please email rich@attriato.com directly.",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
