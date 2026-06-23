# Ordinance

An AI-powered operating system for Congressional offices, branded as Capitol Intelligence.

An earlier branch of this project is also available at [github.com/zhandrewh/Ordinance](https://github.com/zhandrewh/Ordinance).

## Overview

Ordinance gives congressional staff a unified workspace to query legislation, ethics rules, and appropriations procedures through a natural-language interface. The platform combines a knowledge base, inter-agency coordination threads, and compliance report tracking into a single dashboard.

The current repository is a full Next.js application: a public marketing site plus a live, AI-backed demo at `/demo`. The demo is powered by a serverless backend that runs retrieval-augmented generation (RAG) over a knowledge base and calls Claude Haiku 4.5 through the Anthropic API. The Anthropic key stays server-side and never reaches the browser.

## History

Vignesh began building a prototype and conducting market research in February 2026. That original work, including the idea framework generated via Lovable, is preserved in `legacy/`.

In April 2026, Vignesh met Andrew at the Congressional App Challenge. They discussed methods to elaborate the implementation and revived the project together. This repository is forked from Andrew's original frontend and now incorporates a backend AI engine that connects dynamically to the Anthropic API.

### Legacy prototype vs. the current AI engine

The two implementations represent two different stages of the project, and they differ in almost every dimension:

| Dimension | `legacy/` prototype | Current AI engine |
|-----------|---------------------|-------------------|
| Origin | Lovable-generated Vite/React scaffold | Hand-built Next.js 15 app |
| Intelligence | None: static, hardcoded mock screens | Live answers from Claude Haiku 4.5 |
| Knowledge base | Placeholder UI with no real retrieval | RAG retrieval over a real document corpus plus user uploads |
| Backend | None (client-only) | Vercel serverless API routes (`/api/query`, `/api/summarize`) |
| API key handling | Not applicable | Server-side environment variable, never exposed to the client |
| Citations | None | Every answer is grounded in cited source documents |
| Build / deploy | Not built or deployed | Deployed on Vercel as a full Next.js app |
| Status | Preserved for history, not developed | Actively developed |

In short, the legacy prototype was a visual mockup that demonstrated the idea, while the current AI engine is a working product that actually answers questions against real documents.

## Architecture

```
Browser (/demo)
  -> POST /api/query        (Vercel serverless function, Node runtime)
       -> retrieve()        (lexical retrieval over the knowledge base + uploaded docs)
       -> Claude Haiku 4.5  (Anthropic API, key read from server env)
       <- grounded answer + cited sources
```

The browser never talks to the Anthropic API directly. It only calls the app's own `/api/*` routes, which run on Vercel's servers and hold the API key as an environment variable.

## Features

The `/demo` dashboard now implements a full working feature set:

- **Knowledge Base and Semantic Search**: natural-language queries answered live by Claude Haiku 4.5, grounded in retrieved documents with inline citations.
- **Document upload**: staff can upload office-specific text documents (memos, reports, correspondence). Uploaded documents are added to the knowledge base and retrieved alongside the built-in corpus when answering queries.
- **Functional Reports panel**: filter by status, search, and sort compliance reports, plus an AI "Summarize" action on each report.
- **Functional Coordination panel**: filter inter-agency threads by agency, search them, and generate an AI summary of any thread.
- **Audit Trail**: every query and action is logged for compliance and viewable in a dedicated panel.
- **Export and sharing**: export any AI answer as Markdown or JSON, copy it to the clipboard, or generate a shareable link that reopens the demo with the result preloaded.

## Repository Structure

```
app/                    Next.js app directory (pages, routing, API routes)
  api/
    query/route.ts      RAG query endpoint (retrieval + Claude Haiku)
    summarize/route.ts  AI summary endpoint for reports and threads
  demo/page.tsx         Interactive dashboard wired to the backend
  page.tsx              Landing page
  why/page.tsx          /why page
components/             Shared UI components used by the landing site
  sections/             Full-page sections: Hero, Navbar, ModernTools, etc.
  ui/                   Small reusable primitives: Container, Eyebrow, icons, etc.
legacy/                 Vignesh's original Lovable-generated prototype (not deployed)
lib/
  anthropic.ts          Server-side Anthropic client (Haiku 4.5)
  knowledgeBase.ts      Shared document corpus and types
  retriever.ts          Retrieval layer for RAG (vector-ready abstraction)
  clientStore.ts        Browser persistence for uploads and the audit log
  exportShare.ts        Export and share helpers
  assetPath.ts          Asset path helper
ordinance-ai-engine/    Standalone single-file AI demo (Anthropic API, bring-your-own-key)
  demo-app.html         Full dashboard UI with live Claude Haiku integration
  dynamic-engine-v1.html  Earlier iteration of the AI engine
  README.md             Setup and usage notes
public/                 Static assets: logo, feature card images
.env.example            Documents the ANTHROPIC_API_KEY environment variable
```

**Recent changes:** added a serverless backend (`app/api/`) and a RAG/AI library (`lib/`), wired the `/demo` dashboard to it, added document upload, audit trail, export/share, and made the Reports and Coordination panels functional. The project now deploys to Vercel instead of GitHub Pages (the static-export config and the GitHub Pages workflow were removed) because the demo needs a server runtime to keep the API key private. Two files in `ordinance-ai-engine/` were also renamed for clarity (`dynamic-engine-v1` to `dynamic-engine-v1.html`, `prod-v1-README.md` to `README.md`).

## Running locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file (copy `.env.example`) and add your Anthropic API key:

   ```bash
   ANTHROPIC_API_KEY=your-anthropic-api-key-here
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`. The landing page works without a key; the `/demo` AI features require the key.

## Deployment (Vercel)

The app deploys to Vercel as a standard Next.js application. Vercel runs the serverless API routes, which is what keeps the Anthropic key off the client.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvignesh-nagarajan-vn%2FOrdinance&env=ANTHROPIC_API_KEY&envDescription=Anthropic%20API%20key%20used%20by%20the%20server-side%20RAG%20endpoints)

Steps:

1. **Rotate your key first.** If a key has ever been pasted into chat, email, or a commit, revoke it in the [Anthropic Console](https://console.anthropic.com/settings/keys) and create a fresh one.
2. Import this repository into Vercel (or click the Deploy button above).
3. In the Vercel project, go to **Settings -> Environment Variables** and add `ANTHROPIC_API_KEY` with your key. Do **not** prefix it with `NEXT_PUBLIC_`; that prefix would expose it to the browser. Plain server variables are never sent to the client.
4. Deploy. The browser calls `/api/query` and `/api/summarize`, which run server-side on Vercel and read the key from `process.env.ANTHROPIC_API_KEY`. The key never appears in client code.

### Why not GitHub Pages

GitHub Pages serves static files only and cannot run a backend, so it cannot host the proxy that hides the API key. Hosting the demo there would require either embedding the key in public files (which would be scraped and abused) or asking every visitor for their own key. Vercel runs the serverless functions, so the hosted key stays private.

## How the key stays secure

- The key lives only as a server-side environment variable (`ANTHROPIC_API_KEY`) in Vercel and in `.env.local` for local development. Both are gitignored and never committed.
- All Anthropic calls happen inside `app/api/*` route handlers, which run on the server. The browser only ever calls those routes.
- `.env.example` documents the variable name with a placeholder value, never a real key.

## Stack

- Next.js 15 (App Router, serverless API routes)
- TypeScript 5
- Tailwind CSS 3
- React 19
- Anthropic Claude API (`claude-haiku-4-5`)

## Next Steps

The following items would move Ordinance further toward a production-ready release:

**Backend and AI**
- Swap the lexical retriever for a true vector database (for example Pinecone or pgvector) with an embeddings model, keeping the existing `retrieve()` interface.
- Persist uploaded documents and the audit log server-side (currently stored in the browser for the demo) so they survive across devices and sessions.
- Add streaming responses for lower perceived latency on longer answers.

**Authentication and Access**
- Add user authentication so only verified congressional staff can access sensitive features.
- Consider SSO integration with existing congressional IT systems.

**Features**
- Support more upload formats (PDF, DOCX) with server-side parsing.
- Build out the Compliance view and richer report workflows.
- Add role-based permissions for who can upload, query, and export.

**Operations**
- Add rate limiting and abuse protection on the API routes.
- Add observability (logging, error tracking) for the serverless functions.
- Register a production domain and configure it in Vercel.

**Design and UX**
- Conduct usability testing with actual congressional staffers.
- Improve mobile responsiveness across all landing and demo pages.
- Add an onboarding flow explaining Ordinance to first-time visitors.
