import "server-only";

import { getPool } from "@/lib/database";
import { absoluteUrl } from "@/lib/seo";
import type { NewsAutomationResult, NewsCandidate, NewsRelatedProduct } from "@/lib/news/types";
import {
  buildNewsArticleHtml,
  canonicalizeSourceUrl,
  createSourceFingerprint,
  extractImageFromHtml,
  hashText,
  isInternalSiteImage,
  isWithinLookback,
  readXmlTag,
  rssItemsFromXml,
  scoreCandidateAgainstProducts,
  slugifyNewsTitle,
  stripHtml,
} from "@/lib/news/utils";

type JobRecord = {
  id: string;
};

const defaultFeeds = [
  "https://www.energy.gov/eere/buildings/listings/buildings-news/rss.xml",
  "https://www.energy.gov/eere/vehicles/articles/rss.xml",
  "https://www.energy-storage.news/feed/",
  "https://www.pv-magazine.com/feed/",
];

function getFeedUrls() {
  return (process.env.NEWS_SOURCE_FEEDS || defaultFeeds.join(","))
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function shouldAutoPublish() {
  return process.env.NEWS_AUTO_PUBLISH === "true";
}

function sourcePublisherFromUrl(value: string) {
  try {
    const hostname = new URL(value).hostname.replace(/^www\./, "");
    return hostname;
  } catch {
    return "External source";
  }
}

async function createJob() {
  const pool = getPool();
  if (!pool) {
    return null;
  }

  const result = await pool.query<JobRecord>(
    `insert into news_jobs (job_type, status, started_at, message)
     values ('cron_collect_generate_publish', 'running', now(), 'News automation started.')
     returning id`,
  );
  return result.rows[0]?.id || null;
}

async function finishJob(id: string | null, status: string, message: string, metadata: Record<string, unknown>) {
  const pool = getPool();
  if (!pool || !id) {
    return;
  }

  await pool.query(
    `update news_jobs
     set status = $2, finished_at = now(), message = $3, metadata = $4::jsonb
     where id = $1`,
    [id, status, message, JSON.stringify(metadata)],
  );
}

async function insertAudit(jobId: string | null, eventType: string, severity: string, message: string, metadata: Record<string, unknown>) {
  const pool = getPool();
  if (!pool) {
    return;
  }

  await pool.query(
    `insert into news_publication_audits (job_id, event_type, severity, message, metadata)
     values ($1, $2, $3, $4, $5::jsonb)`,
    [jobId, eventType, severity, message, JSON.stringify(metadata)],
  );
}

async function fetchCandidateImage(candidate: NewsCandidate) {
  if (candidate.imageUrl && !isInternalSiteImage(candidate.imageUrl)) {
    return candidate.imageUrl;
  }

  try {
    const response = await fetch(candidate.url, {
      headers: { "user-agent": "CowinMaterialsNewsBot/1.0 (+https://www.cowinmaterials.com/news)" },
      next: { revalidate: 0 },
    });
    const html = await response.text();
    const image = extractImageFromHtml(html, candidate.url);
    return image && !isInternalSiteImage(image) ? image : null;
  } catch {
    return null;
  }
}

async function collectCandidates() {
  const candidates: NewsCandidate[] = [];
  const fetchedAt = new Date().toISOString();

  for (const feedUrl of getFeedUrls()) {
    try {
      const response = await fetch(feedUrl, {
        headers: { "user-agent": "CowinMaterialsNewsBot/1.0 (+https://www.cowinmaterials.com/news)" },
        next: { revalidate: 0 },
      });
      const xml = await response.text();
      const publisher = sourcePublisherFromUrl(feedUrl);

      for (const item of rssItemsFromXml(xml).slice(0, 12)) {
        const title = stripHtml(readXmlTag(item, "title") || "");
        const link = stripHtml(readXmlTag(item, "link") || "");
        const summary = stripHtml(readXmlTag(item, "description") || readXmlTag(item, "content:encoded") || "");
        const pubDate = readXmlTag(item, "pubDate") || readXmlTag(item, "published") || readXmlTag(item, "dc:date");
        const image = item.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1] || item.match(/<enclosure[^>]+url=["']([^"']+)["']/i)?.[1];

        if (!title || !link || !pubDate) {
          continue;
        }

        candidates.push({
          title,
          summary,
          url: canonicalizeSourceUrl(link),
          publisher,
          publishedAt: new Date(pubDate).toISOString(),
          fetchedAt,
          sourceTimezone: "UTC",
          imageUrl: image ? new URL(image, link).toString() : null,
        });
      }
    } catch {
      continue;
    }
  }

  return candidates;
}

async function sourceAlreadyUsed(canonicalUrl: string, fingerprint: string) {
  const pool = getPool();
  if (!pool) {
    return true;
  }

  const result = await pool.query(
    `select id from news_articles
     where (canonical_source_url = $1 or source_fingerprint = $2)
       and created_at >= now() - interval '7 days'
     limit 1`,
    [canonicalUrl, fingerprint],
  );

  return (result.rowCount || 0) > 0;
}

async function saveArticle(candidate: NewsCandidate, imageUrl: string, relatedProducts: NewsRelatedProduct[]) {
  const pool = getPool();
  if (!pool) {
    return null;
  }

  const canonicalSourceUrl = canonicalizeSourceUrl(candidate.url);
  const fingerprint = createSourceFingerprint(candidate);
  const slugBase = slugifyNewsTitle(candidate.title);
  const slug = `${slugBase}-${candidate.publishedAt.slice(0, 10)}`;
  const excerpt = stripHtml(candidate.summary).slice(0, 220) || `Industry brief from ${candidate.publisher}.`;
  const contentHtml = buildNewsArticleHtml(candidate, relatedProducts);
  const status = shouldAutoPublish() ? "published" : "review";
  const publishedAt = shouldAutoPublish() ? new Date().toISOString() : null;
  const seoTitle = `${candidate.title.slice(0, 72)} | Cowin Materials News`;
  const seoDescription = excerpt.slice(0, 155);
  const keyTakeaways = [
    "Source was published within the configured 72-hour news window.",
    "Article is linked to Cowin Materials product evaluation only when relevance is detected.",
    "External image source is recorded for audit and structured data.",
  ];

  const result = await pool.query<{ id: string }>(
    `insert into news_articles (
      title, slug, excerpt, content_html, status, language, category, tags,
      published_at, updated_at, author_name, seo_title, seo_description, canonical_url,
      primary_keyword, secondary_keywords, geo_summary, key_takeaways,
      cover_image_url, cover_image_source_url, cover_image_page_url, cover_image_alt,
      cover_image_status, cover_image_fetched_at, cover_image_hash,
      source_title, source_author, source_publisher, source_url, canonical_source_url,
      source_language, source_published_at, source_fetched_at, source_timezone, source_fingerprint,
      relevance_score, credibility_score, generation_model, generation_prompt_version
    ) values (
      $1, $2, $3, $4, $5, 'en', 'Industry News', $6,
      $7, now(), 'Cowin Materials Editorial Team', $8, $9, $10,
      $11, $12, $13, $14,
      $15, $16, $17, $18,
      'verified', now(), $19,
      $1, $20, $21, $22, $23,
      $24, $25, $26, $27, $28,
      $29, $30, $31, $32
    )
    on conflict (slug) do nothing
    returning id`,
    [
      candidate.title,
      slug,
      excerpt,
      contentHtml,
      status,
      ["aerogel", "insulation", "battery", "fire protection"].filter((tag) =>
        [candidate.title, candidate.summary].join(" ").toLowerCase().includes(tag),
      ),
      publishedAt,
      seoTitle,
      seoDescription,
      absoluteUrl(`/news/${slug}`),
      relatedProducts[0]?.category || "silica aerogel materials",
      relatedProducts.map((item) => item.name),
      `International buyers can use this brief to monitor material specification and sourcing signals related to ${relatedProducts[0]?.category || "advanced insulation materials"}.`,
      keyTakeaways,
      imageUrl,
      imageUrl,
      canonicalSourceUrl,
      candidate.title,
      hashText(imageUrl),
      candidate.author || null,
      candidate.publisher,
      candidate.url,
      canonicalSourceUrl,
      candidate.language || "en",
      new Date(candidate.publishedAt),
      new Date(candidate.fetchedAt),
      candidate.sourceTimezone || "UTC",
      fingerprint,
      relatedProducts[0]?.relevanceScore || 0,
      0.75,
      "deterministic-editorial-template",
      "news-automation-v1",
    ],
  );

  const articleId = result.rows[0]?.id;
  if (!articleId) {
    return null;
  }

  for (const [index, product] of relatedProducts.entries()) {
    await pool.query(
      `insert into news_products (
        news_id, product_slug, product_name, product_category, product_summary,
        product_image, relevance_score, relationship_reason, display_order
      ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      on conflict (news_id, product_slug) do nothing`,
      [
        articleId,
        product.slug,
        product.name,
        product.category,
        product.summary,
        product.image,
        product.relevanceScore,
        product.relationshipReason,
        index + 1,
      ],
    );
  }

  return articleId;
}

export async function runNewsAutomation(): Promise<NewsAutomationResult> {
  const checkedAt = new Date().toISOString();
  const pool = getPool();
  const warnings: string[] = [];

  if (!pool) {
    return {
      ok: false,
      status: "configuration_required",
      checkedAt,
      collected: 0,
      rejected: 0,
      published: 0,
      message: "DATABASE_URL is not configured. News automation is installed but cannot persist or publish articles.",
      warnings: ["Configure DATABASE_URL and run database/schema.sql before enabling news publication."],
    };
  }

  const jobId = await createJob();
  let collected = 0;
  let rejected = 0;
  let published = 0;

  try {
    const candidates = await collectCandidates();
    collected = candidates.length;

    for (const candidate of candidates) {
      const canonicalSourceUrl = canonicalizeSourceUrl(candidate.url);
      const fingerprint = createSourceFingerprint(candidate);

      if (!isWithinLookback(candidate.publishedAt, candidate.fetchedAt, 72)) {
        rejected += 1;
        await insertAudit(jobId, "candidate_rejected", "info", "Candidate outside the 72-hour source window.", { title: candidate.title, canonicalSourceUrl });
        continue;
      }

      if (await sourceAlreadyUsed(canonicalSourceUrl, fingerprint)) {
        rejected += 1;
        await insertAudit(jobId, "candidate_rejected", "info", "Candidate source already used within seven days.", { title: candidate.title, canonicalSourceUrl });
        continue;
      }

      const relatedProducts = scoreCandidateAgainstProducts(candidate);
      if (!relatedProducts.length) {
        rejected += 1;
        await insertAudit(jobId, "candidate_rejected", "warning", "No product relevance above threshold.", { title: candidate.title, canonicalSourceUrl });
        continue;
      }

      const imageUrl = await fetchCandidateImage(candidate);
      if (!imageUrl || isInternalSiteImage(imageUrl)) {
        rejected += 1;
        await insertAudit(jobId, "candidate_rejected", "warning", "No compliant external cover image found.", { title: candidate.title, canonicalSourceUrl });
        continue;
      }

      const articleId = await saveArticle(candidate, imageUrl, relatedProducts);
      if (articleId && shouldAutoPublish()) {
        published += 1;
      }
    }

    const status = published > 0 ? "completed" : "no_publishable_items";
    const message = shouldAutoPublish()
      ? `News automation completed. Published ${published} article(s).`
      : "News automation completed in editorial-review mode. Set NEWS_AUTO_PUBLISH=true only after review workflow is ready.";

    if (!shouldAutoPublish()) {
      warnings.push("NEWS_AUTO_PUBLISH is not enabled; eligible items are stored for review, not published.");
    }

    await finishJob(jobId, status, message, { collected, rejected, published, warnings });
    return {
      ok: true,
      status,
      checkedAt,
      collected,
      rejected,
      published,
      message,
      warnings,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "News automation failed.";
    await finishJob(jobId, "failed", message, { collected, rejected, published });
    return { ok: false, status: "failed", checkedAt, collected, rejected, published, message, warnings };
  }
}
