import { NextResponse } from "next/server";
import { sendInquiryEmail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = clean(body.name, 120);
    const email = clean(body.email, 180);
    const country = clean(body.country, 120);
    const scenario = clean(body.scenario, 160);
    const message = clean(body.message, 4000);
    const page = clean(body.page, 300);
    const website = clean(body.website, 120);

    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !isEmail(email)) {
      return NextResponse.json({ error: "Please provide a valid name and email." }, { status: 400 });
    }

    await sendInquiryEmail({
      name,
      email,
      country,
      scenario,
      message,
      page,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Inquiry email failed", error);
    return NextResponse.json({ error: "Unable to send inquiry right now." }, { status: 500 });
  }
}
