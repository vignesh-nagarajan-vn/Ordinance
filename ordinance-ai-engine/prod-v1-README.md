# Ordinance — Capitol Intelligence

A congressional staff intelligence dashboard powered by Claude Haiku. Ask questions about legislative procedure, ethics rules, appropriations, and more — and get live AI-generated answers with cited sources.

## Setup

1. Clone the repo
2. Open `index.html` in a browser (no build step needed)
3. Enter your Anthropic API key in the banner that appears
4. Start querying

That's it. No server, no dependencies.

## Features

- **Live AI answers** via Claude Haiku (`claude-haiku-4-5`) — replaces the static mock responses from the original
- **Preset questions** covering common congressional procedure topics
- **Custom questions** — type anything and hit Enter or "Ask This"
- **Source citations** extracted from the model's response
- **Reports & Coordination panels** with static demo data
- API key stored in `localStorage` — never leaves your browser except to `api.anthropic.com`

## Notes

- Requires an [Anthropic API key](https://console.anthropic.com/)
- Calls are made directly from the browser to the Anthropic API (requires the `anthropic-dangerous-direct-browser-access` header, which is included)
- For a production deployment, proxy API calls through a backend to keep your key secret

## Stack

Single HTML file. No frameworks, no bundler. Vanilla JS + CSS.
