import Anthropic from "@anthropic-ai/sdk";

// Server-only Anthropic client. The key is read from the environment and never
// shipped to the browser. Per the project constraint, all calls use Haiku 4.5
// to keep token/credit usage low.
export const MODEL = "claude-haiku-4-5";

let client: Anthropic | null = null;

export function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new MissingKeyError();
  }
  if (!client) {
    client = new Anthropic({ apiKey });
  }
  return client;
}

export class MissingKeyError extends Error {
  constructor() {
    super(
      "ANTHROPIC_API_KEY is not configured on the server. Set it in your Vercel project's Environment Variables (or .env.local for local dev)."
    );
    this.name = "MissingKeyError";
  }
}

/** Collapse a Claude message's content blocks into plain text. */
export function textFromMessage(content: Array<{ type: string }>): string {
  return content
    .filter((b): b is { type: "text"; text: string } => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}
