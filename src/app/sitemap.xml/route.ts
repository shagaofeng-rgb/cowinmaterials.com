import { getSitemapSummary, sitemapKinds } from "@/lib/sitemap/catalog";
import { absoluteUrl } from "@/lib/seo";
import { MAX_SITEMAP_URLS, renderSitemapIndex } from "@/lib/sitemap/xml";

export const dynamic = "force-dynamic";

export async function GET() {
  const summaries = await Promise.all(sitemapKinds.map(getSitemapSummary));
  const entries = summaries.flatMap((summary) => {
    const parts = Math.ceil(summary.count / MAX_SITEMAP_URLS);
    return Array.from({ length: parts }, (_, index) => ({
      url: absoluteUrl(`/sitemaps/${summary.kind}-${index + 1}.xml`),
      lastModified: summary.lastModified,
    }));
  });

  return new Response(renderSitemapIndex(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
