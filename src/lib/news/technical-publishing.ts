import "server-only";

import { getPool } from "@/lib/database";
import { products } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";
import { getEditorialNewsImage } from "./editorial-images";
import { technicalEvidenceSeed, technicalNewsTopicSeed, type TechnicalEvidenceSeed } from "./technical-evidence";
import type { NewsRelatedProduct } from "./types";
import { hashText, slugifyNewsTitle } from "./utils";

type EvidenceRow = {
  id: string;
  product_slug: string;
  claim_label: string;
  value_text: string;
  test_conditions: string | null;
  standard_reference: string | null;
  source_document: string;
  source_locator: string;
  report_number: string | null;
  evidence_level: TechnicalEvidenceSeed["evidenceLevel"];
  restriction_note: string | null;
};

type ClaimedTopic = {
  id: string;
  title: string;
  excerpt: string;
  primary_product_slug: string;
  evidence_ids: string[];
  tags: string[];
};

export type TechnicalPublishResult =
  | { kind: "published"; articleId: string; slug: string; topicId: string; title: string }
  | { kind: "not_due"; message: string }
  | { kind: "unavailable"; message: string };

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
const getIntervalDays = () => Math.min(30, Math.max(1, Number(process.env.NEWS_TECHNICAL_INTERVAL_DAYS || 7)));

async function seedTechnicalData() {
  const pool = getPool(true);
  if (!pool) throw new Error("DATABASE_URL is not configured.");
  for (const evidence of technicalEvidenceSeed) {
    await pool.query(
      `insert into news_technical_evidence (id, product_slug, claim_label, value_text, test_conditions, standard_reference, source_document, source_locator, report_number, evidence_level, restriction_note)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       on conflict (id) do update set product_slug = excluded.product_slug, claim_label = excluded.claim_label, value_text = excluded.value_text, test_conditions = excluded.test_conditions, standard_reference = excluded.standard_reference, source_document = excluded.source_document, source_locator = excluded.source_locator, report_number = excluded.report_number, evidence_level = excluded.evidence_level, restriction_note = excluded.restriction_note, updated_at = now()`,
      [evidence.id, evidence.productSlug, evidence.claimLabel, evidence.valueText, evidence.testConditions || null, evidence.standardReference || null, evidence.sourceDocument, evidence.sourceLocator, evidence.reportNumber || null, evidence.evidenceLevel, evidence.restrictionNote || null],
    );
  }
  for (const topic of technicalNewsTopicSeed) {
    await pool.query(
      `insert into news_technical_topics (id, title, excerpt, primary_product_slug, evidence_ids, tags, sort_order)
       values ($1,$2,$3,$4,$5,$6,$7)
       on conflict (id) do update set title = excluded.title, excerpt = excluded.excerpt, primary_product_slug = excluded.primary_product_slug, evidence_ids = excluded.evidence_ids, tags = excluded.tags, sort_order = excluded.sort_order, updated_at = now()
       where news_technical_topics.status = 'pending'`,
      [topic.id, topic.title, topic.excerpt, topic.primaryProductSlug, topic.evidenceIds, topic.tags, topic.sortOrder],
    );
  }
}

function articleHtml(topic: ClaimedTopic, evidence: EvidenceRow[], productName: string) {
  const rows = evidence.map((item) => `<tr><th scope="row">${escapeHtml(item.claim_label)}</th><td>${escapeHtml(item.value_text)}</td><td>${escapeHtml(item.test_conditions || "See source record.")}</td><td>${escapeHtml([item.standard_reference, item.source_document, item.source_locator, item.report_number ? `Report ${item.report_number}` : ""].filter(Boolean).join(" | "))}</td></tr>`).join("");
  const limits = [...new Set(evidence.map((item) => item.restriction_note).filter((item): item is string => Boolean(item)))];
  const limitations = limits.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  return `<h2>Technical context</h2><p>This technical note organizes supplied source-file information for ${escapeHtml(productName)}. It is intended to help an engineering or procurement team frame a request for product-specific documentation; it is not a substitute for project qualification.</p><h2>Source-recorded data</h2><div class="article-table-wrap"><table><thead><tr><th>Item</th><th>Source-recorded value</th><th>Conditions / scope</th><th>Source record</th></tr></thead><tbody>${rows}</tbody></table></div><h2>How to use this information</h2><p>Keep the grade, temperature or substrate, sample configuration, test method and system build-up aligned with the source record. Material values should not be averaged across grades or converted into a project outcome without the complete evaluation method.</p><h2>Selection limits</h2><ul>${limitations}</ul><h2>Next technical step</h2><p>For a project-specific review, provide the operating temperature range, substrate or equipment geometry, required thickness, exposure conditions and applicable standard. Cowin Materials can then identify the relevant product documentation and evaluation path.</p><p><strong>Data scope:</strong> Values above are tied to the cited source file and locator. Confirm complete test conditions and actual service requirements before specification or installation.</p>`;
}

async function claimNextTopic(): Promise<ClaimedTopic | null> {
  const pool = getPool(true);
  if (!pool) throw new Error("DATABASE_URL is not configured.");
  const interval = getIntervalDays();
  const recent = await pool.query<{ published_at: Date | null }>(`select max(published_at) as published_at from news_technical_topics where status = 'published'`);
  const lastPublished = recent.rows[0]?.published_at;
  if (lastPublished && Date.now() - new Date(lastPublished).getTime() < interval * 86_400_000) return null;
  const claimed = await pool.query<ClaimedTopic>(`with candidate as (
      select id from news_technical_topics where status = 'pending' order by sort_order asc, created_at asc for update skip locked limit 1
    ) update news_technical_topics topic set status = 'publishing', updated_at = now(), last_error = null
      from candidate where topic.id = candidate.id
      returning topic.id, topic.title, topic.excerpt, topic.primary_product_slug, topic.evidence_ids, topic.tags`);
  return claimed.rows[0] || null;
}

async function restoreTopic(topicId: string, message: string) {
  const pool = getPool(true);
  if (!pool) return;
  await pool.query(`update news_technical_topics set status = 'pending', last_error = $2, updated_at = now() where id = $1 and status = 'publishing'`, [topicId, message.slice(0, 900)]);
}

export async function publishNextTechnicalNote(): Promise<TechnicalPublishResult> {
  const pool = getPool(true);
  if (!pool) return { kind: "unavailable", message: "DATABASE_URL is not configured." };
  await seedTechnicalData();
  const topic = await claimNextTopic();
  if (!topic) return { kind: "not_due", message: `No evidence-backed technical note is due yet (interval: ${getIntervalDays()} days).` };
  try {
    const evidenceQuery = await pool.query<EvidenceRow>(`select id, product_slug, claim_label, value_text, test_conditions, standard_reference, source_document, source_locator, report_number, evidence_level, restriction_note from news_technical_evidence where id = any($1::text[]) and public_status = true`, [topic.evidence_ids]);
    const evidenceById = new Map(evidenceQuery.rows.map((item) => [item.id, item]));
    const evidence = topic.evidence_ids.map((id) => evidenceById.get(id)).filter((item): item is EvidenceRow => Boolean(item));
    if (evidence.length !== topic.evidence_ids.length || evidence.some((item) => item.evidence_level === "context_only")) throw new Error("The topic has missing or non-public technical evidence.");
    const product = products.find((item) => item.slug === topic.primary_product_slug);
    if (!product) throw new Error(`No public product mapping exists for ${topic.primary_product_slug}.`);
    const slug = `${slugifyNewsTitle(topic.title)}-technical-note`;
    const existing = await pool.query<{ id: string }>(`select id from news_articles where canonical_source_url = $1 limit 1`, [`technical-source:${topic.id}`]);
    if (existing.rows[0]) throw new Error("A technical note for this source topic already exists.");
    const image = getEditorialNewsImage({ title: topic.title, summary: topic.excerpt, seed: `technical:${topic.id}` });
    const related: NewsRelatedProduct = { slug: product.slug, name: product.name, category: product.category, summary: product.summary, image: product.image || "/images/products/aerogel-blanket.svg", relationshipReason: "This technical note is mapped to the product family named in its source record.", relevanceScore: 1 };
    const sourceLabel = `Internal technical source file: ${evidence[0].source_document}`;
    const sourceLocator = [...new Set(evidence.map((item) => item.source_locator))].join("; ");
    const reportNumbers = [...new Set(evidence.map((item) => item.report_number).filter((item): item is string => Boolean(item)))].join(", ");
    const contentHtml = articleHtml(topic, evidence, product.name);
    const inserted = await pool.query<{ id: string }>(`insert into news_articles (title, slug, excerpt, content_html, status, seo_indexable, language, category, tags, published_at, updated_at, author_name, seo_title, seo_description, canonical_url, primary_keyword, secondary_keywords, geo_summary, key_takeaways, cover_image_url, cover_image_source_url, cover_image_page_url, cover_image_alt, cover_image_status, cover_image_fetched_at, cover_image_hash, source_title, source_publisher, source_url, canonical_source_url, source_language, source_published_at, source_fetched_at, source_timezone, source_fingerprint, relevance_score, credibility_score, generation_model, generation_prompt_version, origin_type, technical_source_label, technical_source_locator, technical_source_report_number, evidence_ids)
      values ($1,$2,$3,$4,'published',true,'en','Technical Notes',$5,now(),now(),'Cowin Materials Technical Team',$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,'verified',now(),$17,$18,'Cowin Materials',$19,$20,'en',now(),now(),'UTC',$21,1,1,'evidence-backed-technical-template','technical-evidence-v1','first_party_technical_note',$22,$23,$24,$25)
      returning id`, [topic.title, slug, topic.excerpt, contentHtml, topic.tags, `${topic.title} | Cowin Materials`, topic.excerpt.slice(0, 155), absoluteUrl(`/news/${slug}`), product.category, [product.name, ...topic.tags], `Evidence-backed technical note for ${product.name}.`, ["Source-recorded data is displayed with its documented scope.", "This note does not replace project-specific testing or system qualification.", "Request the relevant product documentation for your operating conditions."], image.url, absoluteUrl(image.url), absoluteUrl("/news"), image.alt, hashText(image.url), sourceLabel, absoluteUrl("/resources"), `technical-source:${topic.id}`, hashText(`technical-source:${topic.id}`), sourceLabel, sourceLocator, reportNumbers || null, topic.evidence_ids]);
    const articleId = inserted.rows[0]?.id;
    if (!articleId) throw new Error("The technical article could not be inserted.");
    await pool.query(`insert into news_products (news_id, product_slug, product_name, product_category, product_summary, product_image, relevance_score, relationship_reason, display_order) values ($1,$2,$3,$4,$5,$6,1,$7,1) on conflict (news_id, product_slug) do nothing`, [articleId, related.slug, related.name, related.category, related.summary, related.image, related.relationshipReason]);
    await pool.query(`update news_technical_topics set status = 'published', published_article_id = $2, published_at = now(), updated_at = now(), last_error = null where id = $1 and status = 'publishing'`, [topic.id, articleId]);
    return { kind: "published", articleId, slug, topicId: topic.id, title: topic.title };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Technical note publication failed.";
    await restoreTopic(topic.id, message);
    throw error;
  }
}
