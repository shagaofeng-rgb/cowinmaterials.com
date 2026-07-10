import manifest from "@/generated/sitemap-content.json";
import { applicationPages, products } from "@/lib/data";
import { getPublishedNewsSitemapPage, getPublishedNewsSitemapSummary } from "@/lib/news/store";
import { absoluteUrl } from "@/lib/seo";
import { MAX_SITEMAP_URLS } from "./xml";
import type { SitemapEntry, SitemapKind, SitemapSummary } from "./types";

const pagePaths = [
  "/",
  "/products",
  "/applications",
  "/technical-resources",
  "/case-studies",
  "/news",
  "/about",
  "/contact",
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

export function getStaticSitemapEntries(kind: Exclude<SitemapKind, "news">): SitemapEntry[] {
  if (kind === "pages") {
    return pagePaths.map((path) => ({
      url: absoluteUrl(path),
      canonicalUrl: absoluteUrl(path),
      lastModified: pageDates[path] || manifest.generatedAt,
      status: "published",
    }));
  }

  if (kind === "products") {
    return products.map((product) => ({
      url: absoluteUrl(`/products/${encodeURIComponent(product.slug)}`),
      canonicalUrl: absoluteUrl(`/products/${encodeURIComponent(product.slug)}`),
      lastModified: manifest.catalog,
      status: "published",
    }));
  }

  return applicationPages.map((application) => ({
    url: absoluteUrl(`/applications/${encodeURIComponent(application.slug)}`),
    canonicalUrl: absoluteUrl(`/applications/${encodeURIComponent(application.slug)}`),
    lastModified: manifest.catalog,
    status: "published",
  }));
}

export async function getSitemapSummary(kind: SitemapKind): Promise<SitemapSummary> {
  if (kind === "news") {
    return { kind, ...(await getPublishedNewsSitemapSummary()) };
  }

  const entries = getStaticSitemapEntries(kind);
  return { kind, count: entries.length, lastModified: latest(entries) };
}

export async function getSitemapChunk(kind: SitemapKind, part: number) {
  const offset = (part - 1) * MAX_SITEMAP_URLS;
  if (part < 1) return [];

  if (kind === "news") {
    const page = await getPublishedNewsSitemapPage({ offset, limit: MAX_SITEMAP_URLS });
    return page.entries.map((entry) => ({
      url: absoluteUrl(`/news/${encodeURIComponent(entry.slug)}`),
      canonicalUrl: absoluteUrl(`/news/${encodeURIComponent(entry.slug)}`),
      lastModified: entry.updatedAt,
      status: "published" as const,
    }));
  }

  return getStaticSitemapEntries(kind).slice(offset, offset + MAX_SITEMAP_URLS);
}

export const sitemapKinds: SitemapKind[] = ["pages", "products", "applications", "news"];
