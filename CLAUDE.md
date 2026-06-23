# Ordinance — CLAUDE.md

## What this project is

**Ordinance** is an AI-powered operating system for Congressional offices, branded as "Capitol Intelligence." This repo contains:

1. **Landing site** — Next.js 15 marketing site deployed to GitHub Pages
2. **Demo app** — interactive mock dashboard at `/demo` simulating a congressional office OS
3. **Legacy directory** — the original Vite/React app from the Lovable platform (kept for history, not actively developed)

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (static export via `output: "export"`) |
| UI | React 19, Tailwind CSS 3 |
| Language | TypeScript 5.7 |
| Hosting | GitHub Pages (deploys on push to `main`) |
| CI/CD | `.github/workflows/deploy.yml` — builds then uploads `./out` |

## Repo layout

```
app/
  page.tsx          # Home — assembles landing sections
  why/page.tsx      # /why page
  demo/page.tsx     # /demo — fully self-contained interactive dashboard
  layout.tsx        # Root layout (fonts, globals)
  globals.css
components/
  sections/         # Hero, Navbar, ModernTools, ActionableInsights, DemoCTA, Footer
  ui/               # Container, Eyebrow, FeatureCell, GetDemoButton, GoldLeaves, icons
lib/
  assetPath.ts      # Utility for GitHub Pages asset prefix
public/ordinance/   # Brand images (logo, feature cards, actionable insights screenshot)
legacy/             # Original Lovable/Vite app (not deployed)
```

## Landing page sections (in order)

1. **Navbar** — top nav with logo and CTA
2. **Hero** — "Introducing Capitol Intelligence." headline with animated gold-leaf decoration
3. **ModernTools** — feature grid showing what Ordinance replaces
4. **ActionableInsights** — highlights the core "AI" (Actionable Insights) concept
5. **DemoCTA** — drives visitors to `/demo`
6. **Footer**

## Demo app (`/demo`)

A fully static, client-side dashboard that simulates the Ordinance product. No external API calls — safe for GitHub Pages.

Four panels:
- **Knowledge Base** — natural-language queries over 6 hardcoded government docs (EPA, CISA, CEQ, OMB circulars). Keyword-scored retrieval with a 450 ms simulated delay.
- **Semantic Search** — same `KbPanel` component reused with different placeholder queries
- **Reports** — table of mock compliance reports with priority bars and status pills
- **Inter-Agency Coordination** — thread list showing multi-agency coordination scenarios (EPA/USACE/DOI/FERC/DoD/NMFS)

All demo content is inlined in `app/demo/page.tsx` including the full CSS string (`DEMO_CSS`).

## Brand / design

- Color palette: cream (`#f0ebe0`), dark gold (`#b8860b`), ink (`#1a1710`)
- Typography: Playfair Display (headings), Inter (body)
- Dot-grid background pattern used on both landing and demo
- Gold left-border accent on AI response cards

## Dev commands

```bash
npm install       # install dependencies
npm run dev       # local dev server at http://localhost:3000
npm run build     # static export to ./out
npm run lint      # ESLint
```

## Deployment

Pushing to `main` triggers the GitHub Actions workflow which runs `npm ci && npm run build` and deploys `./out` to GitHub Pages. The `lib/assetPath.ts` helper handles the `/Ordinance` base path prefix for assets in the Pages environment.

## Key design decisions

- **Fully static demo**: the knowledge base search and all demo data live in the client bundle so the demo works without any backend, API keys, or server.
- **CSS-in-JS for the demo**: the demo component injects its styles via a `<style dangerouslySetInnerHTML>` string (`DEMO_CSS`) to keep the demo self-contained and avoid Tailwind class conflicts.
- **Legacy directory**: the `legacy/` folder holds the original Lovable-generated React/Vite codebase, imported via `git` history. It is not built or deployed by the current workflow.
