# Ordinance

A congressional staff intelligence dashboard. Live demo: https://zhandrewh.github.io/Ordinance/

## Overview

Ordinance is an AI-powered platform built for congressional staff to query legislative procedure, ethics rules, appropriations processes, and related topics. The interface is modeled after an internal office intelligence tool — knowledge base queries, inter-office coordination threads, and report tracking.

## History

Vignesh began building a prototype and conducting market research in February 2026. That original work, including the idea framework generated via Lovable, is preserved in `/legacy`.

In April 2026, Vignesh met Andrew at the Congressional App Challenge. They discussed methods to elaborate the implementation and revived the project together. This repository is forked from Andrew's original frontend and incorporates a new AI engine (`/ordinance-ai-engine`) that connects dynamically to the Anthropic API.

## Repository Structure

```
/app                    Next.js app directory (pages, routing)
/components             Shared UI components
/legacy                 Vignesh's original prototype (Lovable-generated framework)
/lib                    Utility functions and shared logic
/ordinance-ai-engine    Dynamic AI demo — single-file HTML app powered by Claude API
/public                 Static assets
```

## Frontend

Built with Next.js, Tailwind CSS, and TypeScript. Deployed via GitHub Pages using a workflow in `/.github/workflows`.

The landing page and main interface live in `/app` and `/components`. Static assets (images, icons) are in `/public`.

To run locally:

```bash
npm install
npm run dev
```

## AI Engine

`/ordinance-ai-engine` contains a standalone HTML implementation of the knowledge base query interface. It calls the Anthropic API directly from the browser using `claude-haiku-4-5`.

To use it:
1. Open `demo-app.html` in a browser
2. Enter an Anthropic API key when prompted (stored in `localStorage`)
3. Select a preset question or type a custom one

The AI engine is self-contained — no build step, no dependencies. For production use, API calls should be proxied through a backend server to avoid exposing the key client-side.

## Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Anthropic Claude API (claude-haiku-4-5)

## Contributors

- Vignesh Nagarajan
- Andrew Zhang
