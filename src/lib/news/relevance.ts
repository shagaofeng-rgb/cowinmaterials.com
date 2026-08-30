import type { NewsCandidate } from "./types";

export function hasDirectMaterialRelevance(candidate: Pick<NewsCandidate, "title" | "summary" | "keywords">) {
  const keywords = Array.isArray(candidate.keywords) ? candidate.keywords.join(" ") : "";
  const text = `${candidate.title} ${candidate.summary} ${keywords}`.replace(/\s+/g, " ");
  const directMaterialTopic = /\b(silica aerogel|thermal insulation|cryogenic|lng|intumescent|fireproof|fire protection|water repellent|waterproofing|concrete|masonry)\b/i;
  const relevantAerogelTopic = /\baerogel\b/i.test(text) && /\b(silica|insulation|thermal|fire|battery|building|coating|blanket)\b/i.test(text);
  const batteryTopic = /\b(battery|batteries|cell|pack|electric vehicle|ev|lithium|bess)\b/i.test(text);
  const safetyTopic = /\b(thermal management|thermal barrier|thermal runaway|heat propagation|fire safety|battery fire|fire risk|safety)\b/i.test(text);
  return directMaterialTopic.test(text) || relevantAerogelTopic || (batteryTopic && safetyTopic);
}
