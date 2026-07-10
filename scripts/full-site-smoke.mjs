import assert from "node:assert/strict";

const siteUrl = (process.env.SITE_URL || "http://127.0.0.1:3010").replace(/\/$/, "");

async function request(path, init) {
  const response = await fetch(new URL(path, siteUrl), { redirect: "manual", signal: AbortSignal.timeout(20_000), ...init });
  return {
    path,
    status: response.status,
    type: response.headers.get("content-type") || "",
    body: init?.method === "HEAD" ? "" : await response.text(),
  };
}

function locations(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1].replace(/&amp;/g, "&")).pathname);
}

const index = await request("/sitemap.xml");
assert.equal(index.status, 200);
assert.match(index.type, /application\/xml/);
assert.match(index.body, /<sitemapindex/);

const childPaths = locations(index.body);
assert.ok(childPaths.length >= 3, "Sitemap index should contain content-specific child files.");

const children = [];
const publicPaths = [];
for (const path of childPaths) {
  const child = await request(path);
  children.push({ path, status: child.status, type: child.type });
  assert.equal(child.status, 200, `${path} should return HTTP 200.`);
  assert.match(child.type, /application\/xml/);
  assert.ok(child.body.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.match(child.body, /<urlset/);
  publicPaths.push(...locations(child.body));
}

const urlChecks = [];
const queue = [...new Set(publicPaths)];
await Promise.all(Array.from({ length: Math.min(8, queue.length) }, async () => {
  while (queue.length) {
    const path = queue.shift();
    if (!path) break;
    try {
      const result = await request(path, { method: "HEAD" });
      urlChecks.push({ path, status: result.status });
    } catch {
      urlChecks.push({ path, status: 0 });
    }
  }
}));

const urlFailures = urlChecks.filter((item) => item.status !== 200);
assert.deepEqual(urlFailures, [], `Sitemap contains unavailable URLs: ${JSON.stringify(urlFailures)}`);

const [robots, rss, llms, home, products, news, search, newsApi, adminHealth, sitemapCron] = await Promise.all([
  request("/robots.txt"),
  request("/news/rss.xml"),
  request("/llms.txt"),
  request("/"),
  request("/products"),
  request("/news"),
  request("/search?q=aerogel"),
  request("/api/news"),
  request("/api/admin/health"),
  request("/api/cron/sitemap-maintenance"),
]);

assert.match(robots.body, /Sitemap: https:\/\/www\.cowinmaterials\.com\/sitemap\.xml/);
assert.match(robots.body, /Disallow: \/admin/);
assert.match(rss.type, /application\/rss\+xml/);
assert.match(rss.body, /<item>/);
assert.match(llms.body, /\/products\//);
assert.match(llms.body, /\/news\/rss\.xml/);

for (const page of [home, products, news]) {
  assert.match(page.body, /<html[^>]*\slang="en"/);
  assert.equal((page.body.match(/<h1/g) || []).length, 1, `${page.path} should have exactly one H1.`);
  assert.match(page.body, /rel="canonical"/);
}
assert.match(search.body, /<meta name="robots" content="noindex, nofollow"/);

const newsPayload = JSON.parse(newsApi.body);
assert.ok(newsPayload.total >= 3, "News API should expose stable published technical content.");
const firstNewsSlug = newsPayload.articles?.[0]?.slug;
assert.ok(firstNewsSlug, "News API should include a published article slug.");
assert.ok(news.body.includes(`/news/${firstNewsSlug}`), "News page and News API should expose the same published article.");
assert.ok(publicPaths.includes(`/news/${firstNewsSlug}`), "Sitemap and News API should expose the same published article.");
const newsDetail = await request(`/api/news/${firstNewsSlug}`);
assert.equal(newsDetail.status, 200);
assert.equal(adminHealth.status, 401);
assert.equal(sitemapCron.status, 401);

console.log(JSON.stringify({
  ok: true,
  siteUrl,
  sitemapFiles: children.length,
  publicUrls: urlChecks.length,
  urlFailures,
  robots: robots.status,
  rss: rss.status,
  llms: llms.status,
  newsSync: { api: newsApi.status, detail: newsDetail.status, firstSlug: firstNewsSlug },
  protectedRoutes: { adminHealth: adminHealth.status, sitemapCron: sitemapCron.status },
  corePages: [home, products, news, search].map((page) => ({ path: page.path, status: page.status })),
}, null, 2));
