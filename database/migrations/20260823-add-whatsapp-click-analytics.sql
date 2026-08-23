-- Adds an idempotency key and an efficient lookup path for anonymized contact-entry events.
alter table analytics_events add column if not exists event_id text;

create unique index if not exists idx_analytics_events_event_id
  on analytics_events(event_id);

create index if not exists idx_analytics_events_name_occurred_at
  on analytics_events(event_name, occurred_at desc);
