-- SnapCal schema v2 — multi-user: anyone may register; each account sees ONLY
-- its own rows (user_id = auth.uid()). Run once in Supabase → SQL Editor.
-- v2 drops the v1 tables (fine while data is test-only).

drop table if exists public.entries;
drop table if exists public.weights;
drop table if exists public.settings;
drop table if exists public.foods_custom;

create table public.entries (
  user_id    uuid   not null default auth.uid(),
  device_id  text   not null,
  local_id   bigint not null,
  date       text   not null,
  name       text   not null,
  grams      double precision,
  kcal       double precision,
  protein    double precision,
  fat        double precision,
  carbs      double precision,
  source     text,
  created_at bigint,
  deleted    boolean not null default false,
  primary key (device_id, local_id)
);

create table public.weights (
  user_id    uuid not null default auth.uid(),
  date       text not null,
  weight     double precision not null,
  muscle     double precision,
  body_fat   double precision,
  created_at bigint,
  primary key (user_id, date)
);

create table public.settings (
  user_id  uuid primary key default auth.uid(),
  kcal     double precision,
  protein  double precision,
  goal     double precision
);

create table public.foods_custom (
  id       bigint generated always as identity primary key,
  user_id  uuid not null default auth.uid(),
  name     text not null,
  kcal     double precision not null,
  protein  double precision default 0,
  fat      double precision default 0,
  carbs    double precision default 0,
  portion  double precision default 100
);

alter table public.entries      enable row level security;
alter table public.weights      enable row level security;
alter table public.settings     enable row level security;
alter table public.foods_custom enable row level security;

create policy "own rows" on public.entries      for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on public.weights      for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on public.settings     for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own rows" on public.foods_custom for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
