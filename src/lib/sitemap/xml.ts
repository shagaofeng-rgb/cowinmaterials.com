import type { SitemapEntry, SitemapIndexEntry } from "./types";

export const MAX_SITEMAP_URLS = 45_000;
export const MAX_SITEMAP_BYTES = 49 * 1024 * 1024;

export function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function normalizeLastModified(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid sitemap lastmod: ${String(value)}`);
  }
  return date.toISOString();
}

export function filterIndexableEntries(entries: SitemapEntry[]) {
  const seen = new Set<string>();

  return entries.filter((entry) => {
    if (entry.indexable === false || ["draft", "private", "archived", "deleted"].includes(entry.status || "")) {
      return false;
    }

    let url: URL;
    try {
      url = new URL(entry.url);
    } catch {
      return false;
    }

    if (!["http:", "https:"].includes(url.protocol) || url.search || url.hash) {
      return false;
    }

    const canonical = entry.canonicalUrl || entry.url;
    if (canonical !== entry.url || seen.has(entry.url)) {
      return false;
    }

    seen.add(entry.url);
    return true;
  });
}

function renderUrl(entry: SitemapEntry) {
  return [
    "  <url>",
    `    <loc>${escapeXml(entry.url)}</loc>`,
    `    <lastmod>${escapeXml(normalizeLastModified(entry.lastModified))}</lastmod>`,
    "  </url>",
  ].join("\n");
}

export function renderUrlSet(entries: SitemapEntry[]) {
  const indexable = filterIndexableEntries(entries);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...indexable.map(renderUrl),
    "</urlset>",
    "",
  ].join("\n");
}

export function renderSitemapIndex(entries: SitemapIndexEntry[]) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((entry) => [
      "  <sitemap>",
      `    <loc>${escapeXml(entry.url)}</loc>`,
      `    <lastmod>${escapeXml(normalizeLastModified(entry.lastModified))}</lastmod>`,
      "  </sitemap>",
    ].join("\n")),
    "</sitemapindex>",
    "",
  ].join("\n");
}

export function splitSitemapEntries(entries: SitemapEntry[], maxUrls = MAX_SITEMAP_URLS, maxBytes = MAX_SITEMAP_BYTES) {
  const chunks: SitemapEntry[][] = [];
  let chunk: SitemapEntry[] = [];
  let bytes = Buffer.byteLength(renderUrlSet([]), "utf8");

  for (const entry of filterIndexableEntries(entries)) {
    const entryBytes = Buffer.byteLength(renderUrl(entry), "utf8") + 1;
    if (chunk.length && (chunk.length >= maxUrls || bytes + entryBytes > maxBytes)) {
      chunks.push(chunk);
      chunk = [];
      bytes = Buffer.byteLength(renderUrlSet([]), "utf8");
    }
    chunk.push(entry);
    bytes += entryBytes;
  }

  if (chunk.length) chunks.push(chunk);
  return chunks;
}

export function isWellFormedSitemapXml(xml: string) {
  const hasDeclaration = xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>');
  const urlSet = xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">') && xml.includes("</urlset>");
  const index = xml.includes('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">') && xml.includes("</sitemapindex>");
  return hasDeclaration && (urlSet || index);
}
