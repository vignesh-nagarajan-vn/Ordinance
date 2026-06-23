# Ordinance

An AI-powered operating system for Congressional offices, branded as Capitol Intelligence.

An earlier branch of this project is also available at [github.com/zhandrewh/Ordinance](https://github.com/zhandrewh/Ordinance).

## Overview

Ordinance gives congressional staff a unified workspace to query legislation, ethics rules, and appropriations procedures through a natural-language interface. The platform combines a knowledge base, inter-agency coordination threads, and compliance report tracking into a single dashboard.

The current repository contains the public marketing site and two demo implementations: a fully static Next.js demo embedded in the site, and a standalone AI-powered HTML app in `ordinance-ai-engine/` that calls the Anthropic API directly.

## History

Vignesh began building a prototype and conducting market research in February 2026. That original work, including the idea framework generated via Lovable, is preserved in `legacy/`.

In April 2026, Vignesh met Andrew at the Congressional App Challenge. They discussed methods to elaborate the implementation and revived the project together. This repository is forked from Andrew's original frontend and incorporates a new AI engine in `ordinance-ai-engine/` that connects dynamically to the Anthropic API.

## Repository Structure

```
app/                    Next.js app directory (pages and routing)
components/             Shared UI components used by the landing site
  sections/             Full-page sections: Hero, Navbar, ModernTools, etc.
  ui/                   Small reusable primitives: Container, Eyebrow, icons, etc.
legacy/                 Vignesh's original Lovable-generated prototype (not deployed)
lib/                    Utility functions (asset path helper for GitHub Pages)
ordinance-ai-engine/    Standalone AI demo powered by the Anthropic API
  demo-app.html         Full dashboard UI with live Claude Haiku integration
  dynamic-engine-v1.html  Earlier iteration of the AI engine (renamed from extensionless file)
  README.md             Setup and usage notes (renamed from prod-v1-README.md)
public/                 Static assets: logo, feature card images
.github/workflows/      GitHub Actions deploy pipeline
```

**Recent organizational changes:** two files in `ordinance-ai-engine/` were renamed for clarity. `dynamic-engine-v1` gained an `.html` extension to reflect its actual type, and `prod-v1-README.md` was renamed to `README.md` for standard discoverability.

## Frontend (Landing Site)

Built with Next.js 15, Tailwind CSS 3, and TypeScript 5. Deployed as a static export to GitHub Pages via the workflow in `.github/workflows/deploy.yml`. Every push to `main` triggers a build and deploy.

The landing page is assembled in `app/page.tsx` from the section components in `components/sections/`. A `/why` route and an interactive `/demo` route are also included. The demo at `/demo` is fully self-contained with no backend calls, making it safe to host as a static export.

To run locally:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## AI Engine (`ordinance-ai-engine/`)

`demo-app.html` is a single-file vanilla HTML and JavaScript application that calls `claude-haiku-4-5` via the Anthropic API. It is the live AI-backed version of the knowledge base interface.

To use it:

1. Open `demo-app.html` in a browser (no build step or server needed)
2. Enter an Anthropic API key when prompted
3. The key is stored in `localStorage` and never leaves your browser except to `api.anthropic.com`
4. Select a preset question or type a custom one and press Enter

Note: API calls are made directly from the browser using the `anthropic-dangerous-direct-browser-access` header. For any production deployment, calls should be proxied through a backend server to avoid exposing the key client-side.

## Stack

- Next.js 15 (static export)
- TypeScript 5
- Tailwind CSS 3
- React 19
- Anthropic Claude API (`claude-haiku-4-5`) for the AI engine

## Contributors

- Vignesh Nagarajan
- Andrew Zhang

## Next Steps

The following items represent the clearest path to a deployable, production-ready version of Ordinance:

**Backend and AI**
- Set up a backend server to proxy Anthropic API calls so keys are never exposed client-side
- Replace the static hardcoded knowledge base in `app/demo/page.tsx` with a real vector database (e.g., Pinecone or pgvector) populated with actual congressional documents
- Implement retrieval-augmented generation (RAG) so the AI references authoritative sources with citations
- Evaluate whether to move from `claude-haiku-4-5` to a larger model for higher-quality answers on complex legislative questions

**Authentication and Access**
- Add user authentication so only verified congressional staff can access sensitive features
- Consider SSO integration with existing congressional IT systems

**Features**
- Make the Reports and Coordination panels in the demo functional rather than static
- Add document upload so staff can ingest office-specific memos, committee reports, and correspondence
- Build out the Audit Trail view for compliance logging of all queries and actions
- Add export and sharing features for query results and reports

**Deployment**
- Register a production domain and configure it on GitHub Pages or migrate to a Node-capable host (Vercel or similar) once the backend is added
- Set up environment variable management for the API key rather than relying on `localStorage`
- Add basic rate limiting and abuse protection on the backend proxy

**Design and UX**
- Conduct usability testing with actual congressional staffers
- Improve mobile responsiveness across all landing and demo pages
- Add onboarding flow explaining Ordinance to first-time visitors
