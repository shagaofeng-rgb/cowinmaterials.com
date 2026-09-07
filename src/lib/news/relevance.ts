import type { NewsCandidate, NewsRelatedProduct } from "./types";

function candidateText(candidate: Pick<NewsCandidate, "title" | "summary" | "keywords">) {
  const keywords = Array.isArray(candidate.keywords) ? candidate.keywords.join(" ") : "";
  return `${candidate.title} ${candidate.summary} ${keywords}`.replace(/\s+/g, " ");
}

export function hasDirectMaterialRelevance(candidate: Pick<NewsCandidate, "title" | "summary" | "keywords">) {
  const text = candidateText(candidate);
  const directMaterialTopic = /\b(silica aerogel|thermal insulation|cryogenic|lng|intumescent|fireproof|fire protection|water repellent|waterproofing|concrete|masonry)\b/i;
  const relevantAerogelTopic = /\baerogel\b/i.test(text) && /\b(silica|insulation|thermal|fire|battery|building|coating|blanket)\b/i.test(text);
  const batteryTopic = /\b(battery|batteries|cell|pack|electric vehicle|ev|lithium|bess)\b/i.test(text);
  const safetyTopic = /\b(thermal management|thermal barrier|thermal runaway|heat propagation|fire safety|battery fire|fire risk|safety)\b/i.test(text);
  return directMaterialTopic.test(text) || relevantAerogelTopic || (batteryTopic && safetyTopic);
}

export function getNewsProductRelevanceThreshold(rawValue = process.env.NEWS_RELEVANCE_THRESHOLD) {
  const configured = Number(rawValue);
  const requested = Number.isFinite(configured) ? configured : 0.55;
  // A very low threshold previously allowed broad energy-market coverage to be mapped to a product.
  return Math.min(1, Math.max(0.55, requested));
}

export function isIndexableNewsCandidate(
  candidate: Pick<NewsCandidate, "title" | "summary" | "keywords">,
  relatedProducts: Pick<NewsRelatedProduct, "relevanceScore">[],
) {
  const text = candidateText(candidate);
  const materialSpecificTopic = /\b(silica aerogel|aerogel insulation|aerogel blanket|aerogel powder|aerogel slurry|thermal insulation|cryogenic|lng|intumescent|fireproof|fire protection coating|water repellent|waterproofing|concrete|masonry)\b/i.test(text);
  const batteryThermalTopic = /\b(battery|batteries|cell|pack|electric vehicle|ev|lithium|bess)\b/i.test(text)
    && /\b(thermal runaway|thermal barrier|thermal management|heat propagation|battery fire)\b/i.test(text);
  return (materialSpecificTopic || batteryThermalTopic)
    && relatedProducts.some((product) => product.relevanceScore >= 0.7);
}
