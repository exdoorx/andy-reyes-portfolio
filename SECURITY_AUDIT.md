# Security Audit and Hardening Report — andy-reyes-portfolio

Date: 2026-10-26. Scope: full repository, Supabase configuration, Cloudflare Worker contact layer, Vercel deployment headers. Type: defensive security engineering. No guarantee of completeness or unbreakability is claimed.

## 1. Threat model (actual application)

| Asset | Who attacks it | Attack path | Primary control |
|---|---|---|---|
| Public portfolio pages | Drive-by visitors, bots | XSS via injected content | No dangerouslySetInnerHTML/eval anywhere (verified); React text escaping; strict CSP |
| Contact form (contact_messages) | Spammers | Automated submissions, DB pollution | Honeypot, strict field allowlist, size limits, default-deny RLS (INSERT-only, anon), optional Turnstile |
| Admin dashboard (/#admin) | Impersonators | Direct URL access, hash-route bypass | Real Supabase session required (frontend); server-side admin verification on the data path (worker + allowlist) |
| Contact inquiries (PII) | Any visitor with the anon key | Anon-key SELECT via Supabase REST | RLS INSERT-only for anon/authenticated; reads only via worker with service key after token verification |
| Login endpoint | Credential stuffers | Brute force, account enumeration | Generic error text; Supabase Auth rate limits (dashboard); MFA recommended (dashboard) |
| Supabase service key | Client-side secret theft | VITE_ bundle leak, repo leak | Service key only in worker secrets; bundle verified clean; .env git-ignored |
| Users' own records (orders, appointments, tasks) | Horizontal privilege escalation | Cross-user reads, ownership-field writes | RLS auth.uid()=user_id; trigger locks ownership; appointments updates limited to cancel |

Trusted boundaries: (1) Supabase database with RLS and triggers, (2) Cloudflare Worker holding the service key. The React UI is never treated as a boundary.

## 2. Prioritized findings and remediations applied

| # | Severity | Finding (evidence) | Remediation |
|---|---|---|---|
| F1 | P0 | src/lib/contact.js read VITE_SUPABASE_ANON_KEY but .env defines VITE_SUPABASE_PUBLISHABLE_KEY: Supabase contact mode silently never activated | Canonical variable name now used; regression test pins the contract |
| F2 | P0 | AuthContext signOut line was dead-code nonsense (supabase.error ternary) | Cleaned in earlier session; verified intact at HEAD; regression from uncommitted working tree reverted |
| F3 | P1 | AdminDashboard selected contact_messages with the anon key: RLS denies; silent empty list | New GET /messages worker endpoint: bearer token verified against Supabase Auth, user id checked against ADMIN_USER_IDS secret via SHA-256 digests; dashboard surfaces explicit errors |
| F4 | P0 | .env.example contained a usable-looking URL as the publishable key | Placeholders are syntactically invalid (REPLACEME prefix); example documents all three contact modes and worker secrets |
| F5 | P0 | Hardcoded demo credentials admin@andy.dev/password123 in Login.jsx; #admin-demo hash bypass worked in production builds | Demo credentials removed entirely; bypass compiled out of production (import.meta.env.DEV gate); error text genericized (no enumeration, no provider-error echo) |
| F6 | P1 | Open redirect: ?redirect= param copied into location.hash unvalidated | New lib/redirect.js (local-hash allowlist), wired into Login; 10 regression tests |
| F7 | P1 | appointments UPDATE policy had no WITH CHECK and no column restriction (owner could reassign rows, edit any field) | database/migrations/002: trigger permits only status transitions for the owner; ownership immutable; policy has WITH CHECK |
| F8 | P1 | orders.total client-writable (check total >= 0 only) | database/migrations/002: total derived by trigger from order_items; write guard rejects any total not matching the recomputed sum |
| F9 | P2 | Worker defaulted ALLOWED_ORIGIN to * (open relay if unset) | Fail-closed: unset or mismatched Origin means 403 on POST/GET/OPTIONS |
| F10 | P2 | Fake analytics labeled "Real-time telemetry" / "Live Analytics Active" | Honest labeling: "simulated demo data"; visitor table states no real tracking; inquiries correctly labeled live database data |
| F11 | P2 | CSP required script-src 'unsafe-inline' (inline theme script) | Theme script moved to external public/theme-init.js; script-src is now 'self' only |
| F12 | P3 | Dead imports/vars (9 eslint warnings) | All cleared: AdminDashboard, BugHuntDemo, N8nDemo, SecurityScoutDemo; 3 legit uses preserved |

## 3. Code changes this session

- index.html / public/theme-init.js: inline executable script externalized (CSP) 
- vercel.json: strict CSP (script-src 'self'), failsafe frame-ancestors 'none', object-src 'none', base-uri 'self', form-action 'none', COOP same-origin, removes deprecated X-XSS-Protection, narrowed img-src to 'self' data:, worker domains added to connect-src
- src/Root.jsx: production builds hard-redirect any unauthenticated #admin access to #login
- src/components/Login.jsx: no demo credentials, generic auth errors, sanitized redirect
- src/lib/redirect.js: new redirect sanitizer
- src/lib/contact.js: canonical env var; placeholder logic unchanged
- src/lib/adminMessages.js: new admin read path via worker
- src/components/AdminDashboard.jsx: fetches via worker with session token; explicit error state; honest demo-data labeling; dead imports removed
- src/security.test.js: 10 real tests (redirect + env contract)
- cloudflare/worker.js: fail-closed origin, GET /messages (token verification + allowlist), optional Turnstile verification, secret-free structured logs, mass-assignment rejection
- cloudflare/worker.test.js: 12 tests (origin, JSON, size, allowlist, honeypot silence, 401s, preflight, fail-closed config)
- database/migrations/002_harden_orders_and_appointments.sql: appointment update guard, orders total derivation and write guard
- vitest.config.js: include cloudflare tests (brace-glob bug found: {js} did not match; plain *.test.js works)
- eslint.config.js: no-console off for workers (intentional server logging)
- .env.example: unusable placeholders plus documentation

## 4. Required Supabase dashboard changes (manual, must do)

1. Authentication > Providers > Email: DISABLE Sign Up (this is a private admin login only). This is the true fix for F5's account-creation surface; frontend does not rely on it.
2. Authentication > Users: create your own admin user; note the UUID.
3. Authentication > Policies: enable email confirmation; set minimum password length 12 or higher.
4. Authentication > MFA: announce/enroll a TOTP factor for the admin account; store recovery codes offline. Enforcing MFA cannot be done by RLS alone: it requires checking the AAL claim in database policies (see Supabase docs) or accepting a documented limitation that enrollment is optional.
5. Auth Providers > Email > Rate limits: keep default email rate limits; confirm max frequency for password reset (allowed emails per hour is configurable; low number is good, do not silently lockout).
6. SQL editor: run database/schema.sql (if not yet) then database/migrations/002_harden_orders_and_appointments.sql. Then revoke direct EXECUTE on the three shipped functions from anon/authenticated (see comments in migration).
7. Database > Storage: no buckets used; nothing to change (verified empty usage).
8. Leave contact_messages RLS exactly as is: INSERT-only. Do not add SELECT for anon/authenticated; reads stay in the worker.

## 5. Required Vercel project changes

1. Environment variables (Production and Preview): VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, and optionally VITE_CONTACT_ENDPOINT (worker URL). Nothing else may be VITE_* prefixed.
2. vercel.json headers are now deployed automatically (CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy, COOP). If a custom CSP violation appears in production (Report-URI monitoring recommended), adjust connect-src/img-src minimally.
3. Deployment protection optional and NOT relied upon: the site is public by design.
4. Source maps: not generated (confirmed zero .map files in dist). Keep it that way: do not enable build.sourcemap.

## 6. Worker secret configuration (Cloudflare, wrangler)

- wrangler secret put SUPABASE_SERVICE_KEY (service_role key; never in git or VITE_)
- wrangler secret put ADMIN_USER_IDS (the admin auth user UUID from step 4.2 above, comma-separated if multiple)
- wrangler secret put TURNSTILE_SECRET_KEY (optional: when set, POSTs must carry a valid turnstileToken)
- wrangler.toml [vars]: SUPABASE_URL (project URL) and ALLOWED_ORIGIN (https://areyes-eight.vercel.app). Fail-closed if omitted.
- Note: the frontend does not yet render a Turnstile widget. Enabling the TURNSTILE_SECRET_KEY secret without adding the widget will block all contact submissions. Add the widget first, then the secret.

## 7. Automated test evidence

Command: npx vitest run. Result: 6 files, 44 tests, 44 passed, 0 failed. Duration ~0.8-1.0 s. Breakdown:
- src/lib/mathSolver/nutrition/password/subnet: 22 pre-existing tests, still passing.
- src/security.test.js: 10 tests (redirect sanitizer vs external URLs/URI schemes/protocol-relative/encoding/non-string; contact env contract incl. exact regression F1).
- cloudflare/worker.test.js: 12 tests (mismatched Origin 403; missing Origin 403; malformed JSON 400; size 413; five field-validation 400s including wrong-type; honeypot silent 200 without DB call; GET /messages 401 with no token and with garbage token; preflight 403 for evil origin, 204 for allowed; 403 with ALLOWED_ORIGIN unset; 500 with malformed SUPABASE_URL).

Command: npx eslint . Result: 0 problems. Command: npm run build. Result: built successfully; dist verified: no .map files, no inline executable scripts, no hardcoded credentials, no service-role material in bundles; only VITE_SUPABASE_URL/VITE_SUPABASE_PUBLISHABLE_KEY/VITE_CONTACT_ENDPOINT referenced (these are public-safe values).

## 8. Security test report (control-by-control)

| Control | Status | Notes |
|---|---|---|
| Auth required for protected route (unauthenticated direct access) | PASS (code) | Root.jsx redirect; demo bypass compiled out for prod; verified by reading production build output |
| Direct API access to inquiries without a valid session | BLOCKED | Requires deployed worker; worker test proves 401 without token and with garbage token; DB layer has no anon SELECT to bypass regardless |
| Tampered ownership/role fields (mass assignment) | PASS (worker) | Unknown fields silently dropped by strict allowlist; wrong types rejected with 400. DB-side: appointments trigger restores ownership immutability |
| Open redirect | PASS | sanitizeHashRedirect tested against 12 attack vectors |
| SQL injection | PASS (review) | All queries use the Supabase JS client (parameterized REST); zero string-built SQL in repo (grep verified). No SECURITY DEFINER functions existed in the schema; the two added in migration 002 use fixed SQL and pinned search_path. No RPC endpoints exist. |
| Reflected/stored XSS | PASS (review) | No dangerouslySetInnerHTML/innerHTML/eval/new Function (grep verified, src and dist). React escapes by default. Message content is rendered as text nodes. |
| CSP enforcement | PASS (deploy pending) | script-src 'self'; no inline scripts remain in built HTML; headers configured in vercel.json; verify after deploy |
| Anon access to private tables | PASS (schema) | contact_messages has no SELECT policy for anon; orders/order_items/study_tasks/appointments require auth.uid; menu_items/services intentionally public |
| Cross-user record access | PASS (schema review) | Policies are owner-scoped; cross-user UPDATE/DELETE attempts are denied by RLS; run Supabase SQL editor tests after migration to confirm |
| Brute force / rate limiting on login | NOT TESTED | Cannot be enforced from frontend; Supabase dashboard rate limits exist by default (email sent limit configurable). Generic errors implemented. |
| Bot protection on contact form | BLOCKED (optional) | Worker supports Turnstile when secret configured; frontend widget is a next step |
| Secrets in client bundle | PASS | dist scanned: none. .env git-ignored and untracked (git ls-files verified: only .env.example tracked). No service-role key anywhere in the repo. No history scan performed this session: see risk R3. |
| Production error disclosure | PASS (review) | Worker logs contain no user data, tokens, or DB errors. Frontend surfaces friendly messages; provider error text is not echoed. |

## 9. Unresolved risks and next steps

- R1: MFA is recommended but not yet enrolled or enforced (dashboard step 4.4). Biggest single hardening win available.
- R2: Public account sign-up must be disabled in the Supabase dashboard (step 4.1). Until then, any visitor can create an account; RLS prevents data access but the surface exists.
- R3: No git history scan was performed for previously committed secrets. Run: git log -p --all | grep -i "service\|secret" or a tool like trufflehog/gitleaks. If found, rotate keys.
- R4: The anon (publishable) key in .env is a JWT valid until 2089; that key is public by design and safe as long as it genuinely is the anon key and RLS is enabled everywhere. Never give it elevated privileges.
- R5: The Turnstile widget is not yet present in the contact form; enable the worker secret only after adding the widget, otherwise submissions are blocked.
- R6: Chunk size >500 kB is a performance note, not a security issue.
- R7: Rate limiting on the worker POST endpoint is not implemented (KV-based limiter would be the approach). Spam surface is currently protected only by honeypot, validation, and RLS-restricted writes.

## 10. How to verify after deployment

1. Deploy with the Vercel env vars set; open the production site.
2. curl -I https://areyes-eight.vercel.app shows CSP, nosniff, HSTS, Referrer-Policy headers.
3. Visit /#admin while signed out: redirected to #login.
4. Sign in with your only admin account (after dashboard step 4.2): dashboard loads; Inquiries shows messages from the worker; Errors appear inline if the endpoint is misconfigured.
5. Attempt POST via curl to the worker without the allowed Origin: 403.
6. In Supabase SQL editor, run the query from schema.sql comment block as anon role to confirm contact_messages SELECT is denied.
