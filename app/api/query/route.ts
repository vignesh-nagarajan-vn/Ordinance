import { NextRequest, NextResponse } from "next/server";
import { getClient, MODEL, MissingKeyError, textFromMessage } from "@/lib/anthropic";
import { KNOWLEDGE_BASE, type KbDoc } from "@/lib/knowledgeBase";
import { retrieve } from "@/lib/retriever";

// The RAG query endpoint. Runs on the server so the Anthropic key stays private.
// Flow: retrieve relevant documents (built-in corpus + any user-uploaded docs)
// -> build a grounded prompt -> ask Claude Haiku -> return the answer plus the
// cited sources. The browser only ever talks to this route, never to Anthropic.
export const runtime = "nodejs";

type QueryBody = {
  question?: string;
  uploadedDocs?: KbDoc[];
};

const SYSTEM_PROMPT = `You are Ordinance, an AI assistant for U.S. congressional and federal agency staff ("Capitol Intelligence").

Answer the user's question using ONLY the context documents provided. Rules:
- Ground every claim in the supplied documents. Cite the document IDs you used in square brackets, e.g. [EPA-HQ-OAR-2024-0041].
- If the documents do not contain enough information to answer, say so plainly and suggest what to search for instead. Do not invent facts, citations, or document IDs.
- Be concise, precise, and written for a professional staffer: lead with the answer, then the key specifics (deadlines, thresholds, citations to law/CFR).`;

export async function POST(req: NextRequest) {
  let body: QueryBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const question = (body.question ?? "").trim();
  if (!question) {
    return NextResponse.json({ error: "Missing 'question'." }, { status: 400 });
  }

  // Combine the built-in corpus with any documents the user uploaded in their
  // browser and sent along with the request.
  const uploaded = Array.isArray(body.uploadedDocs) ? body.uploadedDocs : [];
  const corpus: KbDoc[] = [...KNOWLEDGE_BASE, ...uploaded];

  const hits = retrieve(question, corpus, 3);

  if (hits.length === 0) {
    return NextResponse.json({
      answer: `No documents in the indexed knowledge base directly address "${question}". Try rephrasing with terms like NEPA, PFAS, PM2.5, NAAQS, ICS, ERM, or A-123, or upload a relevant document and ask again.`,
      sources: [],
      retrieved: [],
    });
  }

  const context = hits
    .map(
      ({ doc }) =>
        `[${doc.id}] ${doc.title}\nType: ${doc.type}${
          doc.source ? ` | Source: ${doc.source}` : ""
        }\n${doc.summary}`
    )
    .join("\n\n");

  const userPrompt = `Question: ${question}\n\nContext documents:\n\n${context}\n\nAnswer the question using the context above, citing document IDs in brackets.`;

  try {
    const client = getClient();
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const answer = textFromMessage(message.content);

    return NextResponse.json({
      answer,
      sources: hits.map(({ doc }) => doc.id),
      retrieved: hits.map(({ doc, score }) => ({
        id: doc.id,
        title: doc.title,
        score,
      })),
      usage: message.usage,
    });
  } catch (err) {
    if (err instanceof MissingKeyError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    console.error("Anthropic query failed:", err);
    return NextResponse.json(
      { error: "The AI service is temporarily unavailable. Please try again." },
      { status: 502 }
    );
  }
}
