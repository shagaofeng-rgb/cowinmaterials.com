# P0/P1 SEO, content and conversion execution report

Date: 09 August 2026

## Scope completed locally

- Backed up the repository, public image directory, deployment configuration, environment-variable record and 22 database tables before changes.
- Reworked the primary navigation to `Products / Applications / Resources / About / Contact`; empty Blog and non-public case studies are not in the primary navigation.
- Rebuilt the home-page technical-evidence entry, removed the empty About image stack and corrected the five-step evaluation layout.
- Added fixed technical modules to all 9 product pages and 6 application pages: overview, data scope, source reference, selection limits, verification guidance, related pages, FAQ and last-reviewed date.
- Removed six presentation screenshots / old-brand graphic assets from the website and eliminated all source references to them.
- Added Product additional-property schema, product/application breadcrumbs, Organization legal name and logo, and factual AI-readable content in `llms.txt`.
- Added a safe optional GA4 configuration point and the agreed conversion-event naming. No analytics ID or fabricated analytics data was introduced.
- Removed the scheduled News automation job from `vercel.json`, removed the live-RSS public fallback and removed every external-News auto-publish override. Candidate collection can only store items for editorial review; it cannot publish them to the public site.
- Marked an empty Blog and non-public Technical References page `noindex` and removed them from the static sitemap while retaining their URLs and manual publishing capability.
- Applied a reversible News archive policy in code: the 58 legacy `news-automation-v1` records remain in the database and at their original URLs, but are noindexed and excluded from the public News list, RSS, sitemap and Article schema. The rule becomes live only after the next deployment.

## Verified results

| Check | Result |
| --- | --- |
| ESLint | Passed (`pnpm lint`) |
| TypeScript | Passed (`pnpm exec tsc --noEmit`) |
| News rule checks | Passed (`pnpm test:news`) |
| Repository self-check | Passed (`pnpm test:self`) |
| Production build | Passed (`pnpm build`) |
| Local full-site smoke | Passed (`SITE_URL=http://127.0.0.1:3101 pnpm test:smoke`) |
| Sitemap links | 28 checked public URLs; zero unavailable URLs |
| Browser QA | Desktop and 390 px mobile checked for the home page, product detail and application detail; one H1 per checked page and no horizontal overflow |
| Final sitemap tests | Passed: 8/8 (`pnpm test:sitemap`) |
| Final protected News-task test | Local production route returned `202` with `published: 0` and no live-RSS fallback when no database is configured |
| Final local smoke | Passed after the News review-only change: 28 public URLs, robots, RSS and `llms.txt`; zero URL failures |

## Current runtime-task inventory

| Task or endpoint | Trigger | Configured frequency | Current local verification |
| --- | --- | --- | --- |
| Email health check | Vercel Cron `/api/cron/email-health-check` | First day of each month, 00:00 UTC | Route exists; delivery is not invoked in this audit to avoid sending email. |
| Sitemap maintenance and optional Search Console submit | Vercel Cron `/api/cron/sitemap-maintenance` | Every 3 days, 02:30 UTC | Protected route returns `401` without its secret; 8 sitemap tests passed. |
| External News candidate collection | Authenticated admin or cron endpoint, not scheduled in `vercel.json` | Manual only | With no local database, protected call returned `202`, `published: 0`, and made no external RSS fallback. With a database it can only create `review` rows. |
| Blog webhook publishing | Authenticated `/api/webhook/send_article` and root POST relay | Plugin-driven, no cron | Invalid-sign smoke request returned response `code: 0`; production write/read verification requires its database environment. |
| Blog automatic publishing | None | Disabled | No Vercel Cron or repository trigger exists. |

## Final local performance sample

Measured against a production build at `http://127.0.0.1:3103` on 09 August 2026. These are local response timings, not synthetic field data or a substitute for production RUM.

| Route | HTTP | TTFB | Total |
| --- | ---: | ---: | ---: |
| `/` | 200 | 0.112 s | 0.112 s |
| `/products` | 200 | 0.006 s | 0.006 s |
| `/applications` | 200 | 0.006 s | 0.006 s |
| `/technical-resources` | 200 | 0.006 s | 0.006 s |
| `/about` | 200 | 0.005 s | 0.005 s |
| `/contact` | 200 | 0.006 s | 0.006 s |
| `/news` | 200 | 0.142 s | 0.142 s |
| `/blog` | 200 | 0.021 s | 0.021 s |

## Data provenance

The technical claim-to-source mapping is in `docs/SEO-CONTENT-DATA-SOURCES-2026-08-09.md`. Public pages deliberately exclude unsupported fire-duration, UL 94, customer, certificate, project, factory and pricing claims.

## News inventory / implemented archive policy

The production-connected snapshot found 58 externally sourced News rows published between 04 and 07 August 2026. Their titles are predominantly general solar, grid and BESS coverage rather than Cowin Materials technical evidence. The database was not modified. `docs/NEWS-URL-INVENTORY-2026-08-09.md` records the active application rule and the required per-URL-301 planning rule. A business decision is still required before deleting or redirecting any of those existing URLs.

## Backups and rollback

Local backup directory: `/Users/apple/Documents/材料/site-audit-backups/2026-08-09-p0-p1-seo-content/`

It contains a Git bundle, image copy, configuration/data snapshots, environment-variable record and a JSON database export. Restore code with the Git bundle or normal Git history, restore images from `public-images-before`, and restore the database only through a reviewed PostgreSQL import; do not copy secret values into source control.

## Not performed

- No DNS, domain, deployment, Vercel production setting, Google Search Console, GA4/GTM, email, form submission or external-account action was performed.
- No existing database article, Blog article, News article, redirect, sitemap submission or user content was deleted.
- The site still emits the existing Next.js Edge Runtime deprecation warning during build; it was present outside this content change and does not fail the build. It should be scheduled as a framework-maintenance item.
- The local `.env.local` does not contain `DATABASE_URL`; production database contents, indexes, permissions, cache state, job history, queue behavior, Vercel resource use and production logs could not be re-read in this local-only pass. No conclusion about their current production health is claimed.
- No GA4/GTM measurement ID, Search Console service-account access, Vercel environment-variable access or production deployment was supplied for this pass. The implementation has configuration points but no fabricated external integration state.
