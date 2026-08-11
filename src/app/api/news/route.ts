import { NextResponse } from "next/server";
import { getPublishedNews } from "@/lib/news/store";
export const dynamic = "force-dynamic";
export async function GET(request: Request) { const url = new URL(request.url); const result = await getPublishedNews({ page: Number(url.searchParams.get("page") || "1"), pageSize: Number(url.searchParams.get("pageSize") || "12"), productSlug: url.searchParams.get("product") || undefined }); return NextResponse.json(result, { headers: { "cache-control": "s-maxage=300, stale-while-revalidate=1200" } }); }
