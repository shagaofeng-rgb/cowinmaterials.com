import "server-only";

import { cache } from "react";
import { getPool } from "@/lib/database";
import { absoluteUrl } from "@/lib/seo";
import type { NewsArticle, NewsListResult, NewsRelatedProduct } from "./types";
import { buildNewsSeoTitle } from "./utils";

type NewsRow = {
  id: string; title: string; slug: string; excerpt: string; content_html: string; status: NewsArticle["status"]; seo_indexable: boolean; category: string | null; tags: string[] | null;
  published_at: Date | string; updated_at: Date | string; author_name: string | null; seo_title: string | null; seo_description: string | null;
  canonical_url: string | null; primary_keyword: string | null; secondary_keywords: string[] | null; geo_summary: string | null; key_takeaways: string[] | null;
  cover_image_url: string; cover_image_source_url: string | null; cover_image_page_url: string | null; cover_image_alt: string; cover_image_width: number | null; cover_image_height: number | null; cover_image_hash: string | null; cover_image_status: "verified" | "pending" | "failed"; cover_image_fetched_at: Date | string | null;
  source_title: string; source_author: string | null; source_publisher: string; source_url: string; canonical_source_url: string; source_language: string | null; source_published_at: Date | string; source_fetched_at: Date | string; source_timezone: string | null; source_fingerprint: string; related_products: NewsRelatedProduct[] | null;
};
export type NewsSitemapEntry = { slug: string; updatedAt: string };
const iso = (value?: Date | string | null) => value ? new Date(value).toISOString() : new Date().toISOString();

const articleSelect = `select a.*, coalesce(json_agg(json_build_object('slug', np.product_slug, 'name', np.product_name, 'category', np.product_category, 'summary', np.product_summary, 'image', np.product_image, 'relationshipReason', np.relationship_reason, 'relevanceScore', np.relevance_score) order by np.display_order asc) filter (where np.product_slug is not null), '[]') as related_products from news_articles a left join news_products np on np.news_id = a.id`;
function rowToArticle(row: NewsRow): NewsArticle {
  const storedSeoTitle = row.seo_title?.trim();
  return { id: row.id, title: row.title, slug: row.slug, excerpt: row.excerpt, contentHtml: row.content_html, status: row.status, indexable: row.seo_indexable, language: "en", category: row.category || "Industry News", tags: row.tags || [], publishedAt: iso(row.published_at), updatedAt: iso(row.updated_at), authorName: row.author_name || "Cowin Materials Editorial Team", seoTitle: storedSeoTitle && storedSeoTitle.length <= 68 ? storedSeoTitle : buildNewsSeoTitle(row.title), seoDescription: row.seo_description || row.excerpt, canonicalUrl: row.canonical_url || absoluteUrl(`/news/${row.slug}`), primaryKeyword: row.primary_keyword, secondaryKeywords: row.secondary_keywords || [], geoSummary: row.geo_summary || row.excerpt, keyTakeaways: row.key_takeaways || [], image: { url: row.cover_image_url, sourceUrl: row.cover_image_source_url || row.source_url, pageUrl: row.cover_image_page_url || row.source_url, alt: row.cover_image_alt || row.title, width: row.cover_image_width, height: row.cover_image_height, hash: row.cover_image_hash, status: row.cover_image_status, fetchedAt: iso(row.cover_image_fetched_at || row.source_fetched_at) }, source: { title: row.source_title, publisher: row.source_publisher, author: row.source_author, url: row.source_url, canonicalUrl: row.canonical_source_url, language: row.source_language, publishedAt: iso(row.source_published_at), fetchedAt: iso(row.source_fetched_at), timezone: row.source_timezone, fingerprint: row.source_fingerprint }, relatedProducts: row.related_products || [] };
}

const publishedClause = "a.status = 'published' and a.deleted_at is null and a.published_at <= now() and a.cover_image_url <> ''";
const indexablePublishedClause = `${publishedClause} and a.seo_indexable = true`;
export async function getPublishedNews({ page = 1, pageSize = 12, productSlug }: { page?: number; pageSize?: number; productSlug?: string } = {}): Promise<NewsListResult> {
  const pool = getPool(); const safePage = Math.max(1, Math.floor(page)); const safePageSize = Math.min(50, Math.max(1, Math.floor(pageSize)));
  if (!pool) return { articles: [], total: 0, page: safePage, pageSize: safePageSize };
  try {
    const params: unknown[] = []; let filter = "";
    if (productSlug) { params.push(productSlug); filter = ` and exists (select 1 from news_products px where px.news_id = a.id and px.product_slug = $${params.length})`; }
    const count = await pool.query<{ count: string }>(`select count(*)::text as count from news_articles a where ${publishedClause}${filter}`, params);
    params.push(safePageSize, (safePage - 1) * safePageSize);
    const rows = await pool.query<NewsRow>(`${articleSelect} where ${publishedClause}${filter} group by a.id order by a.published_at desc limit $${params.length - 1} offset $${params.length}`, params);
    return { articles: rows.rows.map(rowToArticle), total: Number(count.rows[0]?.count || 0), page: safePage, pageSize: safePageSize };
  } catch { return { articles: [], total: 0, page: safePage, pageSize: safePageSize }; }
}

export const getPublishedNewsBySlug = cache(async function getPublishedNewsBySlug(slug: string) {
  const pool = getPool(); if (!pool) return null;
  try { const result = await pool.query<NewsRow>(`${articleSelect} where ${publishedClause} and a.slug = $1 group by a.id limit 1`, [slug]); return result.rows[0] ? rowToArticle(result.rows[0]) : null; } catch { return null; }
});

export async function getPublishedNewsSitemapSummary() {
  const pool = getPool(); if (!pool) return { count: 0, lastModified: new Date().toISOString() };
  try { const result = await pool.query<{ count: string; last_modified: Date | string | null }>(`select count(*)::text as count, max(updated_at) as last_modified from news_articles a where ${indexablePublishedClause}`); return { count: Number(result.rows[0]?.count || 0), lastModified: iso(result.rows[0]?.last_modified) }; } catch { return { count: 0, lastModified: new Date().toISOString() }; }
}

export async function getPublishedNewsSitemapPage({ offset, limit }: { offset: number; limit: number }) {
  const pool = getPool(); if (!pool) return { entries: [] as NewsSitemapEntry[], total: 0 };
  try { const [count, rows] = await Promise.all([pool.query<{ count: string }>(`select count(*)::text as count from news_articles a where ${indexablePublishedClause}`), pool.query<{ slug: string; updated_at: Date | string }>(`select slug, updated_at from news_articles a where ${indexablePublishedClause} order by published_at desc, id desc limit $1 offset $2`, [Math.min(45_000, Math.max(1, limit)), Math.max(0, offset)])]); return { entries: rows.rows.map((row) => ({ slug: row.slug, updatedAt: iso(row.updated_at) })), total: Number(count.rows[0]?.count || 0) }; } catch { return { entries: [] as NewsSitemapEntry[], total: 0 }; }
}
