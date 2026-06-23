import type { KbDoc } from "./knowledgeBase";

// Retrieval layer for the RAG pipeline. This is intentionally isolated behind a
// single `retrieve()` function so the lexical implementation below can be
// swapped for a vector store (Pinecone / pgvector + an embeddings model) without
// touching the API route or the UI. The interface, (query, docs, k) ->
// ranked chunks, stays the same.

export type RetrievedChunk = {
  doc: KbDoc;
  score: number;
};

export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s.-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

/**
 * Lexical (keyword overlap) retrieval over the supplied documents. Returns the
 * top-k highest scoring documents. Documents with no token overlap are dropped
 * so the model is never handed irrelevant context.
 */
export function retrieve(query: string, docs: KbDoc[], k = 3): RetrievedChunk[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored = docs
    .map((doc) => {
      const haystack = [
        doc.title,
        doc.summary,
        doc.keywords.join(" "),
        doc.id,
        doc.type,
      ]
        .join(" ")
        .toLowerCase();

      let score = 0;
      for (const t of tokens) {
        if (haystack.includes(t)) score += 1;
        // Bonus for matching a curated keyword exactly or as a prefix.
        if (doc.keywords.some((kw) => kw === t || kw.includes(t))) score += 1;
      }
      return { doc, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, k);
}
