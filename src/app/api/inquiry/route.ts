import { NextResponse } from "next/server";
import { sendInquiryEmail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxFileSize = 5 * 1024 * 1024;
const allowedTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
]);

function clean(value: FormDataEntryValue | null, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function parseAttachment(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || !file.name || file.size === 0) {
    return undefined;
  }

  if (file.size > maxFileSize) {
    throw new Error("File is larger than 5 MB.");
  }

  if (!allowedTypes.has(file.type)) {
    throw new Error("Unsupported file type.");
  }

  return {
    filename: file.name.slice(0, 180),
    content: Buffer.from(await file.arrayBuffer()),
    contentType: file.type,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.formData();

    const website = clean(body.get("website"), 120);
    if (website) {
      return NextResponse.json({ ok: true });
    }

    const name = clean(body.get("name"), 120);
    const company = clean(body.get("company"), 160);
    const email = clean(body.get("email"), 180);
    const country = clean(body.get("country"), 120);
    const privacy = clean(body.get("privacy"), 20);

    if (!name || !company || !country || !email || !isEmail(email) || !privacy) {
      return NextResponse.json({ error: "Please provide the required contact fields." }, { status: 400 });
    }

    const attachment = await parseAttachment(body.get("file"));

    await sendInquiryEmail({
      name,
      company,
      email,
      phone: clean(body.get("phone"), 120),
      country,
      customerType: clean(body.get("customerType"), 120),
      requestType: clean(body.get("requestType"), 160),
      product: clean(body.get("product"), 180),
      application: clean(body.get("application"), 180),
      substrate: clean(body.get("substrate"), 180),
      operatingTemperature: clean(body.get("operatingTemperature"), 120),
      targetPerformance: clean(body.get("targetPerformance"), 220),
      quantity: clean(body.get("quantity"), 120),
      requiredStandard: clean(body.get("requiredStandard"), 160),
      purchaseTime: clean(body.get("purchaseTime"), 120),
      message: clean(body.get("message"), 5000),
      page: clean(body.get("page"), 500),
      submittedAt: new Date().toISOString(),
      utm: {
        utm_source: clean(body.get("utm_source"), 120),
        utm_medium: clean(body.get("utm_medium"), 120),
        utm_campaign: clean(body.get("utm_campaign"), 120),
        utm_term: clean(body.get("utm_term"), 120),
        utm_content: clean(body.get("utm_content"), 120),
      },
      attachment,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Inquiry email failed", error);
    return NextResponse.json({ error: "Unable to send inquiry right now." }, { status: 500 });
  }
}
