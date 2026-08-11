import { createHash } from "node:crypto";
import sanitizeHtml from "sanitize-html";
import { getPool } from "@/lib/database";
import type { BlogArticle } from "./types";

type BlogRow = {
  id: string;
  slug: string;
  class_id: string;
  title_en: string;
  body_html: string;
  excerpt_en: string | null;
  author_id: string;
  cover_image_url: string | null;
  status: string;
  category_name: string;
  published_at: Date | string | null;
  updated_at: Date | string;
};

export type AdminBlogArticle = BlogArticle & { status: string; categoryName: string };

export type BlogWebhookEvent = {
  requestFingerprint?: string | null;
  articleId?: string | null;
  eventType: "verification" | "published" | "idempotent_replay" | "rejected" | "retryable_failure";
  classId?: string | null;
  authorId?: string | null;
  outcome: "accepted" | "rejected" | "retryable_failure";
  httpStatus: number;
  message: string;
  metadata?: Record<string, string | number | boolean | null>;
};

function iso(value: Date | string | null) {
  return value ? new Date(value).toISOString() : new Date().toISOString();
}

function rowToArticle(row: BlogRow): BlogArticle {
  return {
    id: row.id,
    slug: row.slug,
    classId: row.class_id,
    title: row.title_en,
    contentHtml: row.body_html,
    excerpt: row.excerpt_en || "",
    authorId: row.author_id,
    imageUrl: row.cover_image_url,
    publishedAt: iso(row.published_at),
    updatedAt: iso(row.updated_at),
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "article";
}

function sanitizeContent(content: string) {
  return sanitizeHtml(content, {
    allowedTags: [
      "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "ul", "ol", "li",
      "blockquote", "a", "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "th", "td",
      "pre", "code", "hr", "sup", "sub",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "nofollow noopener noreferrer", target: "_blank" }),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
    },
  }).trim();
}

function excerptFromHtml(contentHtml: string) {
  return sanitizeHtml(contentHtml, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

function normalizeImageUrl(value: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function requirePool() {
  const pool = getPool();
  if (!pool) throw new Error("Blog database is not configured.");
  return pool;
}

const articleSelect = `
  select a.id, a.slug, a.class_id, a.title_en, a.body_html, a.excerpt_en,
    a.author_id, a.cover_image_url, a.status, a.published_at, a.updated_at,
    coalesce(c.name, 'Blog') as category_name
  from articles a
  left join article_categories c on c.id = a.category_id
`;

export async function publishBlogArticle(input: {
  classId: string;
  title: string;
  content: string;
  authorId: string;
  imageUrl: string;
}): Promise<{ article: BlogArticle; idempotentReplay: boolean }> {
  const pool = requirePool();
  const contentHtml = sanitizeContent(input.content);
  if (!contentHtml) throw new Error("Article content is empty after security filtering.");

  const fingerprint = createHash("sha256")
    .update(`${input.classId}\n${input.title}\n${contentHtml}`)
    .digest("hex");
  const slug = `${slugify(input.title)}-${fingerprint.slice(0, 10)}`;
  const excerpt = excerptFromHtml(contentHtml);
  const imageUrl = normalizeImageUrl(input.imageUrl);

  const result = await pool.query<BlogRow & { inserted: boolean }>(
    `with category as (
       insert into article_categories (name, slug, sort_order)
       values ('Blog', 'blog', 10)
       on conflict (slug) do update set name = excluded.name
       returning id
     )
     insert into articles (
       category_id, title_en, slug, excerpt_en, body_html, class_id, author_id,
       cover_image_url, external_fingerprint, source_type, status, published_at, created_at, updated_at
     ) values (
       (select id from category), $1, $2, $3, $4, $5, $6,
       $7, $8, 'webhook', 'published', now(), now(), now()
     )
     on conflict (external_fingerprint) do update set
       title_en = excluded.title_en,
       excerpt_en = excluded.excerpt_en,
       body_html = excluded.body_html,
       author_id = excluded.author_id,
       cover_image_url = excluded.cover_image_url,
       status = 'published',
       deleted_at = null,
       updated_at = now()
     returning id, slug, class_id, title_en, body_html, excerpt_en, author_id,
       cover_image_url, status, published_at, updated_at, 'Blog'::text as category_name,
       (xmax = 0) as inserted`,
    [input.title.trim(), slug, excerpt, contentHtml, input.classId, input.authorId.trim(), imageUrl, fingerprint],
  );
  const row = result.rows[0];
  return { article: rowToArticle(row), idempotentReplay: !row.inserted };
}

export async function logBlogWebhookEvent(event: BlogWebhookEvent) {
  const pool = getPool();
  if (!pool) return;

  try {
    await pool.query(
      `insert into blog_webhook_events (
        request_fingerprint, article_id, event_type, class_id, author_id,
        outcome, http_status, message, metadata
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)`,
      [
        event.requestFingerprint || null,
        event.articleId || null,
        event.eventType,
        event.classId || null,
        event.authorId || null,
        event.outcome,
        event.httpStatus,
        event.message,
        JSON.stringify(event.metadata || {}),
      ],
    );
  } catch (error) {
    console.warn(JSON.stringify({ event: "blog_webhook_audit_failed", message: error instanceof Error ? error.message : "Unknown audit persistence error" }));
  }
}

export async function getBlogArticles() {
  const pool = getPool();
  if (!pool) return [];
  const result = await pool.query<BlogRow>(
    `${articleSelect}
     where a.class_id in ('blog', '31') and a.status = 'published'
       and a.deleted_at is null and a.published_at <= now()
     order by a.published_at desc, a.id desc
     limit 1000`,
  );
  return result.rows.map(rowToArticle);
}

export async function getBlogArticle(slug: string) {
  const pool = getPool();
  if (!pool) return null;
  const result = await pool.query<BlogRow>(
    `${articleSelect}
     where a.slug = $1 and a.class_id in ('blog', '31') and a.status = 'published'
       and a.deleted_at is null and a.published_at <= now()
     limit 1`,
    [slug],
  );
  return result.rows[0] ? rowToArticle(result.rows[0]) : null;
}

export async function getAdminBlogArticles() {
  const pool = requirePool();
  const result = await pool.query<BlogRow>(
    `${articleSelect}
     where a.class_id in ('blog', '31') and a.deleted_at is null
     order by a.created_at desc
     limit 500`,
  );
  return result.rows.map((row) => ({ ...rowToArticle(row), status: row.status, categoryName: row.category_name }));
}

export async function updateBlogArticleStatus(id: string, status: "draft" | "published" | "archived") {
  const pool = requirePool();
  await pool.query(
    `update articles set status = $2,
       published_at = case when $2 = 'published' then coalesce(published_at, now()) else published_at end,
       updated_at = now()
     where id = $1 and class_id in ('blog', '31') and deleted_at is null`,
    [id, status],
  );
}
