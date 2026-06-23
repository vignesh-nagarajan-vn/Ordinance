# Ordinance: CLAUDE.md

## What this project is

**Ordinance** is an AI-powered operating system for Congressional offices, branded as "Capitol Intelligence." This repo contains:

1. **Landing site**: Next.js 15 marketing site
2. **AI demo app**: interactive dashboard at `/demo` backed by a serverless RAG API that calls Claude Haiku 4.5
3. **Standalone AI engine**: a single-file HTML app in `ordinance-ai-engine/` (bring-your-own-key)
4. **Legacy directory**: the original Vite/React app from the Lovable platform (kept for history, not actively developed)

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router, serverless API routes) |
| UI | React 19, Tailwind CSS 3 |
| Language | TypeScript 5.7 |
| AI | Anthropic Claude API (`claude-haiku-4-5`) via `@anthropic-ai/sdk` |
| Hosting | Vercel (serverless functions run the API routes) |

## Repo layout

```
app/
  api/
    query/route.ts        # RAG query endpoint: retrieval + Claude Haiku, key from server env
    summarize/route.ts    # AI summary endpoint for reports and coordination threads
  page.tsx                # Home page, assembles landing sections
  why/page.tsx            # /why page
  demo/page.tsx           # /demo, interactive dashboard wired to the backend
  layout.tsx              # Root layout (fonts, globals)
  globals.css
components/
  sections/               # Hero, Navbar, ModernTools, ActionableInsights, DemoCTA, Footer
  ui/                     # Container, Eyebrow, FeatureCell, GetDemoButton, GoldLeaves, icons
lib/
  anthropic.ts            # Server-side Anthropic client (Haiku 4.5)
  knowledgeBase.ts        # Shared document corpus and KbDoc type
  retriever.ts            # Retrieval layer for RAG (lexical now, vector-ready)
  clientStore.ts          # Browser persistence: uploaded docs + audit log
  exportShare.ts          # Export (Markdown/JSON) and share-link helpers
  assetPath.ts            # Asset path helper
ordinance-ai-engine/
  demo-app.html           # Full dashboard UI with live Claude Haiku integration
  dynamic-engine-v1.html  # Earlier iteration of the AI engine
  README.md               # Setup and usage notes
public/ordinance/         # Brand images (logo, feature cards, actionable insights screenshot)
legacy/                   # Original Lovable/Vite app (not deployed)
.env.example              # Documents the ANTHROPIC_API_KEY environment variable
```

## Landing page sections (in order)

1. **Navbar**: top nav with logo and CTA
2. **Hero**: "Introducing Capitol Intelligence." headline with animated gold-leaf decoration
3. **ModernTools**: feature grid showing what Ordinance replaces
4. **ActionableInsights**: highlights the core "AI" (Actionable Insights) concept
5. **DemoCTA**: drives visitors to `/demo`
6. **Footer**

## Demo app (`/demo`)

A client dashboard wired to the serverless backend. Panels:

- **Knowledge Base** and **Semantic Search**: natural-language queries answered live by Claude Haiku 4.5 through `/api/query`, grounded in retrieved documents with cited sources.
- **Documents**: upload text documents that are stored in the browser and sent with each query so they are retrieved alongside the built-in corpus.
- **Reports**: filter, search, and sort mock compliance reports, with an AI "Summarize" action per report via `/api/summarize`.
- **Inter-Agency Coordination**: filter and search threads (EPA/USACE/DOI/FERC/DoD/NMFS), with an AI "Summarize" action per thread.
- **Audit Trail**: compliance log of every query and action, stored in the browser.

The demo also supports exporting an AI answer as Markdown or JSON, copying it, and generating a shareable link. The demo CSS is inlined via a `<style dangerouslySetInnerHTML>` string (`DEMO_CSS`).

## RAG pipeline

`app/api/query/route.ts` runs the flow: retrieve relevant documents from the built-in corpus (`lib/knowledgeBase.ts`) plus any user-uploaded documents, build a grounded prompt, call Claude Haiku 4.5, and return the answer with cited source IDs. Retrieval lives behind `lib/retriever.ts` as a single `retrieve()` function so the lexical implementation can be swapped for a vector store later without changing call sites.

## Brand / design

- Color palette: cream (`#f0ebe0`), dark gold (`#b8860b`), ink (`#1a1710`)
- Typography: Playfair Display (headings), Inter (body)
- Dot-grid background pattern used on both landing and demo
- Gold left-border accent on AI response cards

## Dev commands

```bash
npm install       # install dependencies
npm run dev       # local dev server at http://localhost:3000
npm run build     # production build
npm run lint      # ESLint
```

Set `ANTHROPIC_API_KEY` in `.env.local` for the `/demo` AI features to work locally.

## Deployment

The app deploys to Vercel as a standard Next.js application. Vercel runs the API routes as serverless functions and holds `ANTHROPIC_API_KEY` as a server-side environment variable (not prefixed with `NEXT_PUBLIC_`), so the key never reaches the browser. GitHub Pages is not used because it cannot run the backend needed to keep the key private.

## Key design decisions

- **Server-side key**: all Anthropic calls happen in `app/api/*` route handlers. The browser only calls those routes, so the API key stays private. This is why the app moved off GitHub Pages static export to Vercel.
- **Swappable retrieval**: `lib/retriever.ts` isolates retrieval behind one function so lexical retrieval can later become vector retrieval without touching the API route or UI.
- **Demo persistence in the browser**: uploaded documents and the audit log live in `localStorage` so the demo is fully functional on a stateless serverless host with no database. In production these would move server-side.
- **Legacy directory**: the `legacy/` folder holds the original Lovable-generated React/Vite codebase. It is not built or deployed.
