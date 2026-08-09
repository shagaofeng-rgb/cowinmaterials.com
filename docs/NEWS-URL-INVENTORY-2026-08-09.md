# News URL inventory and publication decision

Snapshot: 09 August 2026, taken from the production-connected `news_articles` table before this change. The database backup is held outside the repository in the dated rollback folder. This document does not delete or redirect an existing URL. The local application now applies the approved archive/noindex rule described below when deployed; database rows remain unchanged.

## Finding

The current published News inventory is dominated by automated external solar, grid and general BESS stories. Most are weakly connected to Cowin Materials' own aerogel material evidence and should not remain an indexable product-news archive.

## Decision rules for the current inventory

- **Keep only after deep rewrite and source review:** articles directly about battery thermal-management material selection or a documented Cowin Materials technical development. No existing item has yet passed this editorial rewrite.
- **Applied archive/noindex rule:** every published row marked `generation_prompt_version = news-automation-v1` is retained at its original URL for audit continuity, but excluded from the public News list, RSS feed, sitemap and Article schema. Its direct page emits `noindex, nofollow` and an archive notice.
- **Proposed 301 destination after archival:** `/technical-resources` for generic material research queries, or the most relevant application page where an individually reviewed article has a clear technical fit. Do not send every URL to the home page.

## Current URL groups

| Database snapshot group | Count | URL pattern | Proposed action |
| --- | ---: | --- | --- |
| 2026-08-07 external solar, grid, energy-policy and BESS stories | 18 | `/news/*-2026-08-07` | Noindex/archive pending approval; individual 301 mapping required before deletion. |
| 2026-08-06 external solar, grid, energy-policy and BESS stories | 18 | `/news/*-2026-08-06` | Noindex/archive pending approval; individual 301 mapping required before deletion. |
| 2026-08-05 external solar, grid, energy-policy and BESS stories | 17 | `/news/*-2026-08-05` | Noindex/archive pending approval; individual 301 mapping required before deletion. |
| 2026-08-04 external solar, grid, energy-policy and BESS stories | 5 | `/news/*-2026-08-04` | Noindex/archive pending approval; individual 301 mapping required before deletion. |

## Implemented locally and remaining action

The application implementation is complete locally. It changes neither `status` nor `deleted_at`, so rollback is a code rollback and no database restore is needed. The retained URLs return `200` rather than `404` or an indiscriminate redirect, protecting existing external references while search engines reprocess their `noindex` directive.

An individual 301 destination must still be chosen before any URL is removed. Candidate destinations are `/technical-resources` for general material research queries or a directly relevant application page only after editorial review. Do not redirect every historical URL to the home page.
