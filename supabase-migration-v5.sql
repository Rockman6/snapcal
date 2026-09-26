-- SnapCal v5: foods_learned becomes a SHARED table — every signed-in user
-- reads the whole learned catalog; anyone signed-in can add to it.
-- Run in Supabase → SQL Editor (safe to run repeatedly).
drop policy if exists "own rows" on public.foods_learned;
drop policy if exists "read all" on public.foods_learned;
drop policy if exists "insert own" on public.foods_learned;
create policy "read all"   on public.foods_learned for select to authenticated using (true);
create policy "insert own" on public.foods_learned for insert to authenticated with check (user_id = auth.uid());
