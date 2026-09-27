-- SnapCal v7: user-taught barcodes — every scan-miss a user fills in becomes
-- a permanent shared barcode entry for all users. Run in Supabase → SQL Editor.
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
