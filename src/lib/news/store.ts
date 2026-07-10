import "server-only";

import { getPool, hasDatabaseUrl } from "@/lib/database";
import { getLivePublishedNews } from "@/lib/news/automation";
import { evergreenNews } from "@/lib/news/evergreen";
import { absoluteUrl } from "@/lib/seo";
import type { NewsArticle, NewsListResult, NewsRelatedProduct } from "@/lib/news/types";

type NewsRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  status: NewsArticle["status"];
  language: "en";
  category: string | null;
  tags: string[] | null;
  published_at: Date | string;
  updated_at: Date | string;
  author_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  primary_keyword: string | null;
  secondary_keywords: string[] | null;
  geo_summary: string | null;
  key_takeaways: string[] | null;
  cover_image_url: string;
  cover_image_source_url: string | null;
  cover_image_page_url: string | null;
  cover_image_alt: string;
  cover_image_width: number | null;
  cover_image_height: number | null;
  cover_image_hash: string | null;
  cover_image_status: "verified" | "pending" | "failed";
  cover_image_fetched_at: Date | string | null;
  source_title: string;
  source_author: string | null;
  source_publisher: string;
  source_url: string;
  canonical_source_url: string;
  source_language: string | null;
  source_published_at: Date | string;
  source_fetched_at: Date | string;
  source_timezone: string | null;
  source_fingerprint: string;
  related_products: NewsRelatedProduct[] | null;
};

export type NewsSitemapEntry = {
  slug: string;
  updatedAt: string;
};

function iso(value?: Date | string | null) {
  return value ? new Date(value).toISOString() : new Date().toISOString();
}

function rowToArticle(row: NewsRow): NewsArticle {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    contentHtml: row.content_html,
    status: row.status,
    language: "en",
    category: row.category || "Industry News",
    tags: row.tags || [],
    publishedAt: iso(row.published_at),
    updatedAt: iso(row.updated_at),
    authorName: row.author_name || "Cowin Materials Editorial Team",
    seoTitle: row.seo_title || row.title,
    seoDescription: row.seo_description || row.excerpt,
    canonicalUrl: row.canonical_url || absoluteUrl(`/news/${row.slug}`),
    primaryKeyword: row.primary_keyword,
    secondaryKeywords: row.secondary_keywords || [],
    geoSummary: row.geo_summary || row.excerpt,
    keyTakeaways: row.key_takeaways || [],
    image: {
      url: row.cover_image_url,
      sourceUrl: row.cover_image_source_url || row.source_url,
      pageUrl: row.cover_image_page_url || row.source_url,
      alt: row.cover_image_alt || row.title,
      width: row.cover_image_width,
      height: row.cover_image_height,
      hash: row.cover_image_hash,
      status: row.cover_image_status,
      fetchedAt: iso(row.cover_image_fetched_at || row.source_fetched_at),
    },
    source: {
      title: row.source_title,
      publisher: row.source_publisher,
      author: row.source_author,
      url: row.source_url,
      canonicalUrl: row.canonical_source_url,
      language: row.source_language,
      publishedAt: iso(row.source_published_at),
      fetchedAt: iso(row.source_fetched_at),
      timezone: row.source_timezone,
      fingerprint: row.source_fingerprint,
    },
    relatedProducts: row.related_products || [],
  };
}

function liveAndEvergreen(liveArticles: NewsArticle[]) {
  const bySlug = new Map<string, NewsArticle>();
  for (const article of [...liveArticles, ...evergreenNews]) bySlug.set(article.slug, article);
  return [...bySlug.values()].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

const articleSelect = `
  select
    a.*,
    coalesce(
      json_agg(
        json_build_object(
          'slug', np.product_slug,
          'name', np.product_name,
          'category', np.product_category,
          'summary', np.product_summary,
          'image', np.product_image,
          'relationshipReason', np.relationship_reason,
          'relevanceScore', np.relevance_score
        )
        order by np.display_order asc
      ) filter (where np.product_slug is not null),
      '[]'
    ) as related_products
  from news_articles a
  left join news_products np on np.news_id = a.id
`;

export async function getPublishedNews({ page = 1, pageSize = 12, productSlug }: { page?: number; pageSize?: number; productSlug?: string } = {}): Promise<NewsListResult> {
  const pool = getPool();
  const safePage = Math.max(1, Math.floor(page));
  const safePageSize = Math.min(50, Math.max(1, Math.floor(pageSize)));

  if (!pool) {
    const liveArticles = liveAndEvergreen(await getLivePublishedNews({ limit: 100 }));
    const start = (safePage - 1) * safePageSize;
    const filtered = productSlug
      ? liveArticles.filter((article) => article.relatedProducts.some((product) => product.slug === productSlug))
      : liveArticles;

    return {
      articles: filtered.slice(start, start + safePageSize),
      total: filtered.length,
      page: safePage,
      pageSize: safePageSize,
    };
  }

  const offset = (safePage - 1) * safePageSize;
  const params: unknown[] = [];
  let productFilter = "";

  if (productSlug) {
    params.push(productSlug);
    productFilter = `and exists (select 1 from news_products px where px.news_id = a.id and px.product_slug = $${params.length})`;
  }

  try {
    const countResult = await pool.query<{ count: string }>(
      `select count(*)::text as count from news_articles a
       where a.status = 'published'
         and a.deleted_at is null
         and a.published_at <= now()
         and a.cover_image_url <> ''
         ${productFilter}`,
      params,
    );

    params.push(safePageSize, offset);
    const rows = await pool.query<NewsRow>(
      `${articleSelect}
       where a.status = 'published'
         and a.deleted_at is null
         and a.published_at <= now()
         and a.cover_image_url <> ''
         ${productFilter}
       group by a.id
       order by a.published_at desc
       limit $${params.length - 1} offset $${params.length}`,
      params,
    );

    return {
      articles: rows.rows.map(rowToArticle),
      total: Number(countResult.rows[0]?.count || 0),
      page: safePage,
      pageSize: safePageSize,
    };
  } catch {
    const liveArticles = liveAndEvergreen(await getLivePublishedNews({ limit: 100 }));
    const start = (safePage - 1) * safePageSize;
    const filtered = productSlug
      ? liveArticles.filter((article) => article.relatedProducts.some((product) => product.slug === productSlug))
      : liveArticles;

    return {
      articles: filtered.slice(start, start + safePageSize),
      total: filtered.length,
      page: safePage,
      pageSize: safePageSize,
    };
  }
}

export async function getPublishedNewsBySlug(slug: string) {
  const pool = getPool();
  const evergreen = evergreenNews.find((article) => article.slug === slug);
  if (evergreen) return evergreen;
  if (!pool) {
    const articles = await getLivePublishedNews({ limit: 100 });
    return articles.find((article) => article.slug === slug) || null;
  }

  try {
    const result = await pool.query<NewsRow>(
      `${articleSelect}
       where a.slug = $1
         and a.status = 'published'
         and a.deleted_at is null
         and a.published_at <= now()
         and a.cover_image_url <> ''
       group by a.id
       limit 1`,
      [slug],
    );

    return result.rows[0] ? rowToArticle(result.rows[0]) : null;
  } catch {
    const articles = await getLivePublishedNews({ limit: 100 });
    return articles.find((article) => article.slug === slug) || null;
  }
}

export async function getPublishedNewsSitemapSummary(): Promise<{ count: number; lastModified: string }> {
  const pool = getPool();

  if (!pool) {
    const articles = liveAndEvergreen(await getLivePublishedNews({ limit: 100 }));
    const lastModified = articles.reduce(
      (latest, article) => new Date(article.updatedAt).getTime() > new Date(latest).getTime() ? article.updatedAt : latest,
      "2026-07-08T00:00:00.000Z",
    );
    return { count: articles.length, lastModified };
  }

  try {
    const result = await pool.query<{ count: string; last_modified: Date | string | null }>(`
      select count(*)::text as count, max(updated_at) as last_modified
      from news_articles
      where status = 'published'
        and deleted_at is null
        and published_at <= now()
        and cover_image_url <> ''
    `);
    return {
      count: Number(result.rows[0]?.count || 0),
      lastModified: iso(result.rows[0]?.last_modified || "2026-07-08T00:00:00.000Z"),
    };
  } catch {
    const articles = liveAndEvergreen(await getLivePublishedNews({ limit: 100 }));
    return {
      count: articles.length,
      lastModified: articles[0]?.updatedAt || "2026-07-08T00:00:00.000Z",
    };
  }
}

export async function getPublishedNewsSitemapPage({ offset, limit }: { offset: number; limit: number }): Promise<{ entries: NewsSitemapEntry[]; total: number }> {
  const pool = getPool();
  const safeOffset = Math.max(0, Math.floor(offset));
  const safeLimit = Math.min(45_000, Math.max(1, Math.floor(limit)));

  if (!pool) {
    const articles = liveAndEvergreen(await getLivePublishedNews({ limit: 100 }));
    return {
      entries: articles.slice(safeOffset, safeOffset + safeLimit).map((article) => ({ slug: article.slug, updatedAt: article.updatedAt })),
      total: articles.length,
    };
  }

  try {
    const [countResult, rows] = await Promise.all([
      pool.query<{ count: string }>(`
        select count(*)::text as count
        from news_articles
        where status = 'published'
          and deleted_at is null
          and published_at <= now()
          and cover_image_url <> ''
      `),
      pool.query<{ slug: string; updated_at: Date | string }>(`
        select slug, updated_at
        from news_articles
        where status = 'published'
          and deleted_at is null
          and published_at <= now()
          and cover_image_url <> ''
        order by published_at desc, id desc
        limit $1 offset $2
      `, [safeLimit, safeOffset]),
    ]);
    return {
      entries: rows.rows.map((row) => ({ slug: row.slug, updatedAt: iso(row.updated_at) })),
      total: Number(countResult.rows[0]?.count || 0),
    };
  } catch {
    const articles = liveAndEvergreen(await getLivePublishedNews({ limit: 100 }));
    return {
      entries: articles.slice(safeOffset, safeOffset + safeLimit).map((article) => ({ slug: article.slug, updatedAt: article.updatedAt })),
      total: articles.length,
    };
  }
}

export async function getNewsAdminSummary() {
  const pool = getPool();
  const configured = hasDatabaseUrl();

  if (!pool) {
    const liveArticles = liveAndEvergreen(await getLivePublishedNews({ limit: 100 }));
    return {
      configured,
      totals: { published: liveArticles.length, draft: 0, review: 0, failedImages: 0 },
      recentArticles: liveArticles.slice(0, 8),
      recentJobs: [] as Array<{ id: string; status: string; startedAt: string; finishedAt?: string | null; message?: string | null }>,
      warnings: ["DATABASE_URL 未配置，当前使用实时 RSS 兜底发布；配置数据库后可保存完整任务和审计记录。"],
    };
  }

  try {
    const totals = await pool.query<{
      published: string;
      draft: string;
      review: string;
      failed_images: string;
    }>(`
      select
        count(*) filter (where status = 'published')::text as published,
        count(*) filter (where status = 'draft')::text as draft,
        count(*) filter (where status = 'review')::text as review,
        count(*) filter (where cover_image_status = 'failed' or cover_image_url = '')::text as failed_images
      from news_articles
      where deleted_at is null
    `);

    const recent = await getPublishedNews({ pageSize: 8 });
    const jobs = await pool.query<{ id: string; status: string; started_at: Date; finished_at: Date | null; message: string | null }>(
      `select id, status, started_at, finished_at, message
       from news_jobs
       order by started_at desc
       limit 8`,
    );

    return {
      configured,
      totals: {
        published: Number(totals.rows[0]?.published || 0),
        draft: Number(totals.rows[0]?.draft || 0),
        review: Number(totals.rows[0]?.review || 0),
        failedImages: Number(totals.rows[0]?.failed_images || 0),
      },
      recentArticles: recent.articles,
      recentJobs: jobs.rows.map((job) => ({
        id: job.id,
        status: job.status,
        startedAt: iso(job.started_at),
        finishedAt: job.finished_at ? iso(job.finished_at) : null,
        message: job.message,
      })),
      warnings: [] as string[],
    };
  } catch {
    return {
      configured,
      totals: { published: 0, draft: 0, review: 0, failedImages: 0 },
      recentArticles: [] as NewsArticle[],
      recentJobs: [] as Array<{ id: string; status: string; startedAt: string; finishedAt?: string | null; message?: string | null }>,
      warnings: ["新闻数据库表尚未初始化，请先执行 database/schema.sql。"],
    };
  }
}
