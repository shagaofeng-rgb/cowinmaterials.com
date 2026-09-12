import assert from "node:assert/strict";
import test from "node:test";
import { technicalEvidenceSeed, technicalNewsTopicSeed } from "../src/lib/news/technical-evidence.ts";

test("technical News topics only reference public evidence with a product mapping", () => {
  const evidenceById = new Map(technicalEvidenceSeed.map((item) => [item.id, item]));
  for (const topic of technicalNewsTopicSeed) {
    assert.ok(topic.evidenceIds.length > 0, `${topic.id} needs evidence`);
    for (const id of topic.evidenceIds) {
      const evidence = evidenceById.get(id);
      assert.ok(evidence, `${topic.id} references an unknown evidence record`);
      assert.notEqual(evidence?.evidenceLevel, "context_only", `${topic.id} cannot publish context-only data`);
      assert.equal(evidence?.productSlug, topic.primaryProductSlug, `${topic.id} must keep evidence with its product mapping`);
      assert.ok(evidence?.sourceDocument && evidence.sourceLocator, `${id} needs a traceable source locator`);
      assert.ok(evidence?.restrictionNote, `${id} needs a public-use limitation`);
    }
  }
});

test("technical evidence does not expose an unsupported fire rating", () => {
  const fireEvidence = technicalEvidenceSeed.find((item) => item.id === "cw-fire-coating-scope");
  assert.ok(fireEvidence?.restrictionNote?.toLowerCase().includes("fire-resistance time rating"));
  assert.ok(!/ul94|2-hour fire rating|certified/i.test(fireEvidence?.valueText || ""));
});
