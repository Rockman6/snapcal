# Apple Watch → SnapCal bridge (free, no Xcode)

An iOS **Shortcut** reads yesterday-to-now Health data (recorded by the Watch)
and posts it to your Supabase every night. Build it once on the iPhone (~10 min).

## Build the Shortcut (Shortcuts app → + → name it "SnapCal Health")

Add actions in this order (search each by name):

1. **Find Health Samples** — Type: `Active Energy`, Start Date: `is today`; then
   **Calculate Statistics** on it → `Sum`. (= today's active kcal)
2. **Find Health Samples** — Type: `Steps`, Start Date: `is today`; then
   **Calculate Statistics** → `Sum`.
3. **Find Health Samples** — Type: `Resting Heart Rate`, Start Date: `is today`,
   Limit 1, newest first. (Just use the sample value.)
4. **Find Health Samples** — Type: `Sleep Analysis`, where `Value is Asleep`,
   Start Date: `is in the last 18 hours`; **Calculate Statistics** → `Sum` of
   Duration → **Calculate** ÷ 60 (minutes→hours) if the sum is in minutes.
5. **Find Health Samples** — Type: `Dietary Water`, Start Date: `is today`; then
   **Calculate Statistics** → `Sum` (set the unit to **mL** if asked). Water logged in
   Apple Health by any app (including the Watch) then counts toward SnapCal's water card.
6. **Find Health Samples** — Type: `Apple Exercise Time`, Start Date: `is today`;
   **Calculate Statistics** → `Sum` (minutes). SnapCal shows it as workout minutes.
7. **Get Contents of URL** (the login):
   - URL: `https://rlpbwgecbqtuwzspzisp.supabase.co/auth/v1/token?grant_type=password`
   - Method: POST · Request Body: JSON with `email` = your login email,
     `password` = your password
   - Headers: `apikey` = the anon key from `config.js` ·
     `Content-Type` = `application/json`
8. **Get Dictionary from Input**, then **Get Dictionary Value** → key
   `access_token`.
9. **Format Date** → Current Date, custom format `yyyy-MM-dd`.
10. **Get Contents of URL** (the upload):
   - URL: `https://rlpbwgecbqtuwzspzisp.supabase.co/rest/v1/health_daily?on_conflict=user_id,date`
   - Method: POST
   - Headers: `apikey` = anon key · `Authorization` = `Bearer ` + the
     access_token variable · `Content-Type` = `application/json` ·
     `Prefer` = `resolution=merge-duplicates`
   - Request Body (JSON):
     `date` = Formatted Date · `active_kcal` = result of step 1 ·
     `steps` = result of step 2 · `resting_hr` = result of step 3 ·
     `sleep_hours` = result of step 4 · `water_ml` = result of step 5 ·
     `workout_min` = result of step 6

Run it once by hand — Shortcuts will ask permission for each Health type
(allow), and the row appears in Supabase → Table Editor → `health_daily`.

## Make it automatic

Shortcuts → **Automation** tab → **+** → **Time of Day** → 11:45 PM, Daily →
Run Immediately → choose "SnapCal Health". Done: every night your day's
activity, steps, resting HR and last night's sleep sync themselves.

## What the site does with it

Settings → **Add exercise calories to the target** (No / Half / All) lets a hard
training day raise that day's calorie target by the Watch's active calories.

The Today tab's **Energy balance** card turns your profile (sex, age, height)
plus latest weight into a BMR estimate (Mifflin-St Jeor), adds the Watch's
active calories, and shows **In / Out / Net** — the number that moves the
weight chart. Steps · sleep · resting HR appear under it.
