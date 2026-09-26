-- SnapCal v3 migration: user profile + full body-composition metrics.
-- Run AFTER the v2 schema, in Supabase → SQL Editor. Safe to run repeatedly.

create table if not exists public.profiles (
  user_id   uuid primary key default auth.uid(),
  sex       text check (sex in ('male','female')),
  dob       date,
  height_cm double precision
);
alter table public.profiles enable row level security;
drop policy if exists "own rows" on public.profiles;
create policy "own rows" on public.profiles
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- All optional scale metrics live in one JSON column.
alter table public.weights add column if not exists metrics jsonb;
