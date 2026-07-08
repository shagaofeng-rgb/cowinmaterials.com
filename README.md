# Cowin Materials Website

Official B2B website for Cowin Materials, operated by Quzhou Qiying Import & Export Co., Ltd.

The website presents silica aerogel material systems for international technical buyers, including:

- Silica aerogel powder, slurry, blankets and thermal pads
- Building and industrial aerogel insulation coatings
- Intumescent and non-intumescent fire protection coatings
- Silicon-based penetrating water repellent systems
- Application pages for buildings, industrial insulation, EV batteries, LNG and waterproofing

## Production Scope

The site is built for public search indexing, AI crawler readability, supplier qualification and lead generation. It includes structured metadata, sitemap, robots rules, an `llms.txt` endpoint and an email-backed inquiry form.

## Chinese Admin Console

The protected Chinese admin console is available at `/admin/login`. It is intentionally excluded from search indexing and uses server-side session validation.

Required production environment variables:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH` or temporary `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `DATABASE_URL`
- Existing SMTP and cron variables from `.env.example`

PostgreSQL initialization SQL is provided in `database/schema.sql`. The admin dashboard shows the real database connection state and does not fabricate analytics, inquiry, or SEO data when external credentials are not configured.

Useful commands:

```bash
pnpm lint
pnpm build
node scripts/hash-admin-password.mjs
psql "$DATABASE_URL" -f database/schema.sql
```

## Contact

- Company: Quzhou Qiying Import & Export Co., Ltd.
- Brand: Cowin Materials
- Website: https://www.cowinmaterials.com
- Email: davidsha@cowinmaterials.com
- Phone: +86 176 0125 2505
