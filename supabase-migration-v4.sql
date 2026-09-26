-- SnapCal v4: foods learned from the online fallback get saved permanently.
-- Run in Supabase → SQL Editor (additive; safe to run repeatedly).
create table if not exists public.foods_learned (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid(),
  name       text not null,
  kcal       double precision not null,
  protein    double precision default 0,
  fat        double precision default 0,
  carbs      double precision default 0,
  portion    double precision default 100,
  origin     text,
  created_at bigint
);
alter table public.foods_learned enable row level security;
drop policy if exists "own rows" on public.foods_learned;
create policy "own rows" on public.foods_learned
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
