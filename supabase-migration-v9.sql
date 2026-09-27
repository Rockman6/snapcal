-- SnapCal v9 (optional): sync the daily water target across devices.
-- Without it, the target is remembered per device. Additive; safe to run repeatedly.
alter table public.settings add column if not exists water_ml double precision;
