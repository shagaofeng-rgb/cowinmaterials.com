import crypto from "node:crypto";
import { products, site } from "../data";
import type { NewsCandidate, NewsRelatedProduct } from "./types";

const trackingParams = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
  "ref",
]);

export function hashText(value: string) {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export function canonicalizeSourceUrl(value: string) {
  const url = new URL(value);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS source URLs are accepted.");
  }

  url.hostname = url.hostname.toLowerCase();
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (trackingParams.has(key.toLowerCase()) || key.toLowerCase().startsWith("utm_")) {
      url.searchParams.delete(key);
    }
  }

  return url.toString();
}

export function createSourceFingerprint(candidate: Pick<NewsCandidate, "title" | "url" | "publisher" | "publishedAt">) {
  const canonicalUrl = canonicalizeSourceUrl(candidate.url);
  return hashText([candidate.title, candidate.publisher, canonicalUrl, candidate.publishedAt.slice(0, 10)].join("|"));
}

export function isWithinLookback(publishedAt: string, fetchedAt = new Date().toISOString(), hours = 72) {
  const published = new Date(publishedAt).getTime();
  const fetched = new Date(fetchedAt).getTime();
  if (!Number.isFinite(published) || !Number.isFinite(fetched)) {
    return false;
  }

  const diff = fetched - published;
  return diff >= 0 && diff <= hours * 60 * 60 * 1000;
}

export function stripHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function slugifyNewsTitle(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 86);

  return slug || `news-${Date.now()}`;
}

export function isInternalSiteImage(value?: string | null) {
  if (!value) {
    return true;
  }

  if (value.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return host === site.domain || host === `www.${site.domain}` || host.endsWith(".vercel.app");
  } catch {
    return true;
  }
}

function tokenSet(value: string) {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(" ")
      .filter((token) => token.length > 2),
  );
}

export function scoreCandidateAgainstProducts(candidate: NewsCandidate): NewsRelatedProduct[] {
  const candidateText = [candidate.title, candidate.summary, candidate.publisher, ...(candidate.keywords || [])].join(" ");
  const candidateTokens = tokenSet(candidateText);

  return products
    .map((product) => {
      const productText = [
        product.name,
        product.code,
        product.category,
        product.summary,
        product.applications.join(" "),
        product.metrics.join(" "),
        product.detail.join(" "),
      ].join(" ");
      const productTokens = tokenSet(productText);
      let hits = 0;

      for (const token of productTokens) {
        if (candidateTokens.has(token)) {
          hits += token.length > 7 ? 1.5 : 1;
        }
      }

      const normalized = Math.min(1, hits / 12);
      return {
        slug: product.slug,
        name: product.name,
        category: product.category,
        summary: product.summary,
        image: product.image,
        relationshipReason:
          hits > 0
            ? `Matched industry terms with ${product.category.toLowerCase()} project requirements.`
            : "No strong relationship detected.",
        relevanceScore: Number(normalized.toFixed(3)),
      };
    })
    .filter((item) => item.relevanceScore >= Number(process.env.NEWS_RELEVANCE_THRESHOLD || 0.12))
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3);
}

export function buildNewsArticleHtml(candidate: NewsCandidate, relatedProducts: NewsRelatedProduct[]) {
  const escapedTitle = escapeHtml(candidate.title);
  const escapedPublisher = escapeHtml(candidate.publisher);
  const productList = relatedProducts.map((product) => `<li><a href="/products/${product.slug}">${escapeHtml(product.name)}</a>: ${escapeHtml(product.relationshipReason)}</li>`).join("");

  return [
    `<p>${escapedPublisher} published an industry update titled <cite>${escapedTitle}</cite>. Cowin Materials tracks this development as a sourcing and specification signal for international technical buyers.</p>`,
    `<h2>Why it matters for aerogel material buyers</h2>`,
    `<p>This development is monitored because it may influence insulation specification, battery thermal-management design, fire protection requirements or durable building-envelope material selection.</p>`,
    relatedProducts.length
      ? `<h2>Related Cowin Materials product areas</h2><ul>${productList}</ul>`
      : `<h2>Related product areas</h2><p>No strong product association was detected, so this item requires editorial review before publication.</p>`,
    `<h2>Source note</h2>`,
    `<p>This is an original Cowin Materials editorial brief based on the cited public source. It does not reproduce the source article or its full text.</p>`,
    `<p><a href="${escapeHtml(candidate.url)}" rel="nofollow noopener" target="_blank">Read the original source: ${escapedTitle}</a></p>`,
  ].join("");
}

export function extractImageFromHtml(html: string, pageUrl: string) {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<img[^>]+src=["']([^"']+)["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern)?.[1];
    if (match) {
      return new URL(match, pageUrl).toString();
    }
  }

  return null;
}

export function rssItemsFromXml(xml: string) {
  return [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]);
}

export function readXmlTag(item: string, tag: string) {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match?.[1]
    ?.replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .trim();
}
