-- Additive: existing inquiries and notification audit records are unchanged.
create table if not exists inquiry_notifications (
  inquiry_id uuid primary key references inquiries(id) on delete cascade,
  request_key uuid not null unique default gen_random_uuid(),
  status text not null default 'pending'
    check (status in ('pending', 'sending', 'retry', 'accepted', 'failed', 'uncertain')),
  attempts smallint not null default 0 check (attempts between 0 and 3),
  retry_at timestamptz not null default now(),
  last_attempt_at timestamptz,
  accepted_at timestamptz,
  failure_code text,
  attachment_name text,
  attachment_type text,
  attachment_content bytea,
  created_at timestamptz not null default now()
);

create index if not exists idx_inquiry_notifications_due on inquiry_notifications(retry_at)
  where status in ('pending', 'retry');
revoke all on inquiry_notifications from public;
