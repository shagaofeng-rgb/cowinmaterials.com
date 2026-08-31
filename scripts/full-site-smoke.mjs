import assert from "node:assert/strict";

const siteUrl = (process.env.SITE_URL || "http://127.0.0.1:3010").replace(/\/$/, "");

async function request(path, init) {
  let lastError;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(new URL(path, siteUrl), { redirect: "manual", signal: AbortSignal.timeout(20_000), ...init });
      return { path, status: response.status, type: response.headers.get("content-type") || "", body: init?.method === "HEAD" ? "" : await response.text() };
    } catch (error) {
      lastError = error;
      if (attempt < 4) await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw new Error(`Request failed after retries: ${path}`, { cause: lastError });
}

function locations(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1].replace(/&amp;/g, "&")).pathname);
}

const index = await request("/sitemap.xml");
assert.equal(index.status, 200);
assert.match(index.type, /application\/xml/);
const childPaths = locations(index.body);
assert.ok(childPaths.length >= 3, "Sitemap index should contain content-specific child files.");

const publicPaths = [];
for (const path of childPaths) {
  const child = await request(path);
  assert.equal(child.status, 200, `${path} should return HTTP 200.`);
  assert.match(child.type, /application\/xml/);
  publicPaths.push(...locations(child.body));
}

const uniquePublicPaths = [...new Set(publicPaths)];
const urlChecks = [];
for (let index = 0; index < uniquePublicPaths.length; index += 4) {
  const batch = uniquePublicPaths.slice(index, index + 4);
  urlChecks.push(...await Promise.all(batch.map(async (path) => ({ path, status: (await request(path, { method: "HEAD" })).status }))));
  if (index + 4 < uniquePublicPaths.length) await new Promise((resolve) => setTimeout(resolve, 100));
}
const urlFailures = urlChecks.filter((item) => item.status !== 200);
assert.deepEqual(urlFailures, [], `Sitemap contains unavailable URLs: ${JSON.stringify(urlFailures)}`);
assert.ok(publicPaths.includes("/news"), "News index must be present in the sitemap.");

const [robots, llms, home, products, resources, locationsPage, quote, search, news, newsRss, adminHealth, sitemapCron, newsCron, blogWebhook, invalidInquiry, botAnalytics] = await Promise.all([
  request("/robots.txt"), request("/llms.txt"), request("/"), request("/products"), request("/resources"), request("/locations"), request("/request-quote"), request("/search?q=aerogel"), request("/news"), request("/news/rss.xml"), request("/api/admin/health"), request("/api/cron/sitemap-maintenance"), request("/api/cron/news-automation"), request("/api/webhook/send_article"), request("/api/inquiry", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }), request("/api/analytics/event", { method: "POST", headers: { "content-type": "application/json", "user-agent": "HeadlessChrome Cowin smoke audit" }, body: JSON.stringify({ event_id: "smoke-headless-analytics-event", event_name: "page_view", page_path: "/" }) }),
]);

assert.match(robots.body, /Sitemap: https:\/\/www\.cowinmaterials\.com\/sitemap\.xml/);
assert.match(llms.body, /\/resources/);
assert.match(llms.body, /\/news/);
for (const page of [home, products, resources, locationsPage, quote]) {
  assert.match(page.body, /<html[^>]*\slang="en"/);
  assert.equal((page.body.match(/<h1/g) || []).length, 1, `${page.path} should have exactly one H1.`);
  assert.match(page.body, /rel="canonical"/);
}
assert.match(search.body, /<meta name="robots" content="noindex, nofollow"/);
assert.equal(news.status, 200);
assert.equal(newsRss.status, 200);
assert.match(newsRss.type, /application\/rss\+xml/);
assert.equal(adminHealth.status, 401);
assert.equal(sitemapCron.status, 401);
assert.equal(newsCron.status, 401);
assert.equal(blogWebhook.status, 405, "Blog webhook must reject unsupported GET requests without writing an audit record.");
assert.equal(invalidInquiry.status, 415, "Inquiry endpoint must reject an unsupported content type without invoking email delivery.");
assert.deepEqual(JSON.parse(botAnalytics.body), { ok: true, ignored: true }, "Automated smoke traffic must not enter production analytics.");

console.log(JSON.stringify({ ok: true, siteUrl, sitemapFiles: childPaths.length, publicUrls: urlChecks.length, urlFailures, news: news.status, protectedRoutes: { adminHealth: adminHealth.status, sitemapCron: sitemapCron.status, newsCron: newsCron.status, blogWebhook: blogWebhook.status }, corePages: [home, products, resources, locationsPage, quote, search, news].map((page) => ({ path: page.path, status: page.status })) }, null, 2));
