-- Evidence-backed technical News. This migration is additive and preserves all
-- existing News records and public URLs.
alter table news_articles
  add column if not exists origin_type text not null default 'external_industry',
  add column if not exists technical_source_label text,
  add column if not exists technical_source_locator text,
  add column if not exists technical_source_report_number text,
  add column if not exists evidence_ids text[] not null default '{}';

create table if not exists news_technical_evidence (
  id text primary key,
  product_slug text not null,
  claim_label text not null,
  value_text text not null,
  test_conditions text,
  standard_reference text,
  source_document text not null,
  source_locator text not null,
  report_number text,
  evidence_level text not null check (evidence_level in ('public_exact', 'public_scoped', 'context_only')),
  public_status boolean not null default true,
  restriction_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists news_technical_topics (
  id text primary key,
  title text not null,
  excerpt text not null,
  primary_product_slug text not null,
  evidence_ids text[] not null default '{}',
  tags text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'publishing', 'published', 'blocked')),
  sort_order integer not null default 100,
  published_article_id uuid references news_articles(id) on delete set null,
  published_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_news_articles_origin_type on news_articles(origin_type, published_at desc);
create index if not exists idx_news_technical_topics_pending on news_technical_topics(status, sort_order, created_at);
create index if not exists idx_news_technical_evidence_product on news_technical_evidence(product_slug);
