import { NextResponse } from "next/server";
import { runNewsAutomation } from "@/lib/news/automation";
export const dynamic = "force-dynamic";
function authorized(request: Request) { const secret = process.env.CRON_SECRET; return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`; }
export async function GET(request: Request) { if (!authorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 }); const result = await runNewsAutomation(); console.info(JSON.stringify({ event: "news_automation", trigger: "vercel_cron", ...result })); return NextResponse.json(result, { status: result.ok ? 200 : 503 }); }
export async function POST(request: Request) { return GET(request); }
