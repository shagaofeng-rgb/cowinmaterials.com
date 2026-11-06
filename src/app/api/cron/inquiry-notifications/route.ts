import { NextResponse } from "next/server";
import { retryDueInquiryNotifications } from "@/lib/inquiry-notifications";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const result = await retryDueInquiryNotifications();
    console.info(JSON.stringify({ event: "inquiry_notification_retry", ...result }));
    return NextResponse.json({ ok: result.failed === 0, ...result }, { status: result.failed ? 503 : 200 });
  } catch {
    console.error(JSON.stringify({ event: "inquiry_notification_retry_failed" }));
    return NextResponse.json({ error: "Notification processing is unavailable." }, { status: 503 });
  }
}
