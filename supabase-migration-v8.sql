-- SnapCal v8: per-user daily counter for server-side photo AI (protects the free quota).
-- RLS on with NO policies = only the Edge Function (service role) can read/write it.
create table if not exists public.ai_usage (
  user_id uuid not null,
  day     date not null,
  n       int  not null default 0,
  primary key (user_id, day)
);
alter table public.ai_usage enable row level security;
