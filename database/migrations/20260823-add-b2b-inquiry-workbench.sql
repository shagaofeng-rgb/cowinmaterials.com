-- Additive B2B lead-management fields. Existing inquiries remain unchanged and readable.
alter table inquiries add column if not exists project_details jsonb not null default '{}'::jsonb;
alter table inquiries add column if not exists priority text not null default 'normal';
alter table inquiries add column if not exists lead_stage text not null default 'new';
alter table inquiries add column if not exists next_follow_up_at timestamptz;
alter table inquiries add column if not exists last_contacted_at timestamptz;
alter table inquiries add column if not exists internal_summary text;

create table if not exists inquiry_notes (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references inquiries(id) on delete cascade,
  note text not null,
  author_label text not null default 'admin',
  created_at timestamptz not null default now()
);

create index if not exists idx_inquiries_stage_follow_up
  on inquiries(lead_stage, next_follow_up_at) where deleted_at is null;
create index if not exists idx_inquiry_notes_inquiry_created_at
  on inquiry_notes(inquiry_id, created_at desc);
