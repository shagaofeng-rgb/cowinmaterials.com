create extension if not exists pgcrypto;

create table if not exists admin_roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  password_hash text not null,
  role_id uuid references admin_roles(id),
  status text not null default 'active',
  last_login_at timestamptz,
  last_login_ip inet,
  failed_login_count integer not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists admin_permissions (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references admin_roles(id) on delete cascade,
  module text not null,
  action text not null,
  created_at timestamptz not null default now(),
  unique(role_id, module, action)
);

create table if not exists admin_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references admin_users(id) on delete cascade,
  session_hash text not null,
  ip inet,
  user_agent text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table if not exists product_categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references product_categories(id),
  name_en text not null,
  name_zh text,
  slug text not null unique,
  description_en text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  sort_order integer not null default 100,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references product_categories(id),
  sku text,
  name_en text not null,
  name_zh text,
  slug text not null unique,
  summary_en text,
  detail_en text,
  attributes jsonb not null default '{}'::jsonb,
  tags text[] not null default '{}',
  status text not null default 'draft',
  main_image_id uuid,
  seo_title text,
  seo_description text,
  seo_keywords text,
  structured_data jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  deleted_at timestamptz
);

create table if not exists article_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references article_categories(id),
  title_en text not null,
  title_zh text,
  slug text not null unique,
  excerpt_en text,
  body_html text,
  status text not null default 'draft',
  related_product_ids uuid[] not null default '{}',
  seo_title text,
  seo_description text,
  seo_keywords text,
  published_at timestamptz,
  scheduled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text not null,
  phone text,
  country text,
  customer_type text,
  request_type text,
  product text,
  application text,
  message text,
  page_url text,
  utm jsonb not null default '{}'::jsonb,
  status text not null default 'new',
  tags text[] not null default '{}',
  assigned_to uuid references admin_users(id),
  is_spam boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_key text not null unique,
  url text not null,
  filename text not null,
  mime_type text not null,
  size_bytes bigint not null,
  width integer,
  height integer,
  alt_text text,
  uploaded_by uuid references admin_users(id),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  page_path text,
  product_slug text,
  country text,
  device text,
  source text,
  occurred_at timestamptz not null,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists seo_snapshots (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  page_path text,
  keyword text,
  clicks integer,
  impressions integer,
  ctr numeric,
  position numeric,
  issue_code text,
  issue_message text,
  captured_at timestamptz not null default now()
);

create table if not exists sync_jobs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  status text not null default 'pending',
  started_at timestamptz,
  finished_at timestamptz,
  records_synced integer not null default 0,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references admin_users(id),
  action text not null,
  module text not null,
  target_id text,
  ip inet,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists system_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references admin_users(id),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_status on products(status) where deleted_at is null;
create index if not exists idx_products_category on products(category_id) where deleted_at is null;
create index if not exists idx_articles_status on articles(status) where deleted_at is null;
create index if not exists idx_inquiries_created_at on inquiries(created_at desc) where deleted_at is null;
create index if not exists idx_analytics_occurred_at on analytics_events(occurred_at desc);
create index if not exists idx_audit_logs_created_at on audit_logs(created_at desc);

create table if not exists news_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  feed_url text not null unique,
  homepage_url text,
  language text not null default 'en',
  country text,
  status text not null default 'active',
  credibility_score numeric not null default 0.7,
  last_checked_at timestamptz,
  last_success_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists news_jobs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null,
  status text not null default 'pending',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  records_collected integer not null default 0,
  records_rejected integer not null default 0,
  records_published integer not null default 0,
  message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content_html text not null,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'rejected', 'archived')),
  language text not null default 'en',
  category text not null default 'Industry News',
  tags text[] not null default '{}',
  published_at timestamptz,
  scheduled_at timestamptz,
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  author_name text not null default 'Cowin Materials Editorial Team',
  seo_title text,
  seo_description text,
  canonical_url text,
  primary_keyword text,
  secondary_keywords text[] not null default '{}',
  geo_summary text,
  key_takeaways text[] not null default '{}',
  cover_image_url text not null default '',
  cover_image_source_url text,
  cover_image_page_url text,
  cover_image_alt text not null default '',
  cover_image_width integer,
  cover_image_height integer,
  cover_image_hash text,
  cover_image_status text not null default 'pending' check (cover_image_status in ('verified', 'pending', 'failed')),
  cover_image_fetched_at timestamptz,
  source_title text not null,
  source_author text,
  source_publisher text not null,
  source_url text not null,
  canonical_source_url text not null,
  source_language text,
  source_published_at timestamptz not null,
  source_fetched_at timestamptz not null default now(),
  source_timezone text,
  source_fingerprint text not null,
  event_fingerprint text,
  content_hash text,
  relevance_score numeric,
  credibility_score numeric,
  generation_model text,
  generation_prompt_version text,
  created_at timestamptz not null default now(),
  unique (canonical_source_url, source_published_at)
);

create table if not exists news_products (
  id uuid primary key default gen_random_uuid(),
  news_id uuid not null references news_articles(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  product_category text,
  product_summary text,
  product_image text,
  relevance_score numeric not null default 0,
  relationship_reason text,
  display_order integer not null default 100,
  created_at timestamptz not null default now(),
  unique (news_id, product_slug)
);

create table if not exists news_publication_audits (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references news_jobs(id) on delete set null,
  article_id uuid references news_articles(id) on delete cascade,
  event_type text not null,
  severity text not null default 'info',
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_news_articles_status_published on news_articles(status, published_at desc) where deleted_at is null;
create index if not exists idx_news_articles_source_fingerprint on news_articles(source_fingerprint);
create index if not exists idx_news_articles_canonical_source on news_articles(canonical_source_url, source_published_at);
create index if not exists idx_news_products_slug on news_products(product_slug);
create index if not exists idx_news_jobs_started_at on news_jobs(started_at desc);
create index if not exists idx_news_publication_audits_created_at on news_publication_audits(created_at desc);

insert into admin_roles (code, name, description)
values
  ('super_admin', '超级管理员', '拥有全部后台权限'),
  ('admin', '管理员', '管理内容和业务数据'),
  ('editor', '内容编辑', '管理产品、新闻和媒体内容'),
  ('marketing', '市场人员', '管理SEO、内容和访问数据'),
  ('sales', '销售人员', '管理客户表单和跟进记录'),
  ('analyst', '数据分析人员', '查看访问分析和SEO数据'),
  ('readonly', '只读用户', '仅查看授权模块')
on conflict (code) do nothing;
