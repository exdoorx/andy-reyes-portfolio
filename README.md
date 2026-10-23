# Andy Reyes — Portfolio Website

A fast, responsive, and accessible personal portfolio built with **React 19 + Vite + Tailwind CSS v4**.
It presents practical projects, software development and technical support experience, credentials, and a working contact path.

---

## Stack

- **React 19** + **Vite 7** for the front end.
- **Tailwind CSS v4** with a small custom design system in `src/index.css`.
- **Vitest + React Testing Library + jsdom** for tests.
- **ESLint** for code quality.

---

## Commands

```bash
npm install       # install dependencies
npm run dev       # start the dev server (default http://localhost:5173)
npm run lint      # lint the code with ESLint
npm run test      # run unit tests once
npm run build     # build the production bundle to dist/
npm run preview   # preview the production build locally
```

The `dist/` folder is what Vercel or any static host should serve. The default Vercel settings are:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

No extra routing config is needed: this is a single-page site with section navigation.

---

## Project structure

```
andy-reyes-portfolio/
├── index.html                 # page title, SEO/social metadata, JSON-LD, theme bootstrap
├── vite.config.js
├── eslint.config.js
├── vitest.config.js
├── database/schema.sql         # optional PostgreSQL/Supabase schema for the contact form + demos
├── cloudflare/
│   ├── wrangler.toml
│   └── worker.js               # optional server-side contact form endpoint
├── public/
│   ├── andy.jpg                # original portrait
│   ├── andy-480.webp / andy-800.webp
│   ├── favicon-32.png
│   ├── apple-touch-icon-180.png
│   ├── og-image.png
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── data.js                 # all portfolio copy, projects, skills, experience
    ├── hooks/useTheme.js
    ├── lib/
    │   ├── contact.js          # contact form delivery (worker / Supabase / mailto fallback)
    │   ├── mathSolver.js       # expression parser + linear solver
    │   ├── nutrition.js
    │   ├── password.js
    │   ├── subnet.js
    │   └── *.test.js           # unit tests for the logic above
    ├── components/
    │   ├── layout/             # Navbar and Footer
    │   ├── sections/           # Hero, About, Skills, Projects, Experience, Credentials, Engineering, Contact
    │   ├── demos/              # in-page interactive demos used by the Projects section
    │   └── ui/                 # Section, Reveal, Modal, Icons
    └── ...
```

---

## Editing content

Most copy lives in `src/data.js`:

- `profile` — name, headline, contact details, availability.
- `stats` — the short stat strip on the hero.
- `skillGroups` — the visible capability categories.
- `projects` — every project card and its demo in `src/components/demos`.
- `experience`, `education`, `certifications`, `engineering` — background facts.

To replace the portrait, drop a new `andy.jpg` into `public/` and regenerate `andy-480.webp` / `andy-800.webp`
(for example with `cwebp`). To add a resume, put a PDF in `public/` and set `profile.resumeUrl`
(for example `"/andy-reyes-resume.pdf"`). The resume button only appears when that path is set.

Do **not** add links, metrics, or credentials you cannot verify. This project intentionally avoids fake
project links, mock metrics, and unsupported claims.

---

## Contact form modes

`src/lib/contact.js` supports three configurations:

1. **Cloudflare Worker (recommended for production)**
   - Deploy `cloudflare/worker.js` with `wrangler`.
   - Set `VITE_CONTACT_ENDPOINT` in your deployment environment variables.
   - Keep `SUPABASE_SERVICE_KEY` only as a Worker secret, never in Vite variables.
2. **Direct Supabase insert**
   - Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
   - The database schema enables Row Level Security; messages are write-only from the client.
3. **Fallback (no environment variables configured)**
   - The contact form opens the visitor's email client with a pre-composed message.

---

## Accessibility

The UI uses semantic landmarks, labelled controls, visible focus states, aria-expanded navigation,
trap-and-restore modals, live regions for status, and honors `prefers-reduced-motion`.

---

## Build / Lint / Test

```bash
npm run lint      # ESLint
npm test          # Vitest unit tests
npm run build     # production build
```

CI runs these three commands on every push via `.github/workflows/ci.yml`.
