import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredPaths = [
  "src/app/news/page.tsx",
  "src/app/news/[slug]/page.tsx",
  "src/app/news/rss.xml/route.ts",
  "src/app/search/page.tsx",
  "src/app/api/cron/news-automation/route.ts",
  "src/app/api/cron/sitemap-maintenance/route.ts",
  "src/app/sitemap.xml/route.ts",
  "src/app/sitemaps/[file]/route.ts",
  "src/app/api/admin/news/run/route.ts",
  "database/schema.sql",
  "vercel.json",
];

for (const path of requiredPaths) {
  assert.ok(existsSync(join(root, path)), `Missing required path: ${path}`);
}

const schema = readFileSync(join(root, "database/schema.sql"), "utf8");
for (const table of ["news_articles", "news_products", "news_sources", "news_jobs", "news_publication_audits"]) {
  assert.ok(schema.includes(`create table if not exists ${table}`), `Missing table: ${table}`);
}

const data = readFileSync(join(root, "src/lib/data.ts"), "utf8");
for (const item of ["/news", "/search", "Quzhou Qiying Import & Export Co., Ltd.", "davidsha@cowinmaterials.com", "+86 176 0125 2505"]) {
  assert.ok(data.includes(item), `Missing official site datum: ${item}`);
}

const llms = readFileSync(join(root, "src/app/llms.txt/route.ts"), "utf8");
assert.ok(llms.includes("/news/rss.xml"), "llms.txt route should mention the public RSS feed");

const cron = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
assert.ok(cron.crons.some((entry) => entry.path === "/api/cron/news-automation"), "Missing news cron");
assert.ok(cron.crons.some((entry) => entry.path === "/api/cron/email-health-check"), "Missing email health cron");
assert.ok(cron.crons.some((entry) => entry.path === "/api/cron/sitemap-maintenance"), "Missing sitemap maintenance cron");

const robots = readFileSync(join(root, "src/app/robots.ts"), "utf8");
assert.ok(robots.includes("/sitemap.xml"), "robots.txt must declare the sitemap index");

const forbiddenPublicPhrases = ["瑞太久合", "上海瑞太", "测试文字", "占位内容", "lorem ipsum"];
const publicFiles = [
  "src/app/page.tsx",
  "src/app/news/page.tsx",
  "src/app/search/page.tsx",
  "src/components/header.tsx",
  "src/components/footer.tsx",
];

for (const file of publicFiles) {
  const body = readFileSync(join(root, file), "utf8").toLowerCase();
  for (const phrase of forbiddenPublicPhrases) {
    assert.equal(body.includes(phrase.toLowerCase()), false, `Forbidden public phrase "${phrase}" in ${file}`);
  }
}

console.log("Site self-check passed.");
