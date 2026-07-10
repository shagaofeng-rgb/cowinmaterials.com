import assert from "node:assert/strict";
import crypto from "node:crypto";

function canonicalizeSourceUrl(value) {
  const trackingParams = new Set(["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id", "fbclid", "gclid", "mc_cid", "mc_eid", "ref"]);
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("invalid protocol");
  url.hostname = url.hostname.toLowerCase();
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (trackingParams.has(key.toLowerCase()) || key.toLowerCase().startsWith("utm_")) url.searchParams.delete(key);
  }
  return url.toString();
}

function hashText(value) {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function createSourceFingerprint(candidate) {
  return hashText([candidate.title, candidate.publisher, canonicalizeSourceUrl(candidate.url), candidate.publishedAt.slice(0, 10)].join("|"));
}

function isWithinLookback(publishedAt, fetchedAt, hours = 72) {
  const diff = new Date(fetchedAt).getTime() - new Date(publishedAt).getTime();
  return diff >= 0 && diff <= hours * 60 * 60 * 1000;
}

function isInternalSiteImage(value) {
  if (!value || value.startsWith("/")) return true;
  const url = new URL(value);
  return ["cowinmaterials.com", "www.cowinmaterials.com"].includes(url.hostname.toLowerCase());
}

function slugifyNewsTitle(title) {
  return title.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 86);
}

function stripHtml(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function productRelevance(candidateText, productText) {
  const candidateTokens = new Set(candidateText.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter((token) => token.length > 2));
  const productTokens = new Set(productText.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter((token) => token.length > 2));
  let hits = 0;
  for (const token of productTokens) if (candidateTokens.has(token)) hits += 1;
  return Math.min(1, hits / 12);
}

const candidate = {
  title: "Battery thermal barrier materials gain attention in energy storage safety",
  summary: "Aerogel insulation and EV battery thermal barrier pads are relevant to module-level safety.",
  url: "https://example.com/news/aerogel?utm_source=test&utm_campaign=demo#section",
  publisher: "Example Materials News",
  publishedAt: "2026-07-08T01:00:00.000Z",
  fetchedAt: "2026-07-08T10:00:00.000Z",
  keywords: ["aerogel", "battery", "thermal barrier"],
};

assert.equal(canonicalizeSourceUrl(candidate.url), "https://example.com/news/aerogel");
assert.equal(isWithinLookback(candidate.publishedAt, candidate.fetchedAt, 72), true);
assert.equal(isWithinLookback("2026-07-01T00:00:00.000Z", candidate.fetchedAt, 72), false);
assert.equal(isInternalSiteImage("/images/fire-test-lab.jpg"), true);
assert.equal(isInternalSiteImage("https://www.cowinmaterials.com/images/fire-test-lab.jpg"), true);
assert.equal(isInternalSiteImage("https://example.com/cover.jpg"), false);
assert.equal(slugifyNewsTitle("Aerogel & Battery Thermal Barriers!"), "aerogel-and-battery-thermal-barriers");
assert.equal(stripHtml("<p>Hello <strong>world</strong> &#8217; &amp;</p>"), "Hello world ’ &");
assert.equal(createSourceFingerprint(candidate).length, 64);
assert.ok(productRelevance(candidate.title + " " + candidate.summary, "Battery Aerogel Thermal Barrier Pads EV energy storage thermal barrier") > 0.12);

console.log("News automation rule checks passed.");
