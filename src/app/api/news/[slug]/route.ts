import { NextResponse } from "next/server";
import { getPublishedNewsBySlug } from "@/lib/news/store";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedNewsBySlug(slug);

  if (!article) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(article, {
    headers: { "cache-control": "s-maxage=300, stale-while-revalidate=1200" },
  });
}
