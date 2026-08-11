-- Idempotent restoration of the direct-publishing News data model.
-- This migration creates missing tables only; it does not remove or alter existing content.
create table if not exists news_jobs (
  id uuid primary key default gen_random_uuid(), job_type text not null, status text not null default 'pending',
  started_at timestamptz not null default now(), finished_at timestamptz, records_collected integer not null default 0,
  records_rejected integer not null default 0, records_published integer not null default 0, message text,
  metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create table if not exists news_articles (
  id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique, excerpt text not null,
  content_html text not null, status text not null default 'draft' check (status in ('draft', 'review', 'published', 'rejected', 'archived')),
  language text not null default 'en', category text not null default 'Industry News', tags text[] not null default '{}',
  published_at timestamptz, scheduled_at timestamptz, updated_at timestamptz not null default now(), deleted_at timestamptz,
  author_name text not null default 'Cowin Materials Editorial Team', seo_title text, seo_description text, canonical_url text,
  primary_keyword text, secondary_keywords text[] not null default '{}', geo_summary text, key_takeaways text[] not null default '{}',
  cover_image_url text not null default '', cover_image_source_url text, cover_image_page_url text, cover_image_alt text not null default '',
  cover_image_width integer, cover_image_height integer, cover_image_hash text,
  cover_image_status text not null default 'pending' check (cover_image_status in ('verified', 'pending', 'failed')),
  cover_image_fetched_at timestamptz, source_title text not null, source_author text, source_publisher text not null,
  source_url text not null, canonical_source_url text not null, source_language text, source_published_at timestamptz not null,
  source_fetched_at timestamptz not null default now(), source_timezone text, source_fingerprint text not null,
  event_fingerprint text, content_hash text, relevance_score numeric, credibility_score numeric, generation_model text,
  generation_prompt_version text, created_at timestamptz not null default now(), unique (canonical_source_url, source_published_at)
);

create table if not exists news_products (
  id uuid primary key default gen_random_uuid(), news_id uuid not null references news_articles(id) on delete cascade,
  product_slug text not null, product_name text not null, product_category text, product_summary text, product_image text,
  relevance_score numeric not null default 0, relationship_reason text, display_order integer not null default 100,
  created_at timestamptz not null default now(), unique (news_id, product_slug)
);

create table if not exists news_publication_audits (
  id uuid primary key default gen_random_uuid(), job_id uuid references news_jobs(id) on delete set null,
  article_id uuid references news_articles(id) on delete cascade, event_type text not null, severity text not null default 'info',
  message text not null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create index if not exists idx_news_articles_status_published on news_articles(status, published_at desc) where deleted_at is null;
create index if not exists idx_news_articles_source_fingerprint on news_articles(source_fingerprint);
create index if not exists idx_news_products_slug on news_products(product_slug);
create index if not exists idx_news_jobs_started_at on news_jobs(started_at desc);
