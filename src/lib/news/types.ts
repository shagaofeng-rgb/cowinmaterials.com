export type NewsSourceRecord = {
  title: string;
  publisher: string;
  author?: string | null;
  url: string;
  canonicalUrl: string;
  language?: string | null;
  publishedAt: string;
  fetchedAt: string;
  timezone?: string | null;
  fingerprint: string;
};

export type NewsImageRecord = {
  url: string;
  sourceUrl: string;
  pageUrl: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  hash?: string | null;
  status: "verified" | "pending" | "failed";
  fetchedAt: string;
};

export type NewsRelatedProduct = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  image: string;
  relationshipReason: string;
  relevanceScore: number;
};

export type NewsArticle = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  status: "draft" | "review" | "published" | "rejected" | "archived";
  language: "en";
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  authorName: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  primaryKeyword?: string | null;
  secondaryKeywords: string[];
  geoSummary: string;
  keyTakeaways: string[];
  source: NewsSourceRecord;
  image: NewsImageRecord;
  relatedProducts: NewsRelatedProduct[];
};

export type NewsListResult = {
  articles: NewsArticle[];
  total: number;
  page: number;
  pageSize: number;
};

export type NewsCandidate = {
  title: string;
  summary: string;
  url: string;
  publisher: string;
  author?: string | null;
  language?: string | null;
  publishedAt: string;
  fetchedAt: string;
  sourceTimezone?: string | null;
  imageUrl?: string | null;
  imagePageUrl?: string | null;
  keywords?: string[];
};

export type NewsAutomationResult = {
  ok: boolean;
  status: "completed" | "configuration_required" | "no_publishable_items" | "failed";
  checkedAt: string;
  collected: number;
  rejected: number;
  published: number;
  message: string;
  warnings: string[];
};
