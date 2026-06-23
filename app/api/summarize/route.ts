import { NextRequest, NextResponse } from "next/server";
import { getClient, MODEL, MissingKeyError, textFromMessage } from "@/lib/anthropic";

// Powers the AI "Summarize" action on the Reports and Coordination panels.
// Given a structured record, returns a tight staffer-ready summary with the
// status, the blocker, and the recommended next action.
export const runtime = "nodejs";

type SummarizeBody = {
  kind?: "report" | "thread";
  title?: string;
  content?: string;
};

export async function POST(req: NextRequest) {
  let body: SummarizeBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const content = (body.content ?? "").trim();
  if (!content) {
    return NextResponse.json({ error: "Missing 'content'." }, { status: 400 });
  }

  const kind = body.kind === "thread" ? "inter-agency coordination thread" : "compliance report";
  const system = `You are Ordinance, an AI assistant for congressional and federal agency staff. Summarize the provided ${kind} for a busy staffer in 2-3 sentences. Lead with current status, name the key blocker or dependency, and end with the single most important next action. Be specific and do not invent details beyond what is given.`;

  const userPrompt = `${body.title ? `Title: ${body.title}\n\n` : ""}${content}`;

  try {
    const client = getClient();
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 300,
      system,
      messages: [{ role: "user", content: userPrompt }],
    });

    return NextResponse.json({ summary: textFromMessage(message.content) });
  } catch (err) {
    if (err instanceof MissingKeyError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    console.error("Anthropic summarize failed:", err);
    return NextResponse.json(
      { error: "The AI service is temporarily unavailable. Please try again." },
      { status: 502 }
    );
  }
}
