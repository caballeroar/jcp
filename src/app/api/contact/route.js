import { NextResponse } from "next/server";
import { ServerClient } from "postmark";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;
const MIN_MESSAGE_LENGTH = 10;
const MIN_NAME_LENGTH = 2;

console.log("POSTMARK_API_KEY exists:", !!process.env.POSTMARK_API_KEY);

const sanitizeInput = (value = "") =>
  value
    .toString()
    .trim()
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/[<>"`]/g, "");

const isSuspicious = (value = "") => {
  const lowered = value.toLowerCase();
  return [
    "http://",
    "https://",
    "www.",
    "javascript:",
    "data:",
    "<script",
  ].some((pattern) => lowered.includes(pattern));
};

const buildConfirmationEmail = ({ name, email, organization, message }) => {
  const summaryRows = [
    { label: "Name", value: name },
    { label: "Organisation", value: organization || "—" },
    { label: "Email", value: email },
    { label: "Message", value: message },
  ]
    .map(
      (row) => `
        <tr>
          <td style="padding:8px 12px;border:1px solid #dcdcdc;font-weight:600;background:#f6f6f6;">${row.label}</td>
          <td style="padding:8px 12px;border:1px solid #dcdcdc;">${row.value}</td>
        </tr>`,
    )
    .join("");

  return `
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-family:Arial, Helvetica, sans-serif;color:#0c0c0c;background:#ffffff;border-collapse:collapse;">
    <tr>
      <td style="padding:24px;border-bottom:4px solid #0c2a2f;background:#0c2a2f;color:#ffffff;font-size:20px;font-weight:600;">
        ESG Consultancy — Confirmation
      </td>
    </tr>
    <tr>
      <td style="padding:24px;font-size:15px;line-height:1.6;">
        <p style="margin:0 0 16px;">Dear ${name},</p>
        <p style="margin:0 0 16px;">Thank you for contacting us. Your message has been received and our advisory team will respond within 2–3 working days.</p>
        <p style="margin:0 0 24px;">A summary of your submission is included below for your records.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;font-size:14px;">${summaryRows}</table>
        <p style="margin:24px 0 8px;font-weight:600;">ESG Consultancy</p>
        <p style="margin:0;">E: contact@mydomain.nl<br/>Amsterdam, The Netherlands</p>
      </td>
    </tr>
  </table>`;
};

const buildInternalEmail = ({ name, email, organization, message }) => {
  const timestamp = new Date().toISOString();
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-family:Arial, Helvetica, sans-serif;color:#0c0c0c;background:#ffffff;border-collapse:collapse;">
    <tr>
      <td style="padding:20px;border-bottom:4px solid #0c2a2f;font-weight:600;font-size:18px;">
        New Contact Submission
      </td>
    </tr>
    <tr>
      <td style="padding:20px;font-size:14px;line-height:1.5;">
        <p style="margin:0 0 12px;">Timestamp: ${timestamp}</p>
        <p style="margin:0 0 8px;"><strong>Name:</strong> ${name}</p>
        <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
        <p style="margin:0 0 8px;"><strong>Organisation:</strong> ${organization || "—"}</p>
        <p style="margin:0 0 8px;"><strong>Message:</strong></p>
        <p style="margin:0;white-space:pre-wrap;">${message}</p>
      </td>
    </tr>
  </table>`;
};

const validatePayload = ({ name, email, organization, message }) => {
  const errors = [];

  if (!name || name.length < MIN_NAME_LENGTH) {
    errors.push("Name must be at least 2 characters.");
  }

  if (name.length > MAX_FIELD_LENGTH) {
    errors.push("Name is too long.");
  }

  if (!EMAIL_REGEX.test(email)) {
    errors.push("Provide a valid email address.");
  }

  if (email.length > MAX_FIELD_LENGTH) {
    errors.push("Email is too long.");
  }

  if (organization && organization.length > MAX_FIELD_LENGTH) {
    errors.push("Organisation is too long.");
  }

  if (!message || message.length < MIN_MESSAGE_LENGTH) {
    errors.push("Message must be at least 10 characters.");
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    errors.push("Message is too long.");
  }

  if ([name, email, organization, message].some(isSuspicious)) {
    errors.push("Submission rejected.");
  }

  return errors;
};

export async function POST(request) {
  try {
    if (!process.env.POSTMARK_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Service unavailable." },
        { status: 500 },
      );
    }

    let payload;
    try {
      payload = await request.json();
    } catch (err) {
      console.error("Contact form error:", error);
      return NextResponse.json(
        { success: false, error: "Invalid request." },
        { status: 400 },
      );
    }

    const {
      name = "",
      email = "",
      organisation = "",
      organization = "",
      message = "",
      companyWebsite = "",
    } = payload || {};

    if (companyWebsite && companyWebsite.toString().trim().length > 0) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const sanitized = {
      name: sanitizeInput(name || payload?.name || ""),
      email: sanitizeInput(email || ""),
      organization: sanitizeInput(organisation || organization || ""),
      message: sanitizeInput(message || ""),
    };

    const errors = validatePayload(sanitized);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: "Unable to process submission." },
        { status: 400 },
      );
    }

    const client = new ServerClient(process.env.POSTMARK_API_KEY);

    await Promise.all([
      client.sendEmail({
        From: "amel@justcommonpeople.com",
        To: sanitized.email,
        Subject: "We received your message",
        HtmlBody: buildConfirmationEmail(sanitized),
        MessageStream: "outbound",
      }),
      client.sendEmail({
        From: "amel@justcommonpeople.com",
        To: "amel@justcommonpeople.com",
        Subject: `New contact request from ${sanitized.name}`,
        HtmlBody: buildInternalEmail(sanitized),
        MessageStream: "outbound",
      }),
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Unable to send message." },
      { status: 500 },
    );
  }
}

const methodNotAllowed = async () =>
  NextResponse.json(
    { success: false, error: "Method not allowed." },
    { status: 405 },
  );

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
export const HEAD = methodNotAllowed;
