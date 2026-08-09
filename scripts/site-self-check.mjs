import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredPaths = ["src/app/resources/page.tsx", "src/app/locations/page.tsx", "src/app/quality/page.tsx", "src/app/request-quote/page.tsx", "src/app/thank-you/page.tsx", "src/app/news/[[...slug]]/route.ts", "src/app/api/webhook/send_article/route.ts", "src/app/api/cron/sitemap-maintenance/route.ts", "src/app/sitemap.xml/route.ts", "src/app/sitemaps/[file]/route.ts", "database/schema.sql", "vercel.json"];
for (const path of requiredPaths) assert.ok(existsSync(join(root, path)), `Missing required path: ${path}`);

const data = readFileSync(join(root, "src/lib/data.ts"), "utf8");
for (const item of ["Quzhou Qiying Import & Export Co., Ltd.", "davidsha@cowinmaterials.com", "+86 176 0125 2505", "manufacturingFacilityAddress", "aerogel-powders-granules", "fireproof-waterproof-solutions"]) assert.ok(data.includes(item), `Missing official site datum: ${item}`);

const source = readFileSync(join(root, "next.config.ts"), "utf8");
assert.ok(source.includes("/products/aerogel-powder-and-slurry"), "Missing legacy product redirect.");
assert.ok(source.includes("/resources"), "Missing technical resources redirect.");

const cron = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
assert.equal(cron.crons.some((entry) => /news/i.test(entry.path)), false, "News cron must not exist");
assert.equal(cron.crons.some((entry) => /blog/i.test(entry.path)), false, "Blog automation cron must not exist");
assert.ok(cron.crons.some((entry) => entry.path === "/api/cron/email-health-check"), "Missing email health cron");
assert.equal(cron.crons.find((entry) => entry.path === "/api/cron/sitemap-maintenance")?.schedule, "30 2 */3 * *", "Sitemap maintenance must run every three days");

for (const removed of ["src/app/news/page.tsx", "src/app/news/[slug]/page.tsx", "src/app/news/rss.xml/route.ts", "src/app/api/news/route.ts", "src/app/api/cron/news-automation/route.ts", "src/lib/news/store.ts"]) assert.equal(existsSync(join(root, removed)), false, `Retired News implementation remains: ${removed}`);

const llms = readFileSync(join(root, "src/app/llms.txt/route.ts"), "utf8");
assert.doesNotMatch(llms, /\/news/);
const webhook = readFileSync(join(root, "src/app/api/webhook/send_article/route.ts"), "utf8");
assert.ok(webhook.includes("WEBHOOK_ARTICLE_SIGN"), "Webhook must use the server-only WEBHOOK_ARTICLE_SIGN variable");
const publicFiles = ["src/app/page.tsx", "src/app/resources/page.tsx", "src/app/search/page.tsx", "src/components/header.tsx", "src/components/footer.tsx"];
for (const file of publicFiles) {
  const body = readFileSync(join(root, file), "utf8").toLowerCase();
  for (const phrase of ["瑞太久合", "上海瑞太", "alibaba.com", "lorem ipsum"]) assert.equal(body.includes(phrase), false, `Forbidden public phrase ${phrase} in ${file}`);
}
console.log("Site self-check passed.");
