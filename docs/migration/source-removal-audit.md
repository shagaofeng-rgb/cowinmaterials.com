# International-source migration and removal audit

Date: 2026-08-09

## Scope and preservation

This audit records an authorized internal-source review for the Cowin Materials website. The original store URL and any historic supplier identity are intentionally not published in visitor-facing copy, structured data, metadata, source code comments, or public documentation.

A rollback snapshot was created before changes at:

`/Users/apple/Documents/材料/site-audit-backups/2026-08-09-international-migration/`

It includes a repository archive, the pre-change working-tree patch, status record, and SHA-256 checksums.

## Source and content outcome

| Item | Outcome |
| --- | --- |
| Authorized external source | Used only as an internal product-inventory reference. It is not exposed on the website. |
| Public business identity | Cowin Materials; legal operator: Quzhou Qiying Import & Export Co., Ltd. |
| Public contact and office address | Replaced with the approved Quzhou details in the shared site data and structured data. |
| Manufacturing location | Presented only as a manufacturing facility address, without ownership, certification, or capacity claims. |
| Product structure | Rebuilt into four category routes with one-to-one permanent redirects from the nine former product URLs. |
| Technical values | Retained only where already mapped to the supplied product-specific material and test documentation. |
| Images | Existing local images remain only where relevant to a product/test context. Rights provenance not recorded in the repository is listed for follow-up below. |

## Automated News retirement

The public News listing, News detail route, RSS route, News API, News admin screen, automated collection/generation logic, and News cron endpoint were removed from the running application. `/news` and child paths return `410 Gone` with `X-Robots-Tag: noindex`.

The manual Blog and its webhook publishing path remain separate from the retired News system.

## URL decisions

| Previous URL | Decision | Destination / status |
| --- | --- | --- |
| `/products/{nine former product slugs}` | Retained through redirect | One-to-one `308` permanent redirect to the appropriate nested category/product URL |
| `/technical-resources` | Retained through redirect | `/resources` |
| `/technology` | Retained through redirect | `/resources` |
| `/construction` | Retained through redirect | `/resources#installation-guides` |
| `/comparison` | Retained through redirect | `/about` |
| `/news` and `/news/*` | Retired | `410 Gone`, not indexed |

No public content URL was deleted without a replacement route or an explicit retirement response.

## Review required before a later content expansion

1. Confirm rights/provenance for each existing local image before using it in new marketing placements.
2. Provide the individual source product-page URLs and approved source documents for any additional product specification migration.
3. Confirm any ownership, certification, production-capacity, packaging, dimensions, or logistics claim before publication.
4. A production database connection was not available in this environment. Existing legacy `news_*` tables were not changed. The fresh-schema definitions and all application callers are removed; production-table archival or removal requires a verified backup and database operator review.
