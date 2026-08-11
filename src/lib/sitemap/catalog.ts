import manifest from "@/generated/sitemap-content.json";
import { applicationPages, getProductFamilyPath, getProductPath, productFamilies, products } from "@/lib/data";
import { getBlogArticles } from "@/lib/blog/store";
import { getPublishedNewsSitemapPage, getPublishedNewsSitemapSummary } from "@/lib/news/store";
import { absoluteUrl } from "@/lib/seo";
import { MAX_SITEMAP_URLS } from "./xml";
import type { SitemapEntry, SitemapKind, SitemapSummary } from "./types";

const pagePaths = [
  "/",
  "/products",
  "/applications",
  "/resources",
  "/news",
  "/about",
  "/locations",
  "/quality",
  "/contact",
  "/request-quote",
  "/privacy-policy",
  "/terms-of-use",
  "/cookie-notice",
] as const;

const pageDates = manifest.pages as Record<string, string>;

function latest(entries: SitemapEntry[], fallback = manifest.generatedAt) {
  return entries.reduce((value, entry) => (
    new Date(entry.lastModified).getTime() > new Date(value).getTime() ? entry.lastModified : value
  ), fallback);
}

export function getStaticSitemapEntries(kind: Exclude<SitemapKind, "blog" | "news">): SitemapEntry[] {
  if (kind === "pages") {
    return pagePaths.map((path) => ({
      url: absoluteUrl(path),
      canonicalUrl: absoluteUrl(path),
      lastModified: pageDates[path] || manifest.generatedAt,
      status: "published",
    }));
  }

  if (kind === "products") {
    return [
      ...productFamilies.map((family) => ({
        url: absoluteUrl(getProductFamilyPath(family)),
        canonicalUrl: absoluteUrl(getProductFamilyPath(family)),
        lastModified: manifest.catalog,
        status: "published" as const,
      })),
      ...products.map((product) => ({
        url: absoluteUrl(getProductPath(product)),
        canonicalUrl: absoluteUrl(getProductPath(product)),
        lastModified: manifest.catalog,
        status: "published" as const,
      })),
    ];
  }

  return applicationPages.map((application) => ({
    url: absoluteUrl(`/applications/${encodeURIComponent(application.slug)}`),
    canonicalUrl: absoluteUrl(`/applications/${encodeURIComponent(application.slug)}`),
    lastModified: manifest.catalog,
    status: "published",
  }));
}

export async function getSitemapSummary(kind: SitemapKind): Promise<SitemapSummary> {
  if (kind === "blog") {
    const articles = await getBlogArticles();
    return { kind, count: articles.length, lastModified: latest(articles.map((article) => ({
      url: absoluteUrl(`/blog/${encodeURIComponent(article.slug)}`),
      lastModified: article.updatedAt,
    }))) };
  }

  if (kind === "news") {
    const summary = await getPublishedNewsSitemapSummary();
    return { kind, count: summary.count, lastModified: summary.lastModified };
  }

  const entries = getStaticSitemapEntries(kind);
  return { kind, count: entries.length, lastModified: latest(entries) };
}

export async function getSitemapChunk(kind: SitemapKind, part: number) {
  const offset = (part - 1) * MAX_SITEMAP_URLS;
  if (part < 1) return [];

  if (kind === "blog") {
    const articles = await getBlogArticles();
    return articles.slice(offset, offset + MAX_SITEMAP_URLS).map((article) => ({
      url: absoluteUrl(`/blog/${encodeURIComponent(article.slug)}`),
      canonicalUrl: absoluteUrl(`/blog/${encodeURIComponent(article.slug)}`),
      lastModified: article.updatedAt,
      status: "published" as const,
    }));
  }

  if (kind === "news") {
    const result = await getPublishedNewsSitemapPage({ offset, limit: MAX_SITEMAP_URLS });
    return result.entries.map((article) => ({ url: absoluteUrl(`/news/${encodeURIComponent(article.slug)}`), canonicalUrl: absoluteUrl(`/news/${encodeURIComponent(article.slug)}`), lastModified: article.updatedAt, status: "published" as const }));
  }

  return getStaticSitemapEntries(kind).slice(offset, offset + MAX_SITEMAP_URLS);
}

export const sitemapKinds: SitemapKind[] = ["pages", "products", "applications", "blog", "news"];
