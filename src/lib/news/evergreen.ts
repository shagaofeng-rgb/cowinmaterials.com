import { products } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";
import type { NewsArticle, NewsRelatedProduct } from "./types";

function relatedProduct(slug: string, reason: string): NewsRelatedProduct {
  const product = products.find((item) => item.slug === slug);
  if (!product) throw new Error(`Unknown evergreen news product: ${slug}`);
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    summary: product.summary,
    image: product.image,
    relationshipReason: reason,
    relevanceScore: 1,
  };
}

function guide({
  title,
  slug,
  excerpt,
  contentHtml,
  product,
  publishedAt,
}: {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  product: NewsRelatedProduct;
  publishedAt: string;
}): NewsArticle {
  const pageUrl = absoluteUrl(`/news/${slug}`);
  const productUrl = absoluteUrl(`/products/${product.slug}`);
  return {
    id: `evergreen-${slug}`,
    title,
    slug,
    excerpt,
    contentHtml,
    status: "published",
    language: "en",
    category: "Technical Guide",
    tags: ["aerogel", "technical guide", product.category.toLowerCase()],
    publishedAt,
    updatedAt: publishedAt,
    authorName: "Cowin Materials Technical Team",
    seoTitle: `${title} | Cowin Materials`,
    seoDescription: excerpt.slice(0, 155),
    canonicalUrl: pageUrl,
    primaryKeyword: product.category,
    secondaryKeywords: [product.name, "silica aerogel materials"],
    geoSummary: excerpt,
    keyTakeaways: [],
    image: {
      url: product.image,
      sourceUrl: absoluteUrl(product.image),
      pageUrl: productUrl,
      alt: `${product.name} technical application guide`,
      width: null,
      height: null,
      hash: null,
      status: "verified",
      fetchedAt: publishedAt,
    },
    source: {
      title: product.name,
      publisher: "Cowin Materials",
      author: "Cowin Materials Technical Team",
      url: productUrl,
      canonicalUrl: productUrl,
      language: "en",
      publishedAt,
      fetchedAt: publishedAt,
      timezone: "UTC",
      fingerprint: `cowin-${slug}`,
    },
    relatedProducts: [product],
  };
}

export const evergreenNews: NewsArticle[] = [
  guide({
    title: "How to Select Aerogel Insulation for Industrial Pipes and Complex Equipment",
    slug: "selecting-aerogel-insulation-for-industrial-pipes-and-equipment",
    excerpt: "A practical specification guide for comparing aerogel blankets and insulation coatings on pipes, valves, flanges, tanks and complex industrial surfaces.",
    publishedAt: "2026-07-10T00:00:00.000Z",
    product: relatedProduct("industrial-aerogel-insulation-coating", "The guide explains where a coating system can complement or replace wrapped insulation on complex geometry."),
    contentHtml: [
      "<p>Industrial insulation selection should begin with the operating temperature, surface geometry, shutdown window, inspection needs and exposure conditions. Aerogel blankets and aerogel insulation coatings solve different installation constraints and should be compared as systems rather than only by nominal thermal conductivity.</p>",
      "<h2>Start with operating conditions</h2><p>Record normal and peak surface temperature, ambient humidity, indoor or outdoor exposure, corrosion-control requirements and the target touch-safe or heat-loss objective. Confirm that every primer, insulation layer and topcoat is compatible with those conditions.</p>",
      "<h2>Match the format to the geometry</h2><p>Flexible blankets are efficient on straight pipe runs and larger regular surfaces. Sprayable or trowel-applied coatings can be evaluated for elbows, valves, flanges and maintenance areas where cutting and fastening wrapped insulation is difficult.</p>",
      "<h2>Confirm the complete system</h2><p>Specify substrate preparation, primer, insulation thickness, reinforcement where required, topcoat, curing conditions and inspection method. Project approval should rely on the applicable TDS, installation guidance and agreed test criteria.</p>",
    ].join(""),
  }),
  guide({
    title: "Aerogel Thermal Barriers for EV and ESS: A Technical Evaluation Checklist",
    slug: "aerogel-thermal-barrier-evaluation-checklist-for-ev-and-ess",
    excerpt: "Key questions for evaluating aerogel thermal barrier pads in electric-vehicle battery modules and stationary energy storage systems.",
    publishedAt: "2026-07-09T00:00:00.000Z",
    product: relatedProduct("battery-thermal-pads", "The checklist focuses on dimensional, thermal and electrical requirements for battery thermal barrier pad evaluation."),
    contentHtml: [
      "<p>A battery thermal barrier is part of a complete cell, module and pack safety design. Material selection should be tied to the cell format, available spacing, compression, electrical insulation requirement and the project validation plan.</p>",
      "<h2>Define the design envelope</h2><p>Confirm available thickness, target density, dimensional tolerance, compression behavior and the locations where heat transfer must be slowed. Include assembly processes and long-term vibration or cycling conditions.</p>",
      "<h2>Review thermal and electrical requirements</h2><p>Compare thermal conductivity together with high-temperature integrity, flame behavior, moisture response and electrical insulation. A single material value does not establish pack-level thermal propagation performance.</p>",
      "<h2>Plan application-specific validation</h2><p>Use representative cells, interfaces, compression and enclosure conditions. Final qualification should follow the vehicle or ESS manufacturer's test plan and the standards applicable to the target market.</p>",
    ].join(""),
  }),
  guide({
    title: "Specifying Waterborne Aerogel Insulation Coatings for Building Retrofit",
    slug: "specifying-waterborne-aerogel-insulation-coatings-for-building-retrofit",
    excerpt: "A buyer-oriented guide to substrate review, coating build, moisture management and technical documentation for aerogel building retrofit systems.",
    publishedAt: "2026-07-08T00:00:00.000Z",
    product: relatedProduct("aerogel-insulation-coating", "The guide connects building retrofit conditions with the complete primer, insulation coating and topcoat system."),
    contentHtml: [
      "<p>Thin-build aerogel insulation coatings can be evaluated where conventional boards are constrained by geometry, added thickness, weight or construction access. They should be specified as a complete coating system and not as an isolated thermal layer.</p>",
      "<h2>Survey the existing envelope</h2><p>Identify substrate type, cracks, salts, moisture sources, previous coatings and areas of thermal bridging. Adhesion and moisture problems must be corrected before the insulation coating is applied.</p>",
      "<h2>Define the coating build</h2><p>State the primer, number of insulation coats, target dry thickness, topcoat and curing window. Application conditions should include substrate temperature, relative humidity and protection from rain or condensation.</p>",
      "<h2>Evaluate data in context</h2><p>Review thermal conductivity, added thermal resistance, adhesion, water resistance and VOC information with the test method and sample configuration. Project performance also depends on workmanship and the existing wall or roof assembly.</p>",
    ].join(""),
  }),
];
