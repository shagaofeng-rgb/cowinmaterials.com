import "server-only";

import { revalidatePath } from "next/cache";
import { getPool } from "@/lib/database";
import { getProductPath } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";
import type { NewsAutomationResult, NewsCandidate, NewsRelatedProduct } from "./types";
import { buildNewsArticleHtml, canonicalizeSourceUrl, createSourceFingerprint, hashText, isWithinLookback, readXmlTag, rssItemsFromXml, scoreCandidateAgainstProducts, slugifyNewsTitle, sourcePublisherFromUrl, stripHtml } from "./utils";

const defaultFeeds = [
  "https://www.energy.gov/eere/buildings/listings/buildings-news/rss.xml",
  "https://www.energy.gov/eere/vehicles/articles/rss.xml",
  "https://www.energy-storage.news/feed/",
  "https://www.pv-magazine.com/feed/",
];

function getFeedUrls() { return (process.env.NEWS_SOURCE_FEEDS || defaultFeeds.join(",")).split(",").map((value) => value.trim()).filter(Boolean); }
function getLookbackHours() { return Math.min(24 * 30, Math.max(24, Number(process.env.NEWS_LOOKBACK_HOURS || 336))); }
function getPublishLimit() { return Math.min(3, Math.max(1, Number(process.env.NEWS_MAX_PUBLISH_PER_RUN || 1))); }

async function createJob() {
  const pool = getPool(); if (!pool) return null;
  const result = await pool.query<{ id: string }>(`insert into news_jobs (job_type, status, started_at, message) values ('cron_collect_generate_publish', 'running', now(), 'Automated direct publishing started.') returning id`);
  return result.rows[0]?.id || null;
}
async function finishJob(id: string | null, status: string, message: string, metadata: Record<string, unknown>) {
  const pool = getPool(); if (!pool || !id) return;
  await pool.query(`update news_jobs set status = $2, finished_at = now(), message = $3, metadata = $4::jsonb where id = $1`, [id, status, message, JSON.stringify(metadata)]);
}
async function insertAudit(jobId: string | null, eventType: string, severity: string, message: string, metadata: Record<string, unknown>) {
  const pool = getPool(); if (!pool) return;
  await pool.query(`insert into news_publication_audits (job_id, event_type, severity, message, metadata) values ($1, $2, $3, $4, $5::jsonb)`, [jobId, eventType, severity, message, JSON.stringify(metadata)]);
}

export async function collectNewsCandidates() {
  const fetchedAt = new Date().toISOString();
  const groups = await Promise.all(getFeedUrls().map(async (feedUrl) => {
    try {
      const response = await fetch(feedUrl, { headers: { "user-agent": "CowinMaterialsNewsBot/1.1 (+https://www.cowinmaterials.com/news)" }, cache: "no-store", signal: AbortSignal.timeout(12_000) });
      if (!response.ok) return [] as NewsCandidate[];
      const xml = await response.text(); const fallbackPublisher = sourcePublisherFromUrl(feedUrl);
      return rssItemsFromXml(xml).slice(0, 20).flatMap((item) => {
        try {
          const title = stripHtml(readXmlTag(item, "title") || "");
          const url = canonicalizeSourceUrl(stripHtml(readXmlTag(item, "link") || ""));
          const summary = stripHtml(readXmlTag(item, "description") || readXmlTag(item, "content:encoded") || "");
          const date = readXmlTag(item, "pubDate") || readXmlTag(item, "published") || readXmlTag(item, "dc:date");
          const publishedAt = date ? new Date(date).toISOString() : "";
          if (!title || !url || !publishedAt || !Number.isFinite(new Date(publishedAt).getTime())) return [];
          return [{ title, url, summary, publisher: stripHtml(readXmlTag(item, "source") || "") || fallbackPublisher, publishedAt, fetchedAt, sourceTimezone: "UTC" }];
        } catch { return []; }
      });
    } catch { return [] as NewsCandidate[]; }
  }));
  return groups.flat().sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

async function sourceAlreadyUsed(canonicalUrl: string, fingerprint: string) {
  const pool = getPool(); if (!pool) return true;
  const result = await pool.query<{ id: string }>(`select id from news_articles where canonical_source_url = $1 or source_fingerprint = $2 limit 1`, [canonicalUrl, fingerprint]);
  return Boolean(result.rows[0]);
}

async function saveArticle(candidate: NewsCandidate, relatedProducts: NewsRelatedProduct[]) {
  const pool = getPool(); if (!pool) return null;
  const canonicalSourceUrl = canonicalizeSourceUrl(candidate.url); const fingerprint = createSourceFingerprint(candidate);
  const slug = `${slugifyNewsTitle(candidate.title)}-${candidate.publishedAt.slice(0, 10)}`;
  const primary = relatedProducts[0]; const imageUrl = primary?.image || "/images/fire-test-lab.jpg";
  const excerpt = `Cowin Materials buyer brief: a recent ${candidate.publisher} update considered in the context of ${primary?.category.toLowerCase() || "advanced insulation material"} evaluation.`;
  const contentHtml = buildNewsArticleHtml(candidate, relatedProducts);
  const result = await pool.query<{ id: string }>(
    `insert into news_articles (title, slug, excerpt, content_html, status, language, category, tags, published_at, updated_at, author_name, seo_title, seo_description, canonical_url, primary_keyword, secondary_keywords, geo_summary, key_takeaways, cover_image_url, cover_image_source_url, cover_image_page_url, cover_image_alt, cover_image_status, cover_image_fetched_at, cover_image_hash, source_title, source_author, source_publisher, source_url, canonical_source_url, source_language, source_published_at, source_fetched_at, source_timezone, source_fingerprint, relevance_score, credibility_score, generation_model, generation_prompt_version) values ($1, $2, $3, $4, 'published', 'en', 'Industry Insights', $5, now(), now(), 'Cowin Materials Editorial Team', $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 'verified', now(), $17, $1, null, $18, $19, $20, 'en', $21, now(), 'UTC', $22, $23, 0.75, 'deterministic-editorial-template', 'news-direct-publish-v2') on conflict (slug) do nothing returning id`,
    [candidate.title, slug, excerpt, contentHtml, ["aerogel", "insulation", "battery", "fire protection"].filter((tag) => `${candidate.title} ${candidate.summary}`.toLowerCase().includes(tag)), `${candidate.title.slice(0, 72)} | Cowin Materials News`, excerpt.slice(0, 155), absoluteUrl(`/news/${slug}`), primary?.category || "silica aerogel materials", relatedProducts.map((product) => product.name), `Technical context for international evaluation of ${primary?.category || "advanced insulation materials"}.`, ["Automatically selected from a recent, product-relevant public source.", "Published directly after source, freshness, relevance and duplicate checks.", "This is not a product certification or project-specific conclusion."], imageUrl, absoluteUrl(imageUrl), primary ? absoluteUrl(getProductPath(primary)) : absoluteUrl("/products"), candidate.title, hashText(imageUrl), candidate.publisher, candidate.url, canonicalSourceUrl, new Date(candidate.publishedAt), fingerprint, primary?.relevanceScore || 0],
  );
  const articleId = result.rows[0]?.id; if (!articleId) return null;
  await Promise.all(relatedProducts.map((product, index) => pool.query(`insert into news_products (news_id, product_slug, product_name, product_category, product_summary, product_image, relevance_score, relationship_reason, display_order) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) on conflict (news_id, product_slug) do nothing`, [articleId, product.slug, product.name, product.category, product.summary, product.image, product.relevanceScore, product.relationshipReason, index + 1])));
  return articleId;
}

export async function runNewsAutomation(): Promise<NewsAutomationResult> {
  const checkedAt = new Date().toISOString();
  if (!getPool()) return { ok: false, status: "configuration_required", checkedAt, collected: 0, rejected: 0, published: 0, message: "DATABASE_URL is not configured; automated News cannot publish durable content.", warnings: ["Configure the production PostgreSQL connection and apply the News schema."] };
  const jobId = await createJob(); let collected = 0; let rejected = 0; let published = 0;
  try {
    const candidates = await collectNewsCandidates(); collected = candidates.length; const seen = new Set<string>();
    for (const candidate of candidates) {
      if (published >= getPublishLimit()) break;
      const fingerprint = createSourceFingerprint(candidate); const canonicalUrl = canonicalizeSourceUrl(candidate.url);
      if (seen.has(fingerprint) || !isWithinLookback(candidate.publishedAt, candidate.fetchedAt, getLookbackHours()) || await sourceAlreadyUsed(canonicalUrl, fingerprint)) { rejected += 1; continue; }
      seen.add(fingerprint);
      const relatedProducts = scoreCandidateAgainstProducts(candidate);
      if (!relatedProducts.length) { rejected += 1; await insertAudit(jobId, "candidate_rejected", "info", "Candidate did not meet product-relevance threshold.", { sourceUrl: canonicalUrl }); continue; }
      const articleId = await saveArticle(candidate, relatedProducts);
      if (!articleId) { rejected += 1; await insertAudit(jobId, "candidate_duplicate", "info", "Candidate was not inserted because an equivalent article already exists.", { sourceUrl: canonicalUrl }); continue; }
      published += 1; await insertAudit(jobId, "article_published", "info", "Article passed automatic checks and was published directly.", { articleId, sourceUrl: canonicalUrl, relatedProducts: relatedProducts.map((product) => product.slug) });
    }
    const status = published ? "completed" : "no_publishable_items";
    const message = published ? `${published} News article${published === 1 ? "" : "s"} published directly.` : "No new source met freshness, relevance and duplicate checks.";
    await finishJob(jobId, status, message, { collected, rejected, published, lookbackHours: getLookbackHours(), directPublish: true });
    if (published) { revalidatePath("/news"); revalidatePath("/sitemap.xml"); }
    return { ok: true, status, checkedAt, collected, rejected, published, message, warnings: [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected News automation failure.";
    await finishJob(jobId, "failed", message, { collected, rejected, published });
    return { ok: false, status: "failed", checkedAt, collected, rejected, published, message, warnings: ["Review the News job and publication audit records."] };
  }
}
