# Admin Console Enhancement - 14 August 2026

## Scope and Safety Boundary

This change improves the existing `/admin` console without replacing its routes, authentication model, public URLs, email workflow, SEO routes or Vercel deployment path. It does not create sample records, modify production content, send mail, apply a database migration or deploy a preview/production build.

## Confirmed Data Flow

| Area | Authority | Admin read/write path | Public effect |
|---|---|---|---|
| Products, product categories and static media | Version-controlled technical source in `src/lib/data.ts` and local public assets | Read-only verification pages under `/admin/products`; no shadow CMS editor | Public product/application pages read the same source at build time |
| Blog | PostgreSQL `articles` and `article_categories` | `/admin/blog` -> Server Action -> transaction -> `audit_logs` | Revalidates Blog list, article, Sitemap and admin pages |
| Website inquiries | PostgreSQL `inquiries` | `/api/inquiry` -> transaction -> `audit_logs`; protected detail status update | Customer data stays private and never enters public routes |
| News / SEO / sync state | PostgreSQL task and snapshot tables plus Next.js routes | Real list reads from `news_*`, `seo_snapshots`, `sync_jobs`, `sitemap_runs` where available | No fake Analytics or Search Console metrics |
| Settings and admin identity | Vercel environment variables and static site data | Transparent read-only status | High-risk Vercel values are not falsely editable in the web UI |

## Implemented Improvements

- **Overview:** actual counts for Blog, inquiries, queued/failed sync jobs and internal analytics events; real work items and operation-log activity; no fabricated traffic figures.
- **Products:** searchable list now leads to a stable product detail URL with technical data scope, source documents, SEO/canonical and public preview. The page explicitly identifies the Git-controlled authority instead of offering non-functional editing.
- **Categories, media, users, settings, SEO, analytics, logs and sync:** share a single module data service that declares the source, last-known state and whether a connection is not configured. Database lists are queried at request time and static sources remain clearly marked.
- **Blog:** stable article detail/editor route; server-side validation and sanitisation; a transaction updates the article and appends a non-secret audit event; Blog and Sitemap cache paths are revalidated only after the transaction succeeds.
- **Inquiries:** protected detail route separates client data from internal state. Status changes run server-side in a transaction and append an audit event with no customer payload. New website inquiry records also create a minimal `website_form` audit event.
- **Authentication:** nested admin routes preserve their post-login return path through the existing proxy while retaining the webhook root-POST rewrite.
- **Shared UX:** `AdminSyncStatus`, source notices, status panels, traceable cards, tables, detail-page actions and responsive admin form/table styles.

## Security and Compatibility

- No credentials, full customer messages, tokens, SMTP details or database URLs are written to operation logs or browser output.
- Every added detail route calls `requireAdminSession()` before reading data.
- Blog HTML is sanitised on every admin save. Inquiry text is rendered as React text, not untrusted HTML.
- No schema migration is needed for these additions. They use existing `articles`, `inquiries`, `audit_logs`, `sync_jobs`, `seo_snapshots`, `analytics_events` and related schema tables.
- Product editing remains intentionally unavailable until a separately approved migration moves the canonical version-controlled technical catalogue into a governed CMS workflow.

## Validation Performed

| Check | Result |
|---|---|
| `pnpm lint` | Passed |
| `pnpm exec tsc --noEmit` | Passed |
| `pnpm test:self` | Passed; includes admin route/auth/audit/source assertions |
| `pnpm test:sitemap` | 8/8 passed |
| `pnpm build` | Passed; generated product, Blog and inquiry detail routes |
| Unauthenticated local detail routes | `307` to `/admin/login` with the original nested `next` path retained; `noindex` headers present |
| Browser check | Local Cowin login page checked at desktop and 375px; labels and controls present |

## Validation Still Required Before Production

The local environment deliberately has no administrator password or production database access, so no real content or inquiry was changed. Before deployment, use a Vercel Preview environment with an administrator test account and preview database connection to verify:

1. Edit a pre-approved Draft Blog article, save it, reload the detail page and check the matching preview URL plus Sitemap behavior.
2. Change a test inquiry status, confirm `audit_logs` receives one metadata-only event, and restore its original status.
3. Confirm the overview shows the expected query counts and sync/SEO connection state.
4. Test desktop and 375px/768px admin navigation while authenticated.

## Rollback

All changes are additive. Revert the commit that adds this document and its related source changes, then deploy the prior Vercel deployment. No database record or migration needs to be rolled back for this implementation.
