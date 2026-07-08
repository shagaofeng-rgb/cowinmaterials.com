import type { MetadataRoute } from "next";
import { applicationPages, products } from "@/lib/data";
import { getPublishedNews } from "@/lib/news/store";
import { absoluteUrl } from "@/lib/seo";

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/products", priority: 0.95 },
  { path: "/applications", priority: 0.9 },
  { path: "/technical-resources", priority: 0.86 },
  { path: "/case-studies", priority: 0.65 },
  { path: "/news", priority: 0.72 },
  { path: "/search", priority: 0.4 },
  { path: "/about", priority: 0.78 },
  { path: "/contact", priority: 0.85 },
  { path: "/privacy-policy", priority: 0.3 },
  { path: "/terms-of-use", priority: 0.3 },
  { path: "/cookie-notice", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const news = await getPublishedNews({ pageSize: 100 });

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: route.priority,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.86,
    })),
    ...applicationPages.map((application) => ({
      url: absoluteUrl(`/applications/${application.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.84,
    })),
    ...news.articles.map((article) => ({
      url: absoluteUrl(`/news/${article.slug}`),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.66,
    })),
  ];
}
