"use client";

import type { KbDoc } from "./knowledgeBase";

// Browser-side persistence for the demo. Uploaded documents and the audit log
// live in localStorage so the demo is fully functional on a stateless serverless
// host with no database. In production these would move to a datastore (Postgres
// / blob storage) behind the API, but the call sites here would stay the same.

const DOCS_KEY = "ordinance.uploadedDocs.v1";
const AUDIT_KEY = "ordinance.auditLog.v1";

export type AuditEntry = {
  id: string;
  ts: number;
  action: string;
  detail: string;
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or serialization errors are non-fatal for the demo */
  }
}

/* ---- Uploaded documents ---- */

export function getUploadedDocs(): KbDoc[] {
  return read<KbDoc[]>(DOCS_KEY, []);
}

export function addUploadedDoc(doc: KbDoc): KbDoc[] {
  const next = [doc, ...getUploadedDocs()];
  write(DOCS_KEY, next);
  return next;
}

export function removeUploadedDoc(id: string): KbDoc[] {
  const next = getUploadedDocs().filter((d) => d.id !== id);
  write(DOCS_KEY, next);
  return next;
}

/** Build a KbDoc from raw uploaded file text. */
export function docFromUpload(filename: string, text: string): KbDoc {
  const clean = text.replace(/\s+/g, " ").trim();
  const keywords = Array.from(
    new Set(
      clean
        .toLowerCase()
        .replace(/[^a-z0-9\s.-]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length > 3)
    )
  ).slice(0, 40);

  return {
    id: `DOC-${Date.now().toString(36).toUpperCase()}`,
    title: filename,
    type: "Uploaded Document",
    source: "User upload",
    date: new Date().toLocaleDateString(),
    // Cap the stored text so a large paste cannot blow the localStorage quota or
    // the model context. Retrieval still works on the truncated body.
    summary: clean.slice(0, 4000),
    keywords,
    uploaded: true,
  };
}

/* ---- Audit log ---- */

export function getAudit(): AuditEntry[] {
  return read<AuditEntry[]>(AUDIT_KEY, []);
}

export function logAudit(action: string, detail: string): AuditEntry[] {
  const entry: AuditEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ts: Date.now(),
    action,
    detail,
  };
  // Newest first, capped at 200 entries.
  const next = [entry, ...getAudit()].slice(0, 200);
  write(AUDIT_KEY, next);
  return next;
}

export function clearAudit(): AuditEntry[] {
  write(AUDIT_KEY, []);
  return [];
}
