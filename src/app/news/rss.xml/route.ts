import { NextResponse } from "next/server";
import { getPublishedNews } from "@/lib/news/store";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

function xmlEscape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET() {
  const news = await getPublishedNews({ pageSize: 30 });
  const items = news.articles
    .map(
      (article) => `
        <item>
          <title>${xmlEscape(article.title)}</title>
          <link>${absoluteUrl(`/news/${article.slug}`)}</link>
          <guid>${absoluteUrl(`/news/${article.slug}`)}</guid>
          <description>${xmlEscape(article.excerpt)}</description>
          <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
          <source url="${xmlEscape(article.source.url)}">${xmlEscape(article.source.publisher)}</source>
        </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Cowin Materials Aerogel News</title>
        <link>${absoluteUrl("/news")}</link>
        <description>Aerogel material industry briefs from Cowin Materials.</description>
        <language>en</language>
        ${items}
      </channel>
    </rss>`;

  return new NextResponse(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
