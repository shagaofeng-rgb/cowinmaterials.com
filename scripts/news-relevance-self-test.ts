import assert from "node:assert/strict";
import test from "node:test";
import { hasDirectMaterialRelevance } from "../src/lib/news/relevance.ts";

test("accepts direct material and battery-safety news", () => {
  assert.equal(hasDirectMaterialRelevance({ title: "Aerogel insulation selected for LNG pipe trials", summary: "" }), true);
  assert.equal(hasDirectMaterialRelevance({ title: "Battery thermal runaway mitigation study released", summary: "" }), true);
  assert.equal(hasDirectMaterialRelevance({ title: "Concrete waterproofing update", summary: "" }), true);
});

test("rejects broad energy-market news", () => {
  assert.equal(hasDirectMaterialRelevance({ title: "Battery storage financing closes for a new grid project", summary: "" }), false);
  assert.equal(hasDirectMaterialRelevance({ title: "Solar generation expands in regional markets", summary: "" }), false);
});
