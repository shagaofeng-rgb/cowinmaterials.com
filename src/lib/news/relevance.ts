import type { NewsCandidate } from "./types";

export function hasDirectMaterialRelevance(candidate: Pick<NewsCandidate, "title" | "summary">) {
  const text = `${candidate.title} ${candidate.summary}`.replace(/\s+/g, " ");
  const materialTopic = /\b(aerogel|silica aerogel|thermal insulation|cryogenic|lng|intumescent|fireproof|fire protection|water repellent|waterproofing|concrete|masonry)\b/i;
  const batterySafetyTopic = /\b(?:battery|cell|pack|electric vehicle|ev|lithium)\b.{0,48}\b(?:thermal management|thermal barrier|thermal runaway|heat propagation|fire safety)\b|\b(?:thermal management|thermal barrier|thermal runaway|heat propagation|fire safety)\b.{0,48}\b(?:battery|cell|pack|electric vehicle|ev|lithium)\b/i;
  return materialTopic.test(text) || batterySafetyTopic.test(text);
}
