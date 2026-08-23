import { NextResponse } from "next/server";
import { recordAnalyticsEvent } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const whatsappEventName = "whatsapp_click";
const pageViewEventName = "page_view";
const whatsappPlacement = "floating_whatsapp";

function readString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidEventId(value: string) {
  return /^[a-z0-9-]{16,120}$/i.test(value);
}

function isValidPagePath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") && value.length <= 260;
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }

    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Use JSON to record an analytics event." }, { status: 415 });
    }

    const body = await request.json().catch(() => null) as Record<string, unknown> | null;
    const receivedEventName = readString(body?.event_name, 80);
    const receivedPlacement = readString(body?.placement, 80);
    const receivedEventId = readString(body?.event_id, 120);
    const pagePath = readString(body?.page_path, 260);

    const isPageView = receivedEventName === pageViewEventName;
    const isWhatsappClick = receivedEventName === whatsappEventName && receivedPlacement === whatsappPlacement;
    if ((!isPageView && !isWhatsappClick) || !isValidEventId(receivedEventId) || !isValidPagePath(pagePath)) {
      return NextResponse.json({ error: "Invalid analytics event." }, { status: 400 });
    }

    const result = await recordAnalyticsEvent({
      eventId: receivedEventId,
      eventName: isPageView ? pageViewEventName : whatsappEventName,
      pagePath,
      source: "website",
      placement: isWhatsappClick ? whatsappPlacement : undefined,
    });

    if (!result.recorded && !result.duplicate) {
      return NextResponse.json({ error: "Analytics storage is unavailable." }, { status: 503 });
    }

    return NextResponse.json({ ok: true, duplicate: result.duplicate }, { status: result.duplicate ? 200 : 201 });
  } catch {
    return NextResponse.json({ error: "Unable to record analytics event." }, { status: 500 });
  }
}
