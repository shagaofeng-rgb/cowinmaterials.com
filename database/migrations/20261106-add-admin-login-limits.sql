create table if not exists admin_login_limits (
  fingerprint text primary key,
  attempts smallint not null check (attempts between 1 and 9),
  reset_at timestamptz not null
);
create index if not exists idx_admin_login_limits_reset_at on admin_login_limits(reset_at);
revoke all on admin_login_limits from public;
