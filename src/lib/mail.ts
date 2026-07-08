import nodemailer from "nodemailer";
import { site } from "@/lib/data";

export type InquiryPayload = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  country?: string;
  customerType?: string;
  requestType?: string;
  product?: string;
  application?: string;
  substrate?: string;
  operatingTemperature?: string;
  targetPerformance?: string;
  quantity?: string;
  requiredStandard?: string;
  purchaseTime?: string;
  message?: string;
  page?: string;
  submittedAt?: string;
  utm?: Record<string, string>;
  attachment?: {
    filename: string;
    content: Buffer;
    contentType?: string;
  };
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
    formatTextLine("Company", payload.company),
    formatTextLine("Business Email", payload.email),
    formatTextLine("Phone / WhatsApp", payload.phone),
    formatTextLine("Country / Region", payload.country),
    formatTextLine("Customer Type", payload.customerType),
    formatTextLine("Request Type", payload.requestType),
    formatTextLine("Product", payload.product),
    formatTextLine("Application", payload.application),
    formatTextLine("Substrate", payload.substrate),
    formatTextLine("Operating Temperature", payload.operatingTemperature),
    formatTextLine("Target Performance", payload.targetPerformance),
    formatTextLine("Project Area or Quantity", payload.quantity),
    formatTextLine("Required Standard", payload.requiredStandard),
    formatTextLine("Estimated Purchase Time", payload.purchaseTime),
    formatTextLine("Submitted At", submittedAt),
    formatTextLine("Page", payload.page),
    formatTextLine("UTM", payload.utm ? JSON.stringify(payload.utm) : ""),
    "",
    "Project Requirements:",
    payload.message?.trim() || "-",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#17201d;line-height:1.5;">
      <h2 style="margin:0 0 16px;">New website inquiry</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;min-width:520px;">
        ${formatHtmlRow("Name", payload.name)}
        ${formatHtmlRow("Company", payload.company)}
        ${formatHtmlRow("Business Email", payload.email)}
        ${formatHtmlRow("Phone / WhatsApp", payload.phone)}
        ${formatHtmlRow("Country / Region", payload.country)}
        ${formatHtmlRow("Customer Type", payload.customerType)}
        ${formatHtmlRow("Request Type", payload.requestType)}
        ${formatHtmlRow("Product", payload.product)}
        ${formatHtmlRow("Application", payload.application)}
        ${formatHtmlRow("Substrate", payload.substrate)}
        ${formatHtmlRow("Operating Temperature", payload.operatingTemperature)}
        ${formatHtmlRow("Target Performance", payload.targetPerformance)}
        ${formatHtmlRow("Project Area or Quantity", payload.quantity)}
        ${formatHtmlRow("Required Standard", payload.requiredStandard)}
        ${formatHtmlRow("Estimated Purchase Time", payload.purchaseTime)}
        ${formatHtmlRow("Submitted At", submittedAt)}
        ${formatHtmlRow("Page", payload.page)}
        ${formatHtmlRow("UTM", payload.utm ? JSON.stringify(payload.utm) : "")}
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
    attachments: payload.attachment ? [payload.attachment] : undefined,
  });
}

export async function sendMonthlyEmailHealthCheck() {
  const to = process.env.MAIL_TO || site.email;
  const from = process.env.MAIL_FROM || `${site.name} Website <${getEnv("SMTP_USER")}>`;
  const checkedAt = new Date().toISOString();

  await getTransporter().sendMail({
    from,
    to,
    subject: `[${site.name}] Monthly email delivery health check`,
    text: [
      "Monthly email delivery health check",
      "",
      `Site: ${site.domain}`,
      `Recipient: ${to}`,
      `Checked at: ${checkedAt}`,
      "",
      "If this message arrived, the website SMTP configuration is working.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#17201d;line-height:1.5;">
        <h2 style="margin:0 0 12px;">Monthly email delivery health check</h2>
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
