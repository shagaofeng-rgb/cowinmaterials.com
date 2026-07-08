import { NextResponse } from "next/server";
import { runNewsAutomation } from "@/lib/news/automation";

export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await runNewsAutomation();
  return NextResponse.json(result, { status: result.ok ? 200 : 202 });
}

export async function POST(request: Request) {
  return GET(request);
}
