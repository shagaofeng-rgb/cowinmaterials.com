-- Keep public historical News accessible while removing weakly related entries
-- from search discovery. The original rows are not deleted or rewritten.
alter table news_articles add column if not exists seo_indexable boolean not null default true;

update news_articles
set seo_indexable = false,
    updated_at = now()
where status = 'published'
  and deleted_at is null
  and concat_ws(' ', title, source_title, coalesce(primary_keyword, '')) !~* '(aerogel|silica|insulation|cryogenic|lng|intumescent|fireproof|fire protection|water repellent|waterproof|concrete|masonry)'
  and concat_ws(' ', title, source_title, coalesce(primary_keyword, '')) !~* '((battery|cell|pack|electric vehicle|ev|lithium).{0,48}(thermal|fire|heat)|(thermal|fire|heat).{0,48}(battery|cell|pack|electric vehicle|ev|lithium))';

create index if not exists idx_news_articles_indexable_published
  on news_articles(seo_indexable, published_at desc)
  where deleted_at is null;
