-- Plate & Scale website schema. Run once in Supabase → SQL Editor.
-- Access model: one human, signed in with email/password (Supabase Auth).
-- All tables: only authenticated users read/write; the public anon key alone
-- can do nothing, so it is safe inside the public GitHub repo.

create table if not exists public.entries (
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

create table if not exists public.weights (
  date       text primary key,
  weight     double precision not null,
  muscle     double precision,
  body_fat   double precision,
  created_at bigint
);

create table if not exists public.settings (
  id       int primary key,
  kcal     double precision,
  protein  double precision,
  goal     double precision
);

create table if not exists public.foods_custom (
  id       bigint generated always as identity primary key,
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

drop policy if exists "auth all" on public.entries;
drop policy if exists "auth all" on public.weights;
drop policy if exists "auth all" on public.settings;
drop policy if exists "auth all" on public.foods_custom;
create policy "auth all" on public.entries      for all to authenticated using (true) with check (true);
create policy "auth all" on public.weights      for all to authenticated using (true) with check (true);
create policy "auth all" on public.settings     for all to authenticated using (true) with check (true);
create policy "auth all" on public.foods_custom for all to authenticated using (true) with check (true);
