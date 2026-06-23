"use client";

// Export and sharing helpers for AI query results. All client-side: results are
// downloaded as a file, copied to the clipboard, or turned into a self-contained
// shareable link that encodes the result in the URL fragment (no backend needed).

export type ExportableResult = {
  query: string;
  answer: string;
  sources: string[];
  timestamp?: number;
};

export function resultToMarkdown(r: ExportableResult): string {
  const when = new Date(r.timestamp ?? Date.now()).toLocaleString();
  const sources = r.sources.length
    ? r.sources.map((s) => `- ${s}`).join("\n")
    : "_None_";
  return `# Ordinance Query Result

**Query:** ${r.query}
**Generated:** ${when}

## Answer

${r.answer}

## Sources

${sources}
`;
}

export function resultToJSON(r: ExportableResult): string {
  return JSON.stringify(
    { ...r, timestamp: r.timestamp ?? Date.now() },
    null,
    2
  );
}

export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Build a shareable link that re-opens the demo with this result preloaded. */
export function buildShareLink(r: ExportableResult): string {
  const payload = {
    q: r.query,
    a: r.answer,
    s: r.sources,
    t: r.timestamp ?? Date.now(),
  };
  const encoded = encodeURIComponent(
    typeof window !== "undefined"
      ? window.btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
      : ""
  );
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : "";
  return `${base}#result=${encoded}`;
}

/** Parse a shared result back out of the URL fragment, if present. */
export function readShareLink(): ExportableResult | null {
  if (typeof window === "undefined") return null;
  const m = window.location.hash.match(/result=([^&]+)/);
  if (!m) return null;
  try {
    const json = decodeURIComponent(
      escape(window.atob(decodeURIComponent(m[1])))
    );
    const p = JSON.parse(json);
    return { query: p.q, answer: p.a, sources: p.s ?? [], timestamp: p.t };
  } catch {
    return null;
  }
}
