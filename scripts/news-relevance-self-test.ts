import assert from "node:assert/strict";
import test from "node:test";
import { hasDirectMaterialRelevance } from "../src/lib/news/relevance.ts";
import { buildNewsSeoTitle } from "../src/lib/news/seo-title.ts";

test("accepts direct material and battery-safety news", () => {
  assert.equal(hasDirectMaterialRelevance({ title: "Aerogel insulation selected for LNG pipe trials", summary: "" }), true);
  assert.equal(hasDirectMaterialRelevance({ title: "Battery thermal runaway mitigation study released", summary: "" }), true);
  assert.equal(hasDirectMaterialRelevance({ title: "BESS safety review released", summary: "", keywords: ["fire safety"] }), true);
  assert.equal(hasDirectMaterialRelevance({ title: "Concrete waterproofing update", summary: "" }), true);
});

test("rejects broad energy-market news", () => {
  assert.equal(hasDirectMaterialRelevance({ title: "Battery storage financing closes for a new grid project", summary: "" }), false);
  assert.equal(hasDirectMaterialRelevance({ title: "Carbon fiber recycling creates a lightweight aerogel", summary: "" }), false);
  assert.equal(hasDirectMaterialRelevance({ title: "Solar generation expands in regional markets", summary: "" }), false);
});

test("builds concise News SEO titles without cutting a word", () => {
  const title = buildNewsSeoTitle("A very long battery thermal safety engineering update for international energy storage projects");
  assert.ok(title.length <= 65);
  assert.match(title, / \| Cowin Materials News$/);
  assert.equal(title.includes("enginee |"), false);
  assert.equal(buildNewsSeoTitle("Battery safety, misinformation, and a very long market update").includes(", |"), false);
});
