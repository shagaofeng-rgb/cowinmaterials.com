# Cowin Materials Full-Site Audit

Audit date: 2026-08-06 (Asia/Shanghai)  
Production site: https://www.cowinmaterials.com  
Audited release: `46431a5`

## Executive status

The production deployment is online and the durable public surface passed an end-to-end smoke test: 29/29 sitemap URLs returned HTTP 200, protected routes returned 401 without credentials, the News API and a stable News detail page returned 200, and robots, sitemap, RSS (`/news/rss.xml`) and `llms.txt` were valid.

Three architecture/credential limitations remain and are not classified as healthy: no production database is configured; Google Search Console credentials are absent, so active submission is disabled; and Vercel serverless does not expose host CPU, disk, process or OS-level backup metrics.

## Backup and rollback

- Pre-change backup: `/Users/apple/Documents/材料/site-audit-backups/2026-08-06-pre-audit`
- Backup contents: configuration, environment snapshot, public assets, baseline logs, cron responses and performance samples. The environment backup is sensitive and is intentionally outside Git.
- Git recovery tag: `backup/pre-full-audit-20260806` -> `7ca4b2b`
- Rollback: redeploy the tagged commit through Vercel. Restore environment variables from the protected backup only through Vercel settings; never commit them.
- Database dump: not applicable because `DATABASE_URL` is absent and no production database exists.

## Runtime inventory

| Component | Trigger/frequency | Input/output | Verified state |
|---|---|---|---|
| Next.js 16.3 application | HTTPS request | Public/admin HTML and API responses | Ready on Vercel |
| News automation | Vercel cron `0 1,7,13,19 * * *` | External RSS -> filtered live News response | HTTP 200; 12 collected/published in audit run |
| Sitemap maintenance | Vercel cron `30 2 */3 * *` | Route manifest -> sitemap validation and optional GSC submission | HTTP 200; 29 URLs; every 3 days |
| Email health check | Vercel cron `0 0 1 * *` | SMTP health message -> company mailbox | Historical production HTTP 200 on 2026-08-01 |
| Inquiry API | User POST | Validated form -> SMTP email | Production marked QA submission HTTP 200 |
| Admin API | Authenticated request | Runtime health and read-only catalog view | Unauthorized request correctly returns 401 |
| Blog | Manual historical route only | `/blog` -> permanent redirect to `/news` | No cron, worker, API, queue or auto-publish trigger found |
| Cache/CDN | Vercel/Next runtime | Static and dynamic response caching | No external Redis/cache service configured |
| Database/queue/webhook | None configured | None | Not present; see limitations |

No duplicate production cron entries, queue consumers, webhook loops or overlapping Blog publisher were found. Two deployments of the same commit occurred during release (Git integration and CLI), both reached Ready; Vercel cron configuration belongs to the active project and was not duplicated.

## Confirmed normal

- Production deployment is Ready; `www` returns 200 and the apex returns 308 to `https://www.cowinmaterials.com/`.
- Full smoke test: 29 public URLs, 0 failures; robots 200, sitemap 200, RSS 200, `llms.txt` 200.
- Desktop QA at 1440x1000 and mobile QA at 390x844 covered Home, Products, product detail, Applications, News, Contact, Search, Admin Login and 404. No horizontal overflow, broken images, console errors or unresponsive mobile navigation were observed.
- Public pages have one H1, descriptions, canonical URLs and JSON-LD. The 404 is noindex with a correct title. Live non-durable RSS articles are noindex; stable authored articles remain indexable.
- Invalid inquiry input returns 400. Unauthenticated admin and cron access returns 401. The authorized production inquiry test returned 200 and sent a clearly marked internal QA email.
- Production logs after deployment contain structured successful News and Sitemap records. No HTTP 500 was found in the post-deployment 30-minute window.
- `pnpm audit --prod` reports no known vulnerabilities. Lint, TypeScript, production build, self-check, News tests and 8 sitemap tests passed.

## Fixed

| Problem/root cause | Impact | Repair and evidence |
|---|---|---|
| Sitemap ran daily | Excessive active-check frequency | Changed Vercel cron to `30 2 */3 * *`; self-check now asserts the exact schedule |
| Ephemeral RSS stories entered sitemap without durable storage | A feed item could disappear and cause sitemap validation failure | Sitemap now includes only stable authored News when no DB exists; production validation passed 29/29 |
| Live RSS articles looked permanently indexable | Search engines could index unstable URLs | Added noindex/nofollow for live fallback articles |
| Admin implied durable data when none existed | Misleading operational status | Admin now states RSS fallback/no-database mode and removes fabricated update timestamps |
| Cron logs lacked consistent machine-readable evidence | Weak diagnosis/audit trail | Added structured News log and Google submission status/message fields |
| 404 inherited generic metadata | Incorrect search/browser metadata | Added specific title, description and noindex metadata |
| Dependency vulnerabilities | 14 production advisories (7 high, 7 moderate) | Upgraded Next.js and related lockfile; production audit now reports 0 |
| Oversized test images | Unnecessary transfer/storage | Reduced public images from about 4.8 MB to 4.3 MB; two files reduced by about 506 KB |

## News and Blog evidence

- News production execution at `2026-08-06T02:00:25.117Z`: HTTP 200, `collected=12`, `rejected=0`, `published=12`.
- Scheduled News requests were also observed four times daily over the available seven-day Vercel log window.
- Without a database, “published” means the filtered RSS content is available through the live fallback. It does not create a durable database record or approval history.
- Blog auto-publishing is absent: repository search found no Blog cron, trigger, route, worker, queue or third-party publisher; a seven-day production log query returned zero Blog automation records. Existing access is preserved through the permanent `/blog` -> `/news` redirect.

## SEO evidence

- Sitemap maintenance at `2026-08-06T02:00:14.517Z`: HTTP 200, 4 sitemap files, 29 successful URLs, 0 failures, valid robots declaration.
- The production schedule is every three days. There is one Sitemap cron entry and no duplicate submitter.
- `searchConsoleStatus=disabled` and `searchConsoleSubmitted=false`: Google credentials/properties are not configured. Sitemap generation, canonical tags, robots, structured data and indexability checks remain operational.

## Performance samples

Single-request production samples include network variance and are not laboratory Core Web Vitals.

| Page | Before TTFB / total | After TTFB / total | After HTML bytes |
|---|---:|---:|---:|
| Home | 0.884s / 1.200s | 0.923s / 1.264s | 72,892 |
| Products | 0.993s / 1.312s | 1.007s / 1.465s | 68,996 |
| News | 1.080s / 1.447s | 1.086s / 1.525s | 93,096 |
| Contact | 1.068s / 1.299s | 0.896s / 1.131s | 43,569 |
| Admin login | 1.012s / 1.177s | 1.056s / 1.214s | 23,172 |

The samples are broadly unchanged; the measurable optimization is reduced image payload. No necessary content or functionality was removed.

## Unresolved or limited

### Found but not safely fixable without infrastructure/credentials

- **High: no production database.** Product/catalog content is code-backed and admin product access is read-only. Database CRUD, schema/index health, durable News workflow, inquiry records, cache-to-database consistency and database backup/restore cannot be truthfully validated. Configure `DATABASE_URL`, apply `database/schema.sql`, migrate existing content, then repeat the audit before enabling mutation endpoints.
- **High: Google submission is disabled.** The every-three-day schedule is live, but no Search Console property credentials are available. Add the documented Google environment variables and grant the service identity access before claiming active submission.
- **Medium: no application rate limiter.** Validation, honeypot, attachment limits and authentication exist, but inquiry/admin APIs do not use a durable distributed rate limiter. Add a Vercel-compatible store/WAF rule before high-volume promotion.
- **Low: Open Graph image uses the Edge runtime.** Next.js reports the Edge runtime deprecation warning during build. Moving it to Node currently conflicts with its bundled asset loading, so it remains operational pending a framework-compatible refactor.

### Unable to inspect from available access

- Vercel serverless host CPU, RAM, disk, process list, connection count, OS logs and physical backup jobs.
- Positive admin login/role mutation flow, because the audit did not retrieve or expose the plaintext admin password. Negative authorization behavior passed.
- Mailbox receipt/read status. SMTP submission returned success, but mailbox contents were not opened during this audit.
- Google Search Console indexing/coverage reports and API quota, because no GSC access or credentials are configured.
- Browser matrix beyond the Chromium desktop/mobile checks performed here.

## Modified files

`README.md`, `docs/SITEMAP.md`, `package.json`, `pnpm-lock.yaml`, `vercel.json`, two files in `public/images`, four audit/build scripts, admin login/news/shell files, News cron/detail/store files, sitemap maintenance/generated manifest, and `src/app/not-found.tsx`. Exact changes are in commit `46431a5`.

## Acceptance result

The deployed code and currently available stateless workflows passed production regression. News automation is functioning in RSS fallback mode; Blog has no automatic publisher; the Sitemap/Google maintenance trigger is set to every three days. Full database-backed publishing, durable synchronization and active Google submission remain blocked by missing infrastructure/credentials and must not be represented as complete.
