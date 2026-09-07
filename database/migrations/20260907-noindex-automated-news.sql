-- Automated, source-linked News remains available to visitors but is excluded from
-- search discovery unless an editor later publishes an independently enriched item.
-- This migration preserves every row and its public URL; it changes only the index flag.
update news_articles
set seo_indexable = false,
    updated_at = now()
where deleted_at is null
  and status = 'published'
  and generation_model = 'deterministic-editorial-template'
  and seo_indexable = true;
