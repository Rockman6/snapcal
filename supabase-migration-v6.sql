-- SnapCal v6: daily Apple Watch / Health data, pushed by an iOS Shortcut.
-- Run in Supabase → SQL Editor (additive; safe to run repeatedly).
create table if not exists public.health_daily (
  user_id     uuid not null default auth.uid(),
  date        text not null,
  active_kcal double precision,
  steps       double precision,
  resting_hr  double precision,
  sleep_hours double precision,
  created_at  bigint,
  primary key (user_id, date)
);
alter table public.health_daily enable row level security;
drop policy if exists "own rows" on public.health_daily;
create policy "own rows" on public.health_daily
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
