-- Adds first-party, pseudonymous visitor and session attribution for the protected
-- administration console. Existing analytics and inquiry records remain unchanged.

create extension if not exists pgcrypto;

create table if not exists analytics_customers (
  id uuid primary key default gen_random_uuid(),
  email_hash text not null unique,
  first_identified_at timestamptz not null default now(),
  last_identified_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists analytics_visitors (
  id uuid primary key default gen_random_uuid(),
  visitor_key uuid not null unique,
  customer_id uuid references analytics_customers(id) on delete set null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  first_landing_path text,
  last_path text,
  first_referrer_host text,
  last_referrer_host text,
  first_utm jsonb not null default '{}'::jsonb,
  last_utm jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists analytics_sessions (
  id uuid primary key default gen_random_uuid(),
  session_key uuid not null unique,
  visitor_id uuid not null references analytics_visitors(id) on delete cascade,
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  landing_path text,
  exit_path text,
  referrer_path text,
  referrer_host text,
  utm jsonb not null default '{}'::jsonb,
  device text,
  source text,
  event_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists analytics_visitor_inquiries (
  visitor_id uuid not null references analytics_visitors(id) on delete cascade,
  inquiry_id uuid not null references inquiries(id) on delete cascade,
  linked_at timestamptz not null default now(),
  source text not null default 'website_form',
  primary key (visitor_id, inquiry_id)
);

alter table analytics_events add column if not exists visitor_id uuid references analytics_visitors(id) on delete set null;
alter table analytics_events add column if not exists session_id uuid references analytics_sessions(id) on delete set null;
alter table analytics_events add column if not exists referrer_path text;
alter table analytics_events add column if not exists referrer_host text;
alter table inquiries add column if not exists visitor_id uuid references analytics_visitors(id) on delete set null;
alter table inquiries add column if not exists visitor_session_id uuid references analytics_sessions(id) on delete set null;
alter table inquiries add column if not exists customer_identity_id uuid references analytics_customers(id) on delete set null;

create index if not exists analytics_visitors_last_seen_idx on analytics_visitors (last_seen_at desc);
create index if not exists analytics_visitors_customer_idx on analytics_visitors (customer_id, last_seen_at desc);
create index if not exists analytics_sessions_visitor_idx on analytics_sessions (visitor_id, started_at desc);
create index if not exists analytics_sessions_last_seen_idx on analytics_sessions (last_seen_at desc);
create index if not exists analytics_events_visitor_time_idx on analytics_events (visitor_id, occurred_at desc);
create index if not exists analytics_events_session_time_idx on analytics_events (session_id, occurred_at asc);
create index if not exists analytics_visitor_inquiries_inquiry_idx on analytics_visitor_inquiries (inquiry_id, linked_at desc);
create index if not exists inquiries_customer_identity_idx on inquiries (customer_identity_id, created_at desc);
