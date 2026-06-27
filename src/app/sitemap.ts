import type { MetadataRoute } from "next";
import { products } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/products", priority: 0.95 },
  { path: "/applications", priority: 0.9 },
  { path: "/technology", priority: 0.82 },
  { path: "/construction", priority: 0.78 },
  { path: "/comparison", priority: 0.68 },
  { path: "/contact", priority: 0.85 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

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
  ];
}
