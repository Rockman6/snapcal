# Plate & Scale — web app

Free food + body tracker: meal logging (12,095-food multilingual database),
barcode scanning (Open Food Facts), **in-browser AI photo recognition**
(MobileNetV4 via onnxruntime-web, runs on-device), daily weight/muscle/body-fat
tracking with trend charts. Hosted on GitHub Pages; data in your own Supabase.

## One-time setup

### 1. Supabase (~5 min, free plan, no card)
1. https://supabase.com → Start your project → New project.
2. SQL Editor → paste `supabase-schema.sql` → Run.
3. Authentication → Users → **Add user** → your email + a password
   (tick "auto-confirm").
4. Project Settings → API → copy **Project URL** and **anon public** key
   into `config.js`.

### 2. GitHub Pages (~5 min)
1. Create a GitHub account if needed.
2. `gh auth login` in the terminal (browser flow).
3. From this folder:
   ```bash
   gh repo create plate-scale --public --source=. --push
   gh api repos/{owner}/plate-scale/pages -X POST -f build_type=workflow \
     || echo "enable Pages in repo Settings → Pages → Source: GitHub Actions or main branch"
   ```
   Simplest UI route: repo Settings → Pages → Source: **Deploy from a branch**,
   Branch: **main / (root)** → Save. The site appears at
   `https://<you>.github.io/plate-scale/` in ~1 minute.

Every later update: commit + push, Pages redeploys automatically.

## Notes
- The anon key in `config.js` is public by design; Row Level Security +
  your email/password login protect the data.
- Camera features need HTTPS — GitHub Pages provides it.
- The model file (`model/food.onnx`, 33 MB) downloads on first Photo use and
  is then cached by the browser.
- Current model: 101 Western dishes (Food-101). The ~1,000-dish global model
  replaces the same file when training completes.
