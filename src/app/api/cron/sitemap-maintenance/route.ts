import { NextResponse } from "next/server";
import { runSitemapMaintenance } from "@/lib/sitemap/maintenance";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret || authorization !== `Bearer ${secret}`) {
    console.warn(JSON.stringify({
      event: "sitemap_maintenance_unauthorized",
      secretConfigured: Boolean(secret),
      secretLength: secret?.length || 0,
      authorizationPresent: Boolean(authorization),
      authorizationLength: authorization?.length || 0,
    }));
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const result = await runSitemapMaintenance({
    trigger: url.searchParams.get("trigger") === "content_change" ? "content_change" : url.searchParams.get("trigger") === "manual" ? "manual" : "cron",
    force: url.searchParams.get("force") === "true",
    dryRun: url.searchParams.get("dryRun") === "true",
    submit: url.searchParams.get("submit") === "true",
  });
  return NextResponse.json(result, { status: result.status === "locked" ? 409 : result.ok ? 200 : 500 });
}
