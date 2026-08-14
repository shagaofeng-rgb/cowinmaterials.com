# Production System Audit - 11 August 2026

## Scope and Evidence

- Production URL: `https://www.cowinmaterials.com`
- Deployment verified Ready: `dpl_FjgqKe9SVdRkByS5x6N7fM9uPAFs`
- Code backup tag: `backup-before-full-system-audit-20260811`
- Database snapshot before changes: `backups/production-system-before-audit-20260811T1024.json` (ignored by Git)
- News-only backup retained from the prior restore: `backups/production-news-before-restore-20260811T1015.json` (ignored by Git)

## Confirmed Healthy

| Area | Evidence | Result |
|---|---|---|
| PostgreSQL connection and permissions | Production connection as `neondb_owner`; read/write privilege checks across the active content, inquiry, News and sitemap tables | Connected and writable |
| Data integrity | `0` duplicate Blog external fingerprints, `0` duplicate News source/date pairs, `0` published Blogs with missing title/body | Passed |
| Query performance | PostgreSQL `EXPLAIN ANALYZE`: Blog list `0.695 ms`, News list `0.089 ms`, inquiry list `0.020 ms` | No observed slow query |
| News data path | API returned `59` published News records; three sampled detail pages returned `200` and contained the API title | Database -> API -> frontend consistent |
| Product pages | Three independently sampled product URLs returned `200`, one H1 and a canonical link | Passed |
| Sitemap and robots | `robots.txt`, sitemap index and four active child sitemaps returned `200`; sitemap smoke checked `91` public URLs with `0` failures | Passed |
| Security boundaries | `/admin/blog` redirected to login with `X-Robots-Tag: noindex`; admin health and cron routes returned `401` without credentials; invalid Webhook key returned `code: 0` | Passed |
| Responsive navigation | Playwright checked the 375px mobile menu: drawer opened, no horizontal overflow, no console errors | Passed |

## Fixed During This Audit

### Blog Webhook Audit and Idempotency Evidence

The Blog already existed at `/blog`, `/blog/[slug]`, `/admin/blog`, `articles`, `article_categories`, and `/api/webhook/send_article`; a second Blog system was not created.

The existing endpoint used a production-only `WEBHOOK_ARTICLE_SIGN` and root-POST proxy for the custom webhook framework. Its gaps were durable delivery evidence and an explicit retryable failure signal. The following safe changes were deployed:

- Added the idempotent migration `database/migrations/20260811-add-blog-webhook-audit.sql` and applied it to production. It only created `blog_webhook_events` plus indexes.
- Added secret-free webhook records for verification, publication, duplicate delivery, rejected payloads and retryable failures.
- Preserved the existing plugin response body (`code` / `msg`) and direct publication behaviour.
- Identified duplicate delivery with the existing external-content fingerprint; a duplicate updates the existing PostgreSQL row rather than inserting another article.
- Database/network failures now return HTTP `503`, which allows a compliant plugin to retry. Validation failures remain non-retryable JSON responses.

Production end-to-end run through the plugin-compatible root URL:

| Check | Evidence | Result |
|---|---|---|
| Root validation | `POST /` with valid key and `class_id=blog` | `200`, `{"code":1,"msg":"验证成功"}`, Blog count unchanged (`2 -> 2`) |
| Real publish | Clearly-labelled QA Blog payload | `200`, `{"code":1,"msg":"发布成功"}`, Blog count `2 -> 3` |
| Duplicate replay | Exact same payload | `200`, same response, count remained `3` |
| Sanitisation | Payload contained an inline script | Script removed before database storage and public rendering |
| Frontend/sitemap | `/blog`, generated detail URL and `/sitemaps/blog-1.xml` | Article present in all three while published |
| Cleanup | Test article status changed to `archived` after validation | No QA article remains public |

The corresponding production audit events are `verification`, `published`, and `idempotent_replay`. No key or body content was written to the audit table.

### Inquiry API Input Handling

An empty JSON request incorrectly reached `request.formData()` and returned `500`. The endpoint now accepts only `multipart/form-data` or URL-encoded form data, returns `415` for unsupported media types and returns `400` for malformed form/attachment input before SMTP is invoked.

Production verification: `POST /api/inquiry` with JSON `{}` returned `415` and `{"error":"Use form data to submit an enquiry."}`. No email was sent.

### Sitemap Documentation

`README.md` and `docs/SITEMAP.md` now match the actual configuration: sitemap maintenance runs every three days and dynamic entries include published Blog and News content.

## Google SEO Task

- Production cron configuration: `/api/cron/sitemap-maintenance` = `30 2 */3 * *` (every three days at 02:30 UTC).
- Production evidence: completed runs on 7 August 2026 02:30 UTC and 10 August 2026 02:30 UTC, both with `urls_failed = 0`.
- There is one sitemap maintenance cron entry; repository and Vercel checks found no GitHub Actions or second Google submission task.
- The task validates sitemap XML, public URL statuses and robots declaration; runs are recorded in `sitemap_runs` and URL states in `sitemap_url_snapshots`.
- Search Console submission is currently disabled in production. No `GOOGLE_SEARCH_CONSOLE_*` credentials or enable flag are configured, and the latest runs correctly record `search_console_status = disabled`. The code uses the official Search Console Sitemaps API only when the owner supplies a service account and enables it; it does not use the retired ping endpoint or the restricted Indexing API.

## Runtime Task Inventory

| Task | Trigger | Frequency | Current evidence |
|---|---|---:|---|
| Email health check | `/api/cron/email-health-check` | 1st day of month, 00:00 UTC | Configured; not invoked in this audit to avoid sending mail |
| Sitemap maintenance / optional Search Console submission | `/api/cron/sitemap-maintenance` | Every 3 days, 02:30 UTC | Last two stored runs completed, 0 URL failures |
| News collection/direct publication | `/api/cron/news-automation` | Daily, 03:15 UTC | Latest job recorded 30 candidates, 2 rejections, 1 direct publication |
| Blog plugin publication | Root POST proxy -> `/api/webhook/send_article` | Plugin-driven; no cron | Live validation, publish and idempotent replay passed |
| Inquiry delivery | `/api/inquiry` | User form submission | Input validation passed; no production inquiry created during this audit |

No duplicate Blog cron, queue worker, GitHub Action or second sitemap submitter was found. The News and Blog paths use different tables and routes, so they do not publish into each other.

## Data Availability and Limits

- Blog: three archived records are retained, including the QA record; there are no public Blog posts after cleanup. Therefore three published Blog samples cannot be drawn without inventing content.
- Inquiries: production contains `0` records, so three real inquiry records are unavailable for comparison. No synthetic inquiries were inserted.
- Analytics: `analytics_events` has `0` records and no GA measurement ID is configured in production. The admin console correctly has no real traffic dataset to display.
- Products: public product content is canonical, version-controlled technical content in `src/lib/data.ts`; the database `products` table currently has `0` records. The public product site is not falsely reading a mock API, but product editing is not yet database-backed CMS functionality.
- The exact external plugin brand/account and its own execution history are not stored in this repository or production database. Its documented webhook contract was tested successfully, but the third-party plugin dashboard cannot be audited without that account access.
- Admin authentication was verified at the access boundary only. The administrator password was not used or exposed during this audit.

## Tests and Performance Samples

| Check | Result |
|---|---|
| `pnpm lint` | Passed |
| `pnpm test:self` | Passed |
| `pnpm test:sitemap` | 8/8 passed |
| `pnpm build` | Passed, including TypeScript |
| Production smoke | 91 sitemap URLs, 0 failures |
| Public response samples | Home 1.19 s cold sample; main content pages 0.41-0.54 s; sitemap 1.23 s cold sample |
| Browser screenshots | Desktop home/products and mobile home/menu captured; no observed horizontal overflow in mobile navigation |

## Modified Files and Rollback

- `database/schema.sql`
- `database/migrations/20260811-add-blog-webhook-audit.sql`
- `src/lib/blog/store.ts`
- `src/app/api/webhook/send_article/route.ts`
- `src/app/api/inquiry/route.ts`
- `scripts/full-site-smoke.mjs`
- `scripts/site-self-check.mjs`
- `README.md`, `docs/SITEMAP.md`, `docs/BLOG-WEBHOOK-INTEGRATION.md`

To roll back application code, redeploy the prior Vercel production deployment or revert commits `6cf6b2b` and `54aa43a`. The added webhook audit table is additive and can safely remain; no production Blog, News, product, inquiry or SEO record was deleted. The pre-change code tag and database snapshot above provide the rollback point.
