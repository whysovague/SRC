# SRC 2026 — KFUPM Conference Website

The website for **SRC 2026**, the first AIChE Student Regional Conference held in the GCC, hosted by KFUPM in Dhahran (August 31 – September 2, 2026). Built with React, TypeScript and Vite.

Visitors can browse the competitions and activities, read the FAQ, explore partnership packages, and register or log in through an in-page modal.

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [How To: Common Tasks](#-how-to-common-tasks)
- [Styling & Theming](#-styling--theming)
- [Deployment](#-deployment)
- [Known Issues](#-known-issues)

## 🛠️ Tech Stack

| Layer | Choice |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite 6 |
| Routing | React Router 7 (`react-router-dom`) |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) + custom CSS in `src/styles/` |
| Components | shadcn/ui on Radix UI (48 primitives in `src/app/components/ui/`) |
| Icons | lucide-react |
| Backend | Firebase (Firestore) — registration and login |

Tailwind 4 is configured **through CSS**, not a `tailwind.config.js`. See `src/styles/tailwind.css`.

Several packages ship with the shadcn scaffold and are available but not used by the conference pages yet (`recharts`, `embla-carousel-react`, `react-hook-form`, `motion`, `date-fns`, `canvas-confetti`, MUI).

## 📦 Installation & Setup

### Prerequisites

- **Node.js** v18 or higher (developed on v22) — [Download](https://nodejs.org/)
- **npm** (ships with Node)

> This project uses **npm** — the committed lockfile is `package-lock.json`. A leftover `pnpm-workspace.yaml` sits in the repo root but there is no pnpm lockfile; use npm to keep the lockfile consistent.

### Steps

```bash
git clone <repository-url>
cd SRC
npm install
```

Then create your `.env` file — see below. Without it the site still renders, but registration and login will not work.

## 🔑 Environment Variables

Firebase configuration is read from environment variables at build time. Copy the template and fill it in:

```bash
cp .env.example .env
```

| Variable | Where to find it |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Console → Project settings → Your apps → SDK setup |
| `VITE_FIREBASE_AUTH_DOMAIN` | same |
| `VITE_FIREBASE_PROJECT_ID` | same |
| `VITE_FIREBASE_STORAGE_BUCKET` | same |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | same |
| `VITE_FIREBASE_APP_ID` | same |

Notes:
- **Restart the dev server after editing `.env`** — Vite only reads it at startup.
- `.env` is not committed. Only `.env.example` is.
- If the variables are missing, `src/app/lib/firebase.ts` logs a clear console error and the app keeps rendering; only registration and login are disabled.

## 🚀 Running the Project

```bash
npm run dev
```

Starts Vite with hot module replacement on `http://localhost:5173`.

```bash
npm run build      # production build into dist/
npx vite preview   # serve the built dist/ locally
```

## 📝 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run typecheck` | Run TypeScript with no emit — **the build does not check types** |

> ⚠️ `vite build` strips TypeScript types without checking them, so a build can succeed while the app is broken at runtime (an undefined identifier, a missing import). **Run `npm run typecheck` before committing.**

## 📁 Project Structure

```
SRC/
├── src/
│   ├── main.tsx                       # Entry point — mounts <App> inside <BrowserRouter>
│   ├── app/
│   │   ├── App.tsx                    # Shell: URL ⇄ section, page switch, layout frame (117 lines)
│   │   ├── routes.ts                  # Section ⇄ URL path map
│   │   ├── types.ts                   # Section, RegType, Competition
│   │   ├── theme.ts                   # Brand colour constants
│   │   │
│   │   ├── pages/                     # One file per page
│   │   │   ├── HomePage.tsx           # Hero, stats, about section, timeline
│   │   │   ├── TimelineSection.tsx    # Milestone timeline (used by HomePage)
│   │   │   ├── CompetitionsPage.tsx   # Competition & activity cards
│   │   │   ├── AgendaPage.tsx         # Agenda data, AgendaPage, AgendaComingSoon
│   │   │   ├── PartnershipPage.tsx
│   │   │   ├── FAQPage.tsx
│   │   │   └── ContactPage.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── common/                # Shared building blocks (+ index.ts barrel)
│   │   │   │   ├── typography.tsx     # SectionTag, SectionTitle, Divider,
│   │   │   │   │                      #   GradientEyebrow, ComingSoonBadge
│   │   │   │   ├── CTAButton.tsx
│   │   │   │   ├── InteractiveCard.tsx  # 3D tilt + cursor-tracked glow
│   │   │   │   ├── GlassCard.tsx
│   │   │   │   ├── RevealOnScroll.tsx
│   │   │   │   ├── MoleculeNetwork.tsx  # Animated particle background
│   │   │   │   ├── CountUp.tsx
│   │   │   │   └── SRCLogo.tsx
│   │   │   ├── hero/
│   │   │   │   ├── HeroLogo.tsx
│   │   │   │   ├── MolecularOrbit.tsx   # Drag-to-spin 3D orbit canvas
│   │   │   │   └── CountdownTimer.tsx   # Split-flap countdown to day one
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx           # Also exports navItems
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── HelpButton.tsx       # Floating FAQ shortcut
│   │   │   ├── registration/
│   │   │   │   ├── RegistrationModal.tsx    # Registration + login flow
│   │   │   │   └── registration.data.tsx    # REG_TYPES, COMPETITIONS, …
│   │   │   ├── ui/                    # 48 shadcn/ui primitives
│   │   │   └── figma/                 # ImageWithFallback
│   │   │
│   │   └── lib/                       # Firebase and user helpers
│   │       ├── firebase.ts            # Init, submitRegistration
│   │       ├── auth.ts  users.ts  userLogin.ts
│   │
│   ├── assets/                        # Logos and SVGs
│   └── styles/
│       ├── index.css                  # Imports the rest
│       ├── theme.css                  # Design tokens + global component CSS
│       ├── globals.css  tailwind.css  fonts.css
│
├── guidelines/Guidelines.md
├── .env.example                       # Firebase variable template
├── index.html  vite.config.ts  tsconfig.json  postcss.config.mjs
└── package.json
```

## 🏗️ Architecture

### Routing and pages

Each page has a real URL. `src/app/routes.ts` is the single source of truth pairing a `Section` with its path:

| Section | URL |
|---|---|
| `home` | `/` |
| `competitions` | `/competitions` |
| `agenda` | `/agenda` |
| `partnership` | `/partnership` |
| `faq` | `/faq` |
| `contact` | `/contact` |

`App.tsx` derives the current section from `location.pathname` and turns `setSection` into a `navigate()` call. Every other component still receives a plain `Section` value, so nothing else needs to know a router exists. Unknown paths redirect to `/`, and a trailing slash resolves to the same page.

### Where the state lives

`App.tsx` owns exactly three things:

1. **Current page** — derived from the URL.
2. **Registration modal** — open/closed, plus an optional preselected competition so a card's "Participate" button can deep-link into the right form.
3. **Logged-in user** — a lightweight session in `localStorage` backed by a Firestore document (not Firebase Auth).

### Registration

Registration is a **modal**, not a page. It opens from the navbar button or from any "Participate" button on the competitions page, which preselects that competition. The login screen is a mode of the same modal.

### Styling

Three tiers, in order of preference:

1. **Tailwind utility classes** — most layout and spacing.
2. **`src/styles/theme.css`** — design tokens and any CSS shared by more than one page (`.src-cta*`, `.src-icard*`, `.src-reveal`, the `faq*` animations, fonts, scrollbar).
3. **A scoped `<style>` block inside a page** — only for rules that page alone uses.

> **Important:** if a shared component needs CSS, it belongs in `theme.css`, not in a page's `<style>` block. A rule defined inside one page does not exist when a different page is mounted — this previously caused a component to silently lose its styling on another page.

## 🧭 How To: Common Tasks

### Add a new page

1. Create `src/app/pages/MyPage.tsx` exporting `export function MyPage() { … }`.
2. Add its key to the `Section` union in `src/app/types.ts`.
3. Add its path to `SECTION_PATHS` in `src/app/routes.ts`.
4. Import it in `App.tsx` and add an entry to the `pages` record.
5. To link it in the top nav, add it to `navItems` in `components/layout/Navbar.tsx`; for the footer, add it to `links` in `components/layout/Footer.tsx`.

TypeScript enforces steps 2–4: miss one and `npm run typecheck` tells you exactly which.

### Add a competition or activity

Edit the `competitions` array in `src/app/pages/CompetitionsPage.tsx`. Give it a `compId` matching an entry in `components/registration/registration.data.tsx` to make its button deep-link into the registration form; omit `compId` and the button opens the modal normally.

### Update the FAQ

Edit the `faqs` array in `src/app/pages/FAQPage.tsx`. Each entry takes `q`, `a`, and an optional `list` for bulleted answers.

### Publish the agenda

The agenda is hidden behind a flag. Set `AGENDA_LIVE = true` in `src/app/pages/AgendaPage.tsx` to swap the "coming soon" screen for the real schedule (`AGENDA_DAYS`, `AGENDA_ALL_DAY`).

### Change the countdown target

`EVENT_START` at the top of `src/app/components/hero/CountdownTimer.tsx`.

### Add a shared component

Put it in `src/app/components/common/`, export it from `index.ts`, and put any CSS it needs in `src/styles/theme.css`.

## 🎨 Styling & Theming

Brand colours live in two places, deliberately:

- **`src/app/theme.ts`** — `TEAL`, `ORANGE` and friends, for colours used in inline styles and canvas drawing.
- **`src/styles/theme.css`** — CSS custom properties (`--card`, `--border`, `--muted-foreground`) consumed by Tailwind classes and shadcn components.

Changing a brand colour usually means updating both.

## 🔍 SEO & Metadata

The site is set up to be found by searches like "SRC KFUPM" or "SRC AIChE".

| Where | What it holds |
|---|---|
| `index.html` | Title, description, canonical, Open Graph / Twitter tags, and JSON-LD structured data for the home page |
| `src/app/routes.ts` → `PAGE_META` | Per-page title and description |
| `public/robots.txt` | Allows all crawlers, points to the sitemap |
| `public/sitemap.xml` | The six public URLs — **keep in sync with `SECTION_PATHS`** |
| `public/og-image.png` | 1200×630 social preview card |

**How the pieces fit:** `index.html` is what a crawler sees before JavaScript runs, so it carries the home page's metadata. `App.tsx` then applies `PAGE_META[section]` on navigation, updating the title, description, canonical and `og:` tags for the other pages.

The JSON-LD declares an `EducationEvent` plus the organizing `Organization`, and lists `"SRC KFUPM"` and `"SRC AIChE"` as `alternateName` values — that is what tells a search engine those phrases refer to this event.

> ⚠️ Absolute URLs (`canonical`, `og:url`, `og:image`, the sitemap) are hardcoded to `https://srcsa26.com`. **If the domain changes, update `index.html` and `public/sitemap.xml`.**

### After deploying

1. Verify with [Google Rich Results Test](https://search.google.com/test/rich-results) and the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).
2. Register the site in [Google Search Console](https://search.google.com/search-console), submit `sitemap.xml`, and use "Request indexing" for the home page.
3. Ranking for a term like "SRC KFUPM" also depends on other sites linking to you — the KFUPM and AIChE chapter pages and social profiles are the highest-value links.

### Adding a page

Add its entry to `PAGE_META` in `routes.ts` (TypeScript requires it) and add its `<url>` to `public/sitemap.xml`.

## 🌐 Deployment

```bash
npm run build     # outputs to dist/
```

Deploy the contents of `dist/`.

> ⚠️ **This is a single-page app with real URLs.** The host must rewrite all paths to `index.html`, otherwise a visitor who refreshes on `/faq` gets a 404. Vite's dev server does this automatically, so the problem only appears in production.
>
> - **Netlify** — add `public/_redirects` containing `/*  /index.html  200`
> - **Vercel** — add a rewrite of `/(.*)` to `/index.html` in `vercel.json`
> - **Nginx** — `try_files $uri $uri/ /index.html;`
> - **GitHub Pages** — copy `dist/index.html` to `dist/404.html`

Remember that the Firebase variables must also be set in the host's build environment.

## 🐛 Known Issues

Small things worth knowing, none of them blocking:

- **`src/app/lib/auth.ts` and `src/app/lib/userLogin.ts` are unused.** `auth.ts` wraps Firebase Auth (register, login, logout, password reset); `userLogin.ts` is a Firestore login helper. The live flow uses `lib/users.ts` + `lib/firebase.ts` instead, via `RegistrationModal`. They are kept as a starting point should the project move to real Firebase Auth — delete them if that is not planned.
- **`pnpm-workspace.yaml` without a pnpm lockfile** — see the install note above.
- **`src/package-lock.json`** — a stray lockfile inside `src/`; the real one is at the repo root.

## 📚 Additional Resources

- [Vite](https://vitejs.dev/) · [React](https://react.dev/) · [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/docs) · [shadcn/ui](https://ui.shadcn.com/) · [Radix UI](https://www.radix-ui.com/)
- [Firebase](https://firebase.google.com/docs/web/setup)
- Project conventions: [Guidelines.md](./guidelines/Guidelines.md)

## 👥 Getting Help

1. Run `npm run typecheck` — it catches most breakages the build misses.
2. Check the browser console; Firebase configuration problems report themselves clearly there.
3. Look at an existing page in `src/app/pages/` as a template.

## 📄 License

See [ATTRIBUTIONS.md](./ATTRIBUTIONS.md) for license and attribution information.
