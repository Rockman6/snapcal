-- SnapCal v10 — complete catch-up: brings a database at ANY earlier version (base schema onward)
-- fully up to date. Includes everything from v3–v9, then v10: sodium & sugar per entry, "your usual
-- portions" memory, Apple Health water & workouts, exercise eat-back, water target, reminder
-- subscriptions, "My bowls" for photo portions.
-- Run in Supabase → SQL Editor. Every statement is idempotent: safe to run repeatedly.

-- ---------- v3: profile + body-composition metrics ----------
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
alter table public.weights add column if not exists metrics jsonb;

-- ---------- v4 + v5: shared catalog of foods learned online ----------
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
drop policy if exists "read all" on public.foods_learned;
drop policy if exists "insert own" on public.foods_learned;
create policy "read all"   on public.foods_learned for select to authenticated using (true);
create policy "insert own" on public.foods_learned for insert to authenticated with check (user_id = auth.uid());

-- ---------- v6: daily Apple Watch / Health data ----------
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

-- ---------- v7: shared user-taught barcodes ----------
create table if not exists public.barcodes_learned (
  code       text primary key,
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
alter table public.barcodes_learned enable row level security;
drop policy if exists "read all" on public.barcodes_learned;
drop policy if exists "insert own" on public.barcodes_learned;
create policy "read all"   on public.barcodes_learned for select to authenticated using (true);
create policy "insert own" on public.barcodes_learned for insert to authenticated with check (user_id = auth.uid());

-- ---------- v8: per-user daily photo-AI counter (RLS on, no policies = server only) ----------
create table if not exists public.ai_usage (
  user_id uuid not null,
  day     date not null,
  n       int  not null default 0,
  primary key (user_id, day)
);
alter table public.ai_usage enable row level security;

-- ---------- v9 + v10 ----------
alter table public.entries      add column if not exists sodium_mg   double precision;
alter table public.entries      add column if not exists sugar_g     double precision;
alter table public.settings     add column if not exists water_ml    double precision;
alter table public.settings     add column if not exists eat_back    double precision;
alter table public.settings     add column if not exists bowls       jsonb;
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
