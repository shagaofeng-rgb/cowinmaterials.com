import { NextResponse } from "next/server";
import { sendMonthlyEmailHealthCheck } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await sendMonthlyEmailHealthCheck();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Monthly email health check failed", error);
    return NextResponse.json({ error: "Unable to send monthly email health check." }, { status: 500 });
  }
}
