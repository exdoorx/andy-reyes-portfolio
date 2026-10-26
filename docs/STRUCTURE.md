# Repository Structure — Phase 12 (before/after + justifications)

Date: 2026-10-26. Principle: separation by *execution environment* and by *truth*, not by obscurity. No rename prevents source inspection; the goal is a tree a reviewer can read correctly at a glance.

## Before → After

| Before | After | Why |
|---|---|---|
| `src/context/AuthContext.jsx` | `src/features/identity/AuthContext.jsx` | All identity concerns (auth state, sign-in/out) grouped together; "features/identity" states intent |
| `src/components/Login.jsx` | `src/features/identity/Login.jsx` | same grouping — this is auth UI, not portfolio presentation |
| `src/components/AdminDashboard.jsx` | `src/features/admin/AdminDashboard.jsx` | Privileged UI separated from public portfolio UI; imports now visibly depend on `lib/adminMessages` (server-side-mediated data path) |
| `src/security.test.js` | `tests/security/security.test.js` | Security regression tests live outside the app source and run standalone |
| `database/schema.sql` | `supabase/migrations/001_initial_schema.sql` | Versioned migration ordering; matches Supabase conventions |
| `database/migrations/002_...sql` | `supabase/migrations/002_harden_orders_and_appointments.sql` | flattened nesting, one migrations dir |
| — | `.vercelignore` (new) | Keeps ops docs, SQL, worker code, tests, and scripts out of deployment uploads |
| — | `docs/STRUCTURE.md` (this file) | Structural decisions written down once |

Unchanged on purpose (framework-required or already purposeful): `index.html`, `vite.config.js`, `vitest.config.js`, `eslint.config.js`, `package.json`, `public/**` (icons, images, `theme-init.js`), `src/main.jsx`, `src/App.jsx`, `src/Root.jsx` (entry/router), `src/data.js`, `src/lib/*` (browser-safe modules), `src/components/{layout,sections,demos,ui}`, `cloudflare/{worker.js,worker.test.js,wrangler.toml}` (trusted server-side boundary), `src/data/{brands.js,demoEngagement.js}`.

## Environment classifier (what executes where)

- **Browser bundle:** everything in `src/**` — public instructors: portfolio copy, calculators, contact client, auth UI. Only public-safe values are injected (`VITE_SUPABASE_URL`, anon key, `VITE_CONTACT_ENDPOINT`).
- **Trusted server only (never bundled):** `cloudflare/worker.js` (service key custody, admin allowlist, message reads), Supabase Postgres itself (RLS + triggers).
- **Dev-only, bundler-eliminated in production:** `src/data/demoEngagement.js` — imported exclusively through `import.meta.env.DEV ? dynamic import : reject`. Verified: no demo chunk emitted in `dist/`, no sample emails in bundles.

## Exclusions from production (and why)

- `.vercelignore`: `SECURITY_AUDIT.md`, `AUTHENTICATION_IMPLEMENTATION.md` (private operational docs), `supabase/` (applied via dashboard, not at deploy), `cloudflare/` (deploys through wrangler, not Vercel), `tests/`, `scripts/`, `.claude/`, `.vscode/`.
- Source maps: not configured — verified `dist/assets/*.map` count is zero.
- Demo sample data: dev-only dynamic chunk (verified by string-scan of every emitted asset).

## Secret audit results this phase

- `git ls-files` tracking check: `.env` is untracked; only `.env.example` is committed. `.env.example` contains only `REPLACEME` placeholders.
- Production bundles scanned: no `service_role` material, no hardcoded credentials, no `VITE_` variables beyond the three public-safe ones.
- Limits: automated scans (grep patterns) cannot guarantee detection of every sensitive value; no git-history deep scan performed yet — run `gitleaks` or `trufflehog` before any public history claim.

## Verification performed

- `npm test` → 6 files, 44/44 passed (includes moved `tests/security/` via vitest include).
- `npx eslint .` → 0 problems.
- `npm run build` → success; `dist/` inspected (no source maps, no inline executable scripts, no demo data, no creds).
- Imports for every moved file updated and resolved (build would fail otherwise); feature-folder changes preserved all routes and public behavior.

## Controls enforced outside the frontend (unchanged obligations)

1. Supabase dashboard: signup disabled, MFA enrollment, email confirmation, rate limits.
2. Run `supabase/migrations/002_harden_orders_and_appointments.sql` in SQL editor.
3. Worker secrets: `SUPABASE_SERVICE_KEY`, `ADMIN_USER_IDS`; `wrangler.toml` vars already configured.
4. Vercel env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, optional `VITE_CONTACT_ENDPOINT`.
