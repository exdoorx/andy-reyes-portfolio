# Andy Reyes — Portfolio Website

A modern, animated, fully responsive portfolio built with **React 19 + Vite + Tailwind CSS v4**.
Features: dark/light mode, typing animation, scroll-reveal animations, project filter, skill bars, timeline, certificates, and a contact form.

---

## 1. What you need first (one time only)

1. **Node.js (LTS)** — download from https://nodejs.org and install it (click Next through the installer).
   Check it worked: open a terminal and run
   ```
   node -v
   npm -v
   ```
   Both should print a version number (Node 20 or newer).
2. **VS Code** — https://code.visualstudio.com
3. **Git** (optional but needed for hosting) — https://git-scm.com

## 2. Open the project in VS Code

1. Unzip / copy the folder `andy-reyes-portfolio` somewhere easy, e.g. `Documents`.
2. Open VS Code → **File → Open Folder…** → choose `andy-reyes-portfolio`.
3. VS Code will pop up *"Do you want to install the recommended extensions?"* → click **Install**.
   (If not, open the Extensions tab `Ctrl+Shift+X` and install the ones below.)

### Recommended VS Code extensions
| Extension | Why |
|---|---|
| **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss) | Autocomplete and color previews for Tailwind classes |
| **ES7+ React/Redux Snippets** (dsznajder.es7-react-js-snippets) | Type `rafce` + Tab to make a component |
| **Prettier – Code formatter** (esbenp.prettier-vscode) | Auto-format on save |
| **ESLint** (dbaeumer.vscode-eslint) | Catches mistakes |
| **Auto Rename Tag** (formulahendry.auto-rename-tag) | Renames closing tags automatically |
| **Path Intellisense** (christian-kohler.path-intellisense) | Autocomplete file paths |
| **GitLens** (eamodio.gitlens) | See Git history (useful for hosting) |

## 3. Run the website

Open the VS Code terminal: **Terminal → New Terminal** (or `` Ctrl+` ``), then:

```bash
npm install      # downloads everything (first time only, 1–2 minutes)
npm run dev      # starts the website
```

You will see something like:

```
  ➜  Local:   http://localhost:5173/
```

`Ctrl+Click` that link — your portfolio opens in the browser. Any change you save in VS Code updates instantly.
To stop the server press `Ctrl+C` in the terminal.

### Other commands
```bash
npm run build     # makes the production version in the "dist" folder
npm run preview   # test the production version locally
```

## 4. Make it yours (edit these)

| What | Where |
|---|---|
| Name, email, social links, About text, skills, projects, experience, certificates | `src/data.js`  ← **start here** |
| Your photo | Replace `public/andy-avatar.svg` with your photo, e.g. `public/andy.jpg`, then change `src="/andy-avatar.svg"` in `src/components/Hero.jsx` to `src="/andy.jpg"` |
| Colors | `src/index.css` (`--color-brand-*`, `--color-accent-*`) |
| Page title | `index.html` |

> **About the photo:** the included `andy-avatar.svg` is an illustrated sample avatar, not a real photograph.
> Use a real, well-lit, front-facing photo of yourself (square crop, at least 800×800) for the best result.
>
> **Please check:** project descriptions, skill percentages and the OJT bullet points in `src/data.js` are
> sample wording. Edit them so they match what you really did. Also add your real email and your project links
> (the `link` and `code` fields).
>
> TESDA is spelled **TESDA** (Technical Education and Skills Development Authority). If your NC II / NC III
> have specific qualification titles (e.g. "Computer Systems Servicing NC II"), add them in the `certifications` list.

### Add your project links, LinkedIn and photo
In `src/data.js`:
- `profile.linkedin` → your LinkedIn **profile** link (`https://www.linkedin.com/in/your-name/`).
- Each project has `link` (live website) and `code` (GitHub repo). Paste the URLs between the quotes; the
  "Live site" and "Source code" links appear automatically once filled in. Empty ones stay hidden.
- Each project also has a **Try sample demo** button (insurance quote, math solver, instrument tones). The demos
  live in `src/components/Demos.jsx`.
- Prompt Engineer skills (Claude, Gemini, Microsoft Copilot) are in `promptEngineering` in the same file.
- Profile photo: your photo is already set up as `public/andy.jpg` (800x800). To change it, replace that file
  with another square photo using the same name.

### Your details already on the site
LinkedIn (`https://www.linkedin.com/in/areyesph/`) and GitHub (`https://github.com/exdoorx`) are set in
`src/data.js`, along with your experience, education and certificates. Still to fill in by you: your real
`email`, and each project's `link` and `code` URLs.

## 4b. Database & cloud setup (SQL, Supabase, Cloudflare)

These parts are optional. The website works without them.

### Supabase (saves contact-form messages to a real database)
1. Create a free project at https://supabase.com.
2. Open **SQL Editor -> New query**, paste all of `database/schema.sql`, click **Run**.
   This creates the tables for the contact form, food orders, appointments and study tasks, with Row Level Security.
3. Go to **Project Settings -> API**. Copy the **Project URL** and the **anon public** key.
4. In the project folder, copy `.env.example` to a new file named `.env` and paste the two values.
5. Restart `npm run dev`. The contact form now saves to Supabase (read messages in **Table Editor -> contact_messages**).
6. When you host on Vercel/Netlify/Cloudflare, add the same two variables in the host's **Environment variables** settings.

Never put the `service_role` key in the website code or in `.env`. It is for the Worker only.

### Cloudflare Worker (optional server-side form handler)
1. Create a free Cloudflare account and install Wrangler: `npm install -g wrangler`, then `wrangler login`.
2. Edit `cloudflare/wrangler.toml` (your Supabase URL and your website address).
3. `cd cloudflare`, then `wrangler secret put SUPABASE_SERVICE_KEY` (paste the service_role key), then `wrangler deploy`.
4. Wrangler prints your Worker URL. To use it, change the `fetch` URL in `src/lib/supabase.js` to that Worker URL and send
   `{ name, email, message }` as JSON.

### Cloudflare Pages (hosting)
Cloudflare dashboard -> **Workers & Pages -> Create -> Pages -> Connect to Git** -> pick your repo -> framework **Vite**
(build `npm run build`, output `dist`) -> Deploy.

## 5. Project structure

```
andy-reyes-portfolio/
├── .vscode/
│   ├── extensions.json      # recommended extensions
│   └── settings.json        # editor settings
├── public/
│   └── andy-avatar.svg      # your photo / avatar (served as /andy-avatar.svg)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # top menu + dark mode button
│   │   ├── Hero.jsx         # intro, typing text, photo
│   │   ├── Sections.jsx     # About, Skills, Projects, Contact, Footer
│   │   ├── Career.jsx       # Experience, Education, Certificates, Data & Cloud
│   │   ├── Demos.jsx        # demo window + insurance, math, sounds demos
│   │   ├── MoreDemos.jsx    # food order, appointment, calorie, subnet, password, planner demos
│   │   └── Reveal.jsx       # scroll animation + section title
│   ├── App.jsx              # puts everything together
│   ├── lib/supabase.js      # Supabase helper for the contact form
│   ├── data.js              # ALL your content lives here
│   ├── index.css            # Tailwind + custom styles
│   └── main.jsx             # React entry point
├── database/schema.sql      # SQL tables + security rules (Supabase / PostgreSQL)
├── cloudflare/              # Worker + wrangler.toml
├── .env.example
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 6. Put it online (free hosting)

First build check: run `npm run build` — if it finishes without errors, you're ready.

### Option A — Vercel (easiest, recommended)
1. Create a free account at https://vercel.com (sign in with GitHub).
2. Push your project to GitHub (see "GitHub steps" below).
3. In Vercel click **Add New → Project → Import** your repo.
4. Vercel auto-detects **Vite**. Leave the defaults (Build: `npm run build`, Output: `dist`) → **Deploy**.
5. In ~1 minute you get a live link like `https://andy-reyes.vercel.app`. Every `git push` updates it automatically.

### Option B — Netlify
1. https://netlify.com → **Add new site → Import from Git** (or drag-and-drop the `dist` folder after `npm run build`).
2. Build command `npm run build`, publish directory `dist`.

### Option C — Cloudflare Pages
https://pages.cloudflare.com → connect GitHub repo → framework preset **Vite** → Deploy. Very fast worldwide.

### Option D — GitHub Pages
Works too, but needs extra config (`base` in `vite.config.js` and a deploy workflow). Choose Vercel/Netlify if you want it simple.

### GitHub steps
```bash
git init
git add .
git commit -m "My portfolio"
git branch -M main
# create an empty repo on github.com first, then:
git remote add origin https://github.com/YOUR-USERNAME/andy-reyes-portfolio.git
git push -u origin main
```

### Custom domain (optional)
Buy something like `andyreyes.dev` or `andyreyes.com` (Namecheap, Cloudflare, GoDaddy ~₱600–1,000/year) and connect it in the Vercel/Netlify **Domains** settings.

## 7. Troubleshooting

| Problem | Fix |
|---|---|
| `'npm' is not recognized` | Install Node.js, then close and reopen VS Code |
| `npm install` fails | Delete `node_modules` and `package-lock.json`, run `npm install` again |
| Port already in use | Vite picks the next port automatically — use the link it prints |
| Styles look broken | Make sure `src/index.css` is imported in `src/main.jsx` and you ran `npm install` |
| Photo not showing | The file must be inside `public/` and the name in `Hero.jsx` must match exactly |

Good luck, Andy — congratulations on your graduation! 🎓
