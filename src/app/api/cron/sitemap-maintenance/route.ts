import { NextResponse } from "next/server";
import { runSitemapMaintenance } from "@/lib/sitemap/maintenance";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const result = await runSitemapMaintenance({
    trigger: url.searchParams.get("trigger") === "content_change" ? "content_change" : url.searchParams.get("trigger") === "manual" ? "manual" : "cron",
    dryRun: url.searchParams.get("dryRun") === "true",
  });
  return NextResponse.json(result, { status: result.status === "locked" ? 409 : result.ok ? 200 : 500 });
}
