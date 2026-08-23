import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const requiredPaths = ["src/app/resources/page.tsx", "src/app/locations/page.tsx", "src/app/quality/page.tsx", "src/app/request-quote/page.tsx", "src/app/thank-you/page.tsx", "src/app/news/page.tsx", "src/app/news/[slug]/page.tsx", "src/app/news/rss.xml/route.ts", "src/app/api/news/route.ts", "src/app/api/cron/news-automation/route.ts", "src/lib/news/automation.ts", "src/lib/news/store.ts", "src/app/api/webhook/send_article/route.ts", "src/app/api/analytics/event/route.ts", "src/app/api/cron/sitemap-maintenance/route.ts", "src/app/sitemap.xml/route.ts", "src/app/sitemaps/[file]/route.ts", "src/app/admin/products/[slug]/page.tsx", "src/app/admin/blog/[id]/page.tsx", "src/app/admin/inquiries/[id]/page.tsx", "src/components/admin-sync-status.tsx", "src/components/whatsapp-float.tsx", "database/migrations/20260811-add-blog-webhook-audit.sql", "database/migrations/20260823-add-whatsapp-click-analytics.sql", "database/schema.sql", "vercel.json"];
for (const path of requiredPaths) assert.ok(existsSync(join(root, path)), `Missing required path: ${path}`);

const data = readFileSync(join(root, "src/lib/data.ts"), "utf8");
for (const item of ["Quzhou Qiying Import & Export Co., Ltd.", "davidsha@cowinmaterials.com", "+86 176 0125 2505", "officeAddress", "aerogel-powders-granules", "fireproof-waterproof-solutions"]) assert.ok(data.includes(item), `Missing official site datum: ${item}`);
for (const item of ["label: \"Company\"", "href: \"/about\"", "href: \"/contact\"", "href: \"/news\"", "href: \"/blog\""]) assert.ok(data.includes(item), `Missing Company navigation route: ${item}`);

const source = readFileSync(join(root, "next.config.ts"), "utf8");
assert.ok(source.includes("/products/aerogel-powder-and-slurry"), "Missing legacy product redirect.");
assert.ok(source.includes("/resources"), "Missing technical resources redirect.");

const cron = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
assert.equal(cron.crons.find((entry) => entry.path === "/api/cron/news-automation")?.schedule, "15 3 * * *", "News cron must run daily");
assert.equal(cron.crons.some((entry) => /blog/i.test(entry.path)), false, "Blog automation cron must not exist");
assert.ok(cron.crons.some((entry) => entry.path === "/api/cron/email-health-check"), "Missing email health cron");
assert.equal(cron.crons.find((entry) => entry.path === "/api/cron/sitemap-maintenance")?.schedule, "30 2 */3 * *", "Sitemap maintenance must run every three days");

const newsAutomation = readFileSync(join(root, "src/lib/news/automation.ts"), "utf8");
assert.match(newsAutomation, /'published'/, "News automation must publish directly after automatic checks");
assert.match(newsAutomation, /sourceAlreadyUsed/, "News automation must deduplicate source records");

const llms = readFileSync(join(root, "src/app/llms.txt/route.ts"), "utf8");
assert.match(llms, /\/news/);
assert.ok(existsSync(join(root, "src/app/blog/page.tsx")), "Missing public Blog listing page");
assert.ok(existsSync(join(root, "src/app/blog/[slug]/page.tsx")), "Missing public Blog detail page");
const webhook = readFileSync(join(root, "src/app/api/webhook/send_article/route.ts"), "utf8");
assert.ok(webhook.includes("WEBHOOK_ARTICLE_SIGN"), "Webhook must use the server-only WEBHOOK_ARTICLE_SIGN variable");
assert.ok(webhook.includes("logBlogWebhookEvent"), "Webhook must persist publication outcomes without exposing its API key");
assert.ok(webhook.includes("idempotentReplay"), "Webhook must identify duplicate delivery replays");

const adminData = readFileSync(join(root, "src/lib/admin-data.ts"), "utf8");
assert.ok(adminData.includes("PostgreSQL 实时查询"), "Admin lists must identify their real database source");
assert.ok(adminData.includes("Git 版本化产品目录"), "Products must not pretend to be database-managed");
assert.ok(adminData.includes("sync_jobs"), "Sync dashboard must read real job records");
const adminBlog = readFileSync(join(root, "src/lib/blog/store.ts"), "utf8");
assert.ok(adminBlog.includes("insert into audit_logs"), "Blog changes must append an audit log");
assert.ok(adminBlog.includes("sanitizeContent(input.content)"), "Blog updates must sanitize content server-side");
const inquiryStore = readFileSync(join(root, "src/lib/database.ts"), "utf8");
assert.ok(inquiryStore.includes("updateAdminInquiryStatus"), "Inquiry status must be updated server-side");
assert.ok(inquiryStore.includes("source: \"website_form\""), "Website form records must append a non-PII audit event");
assert.ok(inquiryStore.includes("recordAnalyticsEvent"), "WhatsApp analytics events must be written through the database layer");
const whatsappRoute = readFileSync(join(root, "src/app/api/analytics/event/route.ts"), "utf8");
assert.ok(whatsappRoute.includes("whatsapp_click"), "WhatsApp analytics API must accept only the named contact event");
assert.ok(whatsappRoute.includes("Invalid request origin"), "WhatsApp analytics API must validate request origin");
const mail = readFileSync(join(root, "src/lib/mail.ts"), "utf8");
assert.ok(mail.includes("getInquiryCcRecipients"), "Inquiry notifications must support a configured CC recipient");
assert.match(mail, /cc:\s*getInquiryCcRecipients\(\)/, "Inquiry notifications must pass configured CC recipients to SMTP");
const adminProxy = readFileSync(join(root, "src/proxy.ts"), "utf8");
assert.ok(adminProxy.includes("x-pathname"), "Protected admin details must preserve the post-login return path");
assert.ok(adminProxy.includes("/admin/:path*"), "Admin return-path support must cover nested routes");

const publicFiles = ["src/app/page.tsx", "src/app/resources/page.tsx", "src/app/search/page.tsx", "src/components/header.tsx", "src/components/footer.tsx"];
for (const file of publicFiles) {
  const body = readFileSync(join(root, file), "utf8").toLowerCase();
  for (const phrase of ["瑞太久合", "上海瑞太", "alibaba.com", "lorem ipsum"]) assert.equal(body.includes(phrase), false, `Forbidden public phrase ${phrase} in ${file}`);
}
console.log("Site self-check passed.");
