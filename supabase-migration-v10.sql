-- SnapCal v10: sodium & sugar per entry, "your usual portions" memory, Apple Health water &
-- workouts, exercise eat-back, water target, reminder subscriptions.
-- Run once in Supabase → SQL Editor. Additive; safe to run repeatedly. (Includes v9.)

alter table public.entries      add column if not exists sodium_mg   double precision;
alter table public.entries      add column if not exists sugar_g     double precision;
alter table public.settings     add column if not exists water_ml    double precision;
alter table public.settings     add column if not exists eat_back    double precision;
alter table public.health_daily add column if not exists water_ml    double precision;
alter table public.health_daily add column if not exists workout_min double precision;

create table if not exists public.portion_memory (
  user_id    uuid   not null default auth.uid(),
  key        text   not null,
  grams      double precision not null,
  n          int    not null default 1,
  updated_at bigint,
  primary key (user_id, key)
);
alter table public.portion_memory enable row level security;
drop policy if exists "own rows" on public.portion_memory;
create policy "own rows" on public.portion_memory
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create table if not exists public.push_subs (
  endpoint   text primary key,
  user_id    uuid   not null default auth.uid(),
  sub        jsonb  not null,
  prefs      jsonb  not null default '{}',
  tz_offset  int    not null default 0,   -- minutes, as JavaScript's getTimezoneOffset()
  last_sent  jsonb  not null default '{}',
  created_at bigint
);
alter table public.push_subs enable row level security;
drop policy if exists "own rows" on public.push_subs;
create policy "own rows" on public.push_subs
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
