import assert from "node:assert/strict";
import test from "node:test";
import { splitArticleSections } from "../src/lib/article-sections.ts";
import { applicationPages, productFamilies, products, productTechnicalProfiles } from "../src/lib/data.ts";
import { applicationDetailVisuals, categoryPresentations, productPresentations, quoteHref } from "../src/lib/interior-content.ts";

test("interior templates cover the existing catalog and preserve every product fact", () => {
  for (const family of productFamilies) assert.ok(categoryPresentations[family.slug], family.slug);
  for (const application of applicationPages) assert.ok(applicationDetailVisuals[application.slug], application.slug);
  for (const { slug } of products) {
    const item = productPresentations[slug];
    const { facts } = productTechnicalProfiles[slug];
    assert.ok(item, slug);
    assert.ok(item.quickFacts.length <= 3, slug);
    for (const { index } of item.quickFacts) assert.ok(facts[index], slug);
    const indexes = item.groups?.flatMap((group) => group.facts) ?? facts.map((_, index) => index);
    assert.deepEqual([...indexes, ...(item.handlingFacts ?? [])].sort((a, b) => a - b), facts.map((_, index) => index), slug);
  }
});

test("article lead and reserved source sections cannot duplicate fragment identifiers", () => {
  const sections = splitArticleSections("<p>Intro</p><h2>Overview</h2><p>Body</p><h2>Source</h2><p>Evidence</p>", ["source"]);
  assert.deepEqual(sections.map(({ id }) => id), ["overview", "overview-2", "source-2"]);
  assert.deepEqual(sections.map(({ html }) => html), ["<p>Intro</p>", "<p>Body</p>", "<p>Evidence</p>"]);
});

test("quote links carry the exact grade context as encoded form values", () => {
  const url = new URL(quoteHref("Request Technical Data", { product: "Grade A / B", application: "EV & ESS" }), "https://example.com");
  assert.equal(url.pathname, "/request-quote");
  assert.equal(url.searchParams.get("request"), "Request Technical Data");
  assert.equal(url.searchParams.get("product"), "Grade A / B");
  assert.equal(url.searchParams.get("application"), "EV & ESS");
});
