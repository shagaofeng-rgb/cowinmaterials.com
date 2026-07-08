import { NextResponse } from "next/server";
import { getPublishedNews } from "@/lib/news/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || "1");
  const pageSize = Number(url.searchParams.get("pageSize") || "12");
  const productSlug = url.searchParams.get("product") || undefined;
  const result = await getPublishedNews({ page, pageSize, productSlug });

  return NextResponse.json(result, {
    headers: { "cache-control": "s-maxage=300, stale-while-revalidate=1200" },
  });
}
