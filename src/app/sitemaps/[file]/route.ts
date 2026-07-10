import { getSitemapChunk } from "@/lib/sitemap/catalog";
import type { SitemapKind } from "@/lib/sitemap/types";
import { isWellFormedSitemapXml, renderUrlSet } from "@/lib/sitemap/xml";

export const dynamic = "force-dynamic";

const filePattern = /^(pages|products|applications|news)-(\d+)\.xml$/;

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const match = file.match(filePattern);
  if (!match) return new Response("Not found", { status: 404 });

  const kind = match[1] as SitemapKind;
  const part = Number(match[2]);
  const entries = await getSitemapChunk(kind, part);
  if (!entries.length) return new Response("Not found", { status: 404 });

  const xml = renderUrlSet(entries);
  if (!isWellFormedSitemapXml(xml)) {
    return new Response("Sitemap generation failed", { status: 500 });
  }

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
