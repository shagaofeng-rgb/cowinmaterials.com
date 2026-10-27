import assert from "node:assert/strict";
import test from "node:test";
import { getBlogTechnicalPaths } from "../src/lib/blog/related.ts";
import { normalizeBlogLinkHref } from "../src/lib/blog/links.ts";
import { sanitizeBlogContent } from "../src/lib/blog/content.ts";

test("maps industrial coating articles to real product and application paths", () => {
  const paths = getBlogTechnicalPaths({
    title: "High-temperature insulation coating selection for industrial valves",
    contentHtml: "<p>Industrial pipe and equipment insulation requires a documented coating system.</p>",
  });
  assert.ok(paths.some((path) => path.href.includes("industrial-aerogel-insulation-coating")));
  assert.ok(paths.some((path) => path.href === "/applications/industrial-pipe-equipment-insulation"));
  assert.ok(paths.some((path) => path.href === "/resources"));
});

test("maps battery articles to the battery thermal barrier route", () => {
  const paths = getBlogTechnicalPaths({
    title: "Battery thermal runaway evaluation for ESS enclosures",
    contentHtml: "<p>Battery module conditions affect thermal barrier selection.</p>",
  });
  assert.ok(paths.some((path) => path.href.includes("battery-thermal-pads")));
  assert.ok(paths.some((path) => path.href === "/applications/ev-ess-thermal-barriers"));
});

test("repairs known product and contact links from imported Blog content", () => {
  assert.equal(normalizeBlogLinkHref("/products/heat-insulation-paint"), "/products/aerogel-slurries-coatings-paste");
  assert.equal(normalizeBlogLinkHref("www.cowinmaterials.com/contact-us"), "/contact");
  assert.equal(normalizeBlogLinkHref("%5Bwww.cowinmaterials.com/contact-us%5D"), "/contact");
  assert.equal(normalizeBlogLinkHref("[www.cowinmaterials.com](https:/www.cowinmaterials.com)"), "/");
  assert.equal(normalizeBlogLinkHref("https://cowinmaterials.com/products"), "/products");
});

test("does not create links to unverified internal pages", () => {
  assert.equal(normalizeBlogLinkHref("/custom-formula-oem-customization"), null);
  assert.equal(normalizeBlogLinkHref("%5Bwww.cowinmaterials.com/custom-formula-oem-customization%5D"), null);
  assert.equal(normalizeBlogLinkHref("javascript:alert(1)"), null);
  assert.equal(normalizeBlogLinkHref("https://example.com/source"), "https://example.com/source");
});

test("renders broken Blog links as valid routes or unlinked text", () => {
  const input = '<p><a href="www.cowinmaterials.com/contact-us">Contact</a> <a href="/custom-formula-oem-customization">Custom formulation</a> <a href="https://example.com/source">Source</a></p>';
  const repaired = sanitizeBlogContent(input);
  assert.match(repaired, /<a href="\/contact">Contact<\/a>/);
  assert.match(repaired, /<span>Custom formulation<\/span>/);
  assert.match(repaired, /href="https:\/\/example\.com\/source"/);
  assert.equal(sanitizeBlogContent(repaired), repaired);
});

test("keeps the original fingerprint input stable for plugin retries", () => {
  const input = '<p><a href="www.cowinmaterials.com/contact-us">Contact</a></p>';
  assert.equal(
    sanitizeBlogContent(input, false),
    '<p><a href="www.cowinmaterials.com/contact-us" rel="nofollow noopener noreferrer" target="_blank">Contact</a></p>',
  );
});
