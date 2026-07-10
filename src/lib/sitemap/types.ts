export type SitemapKind = "pages" | "products" | "applications" | "news";

export type SitemapEntry = {
  url: string;
  lastModified: string;
  indexable?: boolean;
  canonicalUrl?: string;
  status?: "published" | "draft" | "private" | "archived" | "deleted";
};

export type SitemapIndexEntry = {
  url: string;
  lastModified: string;
};

export type SitemapSummary = {
  kind: SitemapKind;
  count: number;
  lastModified: string;
};
