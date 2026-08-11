-- Records webhook outcomes without storing API keys or article bodies.
create table if not exists blog_webhook_events (
  id uuid primary key default gen_random_uuid(),
  request_fingerprint text,
  article_id uuid references articles(id) on delete set null,
  event_type text not null,
  class_id text,
  author_id text,
  outcome text not null check (outcome in ('accepted', 'rejected', 'retryable_failure')),
  http_status integer not null,
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now()
);

create index if not exists idx_blog_webhook_events_received_at on blog_webhook_events(received_at desc);
create index if not exists idx_blog_webhook_events_fingerprint on blog_webhook_events(request_fingerprint);
