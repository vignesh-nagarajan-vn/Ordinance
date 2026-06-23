"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { KNOWLEDGE_BASE, type KbDoc } from "@/lib/knowledgeBase";
import {
  addUploadedDoc,
  clearAudit,
  docFromUpload,
  getAudit,
  getUploadedDocs,
  logAudit,
  removeUploadedDoc,
  type AuditEntry,
} from "@/lib/clientStore";
import {
  buildShareLink,
  copyToClipboard,
  downloadFile,
  readShareLink,
  resultToJSON,
  resultToMarkdown,
  type ExportableResult,
} from "@/lib/exportShare";

type PanelId = "kb" | "search" | "reports" | "coord" | "docs" | "audit";

type QueryState = {
  value: string;
  loading: boolean;
  visible: boolean;
  echo: string;
  paragraphs: string[];
  sources: string[];
  errored: boolean;
  errorMsg: string;
  answer: string;
};

const initialQuery: QueryState = {
  value: "",
  loading: false,
  visible: false,
  echo: "",
  paragraphs: [],
  sources: [],
  errored: false,
  errorMsg: "",
  answer: "",
};

const TITLES: Record<PanelId, [string, string]> = {
  kb: ["Knowledge Base", "Live AI · Claude Haiku 4.5"],
  search: ["Semantic Search", "AI-powered search across all indexed documents"],
  reports: ["Reports", "47 open · 3 urgent"],
  coord: ["Inter-Agency Coordination", "4 active threads across 6 agencies"],
  docs: ["Documents", "Upload office documents into the knowledge base"],
  audit: ["Audit Trail", "Compliance log of all queries and actions"],
};

/* ------------------------------------------------------------------ */
/* API helpers                                                         */
/* ------------------------------------------------------------------ */

async function apiQuery(
  question: string,
  uploadedDocs: KbDoc[]
): Promise<{ answer: string; sources: string[] }> {
  const res = await fetch("/api/query", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question, uploadedDocs }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status}).`);
  }
  return { answer: data.answer ?? "", sources: data.sources ?? [] };
}

async function apiSummarize(
  kind: "report" | "thread",
  title: string,
  content: string
): Promise<string> {
  const res = await fetch("/api/summarize", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind, title, content }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status}).`);
  }
  return data.summary ?? "";
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function DemoPage() {
  const [active, setActive] = useState<PanelId>("kb");
  const [kb, setKb] = useState<QueryState>(initialQuery);
  const [search, setSearch] = useState<QueryState>(initialQuery);

  const [docs, setDocs] = useState<KbDoc[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);

  const kbRef = useRef<HTMLTextAreaElement | null>(null);
  const searchRef = useRef<HTMLTextAreaElement | null>(null);

  const [topTitle, topMeta] = TITLES[active];

  // Load browser-persisted state after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    setDocs(getUploadedDocs());
    setAudit(getAudit());

    // If opened via a shared link, preload the result into the KB panel.
    const shared = readShareLink();
    if (shared) {
      setKb({
        ...initialQuery,
        value: shared.query,
        visible: true,
        echo: `"${shared.query}"`,
        paragraphs: splitParagraphs(shared.answer),
        sources: shared.sources,
        answer: shared.answer,
      });
      setActive("kb");
    }
  }, []);

  const record = useCallback((action: string, detail: string) => {
    setAudit(logAudit(action, detail));
  }, []);

  function autoResize(el: HTMLTextAreaElement | null) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  const runQuery = useCallback(
    async (state: QueryState, setState: (s: QueryState) => void, label: string) => {
      const query = state.value.trim();
      if (!query) return;

      record(label, query);
      setState({
        ...state,
        loading: true,
        visible: true,
        echo: `"${query}"`,
        paragraphs: [],
        sources: [],
        errored: false,
        errorMsg: "",
        answer: "",
      });

      try {
        const { answer, sources } = await apiQuery(query, getUploadedDocs());
        setState({
          ...state,
          value: query,
          loading: false,
          visible: true,
          echo: `"${query}"`,
          paragraphs: splitParagraphs(answer),
          sources,
          errored: false,
          errorMsg: "",
          answer,
        });
      } catch (err) {
        setState({
          ...state,
          value: query,
          loading: false,
          visible: true,
          echo: `"${query}"`,
          paragraphs: [],
          sources: [],
          errored: true,
          errorMsg: err instanceof Error ? err.message : "Something went wrong.",
          answer: "",
        });
      }
    },
    [record]
  );

  function handleEnter(
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    onRun: () => void
  ) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onRun();
    }
  }

  /* ---- Document upload handlers ---- */

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      const text = await file.text();
      const doc = docFromUpload(file.name, text);
      setDocs(addUploadedDoc(doc));
      record("document.upload", file.name);
    }
  }

  function handleRemoveDoc(id: string, title: string) {
    setDocs(removeUploadedDoc(id));
    record("document.remove", title);
  }

  function handleClearAudit() {
    setAudit(clearAudit());
  }

  return (
    <div className="demo-app-root">
      <style dangerouslySetInnerHTML={{ __html: DEMO_CSS }} />
      <div className="app">
        <aside className="sidebar">
          <div className="logo-area">
            <div className="logo">
              <svg className="logo-icon" viewBox="0 0 26 26" fill="none">
                <path
                  d="M13 2C13 2 5.5 6.5 5.5 14C5.5 18.14 8.86 21.5 13 21.5C17.14 21.5 20.5 18.14 20.5 14C20.5 6.5 13 2Z"
                  fill="#b8860b"
                  opacity="0.9"
                />
                <path
                  d="M13 21.5L13 24.5"
                  stroke="#b8860b"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M13 11.5L9.5 8"
                  stroke="#faf7f2"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </svg>
              <span className="logo-name">Ordinance</span>
            </div>
            <div className="logo-tagline">Capitol Intelligence</div>
          </div>

          <nav className="nav">
            <div className="nav-section-label">Knowledge</div>
            <NavItem
              icon="◈"
              label="Knowledge Base"
              badge={String(KNOWLEDGE_BASE.length + docs.length)}
              activeNav={active === "kb"}
              onClick={() => setActive("kb")}
            />
            <NavItem
              icon="⊹"
              label="Semantic Search"
              activeNav={active === "search"}
              onClick={() => setActive("search")}
            />
            <NavItem
              icon="⬆"
              label="Documents"
              badge={docs.length ? String(docs.length) : undefined}
              activeNav={active === "docs"}
              onClick={() => setActive("docs")}
            />

            <div className="nav-section-label">Operations</div>
            <NavItem
              icon="≡"
              label="Reports"
              badge="3"
              badgeAlert
              activeNav={active === "reports"}
              onClick={() => setActive("reports")}
            />
            <NavItem
              icon="⟐"
              label="Coordination"
              badge="12"
              activeNav={active === "coord"}
              onClick={() => setActive("coord")}
            />

            <div className="nav-section-label">System</div>
            <NavItem
              icon="◌"
              label="Audit Trail"
              badge={audit.length ? String(audit.length) : undefined}
              activeNav={active === "audit"}
              onClick={() => setActive("audit")}
            />
          </nav>

          <div className="sidebar-footer">
            <div className="agency-badge">
              <div className="agency-avatar">EPA</div>
              <div>
                <div className="agency-name">J. Reyes</div>
                <div className="agency-role">Regional Director</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <span className="topbar-title">{topTitle}</span>
            <span className="topbar-meta">{topMeta}</span>
            <div className="topbar-actions">
              <a href="/" className="btn btn-ghost">Return to home</a>
            </div>
          </div>

          <div className="content">
            {active === "kb" && (
              <KbPanel
                state={kb}
                setState={setKb}
                inputRef={kbRef}
                onEnter={(e) =>
                  handleEnter(e, () => runQuery(kb, setKb, "query.kb"))
                }
                onRun={() => runQuery(kb, setKb, "query.kb")}
                onAutoResize={() => autoResize(kbRef.current)}
                primaryPlaceholder="e.g. What are the new PM2.5 air quality thresholds under the revised NAAQS?"
                quickQueries={[
                  "What are the new PM2.5 air quality thresholds?",
                  "Critical infrastructure resilience under EO 14168",
                  "Interagency NEPA permitting coordination",
                  "PFAS drinking water standards",
                ]}
                showRecentDocs
                docCount={docs.length}
                onExportLog={(detail) => record("result.export", detail)}
              />
            )}

            {active === "search" && (
              <KbPanel
                state={search}
                setState={setSearch}
                inputRef={searchRef}
                onEnter={(e) =>
                  handleEnter(e, () => runQuery(search, setSearch, "query.search"))
                }
                onRun={() => runQuery(search, setSearch, "query.search")}
                onAutoResize={() => autoResize(searchRef.current)}
                primaryPlaceholder="e.g. How should agencies mitigate critical ICS vulnerabilities?"
                quickQueries={[
                  "Mitigating critical ICS vulnerabilities",
                  "Enterprise risk management under A-123",
                  "NEPA categorical exclusion criteria",
                ]}
                showRecentDocs={false}
                docCount={docs.length}
                onExportLog={(detail) => record("result.export", detail)}
              />
            )}

            {active === "docs" && (
              <DocsPanel
                docs={docs}
                onUpload={handleUpload}
                onRemove={handleRemoveDoc}
              />
            )}

            {active === "reports" && <ReportsPanel record={record} />}
            {active === "coord" && <CoordPanel record={record} />}
            {active === "audit" && (
              <AuditPanel audit={audit} onClear={handleClearAudit} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar item                                                        */
/* ------------------------------------------------------------------ */

function NavItem({
  icon,
  label,
  badge,
  badgeAlert,
  activeNav,
  onClick,
}: {
  icon: string;
  label: string;
  badge?: string;
  badgeAlert?: boolean;
  activeNav: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`nav-item${activeNav ? " active" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <span className="nav-icon">{icon}</span> {label}
      {badge && (
        <span className={`nav-badge${badgeAlert ? " alert" : ""}`}>{badge}</span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Knowledge Base / Semantic Search panel                              */
/* ------------------------------------------------------------------ */

function KbPanel({
  state,
  setState,
  inputRef,
  onEnter,
  onRun,
  onAutoResize,
  primaryPlaceholder,
  quickQueries,
  showRecentDocs,
  docCount,
  onExportLog,
}: {
  state: QueryState;
  setState: (s: QueryState) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onEnter: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onRun: () => void;
  onAutoResize: () => void;
  primaryPlaceholder: string;
  quickQueries: string[];
  showRecentDocs: boolean;
  docCount: number;
  onExportLog: (detail: string) => void;
}) {
  return (
    <div className="panel active">
      <div className="kb-notice" role="note">
        <span className="kb-notice-icon" aria-hidden="true">★</span>
        <span className="kb-notice-text">
          Answers are generated live by Claude Haiku 4.5 over a retrieval-augmented
          knowledge base of public government documents
          {docCount > 0 ? ` plus ${docCount} document${docCount > 1 ? "s" : ""} you uploaded` : ""}.
          Every claim is grounded in cited sources.
        </span>
      </div>
      <div className="kb-search-area">
        <div className="kb-search-label">
          {showRecentDocs
            ? "Query the knowledge base with natural language"
            : "Ask anything about government regulations and procedures"}
        </div>
        <div className="search-input-row">
          <textarea
            ref={inputRef}
            className="search-input"
            rows={1}
            placeholder={primaryPlaceholder}
            value={state.value}
            onChange={(e) => {
              setState({ ...state, value: e.target.value });
              onAutoResize();
            }}
            onKeyDown={onEnter}
          />
          <button className="search-btn" onClick={onRun} disabled={state.loading}>
            {state.loading ? "Querying…" : "Query →"}
          </button>
        </div>
        <div className="quick-queries">
          {quickQueries.map((q) => (
            <button
              key={q}
              className="qq-pill"
              onClick={() => {
                setState({ ...state, value: q });
                requestAnimationFrame(onAutoResize);
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {state.visible && (
        <div className="ai-response visible animate-in">
          <div className="ai-response-header">
            <span className="ai-chip">Ordinance AI</span>
            <span className="ai-query-echo">{state.echo}</span>
          </div>
          <div className="ai-response-body">
            {state.loading ? (
              <div className="ai-loading">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                Retrieving sources and generating answer…
              </div>
            ) : state.errored ? (
              <p className="ai-error">{state.errorMsg}</p>
            ) : (
              state.paragraphs.map((para, i) => (
                <p key={i} style={{ marginBottom: 10 }}>
                  {para}
                </p>
              ))
            )}
          </div>

          {state.sources.length > 0 && (
            <div className="source-tags" style={{ display: "flex" }}>
              {state.sources.map((s, i) => (
                <span key={i} className="source-tag">
                  {s}
                </span>
              ))}
            </div>
          )}

          {!state.loading && !state.errored && state.answer && (
            <ExportBar
              result={{
                query: state.value,
                answer: state.answer,
                sources: state.sources,
                timestamp: Date.now(),
              }}
              onExportLog={onExportLog}
            />
          )}
        </div>
      )}

      {showRecentDocs && (
        <>
          <div className="section-header">
            <span className="section-title">Recent Documents</span>
            <span className="section-link">Browse all →</span>
          </div>
          <div className="doc-grid">
            {KNOWLEDGE_BASE.map((doc) => (
              <DocCard
                key={doc.id}
                type={doc.type}
                dotColor={dotForType(doc.type)}
                title={doc.title}
                meta={[doc.id, doc.date ?? ""]}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function dotForType(type: string): string {
  switch (type) {
    case "Executive Order":
      return "var(--gold)";
    case "Guidance Memo":
      return "var(--success)";
    case "Emergency Directive":
      return "var(--danger)";
    case "OMB Circular":
      return "#7a5c9e";
    case "Uploaded Document":
      return "var(--gold-muted)";
    default:
      return "var(--info)";
  }
}

/* ---- Export / share bar ---- */

function ExportBar({
  result,
  onExportLog,
}: {
  result: ExportableResult;
  onExportLog: (detail: string) => void;
}) {
  const [flash, setFlash] = useState("");

  function announce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(""), 1800);
  }

  return (
    <div className="export-bar">
      <span className="export-label">Export</span>
      <button
        className="export-btn"
        onClick={async () => {
          const ok = await copyToClipboard(result.answer);
          announce(ok ? "Copied answer" : "Copy failed");
          onExportLog("copy answer");
        }}
      >
        Copy
      </button>
      <button
        className="export-btn"
        onClick={() => {
          downloadFile(
            "ordinance-result.md",
            resultToMarkdown(result),
            "text/markdown"
          );
          onExportLog("download markdown");
        }}
      >
        Markdown
      </button>
      <button
        className="export-btn"
        onClick={() => {
          downloadFile(
            "ordinance-result.json",
            resultToJSON(result),
            "application/json"
          );
          onExportLog("download json");
        }}
      >
        JSON
      </button>
      <button
        className="export-btn"
        onClick={async () => {
          const link = buildShareLink(result);
          const ok = await copyToClipboard(link);
          announce(ok ? "Share link copied" : "Copy failed");
          onExportLog("share link");
        }}
      >
        Share link
      </button>
      {flash && <span className="export-flash">{flash}</span>}
    </div>
  );
}

function DocCard({
  type,
  dotColor,
  title,
  meta,
}: {
  type: string;
  dotColor: string;
  title: string;
  meta: string[];
}) {
  return (
    <div className="doc-card">
      <div className="doc-card-type">
        <div className="doc-type-dot" style={{ background: dotColor }}></div>
        {type}
      </div>
      <div className="doc-card-title">{title}</div>
      <div className="doc-card-meta">
        {meta.filter(Boolean).map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Documents panel (upload)                                            */
/* ------------------------------------------------------------------ */

function DocsPanel({
  docs,
  onUpload,
  onRemove,
}: {
  docs: KbDoc[];
  onUpload: (files: FileList | null) => void;
  onRemove: (id: string, title: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div className="panel active">
      <div className="kb-notice" role="note">
        <span className="kb-notice-icon" aria-hidden="true">★</span>
        <span className="kb-notice-text">
          Upload office-specific documents (memos, committee reports, correspondence).
          They are added to the knowledge base and retrieved alongside the built-in
          corpus when you query. Text files (.txt, .md) are stored in your browser
          for this demo.
        </span>
      </div>

      <div
        className={`upload-zone${dragging ? " dragging" : ""}`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onUpload(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
      >
        <div className="upload-icon">⬆</div>
        <div className="upload-title">Drop files here or click to upload</div>
        <div className="upload-sub">.txt and .md files</div>
        <input
          ref={fileRef}
          className="upload-input"
          type="file"
          accept=".txt,.md,.markdown,text/plain,text/markdown"
          multiple
          onChange={(e) => {
            onUpload(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="section-header">
        <span className="section-title">
          Uploaded Documents ({docs.length})
        </span>
      </div>

      {docs.length === 0 ? (
        <div className="empty-state">
          No documents uploaded yet. Uploaded documents become queryable in the
          Knowledge Base and Semantic Search panels.
        </div>
      ) : (
        <div className="doc-list">
          {docs.map((d) => (
            <div className="doc-row" key={d.id}>
              <div className="doc-type-dot" style={{ background: dotForType(d.type) }} />
              <div className="doc-row-body">
                <div className="doc-row-title">{d.title}</div>
                <div className="doc-row-meta">
                  <span>{d.id}</span>
                  <span>{d.date}</span>
                  <span>{d.summary.length} chars indexed</span>
                </div>
              </div>
              <button
                className="doc-remove"
                onClick={() => onRemove(d.id, d.title)}
                aria-label={`Remove ${d.title}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reports panel (functional)                                          */
/* ------------------------------------------------------------------ */

type Report = {
  title: string;
  id: string;
  agency: string;
  status: "urgent" | "review" | "open" | "closed";
  statusLabel: string;
  priority: number;
  priorityColor: string;
  due: string;
  assignee: string;
};

const REPORTS: Report[] = [
  { title: "Quarterly Air Permit Compliance Report", id: "RPT-2025-0441", agency: "EPA Region 9", status: "urgent", statusLabel: "Urgent", priority: 9, priorityColor: "var(--danger)", due: "May 7", assignee: "J. Reyes" },
  { title: "PFAS Groundwater Monitoring — Site Delta", id: "RPT-2025-0438", agency: "EPA / DoD", status: "review", statusLabel: "In Review", priority: 7, priorityColor: "var(--warning)", due: "May 15", assignee: "M. Chen" },
  { title: "Wetland Mitigation Bank Annual Report", id: "RPT-2025-0429", agency: "USACE / EPA", status: "open", statusLabel: "Active", priority: 5, priorityColor: "var(--success)", due: "May 30", assignee: "T. Park" },
  { title: "Tribal Consultation Documentation — NM Pipeline", id: "RPT-2025-0421", agency: "BIA / FERC", status: "urgent", statusLabel: "Urgent", priority: 8, priorityColor: "var(--danger)", due: "May 9", assignee: "A. Morales" },
  { title: "Section 7 Consultation — ESA Salmon Habitat", id: "RPT-2025-0414", agency: "NMFS / EPA", status: "review", statusLabel: "In Review", priority: 6, priorityColor: "var(--warning)", due: "Jun 1", assignee: "S. Johnson" },
  { title: "CERCLA 5-Year Review — Superfund Site 88", id: "RPT-2025-0398", agency: "EPA OLEM", status: "closed", statusLabel: "Closed", priority: 3, priorityColor: "var(--text-faint)", due: "Apr 25 ✓", assignee: "B. Williams" },
];

type SummaryState = { loading: boolean; text: string; error: string };

function ReportsPanel({
  record,
}: {
  record: (action: string, detail: string) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<"all" | Report["status"]>("all");
  const [sortBy, setSortBy] = useState<"none" | "priority" | "title">("none");
  const [search, setSearch] = useState("");
  const [summaries, setSummaries] = useState<Record<string, SummaryState>>({});

  let rows = REPORTS.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !(
          r.title.toLowerCase().includes(q) ||
          r.agency.toLowerCase().includes(q) ||
          r.assignee.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
        )
      )
        return false;
    }
    return true;
  });

  if (sortBy === "priority") {
    rows = [...rows].sort((a, b) => b.priority - a.priority);
  } else if (sortBy === "title") {
    rows = [...rows].sort((a, b) => a.title.localeCompare(b.title));
  }

  async function summarize(r: Report) {
    setSummaries((s) => ({ ...s, [r.id]: { loading: true, text: "", error: "" } }));
    record("report.summarize", r.id);
    try {
      const content = `Report: ${r.title} (${r.id})\nAgency: ${r.agency}\nStatus: ${r.statusLabel}\nPriority: ${r.priority}/10\nDue: ${r.due}\nAssignee: ${r.assignee}`;
      const text = await apiSummarize("report", r.title, content);
      setSummaries((s) => ({ ...s, [r.id]: { loading: false, text, error: "" } }));
    } catch (err) {
      setSummaries((s) => ({
        ...s,
        [r.id]: {
          loading: false,
          text: "",
          error: err instanceof Error ? err.message : "Failed.",
        },
      }));
    }
  }

  const statuses: ("all" | Report["status"])[] = ["all", "urgent", "review", "open", "closed"];

  return (
    <div className="panel active">
      <div className="stats-row">
        <Stat label="Open Reports" value="47" delta="↑ 5 this week" />
        <Stat
          label="Avg Resolution"
          value={<>8.2<span style={{ fontSize: 14, color: "var(--text-faint)" }}>d</span></>}
          delta="↓ 1.4d improvement"
        />
        <Stat label="Agencies Involved" value="14" delta="across 3 regions" deltaColor="var(--text-faint)" />
        <Stat
          label="Compliance Rate"
          value={<>94<span style={{ fontSize: 14, color: "var(--text-faint)" }}>%</span></>}
          delta="↑ 2.1% vs last qtr"
        />
      </div>

      <div className="filter-bar">
        <input
          className="filter-input"
          placeholder="Search reports…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-chips">
          {statuses.map((s) => (
            <button
              key={s}
              className={`filter-chip${statusFilter === s ? " active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
        >
          <option value="none">Sort: default</option>
          <option value="priority">Sort: priority</option>
          <option value="title">Sort: title</option>
        </select>
      </div>

      <div className="table-wrap">
        <table className="report-table">
          <thead>
            <tr>
              <th>Report ID / Title</th>
              <th>Agency</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due</th>
              <th>Assignee</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const sum = summaries[r.id];
              return (
                <Fragment key={r.id}>
                  <tr>
                    <td>
                      <div>{r.title}</div>
                      <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>{r.id}</div>
                    </td>
                    <td>{r.agency}</td>
                    <td>
                      <span className={`status-pill status-${r.status}`}>{r.statusLabel}</span>
                    </td>
                    <td>
                      <div className="priority-bar">
                        <div className="priority-track">
                          <div className="priority-fill" style={{ width: `${r.priority * 10}%`, background: r.priorityColor }}></div>
                        </div>
                        <span style={{ fontSize: 11, color: r.priorityColor }}>{r.priority}/10</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>{r.due}</td>
                    <td>{r.assignee}</td>
                    <td>
                      <button
                        className="row-ai-btn"
                        onClick={() => summarize(r)}
                        disabled={sum?.loading}
                      >
                        {sum?.loading ? "…" : "Summarize"}
                      </button>
                    </td>
                  </tr>
                  {sum && (sum.text || sum.error) && (
                    <tr>
                      <td colSpan={7} style={{ paddingTop: 0 }}>
                        <div className={`ai-summary${sum.error ? " error" : ""}`}>
                          <span className="ai-summary-head">AI summary</span>
                          {sum.error ? sum.error : sum.text}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">No reports match your filters.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  delta,
  deltaColor,
}: {
  label: string;
  value: React.ReactNode;
  delta: string;
  deltaColor?: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div
        className={`stat-delta${deltaColor ? "" : " delta-up"}`}
        style={deltaColor ? { color: deltaColor } : undefined}
      >
        {delta}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Coordination panel (functional)                                     */
/* ------------------------------------------------------------------ */

type Thread = {
  id: string;
  unread?: boolean;
  tags: { label: string; bg: string; color: string }[];
  title: string;
  preview: string;
  status: "urgent" | "review" | "open" | "closed";
  statusLabel: string;
  messages: string;
  ago: string;
};

const TAG = {
  EPA: { bg: "rgba(46,90,122,0.1)", color: "var(--info)" },
  USACE: { bg: "rgba(184,134,11,0.1)", color: "var(--gold-btn)" },
  DOI: { bg: "rgba(74,124,89,0.1)", color: "var(--success)" },
  FERC: { bg: "rgba(122,92,158,0.1)", color: "#7a5c9e" },
  DoD: { bg: "rgba(139,58,46,0.1)", color: "var(--danger)" },
  NMFS: { bg: "rgba(74,124,89,0.1)", color: "var(--success)" },
} as const;

function tag(label: keyof typeof TAG) {
  return { label, ...TAG[label] };
}

const THREADS: Thread[] = [
  {
    id: "TH-1",
    unread: true,
    tags: [tag("EPA"), tag("USACE")],
    title: "Section 404 / Section 401 Joint Review — Rillito Wetland Restoration",
    preview:
      "USACE requested EPA water quality cert. EPA Region 9 flagged potential ESA Section 7 trigger — awaiting NMFS consultation status from DoI liaison before proceeding.",
    status: "review",
    statusLabel: "In Review",
    messages: "14 messages",
    ago: "2h ago",
  },
  {
    id: "TH-2",
    unread: true,
    tags: [tag("EPA"), tag("DOI"), tag("FERC")],
    title: "NM Pipeline Project — Tribal Consultation & Environmental Review",
    preview:
      "Three-agency coordination on NHPA Section 106, NEPA EIS, and tribal consultation timelines. BIA lead has requested 30-day extension for sovereign nation review period.",
    status: "urgent",
    statusLabel: "Urgent",
    messages: "31 messages",
    ago: "45m ago",
  },
  {
    id: "TH-3",
    tags: [tag("EPA"), tag("DoD")],
    title: "PFAS Remediation Cost-Share Agreement — Tucson AFB Adjacent Sites",
    preview:
      "EPA and DoD resolving cost allocation under CERCLA for PFAS plume originating at Air Force installation. Draft MOA under legal review at both agencies.",
    status: "open",
    statusLabel: "Active",
    messages: "22 messages",
    ago: "yesterday",
  },
  {
    id: "TH-4",
    tags: [tag("USACE"), tag("NMFS")],
    title: "Biological Opinion — Yuma Irrigation District Diversion Structure",
    preview:
      "BiOp issued with Reasonable and Prudent Alternatives. USACE confirming Section 404 permit conditions align with NMFS RPAs. Final coordination memo due May 20.",
    status: "review",
    statusLabel: "In Review",
    messages: "9 messages",
    ago: "3 days ago",
  },
];

function CoordPanel({
  record,
}: {
  record: (action: string, detail: string) => void;
}) {
  const [agency, setAgency] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [summaries, setSummaries] = useState<Record<string, SummaryState>>({});

  const agencies = ["all", ...Object.keys(TAG)];

  const threads = THREADS.filter((t) => {
    if (agency !== "all" && !t.tags.some((x) => x.label === agency)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!(t.title.toLowerCase().includes(q) || t.preview.toLowerCase().includes(q)))
        return false;
    }
    return true;
  });

  async function summarize(t: Thread) {
    setSummaries((s) => ({ ...s, [t.id]: { loading: true, text: "", error: "" } }));
    record("thread.summarize", t.id);
    try {
      const content = `Thread: ${t.title}\nAgencies: ${t.tags.map((x) => x.label).join(", ")}\nStatus: ${t.statusLabel}\nActivity: ${t.messages}, last ${t.ago}\nLatest update: ${t.preview}`;
      const text = await apiSummarize("thread", t.title, content);
      setSummaries((s) => ({ ...s, [t.id]: { loading: false, text, error: "" } }));
    } catch (err) {
      setSummaries((s) => ({
        ...s,
        [t.id]: { loading: false, text: "", error: err instanceof Error ? err.message : "Failed." },
      }));
    }
  }

  return (
    <div className="panel active">
      <div className="agency-grid">
        <AgencyCard tag="EPA" tagBg="rgba(46,90,122,0.1)" tagColor="var(--info)" tagBorder="rgba(46,90,122,0.2)" name="Environmental Protection" dept="Region 9 — Southwest" metrics={[{ val: "12", label: "open items" }, { val: "94%", label: "response rate", color: "var(--success)" }]} />
        <AgencyCard tag="DOI" tagBg="rgba(74,124,89,0.1)" tagColor="var(--success)" tagBorder="rgba(74,124,89,0.2)" name="Dept. of the Interior" dept="Bureau of Indian Affairs" metrics={[{ val: "5", label: "open items" }, { val: "78%", label: "response rate", color: "var(--warning)" }]} />
        <AgencyCard tag="USACE" tagBg="rgba(184,134,11,0.1)" tagColor="var(--gold-btn)" tagBorder="rgba(184,134,11,0.2)" name="Army Corps of Engineers" dept="Los Angeles District" metrics={[{ val: "8", label: "open items" }, { val: "91%", label: "response rate", color: "var(--success)" }]} />
      </div>

      <div className="filter-bar">
        <input
          className="filter-input"
          placeholder="Search threads…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-chips">
          {agencies.map((a) => (
            <button
              key={a}
              className={`filter-chip${agency === a ? " active" : ""}`}
              onClick={() => setAgency(a)}
            >
              {a === "all" ? "All agencies" : a}
            </button>
          ))}
        </div>
      </div>

      <div className="thread-list">
        {threads.map((t) => {
          const sum = summaries[t.id];
          return (
            <div className="thread-item" key={t.id}>
              {t.unread && <div className="thread-unread"></div>}
              <div className="thread-agencies">
                {t.tags.map((x, i) => (
                  <div key={i} className="thread-agency-tag" style={{ background: x.bg, color: x.color }}>
                    {x.label}
                  </div>
                ))}
              </div>
              <div className="thread-body">
                <div className="thread-title">{t.title}</div>
                <div className="thread-preview">{t.preview}</div>
                <div className="thread-meta">
                  <span className={`status-pill status-${t.status}`}>{t.statusLabel}</span>
                  <span>{t.messages}</span>
                  <span>{t.ago}</span>
                  <button
                    className="row-ai-btn"
                    onClick={() => summarize(t)}
                    disabled={sum?.loading}
                    style={{ marginLeft: "auto" }}
                  >
                    {sum?.loading ? "Summarizing…" : "AI summarize"}
                  </button>
                </div>
                {sum && (sum.text || sum.error) && (
                  <div className={`ai-summary${sum.error ? " error" : ""}`}>
                    <span className="ai-summary-head">AI summary</span>
                    {sum.error ? sum.error : sum.text}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {threads.length === 0 && (
          <div className="empty-state">No threads match your filters.</div>
        )}
      </div>
    </div>
  );
}

function AgencyCard({
  tag,
  tagBg,
  tagColor,
  tagBorder,
  name,
  dept,
  metrics,
}: {
  tag: string;
  tagBg: string;
  tagColor: string;
  tagBorder: string;
  name: string;
  dept: string;
  metrics: { val: string; label: string; color?: string }[];
}) {
  return (
    <div className="agency-card">
      <div className="agency-card-header">
        <div className="agency-icon" style={{ background: tagBg, color: tagColor, border: `1px solid ${tagBorder}` }}>
          {tag}
        </div>
        <div>
          <div className="agency-card-name">{name}</div>
          <div className="agency-card-dept">{dept}</div>
        </div>
      </div>
      <div className="agency-metrics">
        {metrics.map((m, i) => (
          <div key={i}>
            <div className="agency-metric-val" style={m.color ? { color: m.color } : undefined}>{m.val}</div>
            <div className="agency-metric-lbl">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Audit Trail panel                                                   */
/* ------------------------------------------------------------------ */

function AuditPanel({
  audit,
  onClear,
}: {
  audit: AuditEntry[];
  onClear: () => void;
}) {
  return (
    <div className="panel active">
      <div className="kb-notice" role="note">
        <span className="kb-notice-icon" aria-hidden="true">★</span>
        <span className="kb-notice-text">
          Every query and action is logged here for compliance. In this demo the
          log is kept in your browser; a production deployment would persist it
          server-side with user attribution.
        </span>
      </div>

      <div className="section-header">
        <span className="section-title">Activity Log ({audit.length})</span>
        {audit.length > 0 && (
          <button className="btn btn-ghost" style={{ fontSize: 11, padding: "4px 10px" }} onClick={onClear}>
            Clear log
          </button>
        )}
      </div>

      {audit.length === 0 ? (
        <div className="empty-state">
          No activity yet. Run a query or summarize a report and it will appear here.
        </div>
      ) : (
        <div className="table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {audit.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>
                    {new Date(e.ts).toLocaleString()}
                  </td>
                  <td>
                    <span className="audit-action">{e.action}</span>
                  </td>
                  <td style={{ color: "var(--text-mid)" }}>{e.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const DEMO_CSS = `
.demo-app-root {
  --cream:        #f0ebe0;
  --cream-dark:   #e6dfd2;
  --cream-card:   #faf7f2;
  --gold:         #b8860b;
  --gold-light:   #c9950d;
  --gold-muted:   #d4a832;
  --gold-pale:    #e8d5a0;
  --gold-btn:     #8b6508;
  --text:         #1a1710;
  --text-mid:     #3d3826;
  --text-muted:   #7a7260;
  --text-faint:   #a89e88;
  --border:       #d5ccb8;
  --border-light: #e2d9c8;
  --success:      #4a7c59;
  --warning:      #9e6d14;
  --danger:       #8b3a2e;
  --info:         #2e5a7a;

  position: fixed;
  inset: 0;
  background: var(--cream);
  color: var(--text);
  font-family: 'Inter', system-ui, -apple-system, Segoe UI, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  overflow: hidden;
}

.demo-app-root *, .demo-app-root *::before, .demo-app-root *::after {
  box-sizing: border-box;
}

.demo-app-root::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(184,134,11,0.18) 1px, transparent 1px);
  background-size: 22px 22px;
  pointer-events: none;
  z-index: 0;
}

.demo-app-root .app { display: flex; height: 100%; position: relative; z-index: 1; }

.demo-app-root .sidebar {
  width: 230px;
  min-width: 230px;
  background: rgba(240,235,224,0.95);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}

.demo-app-root .logo-area {
  padding: 22px 20px 18px;
  border-bottom: 1px solid var(--border-light);
}

.demo-app-root .logo { display: flex; align-items: center; gap: 9px; margin-bottom: 2px; }
.demo-app-root .logo-icon { width: 26px; height: 26px; flex-shrink: 0; }
.demo-app-root .logo-name { font-family: 'Playfair Display', var(--font-heading), serif; font-size: 18px; font-weight: 700; color: var(--text); }
.demo-app-root .logo-tagline {
  font-size: 10px; color: var(--gold); letter-spacing: 0.12em;
  text-transform: uppercase; padding-left: 35px; font-weight: 500;
}

.demo-app-root .nav { padding: 14px 0; flex: 1; overflow-y: auto; }
.demo-app-root .nav-section-label {
  font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--text-faint); padding: 12px 20px 5px; font-weight: 600;
}
.demo-app-root .nav-item {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 20px; cursor: pointer; color: var(--text-muted);
  font-size: 13px; border-left: 2px solid transparent;
  transition: all 0.15s; user-select: none;
}
.demo-app-root .nav-item:hover { color: var(--text); background: rgba(184,134,11,0.06); }
.demo-app-root .nav-item.active {
  color: var(--gold-btn); background: rgba(184,134,11,0.09);
  border-left-color: var(--gold);
}
.demo-app-root .nav-icon { font-size: 13px; width: 16px; text-align: center; flex-shrink: 0; }
.demo-app-root .nav-badge {
  margin-left: auto; background: var(--cream-dark);
  color: var(--text-muted); font-size: 10px;
  padding: 1px 7px; border-radius: 10px; border: 1px solid var(--border-light);
}
.demo-app-root .nav-badge.alert { background: rgba(139,58,46,0.1); color: var(--danger); border-color: rgba(139,58,46,0.2); }

.demo-app-root .sidebar-footer { padding: 14px 20px; border-top: 1px solid var(--border-light); }
.demo-app-root .agency-badge { display: flex; align-items: center; gap: 9px; }
.demo-app-root .agency-avatar {
  width: 30px; height: 30px; border-radius: 50%;
  background: rgba(184,134,11,0.1); border: 1px solid var(--gold-pale);
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; color: var(--gold-btn);
  letter-spacing: 0.04em; flex-shrink: 0;
}
.demo-app-root .agency-name { font-size: 12px; color: var(--text-mid); font-weight: 500; }
.demo-app-root .agency-role { font-size: 10px; color: var(--text-faint); }

.demo-app-root .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

.demo-app-root .topbar {
  height: 52px; border-bottom: 1px solid var(--border);
  background: rgba(240,235,224,0.9);
  display: flex; align-items: center; padding: 0 28px; gap: 14px; flex-shrink: 0;
}
.demo-app-root .topbar-title {
  font-family: 'Playfair Display', var(--font-heading), serif;
  font-size: 16px; font-weight: 600; color: var(--text);
}
.demo-app-root .topbar-meta { font-size: 12px; color: var(--text-faint); }
.demo-app-root .topbar-actions { margin-left: auto; display: flex; gap: 8px; align-items: center; }

.demo-app-root .btn {
  padding: 6px 14px; border-radius: 6px;
  font-size: 12px; font-family: 'Inter', system-ui, sans-serif;
  cursor: pointer; transition: all 0.15s; border: 1px solid; font-weight: 500;
}
.demo-app-root .btn-ghost { background: transparent; border-color: var(--border); color: var(--text-muted); }
.demo-app-root .btn-ghost:hover { color: var(--text); background: rgba(184,134,11,0.05); border-color: var(--border); }
.demo-app-root .btn-gold { background: var(--gold-btn); border-color: var(--gold-btn); color: #fff; }
.demo-app-root .btn-gold:hover { background: var(--gold); border-color: var(--gold); }

.demo-app-root .content { flex: 1; overflow-y: auto; padding: 28px; }

.demo-app-root .panel { display: none; }
.demo-app-root .panel.active { display: block; }

.demo-app-root .kb-search-area {
  position: relative;
  background: var(--cream-card); border: 1px solid var(--border);
  border-radius: 10px; padding: 22px 24px; margin-bottom: 24px;
}
.demo-app-root .kb-notice {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fdf6e3;
  border: 1px solid #e8c97a;
  border-left: 3px solid #c9962b;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 16px;
}
.demo-app-root .kb-notice-icon {
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #c9962b;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}
.demo-app-root .kb-notice-text {
  flex: 1;
  font-size: 12.5px;
  line-height: 1.5;
  color: #5b4413;
}
.demo-app-root .kb-search-label {
  font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-faint); margin-bottom: 10px; font-weight: 600;
}
.demo-app-root .search-input-row { display: flex; gap: 10px; align-items: flex-start; }
.demo-app-root .search-input {
  flex: 1; background: var(--cream); border: 1px solid var(--border);
  border-radius: 6px; padding: 10px 14px; color: var(--text);
  font-family: 'Inter', system-ui, sans-serif; font-size: 14px;
  resize: none; min-height: 44px; transition: border-color 0.2s; outline: none;
}
.demo-app-root .search-input:focus { border-color: var(--gold-muted); }
.demo-app-root .search-input::placeholder { color: var(--text-faint); }

.demo-app-root .search-btn {
  padding: 10px 22px; background: var(--gold-btn); border: none; border-radius: 6px;
  color: #fff; font-family: 'Inter', system-ui, sans-serif; font-size: 13px;
  font-weight: 600; cursor: pointer; white-space: nowrap; transition: background 0.15s;
}
.demo-app-root .search-btn:hover { background: var(--gold); }
.demo-app-root .search-btn:disabled { background: var(--text-faint); cursor: not-allowed; }

.demo-app-root .quick-queries { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 6px; }
.demo-app-root .qq-pill {
  font-size: 11px; padding: 4px 11px; border-radius: 20px;
  border: 1px solid var(--border); color: var(--text-muted);
  cursor: pointer; transition: all 0.15s; background: transparent;
  font-family: inherit;
}
.demo-app-root .qq-pill:hover { border-color: var(--gold-muted); color: var(--gold-btn); background: rgba(184,134,11,0.05); }

.demo-app-root .ai-response {
  background: var(--cream-card); border: 1px solid var(--border);
  border-left: 3px solid var(--gold); border-radius: 10px;
  padding: 20px 24px; margin-bottom: 22px;
}
.demo-app-root .ai-response-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.demo-app-root .ai-chip {
  font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
  background: rgba(184,134,11,0.1); border: 1px solid rgba(184,134,11,0.3);
  color: var(--gold-btn); padding: 2px 8px; border-radius: 4px; font-weight: 600;
}
.demo-app-root .ai-query-echo { font-size: 12px; color: var(--text-faint); font-style: italic; }
.demo-app-root .ai-response-body { font-size: 13.5px; color: var(--text-mid); line-height: 1.78; }
.demo-app-root .ai-error { color: var(--danger); }
.demo-app-root .ai-loading { display: flex; align-items: center; gap: 10px; color: var(--text-faint); font-size: 13px; }
.demo-app-root .loading-dots span {
  display: inline-block; width: 5px; height: 5px;
  border-radius: 50%; background: var(--gold);
  animation: demoBlink 1.2s infinite; margin: 0 2px;
}
.demo-app-root .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.demo-app-root .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes demoBlink { 0%,80%,100%{opacity:.2} 40%{opacity:1} }

.demo-app-root .source-tags {
  margin-top: 14px; display: flex; flex-wrap: wrap; gap: 6px;
  border-top: 1px solid var(--border-light); padding-top: 12px;
}
.demo-app-root .source-tag {
  font-size: 11px; padding: 3px 9px; border-radius: 4px;
  background: rgba(46,90,122,0.07); border: 1px solid rgba(46,90,122,0.18); color: var(--info);
}

.demo-app-root .export-bar {
  margin-top: 14px; display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
  border-top: 1px solid var(--border-light); padding-top: 12px;
}
.demo-app-root .export-label {
  font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-faint); font-weight: 600; margin-right: 2px;
}
.demo-app-root .export-btn {
  font-size: 11px; padding: 4px 11px; border-radius: 6px;
  border: 1px solid var(--border); color: var(--text-muted);
  cursor: pointer; transition: all 0.15s; background: transparent; font-family: inherit;
}
.demo-app-root .export-btn:hover { border-color: var(--gold-muted); color: var(--gold-btn); background: rgba(184,134,11,0.05); }
.demo-app-root .export-flash { font-size: 11px; color: var(--success); margin-left: 4px; }

.demo-app-root .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.demo-app-root .section-title { font-size: 10px; letter-spacing: 0.13em; text-transform: uppercase; color: var(--text-faint); font-weight: 600; }
.demo-app-root .section-link { font-size: 11px; color: var(--gold); cursor: pointer; }
.demo-app-root .section-link:hover { color: var(--gold-btn); }

.demo-app-root .doc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 12px; margin-bottom: 28px; }
.demo-app-root .doc-card {
  background: var(--cream-card); border: 1px solid var(--border);
  border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.15s;
}
.demo-app-root .doc-card:hover { border-color: var(--gold-muted); }
.demo-app-root .doc-card-type {
  font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-faint); font-weight: 600; margin-bottom: 7px;
  display: flex; align-items: center; gap: 6px;
}
.demo-app-root .doc-type-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.demo-app-root .doc-card-title { font-size: 13px; color: var(--text); margin-bottom: 7px; line-height: 1.4; }
.demo-app-root .doc-card-meta { font-size: 11px; color: var(--text-faint); display: flex; gap: 10px; }

.demo-app-root .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
.demo-app-root .stat-card { background: var(--cream-card); border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
.demo-app-root .stat-label { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 8px; font-weight: 600; }
.demo-app-root .stat-value { font-family: 'Playfair Display', var(--font-heading), serif; font-size: 30px; font-weight: 700; color: var(--text); line-height: 1; }
.demo-app-root .stat-delta { font-size: 11px; margin-top: 5px; }
.demo-app-root .delta-up { color: var(--success); }

.demo-app-root .filter-bar {
  display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 16px;
}
.demo-app-root .filter-input {
  background: var(--cream-card); border: 1px solid var(--border); border-radius: 6px;
  padding: 7px 12px; font-size: 13px; font-family: inherit; color: var(--text);
  outline: none; min-width: 200px; flex: 1;
}
.demo-app-root .filter-input:focus { border-color: var(--gold-muted); }
.demo-app-root .filter-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.demo-app-root .filter-chip {
  font-size: 11px; padding: 5px 11px; border-radius: 20px;
  border: 1px solid var(--border); color: var(--text-muted);
  cursor: pointer; background: transparent; font-family: inherit; transition: all 0.15s;
}
.demo-app-root .filter-chip:hover { border-color: var(--gold-muted); color: var(--gold-btn); }
.demo-app-root .filter-chip.active { background: var(--gold-btn); border-color: var(--gold-btn); color: #fff; }
.demo-app-root .filter-select {
  background: var(--cream-card); border: 1px solid var(--border); border-radius: 6px;
  padding: 7px 10px; font-size: 12px; font-family: inherit; color: var(--text-muted); cursor: pointer;
}

.demo-app-root .table-wrap {
  background: var(--cream-card); border: 1px solid var(--border);
  border-radius: 8px; overflow: hidden; margin-bottom: 24px;
}
.demo-app-root .report-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.demo-app-root .report-table th {
  text-align: left; padding: 8px 14px;
  font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-faint); border-bottom: 1px solid var(--border); font-weight: 600;
}
.demo-app-root .report-table td {
  padding: 11px 14px; border-bottom: 1px solid var(--border-light);
  color: var(--text-muted); vertical-align: middle;
}
.demo-app-root .report-table tr:last-child td { border-bottom: none; }
.demo-app-root .report-table tr:hover td { background: rgba(184,134,11,0.03); }
.demo-app-root .report-table td:first-child { color: var(--text); }

.demo-app-root .row-ai-btn {
  font-size: 11px; padding: 4px 10px; border-radius: 6px;
  border: 1px solid var(--border); color: var(--gold-btn);
  background: rgba(184,134,11,0.06); cursor: pointer; font-family: inherit;
  white-space: nowrap; transition: all 0.15s;
}
.demo-app-root .row-ai-btn:hover { border-color: var(--gold-muted); background: rgba(184,134,11,0.12); }
.demo-app-root .row-ai-btn:disabled { color: var(--text-faint); cursor: not-allowed; }

.demo-app-root .ai-summary {
  background: rgba(184,134,11,0.05); border: 1px solid var(--border-light);
  border-left: 3px solid var(--gold); border-radius: 6px;
  padding: 10px 12px; margin: 4px 0 8px; font-size: 12.5px;
  color: var(--text-mid); line-height: 1.6;
}
.demo-app-root .ai-summary.error { border-left-color: var(--danger); color: var(--danger); }
.demo-app-root .ai-summary-head {
  display: block; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--gold-btn); font-weight: 700; margin-bottom: 4px;
}

.demo-app-root .audit-action {
  font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 600;
  background: rgba(46,90,122,0.07); border: 1px solid rgba(46,90,122,0.18); color: var(--info);
}

.demo-app-root .status-pill {
  display: inline-block; padding: 2px 8px; border-radius: 4px;
  font-size: 10px; letter-spacing: 0.07em; text-transform: uppercase; font-weight: 600;
}
.demo-app-root .status-open   { background: rgba(74,124,89,0.1);  color: var(--success); border: 1px solid rgba(74,124,89,0.25); }
.demo-app-root .status-review { background: rgba(158,109,20,0.1); color: var(--warning); border: 1px solid rgba(158,109,20,0.25); }
.demo-app-root .status-closed { background: rgba(122,114,96,0.1); color: var(--text-faint); border: 1px solid var(--border); }
.demo-app-root .status-urgent { background: rgba(139,58,46,0.1);  color: var(--danger);  border: 1px solid rgba(139,58,46,0.25); }

.demo-app-root .priority-bar { display: flex; align-items: center; gap: 8px; }
.demo-app-root .priority-track { width: 56px; height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; }
.demo-app-root .priority-fill  { height: 100%; border-radius: 2px; }

.demo-app-root .agency-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px; }
.demo-app-root .agency-card { background: var(--cream-card); border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
.demo-app-root .agency-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.demo-app-root .agency-icon {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; flex-shrink: 0;
}
.demo-app-root .agency-card-name { font-size: 13px; color: var(--text); font-weight: 600; }
.demo-app-root .agency-card-dept { font-size: 11px; color: var(--text-faint); }
.demo-app-root .agency-metrics { display: flex; gap: 20px; }
.demo-app-root .agency-metric-val { font-family: 'Playfair Display', var(--font-heading), serif; font-size: 22px; font-weight: 700; color: var(--text); }
.demo-app-root .agency-metric-lbl { font-size: 10px; color: var(--text-faint); margin-top: 1px; }

.demo-app-root .thread-list { display: flex; flex-direction: column; gap: 8px; }
.demo-app-root .thread-item {
  background: var(--cream-card); border: 1px solid var(--border);
  border-radius: 8px; padding: 14px 16px;
  display: flex; align-items: flex-start; gap: 14px;
  cursor: pointer; transition: border-color 0.15s;
}
.demo-app-root .thread-item:hover { border-color: var(--gold-muted); }
.demo-app-root .thread-agencies { display: flex; flex-direction: column; gap: 3px; min-width: 76px; }
.demo-app-root .thread-agency-tag { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 3px; text-align: center; letter-spacing: 0.06em; }
.demo-app-root .thread-body { flex: 1; }
.demo-app-root .thread-title { font-size: 13px; color: var(--text); font-weight: 500; margin-bottom: 3px; }
.demo-app-root .thread-preview { font-size: 12px; color: var(--text-muted); line-height: 1.5; }
.demo-app-root .thread-meta { font-size: 11px; color: var(--text-faint); display: flex; align-items: center; gap: 10px; margin-top: 7px; }
.demo-app-root .thread-unread { width: 7px; height: 7px; border-radius: 50%; background: var(--gold); flex-shrink: 0; margin-top: 5px; }

.demo-app-root .upload-zone {
  background: var(--cream-card); border: 2px dashed var(--border);
  border-radius: 10px; padding: 36px 24px; text-align: center;
  cursor: pointer; transition: all 0.15s; margin-bottom: 24px;
}
.demo-app-root .upload-zone:hover, .demo-app-root .upload-zone.dragging {
  border-color: var(--gold-muted); background: rgba(184,134,11,0.05);
}
.demo-app-root .upload-icon { font-size: 26px; color: var(--gold); margin-bottom: 8px; }
.demo-app-root .upload-title { font-size: 14px; color: var(--text); font-weight: 500; margin-bottom: 4px; }
.demo-app-root .upload-sub { font-size: 11px; color: var(--text-faint); }
.demo-app-root .upload-input { display: none; }

.demo-app-root .doc-list { display: flex; flex-direction: column; gap: 8px; }
.demo-app-root .doc-row {
  background: var(--cream-card); border: 1px solid var(--border);
  border-radius: 8px; padding: 12px 16px; display: flex; align-items: center; gap: 12px;
}
.demo-app-root .doc-row-body { flex: 1; }
.demo-app-root .doc-row-title { font-size: 13px; color: var(--text); font-weight: 500; }
.demo-app-root .doc-row-meta { font-size: 11px; color: var(--text-faint); display: flex; gap: 12px; margin-top: 2px; }
.demo-app-root .doc-remove {
  font-size: 11px; padding: 4px 10px; border-radius: 6px;
  border: 1px solid var(--border); color: var(--danger);
  background: transparent; cursor: pointer; font-family: inherit; transition: all 0.15s;
}
.demo-app-root .doc-remove:hover { background: rgba(139,58,46,0.08); border-color: rgba(139,58,46,0.3); }

.demo-app-root .empty-state {
  background: var(--cream-card); border: 1px dashed var(--border);
  border-radius: 8px; padding: 24px; text-align: center;
  font-size: 13px; color: var(--text-faint);
}

.demo-app-root ::-webkit-scrollbar { width: 5px; }
.demo-app-root ::-webkit-scrollbar-track { background: transparent; }
.demo-app-root ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

@keyframes demoFadeSlide { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
.demo-app-root .animate-in { animation: demoFadeSlide 0.22s ease forwards; }
`;
