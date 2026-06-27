import { NextResponse } from "next/server";
import { sendMonthlyTestEmail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await sendMonthlyTestEmail();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Monthly email test failed", error);
    return NextResponse.json({ error: "Unable to send monthly test email." }, { status: 500 });
  }
}
