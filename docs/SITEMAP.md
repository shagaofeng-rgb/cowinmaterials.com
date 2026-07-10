# Sitemap Operations

Cowin Materials serves a dynamic sitemap index at:

- `https://www.cowinmaterials.com/sitemap.xml`
- `https://www.cowinmaterials.com/sitemaps/pages-1.xml`
- `https://www.cowinmaterials.com/sitemaps/products-1.xml`
- `https://www.cowinmaterials.com/sitemaps/applications-1.xml`
- `https://www.cowinmaterials.com/sitemaps/news-1.xml`

The index only lists non-empty child files. A child file is split before 50,000 URLs or 50 MB; the implementation uses a safety limit of 45,000 URLs and 49 MB. XML is UTF-8, escaped, and returned with `application/xml; charset=utf-8`.

## How Updates Work

Static public page timestamps are generated from the last Git commit that significantly changed each page. Product and application timestamps come from the last commit to `src/lib/data.ts`. The manifest is regenerated before every production build by `scripts/generate-sitemap-manifest.mjs`.

Published news is read at request time from PostgreSQL when `DATABASE_URL` is configured. Without PostgreSQL, the existing verified RSS fallback remains available, but it does not provide permanent article storage or durable audit history.

Dynamic sitemap routes mean a published or removed database article is reflected without writing to the Vercel filesystem. The daily maintenance job validates the index, child XML, robots declaration, and public HTTP status. It records URL additions, modifications, and removals in PostgreSQL when the schema is installed, and always writes a structured Vercel runtime log.

## Commands

```bash
pnpm sitemap:generate -- --dry-run --verbose
pnpm sitemap:generate -- --force --verbose
pnpm sitemap:generate -- --force --submit --verbose
pnpm test:sitemap
SITE_URL=https://www.cowinmaterials.com pnpm test:smoke
```

`--dry-run` only checks public sitemap files. Other modes call the authenticated maintenance route and require `CRON_SECRET`. `--submit` still requires `GOOGLE_SEARCH_CONSOLE_ENABLED=true` and valid Google credentials; the flag cannot bypass the environment safety switch.

The production Vercel Cron route is `/api/cron/sitemap-maintenance`, scheduled daily in `vercel.json`. Vercel supplies `Authorization: Bearer $CRON_SECRET` automatically when the project secret is configured.

## Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://www.cowinmaterials.com
CRON_SECRET=
DATABASE_URL=
DATABASE_SSL=true

GOOGLE_SEARCH_CONSOLE_ENABLED=false
GOOGLE_SEARCH_CONSOLE_SITE_URL=sc-domain:cowinmaterials.com
GOOGLE_SEARCH_CONSOLE_SITEMAP_URL=https://www.cowinmaterials.com/sitemap.xml
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_PATH=
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_JSON=
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_BASE64=
```

Use only one service-account credential source. A path is convenient on a conventional server; encrypted JSON or Base64 is more practical on Vercel. Never commit the credential file or value.

## Search Console Setup

1. Create or select a Google Cloud project and enable the Google Search Console API.
2. Create a service account and download its JSON credentials.
3. Add the service-account email as an owner or full user of the matching Search Console property.
4. Set `GOOGLE_SEARCH_CONSOLE_SITE_URL` to the exact property identifier, such as `sc-domain:cowinmaterials.com` or `https://www.cowinmaterials.com/`.
5. Add encrypted credentials to the deployment environment.
6. Leave `GOOGLE_SEARCH_CONSOLE_ENABLED=false` until access is verified, then enable it and redeploy.

The implementation uses the Search Console Sitemaps API `PUT` endpoint. It does not use the retired sitemap ping endpoint or the Google Indexing API. The Indexing API is restricted to qualifying job posting and livestream pages and is not appropriate for this company website.

## Logs

With `DATABASE_URL` and `database/schema.sql` installed, inspect `sitemap_runs` and `sitemap_url_snapshots`. Each run includes timestamps, duration, trigger, file and URL counts, byte size, split status, changed URLs, validation errors, and Search Console status.

Without a database, inspect Vercel runtime logs for the `sitemap_maintenance` event. These logs are operational evidence but are not a permanent content database.

## Troubleshooting

- Sitemap 404: confirm the latest deployment contains `src/app/sitemap.xml/route.ts` and the production alias targets that deployment.
- Invalid XML: run `pnpm test:sitemap` and `pnpm sitemap:generate -- --dry-run --verbose`; check for an unescaped or malformed URL.
- robots declaration missing: confirm `https://www.cowinmaterials.com/robots.txt` contains `Sitemap: https://www.cowinmaterials.com/sitemap.xml`.
- API 403: verify the service-account email has permission on the exact Search Console property and the property string matches.
- Submitted but not indexed: use Search Console URL Inspection and Page Indexing reports to check crawlability, canonical selection, content quality, and server responses.

Submitting a sitemap is a discovery hint, not proof that Google downloaded it. A crawl does not guarantee indexing. Final index status must be confirmed in Google Search Console.
