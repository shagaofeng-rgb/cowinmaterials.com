import nodemailer from "nodemailer";
import { site } from "@/lib/data";

type InquiryPayload = {
  name: string;
  email: string;
  country?: string;
  scenario?: string;
  message?: string;
  page?: string;
  submittedAt?: string;
};

let transporter: nodemailer.Transporter | null = null;

function getEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.exmail.qq.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: (process.env.SMTP_SECURE || "true") === "true",
      auth: {
        user: getEnv("SMTP_USER"),
        pass: getEnv("SMTP_PASS"),
      },
    });
  }

  return transporter;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTextLine(label: string, value?: string) {
  return `${label}: ${value?.trim() || "-"}`;
}

function formatHtmlRow(label: string, value?: string) {
  return `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;background:#f8fafc;width:170px;">${escapeHtml(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(value?.trim() || "-")}</td></tr>`;
}

export async function sendInquiryEmail(payload: InquiryPayload) {
  const to = process.env.MAIL_TO || site.email;
  const from = process.env.MAIL_FROM || `${site.name} Website <${getEnv("SMTP_USER")}>`;
  const submittedAt = payload.submittedAt || new Date().toISOString();

  const text = [
    "New website inquiry",
    "",
    formatTextLine("Name", payload.name),
    formatTextLine("Company Email", payload.email),
    formatTextLine("Country / Region", payload.country),
    formatTextLine("Application", payload.scenario),
    formatTextLine("Submitted At", submittedAt),
    formatTextLine("Page", payload.page),
    "",
    "Project Requirements:",
    payload.message?.trim() || "-",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#17201d;line-height:1.5;">
      <h2 style="margin:0 0 16px;">New website inquiry</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;min-width:520px;">
        ${formatHtmlRow("Name", payload.name)}
        ${formatHtmlRow("Company Email", payload.email)}
        ${formatHtmlRow("Country / Region", payload.country)}
        ${formatHtmlRow("Application", payload.scenario)}
        ${formatHtmlRow("Submitted At", submittedAt)}
        ${formatHtmlRow("Page", payload.page)}
      </table>
      <h3 style="margin:20px 0 8px;">Project Requirements</h3>
      <div style="white-space:pre-wrap;padding:14px;border:1px solid #e5e7eb;background:#f8fafc;">${escapeHtml(payload.message?.trim() || "-")}</div>
    </div>
  `;

  await getTransporter().sendMail({
    from,
    to,
    replyTo: payload.email,
    subject: `[${site.name}] New inquiry from ${payload.name}`,
    text,
    html,
  });
}

export async function sendMonthlyTestEmail() {
  const to = process.env.MAIL_TO || site.email;
  const from = process.env.MAIL_FROM || `${site.name} Website <${getEnv("SMTP_USER")}>`;
  const checkedAt = new Date().toISOString();

  await getTransporter().sendMail({
    from,
    to,
    subject: `[${site.name}] Monthly website email test`,
    text: [
      "Monthly email delivery test",
      "",
      `Site: ${site.domain}`,
      `Recipient: ${to}`,
      `Checked at: ${checkedAt}`,
      "",
      "If this message arrived, the website SMTP configuration is working.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#17201d;line-height:1.5;">
        <h2 style="margin:0 0 12px;">Monthly email delivery test</h2>
        <p>If this message arrived, the website SMTP configuration is working.</p>
        <ul>
          <li><strong>Site:</strong> ${escapeHtml(site.domain)}</li>
          <li><strong>Recipient:</strong> ${escapeHtml(to)}</li>
          <li><strong>Checked at:</strong> ${escapeHtml(checkedAt)}</li>
        </ul>
      </div>
    `,
  });
}
