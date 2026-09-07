import { applicationPages, getProductPath, products } from "../data.ts";
import type { BlogArticle } from "./types";

export type BlogTechnicalPath = {
  href: string;
  label: string;
  note: string;
};

type PathRule = {
  match: RegExp;
  productSlugs: string[];
  applicationSlugs: string[];
};

const pathRules: PathRule[] = [
  {
    match: /\b(battery|bess|energy storage|electric vehicle|ev|thermal runaway|thermal barrier)\b/i,
    productSlugs: ["battery-thermal-pads", "aerogel-blanket-and-thermal-pads"],
    applicationSlugs: ["ev-ess-thermal-barriers"],
  },
  {
    match: /\b(intumescent|fireproof|fire protection|flame retardant|steel)\b/i,
    productSlugs: ["aerogel-fireproof-coating", "non-intumescent-fire-protection-coating"],
    applicationSlugs: ["steel-fire-protection"],
  },
  {
    match: /\b(waterproof|water repellent|concrete|masonry|stone)\b/i,
    productSlugs: ["silicon-penetrating-water-repellent"],
    applicationSlugs: ["concrete-masonry-waterproofing"],
  },
  {
    match: /\b(cryogenic|lng|cold service)\b/i,
    productSlugs: ["aerogel-blanket-and-thermal-pads"],
    applicationSlugs: ["lng-cryogenic-insulation"],
  },
  {
    match: /\b(pipe|valve|flange|process equipment|industrial insulation|high[ -]temperature|insulation paint|insulation coating)\b/i,
    productSlugs: ["industrial-aerogel-insulation-coating", "aerogel-blanket-and-thermal-pads"],
    applicationSlugs: ["industrial-pipe-equipment-insulation"],
  },
  {
    match: /\b(wall|roof|building|retrofit)\b/i,
    productSlugs: ["aerogel-insulation-coating"],
    applicationSlugs: ["building-energy-retrofit"],
  },
  {
    match: /\b(aerogel|silica)\b/i,
    productSlugs: ["aerogel-powder-and-slurry"],
    applicationSlugs: [],
  },
];

export function getBlogTechnicalPaths(article: Pick<BlogArticle, "title" | "contentHtml">): BlogTechnicalPath[] {
  const text = `${article.title} ${article.contentHtml.replace(/<[^>]+>/g, " ")}`;
  const links: BlogTechnicalPath[] = [];
  const seen = new Set<string>();

  const add = (path: BlogTechnicalPath) => {
    if (!seen.has(path.href)) {
      seen.add(path.href);
      links.push(path);
    }
  };

  for (const rule of pathRules) {
    if (!rule.match.test(text)) continue;
    for (const slug of rule.productSlugs) {
      const product = products.find((item) => item.slug === slug);
      if (product) add({ href: getProductPath(product), label: product.name, note: product.summary });
    }
    for (const slug of rule.applicationSlugs) {
      const application = applicationPages.find((item) => item.slug === slug);
      if (application) add({ href: `/applications/${application.slug}`, label: application.shortTitle, note: application.intro });
    }
  }

  add({ href: "/resources", label: "Technical resources", note: "Request product-specific documents and review data in the stated test context." });
  return links.slice(0, 4);
}
