import crypto from "node:crypto";
import { getProductPath, products, site } from "@/lib/data";
import type { NewsCandidate, NewsRelatedProduct } from "./types";

const trackingParams = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "fbclid", "gclid", "mc_cid", "mc_eid", "ref"]);

export function hashText(value: string) {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export function canonicalizeSourceUrl(value: string) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error("Only HTTP and HTTPS source URLs are accepted.");
  url.hostname = url.hostname.toLowerCase();
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) if (trackingParams.has(key.toLowerCase()) || key.toLowerCase().startsWith("utm_")) url.searchParams.delete(key);
  return url.toString();
}

export function createSourceFingerprint(candidate: Pick<NewsCandidate, "title" | "url" | "publisher" | "publishedAt">) {
  return hashText([candidate.title, candidate.publisher, canonicalizeSourceUrl(candidate.url), candidate.publishedAt.slice(0, 10)].join("|"));
}

export function isWithinLookback(publishedAt: string, fetchedAt: string, hours: number) {
  const difference = new Date(fetchedAt).getTime() - new Date(publishedAt).getTime();
  return Number.isFinite(difference) && difference >= 0 && difference <= hours * 3_600_000;
}

export function stripHtml(value: string) {
  return value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")
    .replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ").trim();
}

export function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

export function slugifyNewsTitle(title: string) {
  return title.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 86) || `news-${Date.now()}`;
}

function tokenSet(value: string) {
  return new Set(value.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter((token) => token.length > 2));
}

export function scoreCandidateAgainstProducts(candidate: NewsCandidate): NewsRelatedProduct[] {
  const candidateTokens = tokenSet([candidate.title, candidate.summary, candidate.publisher, ...(candidate.keywords || [])].join(" "));
  return products.map((product) => {
    const productTokens = tokenSet([product.name, product.code, product.category, product.summary, product.applications.join(" "), product.metrics.join(" "), product.detail.join(" ")].join(" "));
    let hits = 0;
    for (const token of productTokens) if (candidateTokens.has(token)) hits += token.length > 7 ? 1.5 : 1;
    return {
      slug: product.slug, name: product.name, category: product.category, summary: product.summary,
      image: product.image || "/images/fire-test-lab.jpg",
      relationshipReason: `Matched terms relevant to ${product.category.toLowerCase()} evaluation.`,
      relevanceScore: Number(Math.min(1, hits / 12).toFixed(3)),
    };
  }).filter((item) => item.relevanceScore >= Number(process.env.NEWS_RELEVANCE_THRESHOLD || 0.12)).sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 3);
}

export function buildNewsArticleHtml(candidate: NewsCandidate, relatedProducts: NewsRelatedProduct[]) {
  const sourceSummary = escapeHtml(candidate.summary.slice(0, 750));
  const productList = relatedProducts.map((product) => `<li><a href="${getProductPath(product)}">${escapeHtml(product.name)}</a>: ${escapeHtml(product.relationshipReason)}</li>`).join("");
  return [
    `<p>${escapeHtml(candidate.publisher)} published an industry update titled <cite>${escapeHtml(candidate.title)}</cite>. This original Cowin Materials brief highlights its possible relevance for international technical buyers.</p>`,
    sourceSummary ? `<h2>What the source reports</h2><p>${sourceSummary}</p>` : "",
    `<h2>Evaluation context</h2><p>This source is tracked as a market and technical signal. It is not a product test report, certification, or project-specific engineering conclusion.</p>`,
    `<h2>Related Cowin Materials product areas</h2><ul>${productList}</ul>`,
    `<h2>Source note</h2><p>This brief is an original summary based on the cited public source and does not reproduce the original article in full.</p>`,
    `<p><a href="${escapeHtml(candidate.url)}" rel="nofollow noopener" target="_blank">Read the original source: ${escapeHtml(candidate.title)}</a></p>`,
  ].filter(Boolean).join("");
}

export function rssItemsFromXml(xml: string) { return [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]); }
export function readXmlTag(item: string, tag: string) {
  return item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1]?.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").trim();
}

export function sourcePublisherFromUrl(value: string) {
  try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return site.name; }
}
