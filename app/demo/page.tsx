"use client";

import { useRef, useState } from "react";

type PanelId = "kb" | "search" | "reports" | "coord";

type QueryState = {
  value: string;
  loading: boolean;
  visible: boolean;
  echo: string;
  paragraphs: string[];
  sources: string[];
  errored: boolean;
};

const initialQuery: QueryState = {
  value: "",
  loading: false,
  visible: false,
  echo: "",
  paragraphs: [],
  sources: [],
  errored: false,
};

const TITLES: Record<PanelId, [string, string]> = {
  kb: ["Knowledge Base", "1,204 documents · Last indexed 4 min ago"],
  search: ["Semantic Search", "AI-powered search across all indexed documents"],
  reports: ["Reports", "47 open · 3 urgent"],
  coord: ["Inter-Agency Coordination", "4 active threads across 6 agencies"],
};

type KbDoc = {
  id: string;
  title: string;
  type: string;
  summary: string;
  keywords: string[];
};

const KNOWLEDGE_BASE: KbDoc[] = [
  {
    id: "EPA-HQ-OAR-2024-0041",
    title: "Revised Air Quality Index Thresholds for PM2.5 (Final Rule)",
    type: "Federal Register",
    summary:
      "Finalizes a tightening of the National Ambient Air Quality Standards (NAAQS) for fine particulate matter (PM2.5), lowering the annual primary standard from 12.0 μg/m³ to 9.0 μg/m³. Codified at 40 CFR Part 50; states must submit revised State Implementation Plans (SIPs) within 18 months of effective date. Guidance for nonattainment area designations follows in a separate notice.",
    keywords: [
      "pm2.5", "particulate", "air quality", "naaqs", "aqi", "epa", "sip",
      "state implementation plan", "nonattainment", "clean air act", "caa",
    ],
  },
  {
    id: "EO 14168",
    title: "EO 14168 — Strengthening Critical Infrastructure Resilience",
    type: "Executive Order",
    summary:
      "Directs sector risk management agencies to update sector-specific resilience plans within 180 days, with priority on energy, water, and communications sectors. Establishes a White House coordinating council and requires CISA to publish baseline cybersecurity performance goals applicable across all 16 critical infrastructure sectors. Implementation is supervised under PPD-21 framework.",
    keywords: [
      "critical infrastructure", "resilience", "cisa", "cybersecurity",
      "executive order", "ppd-21", "sector risk management", "white house",
      "energy", "water", "communications",
    ],
  },
  {
    id: "CEQ-2025-GM-003",
    title: "Interagency Permitting Coordination Under NEPA Reform Act",
    type: "Guidance Memo",
    summary:
      "Implements the 2023 NEPA Reform Act amendments to 42 USC §4336, codifying single-lead-agency review for projects involving 2+ federal agencies. Establishes 2-year EIS and 1-year EA page and time limits, and requires agencies to publish concurrent NEPA schedules. Categorical exclusions may be adopted from cooperating agencies under 40 CFR §1501.4(d).",
    keywords: [
      "nepa", "permitting", "eis", "ea", "categorical exclusion",
      "interagency", "lead agency", "ceq", "cooperating agency", "reform act",
      "permit", "consultation",
    ],
  },
  {
    id: "CISA ED 25-02",
    title: "CISA ED 25-02: Mitigation of Critical Vulnerability in ICS Systems",
    type: "Emergency Directive",
    summary:
      "Requires federal civilian agencies to identify and patch CVE-2025-1147 in deployed industrial control systems (ICS) within 72 hours of detection. Mandates network segmentation per NIST SP 800-82 Rev 3, and requires submission of mitigation reports through the CyberScope portal. Applies to all FCEB agencies; recommended for state, local, tribal, and territorial entities.",
    keywords: [
      "cisa", "ics", "industrial control", "vulnerability", "cve",
      "emergency directive", "patch", "cybersecurity", "fceb", "nist",
      "segmentation",
    ],
  },
  {
    id: "EPA-HQ-OW-2025-0011",
    title: "Proposed Rule: Drinking Water Standards for PFAS Compounds",
    type: "Federal Register",
    summary:
      "Proposes enforceable Maximum Contaminant Levels (MCLs) under the Safe Drinking Water Act (42 USC §300g-1) of 4 parts per trillion for PFOA and PFOS, with a hazard index for mixtures of four additional PFAS compounds. Public water systems would have 3 years to comply with monitoring requirements and 5 years to install treatment if exceedances occur. Comment period: 60 days.",
    keywords: [
      "pfas", "pfoa", "pfos", "drinking water", "mcl", "safe drinking water act",
      "sdwa", "epa", "contaminant", "groundwater", "monitoring",
    ],
  },
  {
    id: "OMB M-25-09",
    title: "A-123 Update: Enterprise Risk Management Framework Rev. 4",
    type: "OMB Circular",
    summary:
      "Updates OMB Circular A-123 to integrate Enterprise Risk Management (ERM) with internal control assessments. Requires agency CFOs to establish risk profiles aligned with strategic objectives, and report material risks to OMB annually. Aligns federal practice with COSO 2017 ERM framework and adds explicit cybersecurity and supply chain risk categories.",
    keywords: [
      "omb", "a-123", "enterprise risk management", "erm", "circular",
      "internal controls", "cfo", "coso", "supply chain", "risk profile",
    ],
  },
];

function searchKnowledgeBase(query: string): KbDoc[] {
  const tokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s.-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
  if (tokens.length === 0) return [];

  const scored = KNOWLEDGE_BASE.map((doc) => {
    const haystack = (
      doc.title +
      " " +
      doc.summary +
      " " +
      doc.keywords.join(" ") +
      " " +
      doc.id +
      " " +
      doc.type
    ).toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (haystack.includes(t)) score += 1;
      // bonus for exact keyword match
      if (doc.keywords.some((k) => k === t || k.includes(t))) score += 1;
    }
    return { doc, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 3).map((s) => s.doc);
}

function buildAnswer(query: string, hits: KbDoc[]): {
  paragraphs: string[];
  sources: string[];
} {
  if (hits.length === 0) {
    return {
      paragraphs: [
        `No documents in the indexed knowledge base directly address "${query}". Try rephrasing with terms like NEPA, PFAS, PM2.5, NAAQS, ICS, ERM, or A-123, or browse the Recent Documents below.`,
      ],
      sources: [],
    };
  }

  const lead = hits[0];
  const intro = `Based on ${hits.length} document${
    hits.length > 1 ? "s" : ""
  } in the indexed knowledge base, the most relevant guidance is ${lead.id} — ${lead.title}.`;

  const body = hits.map((h) => `${h.id}: ${h.summary}`);
  return {
    paragraphs: [intro, ...body],
    sources: hits.map((h) => h.id),
  };
}

export default function DemoPage() {
  const [active, setActive] = useState<PanelId>("kb");
  const [kb, setKb] = useState<QueryState>(initialQuery);
  const [search, setSearch] = useState<QueryState>(initialQuery);

  const kbRef = useRef<HTMLTextAreaElement | null>(null);
  const searchRef = useRef<HTMLTextAreaElement | null>(null);

  const [topTitle, topMeta] = TITLES[active];

  function autoResize(el: HTMLTextAreaElement | null) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  async function runQuery(
    state: QueryState,
    setState: (s: QueryState) => void
  ) {
    const query = state.value.trim();
    if (!query) return;

    setState({
      ...state,
      loading: true,
      visible: true,
      echo: `"${query}"`,
      paragraphs: [],
      sources: [],
      errored: false,
    });

    // Simulated retrieval over the in-memory knowledge base. No external call —
    // works fully on a static GitHub Pages deploy.
    await new Promise((r) => setTimeout(r, 450));
    const hits = searchKnowledgeBase(query);
    const { paragraphs, sources } = buildAnswer(query, hits);

    setState({
      ...state,
      value: query,
      loading: false,
      visible: true,
      echo: `"${query}"`,
      paragraphs,
      sources,
      errored: false,
    });
  }

  function handleEnter(
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    onRun: () => void
  ) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onRun();
    }
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
              badge="1,204"
              activeNav={active === "kb"}
              onClick={() => setActive("kb")}
            />
            <NavItem
              icon="⊹"
              label="Semantic Search"
              activeNav={active === "search"}
              onClick={() => setActive("search")}
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
            <NavItem
              icon="◫"
              label="Compliance"
              activeNav={false}
              onClick={() => setActive("kb")}
            />

            <div className="nav-section-label">System</div>
            <NavItem
              icon="◌"
              label="Audit Trail"
              activeNav={false}
              onClick={() => setActive("kb")}
            />
            <NavItem
              icon="⊡"
              label="Settings"
              activeNav={false}
              onClick={() => setActive("kb")}
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
              <span style={{ fontSize: 12, color: "var(--text-faint)" }}>
                <span className="status-dot"></span>All systems operational
              </span>
              <button className="btn btn-ghost">Export</button>
              <button className="btn btn-gold">+ New Report</button>
            </div>
          </div>

          <div className="content">
            {active === "kb" && (
              <KbPanel
                state={kb}
                setState={setKb}
                inputRef={kbRef}
                onEnter={(e) => handleEnter(e, () => runQuery(kb, setKb))}
                onRun={() => runQuery(kb, setKb)}
                onAutoResize={() => autoResize(kbRef.current)}
                primaryPlaceholder="e.g. What are the new PM2.5 air quality thresholds under the revised NAAQS?"
                quickQueries={[
                  "What are the new PM2.5 air quality thresholds?",
                  "Critical infrastructure resilience under EO 14168",
                  "Interagency NEPA permitting coordination",
                  "PFAS drinking water standards",
                ]}
                showRecentDocs
              />
            )}

            {active === "search" && (
              <KbPanel
                state={search}
                setState={setSearch}
                inputRef={searchRef}
                onEnter={(e) =>
                  handleEnter(e, () => runQuery(search, setSearch))
                }
                onRun={() => runQuery(search, setSearch)}
                onAutoResize={() => autoResize(searchRef.current)}
                primaryPlaceholder="e.g. How should agencies mitigate critical ICS vulnerabilities?"
                quickQueries={[
                  "Mitigating critical ICS vulnerabilities",
                  "Enterprise risk management under A-123",
                  "NEPA categorical exclusion criteria",
                ]}
                showRecentDocs={false}
              />
            )}

            {active === "reports" && <ReportsPanel />}
            {active === "coord" && <CoordPanel />}
          </div>
        </main>
      </div>
    </div>
  );
}

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
        <span className={`nav-badge${badgeAlert ? " alert" : ""}`}>
          {badge}
        </span>
      )}
    </div>
  );
}

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
}) {
  return (
    <div className="panel active">
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
          <button
            className="search-btn"
            onClick={onRun}
            disabled={state.loading}
          >
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
                Searching knowledge base…
              </div>
            ) : state.errored ? (
              <p>Error connecting to knowledge base. Please try again.</p>
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
        </div>
      )}

      {showRecentDocs && (
        <>
          <div className="section-header">
            <span className="section-title">Recent Documents</span>
            <span className="section-link">Browse all →</span>
          </div>
          <div className="doc-grid">
            <DocCard
              type="Federal Register"
              dotColor="var(--info)"
              title="Revised Air Quality Index Thresholds for PM2.5 (Final Rule)"
              meta={["EPA-HQ-OAR-2024-0041", "Mar 14, 2025"]}
            />
            <DocCard
              type="Executive Order"
              dotColor="var(--gold)"
              title="EO 14168 — Strengthening Critical Infrastructure Resilience"
              meta={["White House", "Jan 20, 2025"]}
            />
            <DocCard
              type="Guidance Memo"
              dotColor="var(--success)"
              title="Interagency Permitting Coordination Under NEPA Reform Act"
              meta={["CEQ-2025-GM-003", "Feb 28, 2025"]}
            />
            <DocCard
              type="Emergency Directive"
              dotColor="var(--danger)"
              title="CISA ED 25-02: Mitigation of Critical Vulnerability in ICS Systems"
              meta={["CISA", "Apr 3, 2025"]}
            />
            <DocCard
              type="Federal Register"
              dotColor="var(--info)"
              title="Proposed Rule: Drinking Water Standards for PFAS Compounds"
              meta={["EPA-HQ-OW-2025-0011", "Apr 18, 2025"]}
            />
            <DocCard
              type="OMB Circular"
              dotColor="#7a5c9e"
              title="A-123 Update: Enterprise Risk Management Framework Rev. 4"
              meta={["OMB M-25-09", "Mar 30, 2025"]}
            />
          </div>
        </>
      )}
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
        {meta.map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function ReportsPanel() {
  const reports: {
    title: string;
    id: string;
    agency: string;
    status: "urgent" | "review" | "open" | "closed";
    statusLabel: string;
    priority: number;
    priorityColor: string;
    due: string;
    assignee: string;
  }[] = [
    {
      title: "Quarterly Air Permit Compliance Report",
      id: "RPT-2025-0441",
      agency: "EPA Region 9",
      status: "urgent",
      statusLabel: "Urgent",
      priority: 9,
      priorityColor: "var(--danger)",
      due: "May 7",
      assignee: "J. Reyes",
    },
    {
      title: "PFAS Groundwater Monitoring — Site Delta",
      id: "RPT-2025-0438",
      agency: "EPA / DoD",
      status: "review",
      statusLabel: "In Review",
      priority: 7,
      priorityColor: "var(--warning)",
      due: "May 15",
      assignee: "M. Chen",
    },
    {
      title: "Wetland Mitigation Bank Annual Report",
      id: "RPT-2025-0429",
      agency: "USACE / EPA",
      status: "open",
      statusLabel: "Active",
      priority: 5,
      priorityColor: "var(--success)",
      due: "May 30",
      assignee: "T. Park",
    },
    {
      title: "Tribal Consultation Documentation — NM Pipeline",
      id: "RPT-2025-0421",
      agency: "BIA / FERC",
      status: "urgent",
      statusLabel: "Urgent",
      priority: 8,
      priorityColor: "var(--danger)",
      due: "May 9",
      assignee: "A. Morales",
    },
    {
      title: "Section 7 Consultation — ESA Salmon Habitat",
      id: "RPT-2025-0414",
      agency: "NMFS / EPA",
      status: "review",
      statusLabel: "In Review",
      priority: 6,
      priorityColor: "var(--warning)",
      due: "Jun 1",
      assignee: "S. Johnson",
    },
    {
      title: "CERCLA 5-Year Review — Superfund Site 88",
      id: "RPT-2025-0398",
      agency: "EPA OLEM",
      status: "closed",
      statusLabel: "Closed",
      priority: 3,
      priorityColor: "var(--text-faint)",
      due: "Apr 25 ✓",
      assignee: "B. Williams",
    },
  ];

  return (
    <div className="panel active">
      <div className="stats-row">
        <Stat label="Open Reports" value="47" delta="↑ 5 this week" />
        <Stat
          label="Avg Resolution"
          value={
            <>
              8.2
              <span style={{ fontSize: 14, color: "var(--text-faint)" }}>d</span>
            </>
          }
          delta="↓ 1.4d improvement"
        />
        <Stat
          label="Agencies Involved"
          value="14"
          delta="across 3 regions"
          deltaColor="var(--text-faint)"
        />
        <Stat
          label="Compliance Rate"
          value={
            <>
              94
              <span style={{ fontSize: 14, color: "var(--text-faint)" }}>%</span>
            </>
          }
          delta="↑ 2.1% vs last qtr"
        />
      </div>

      <div className="section-header">
        <span className="section-title">Active Reports</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 11, padding: "4px 10px" }}
          >
            Filter
          </button>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 11, padding: "4px 10px" }}
          >
            Sort ↕
          </button>
        </div>
      </div>

      <div
        style={{
          background: "var(--cream-card)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        <table className="report-table">
          <thead>
            <tr>
              <th>Report ID / Title</th>
              <th>Agency</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due</th>
              <th>Assignee</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>
                  <div>{r.title}</div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-faint)",
                      marginTop: 2,
                    }}
                  >
                    {r.id}
                  </div>
                </td>
                <td>{r.agency}</td>
                <td>
                  <span className={`status-pill status-${r.status}`}>
                    {r.statusLabel}
                  </span>
                </td>
                <td>
                  <div className="priority-bar">
                    <div className="priority-track">
                      <div
                        className="priority-fill"
                        style={{
                          width: `${r.priority * 10}%`,
                          background: r.priorityColor,
                        }}
                      ></div>
                    </div>
                    <span style={{ fontSize: 11, color: r.priorityColor }}>
                      {r.priority}/10
                    </span>
                  </div>
                </td>
                <td style={{ fontSize: 12 }}>{r.due}</td>
                <td>{r.assignee}</td>
              </tr>
            ))}
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

function CoordPanel() {
  return (
    <div className="panel active">
      <div className="agency-grid">
        <AgencyCard
          tag="EPA"
          tagBg="rgba(46,90,122,0.1)"
          tagColor="var(--info)"
          tagBorder="rgba(46,90,122,0.2)"
          name="Environmental Protection"
          dept="Region 9 — Southwest"
          metrics={[
            { val: "12", label: "open items" },
            { val: "94%", label: "response rate", color: "var(--success)" },
          ]}
        />
        <AgencyCard
          tag="DOI"
          tagBg="rgba(74,124,89,0.1)"
          tagColor="var(--success)"
          tagBorder="rgba(74,124,89,0.2)"
          name="Dept. of the Interior"
          dept="Bureau of Indian Affairs"
          metrics={[
            { val: "5", label: "open items" },
            { val: "78%", label: "response rate", color: "var(--warning)" },
          ]}
        />
        <AgencyCard
          tag="USACE"
          tagBg="rgba(184,134,11,0.1)"
          tagColor="var(--gold-btn)"
          tagBorder="rgba(184,134,11,0.2)"
          name="Army Corps of Engineers"
          dept="Los Angeles District"
          metrics={[
            { val: "8", label: "open items" },
            { val: "91%", label: "response rate", color: "var(--success)" },
          ]}
        />
      </div>

      <div className="section-header" style={{ marginBottom: 12 }}>
        <span className="section-title">Active Coordination Threads</span>
        <button
          className="btn btn-gold"
          style={{ fontSize: 11, padding: "5px 12px" }}
        >
          + New Thread
        </button>
      </div>

      <div className="thread-list">
        <Thread
          unread
          tags={[
            { label: "EPA", bg: "rgba(46,90,122,0.1)", color: "var(--info)" },
            { label: "USACE", bg: "rgba(184,134,11,0.1)", color: "var(--gold-btn)" },
          ]}
          title="Section 404 / Section 401 Joint Review — Rillito Wetland Restoration"
          preview="USACE requested EPA water quality cert. EPA Region 9 flagged potential ESA Section 7 trigger — awaiting NMFS consultation status from DoI liaison before proceeding."
          status="review"
          statusLabel="In Review"
          messages="14 messages"
          ago="2h ago"
        />
        <Thread
          unread
          tags={[
            { label: "EPA", bg: "rgba(46,90,122,0.1)", color: "var(--info)" },
            { label: "DOI", bg: "rgba(74,124,89,0.1)", color: "var(--success)" },
            { label: "FERC", bg: "rgba(122,92,158,0.1)", color: "#7a5c9e" },
          ]}
          title="NM Pipeline Project — Tribal Consultation & Environmental Review"
          preview="Three-agency coordination on NHPA Section 106, NEPA EIS, and tribal consultation timelines. BIA lead has requested 30-day extension for sovereign nation review period."
          status="urgent"
          statusLabel="Urgent"
          messages="31 messages"
          ago="45m ago"
        />
        <Thread
          tags={[
            { label: "EPA", bg: "rgba(46,90,122,0.1)", color: "var(--info)" },
            { label: "DoD", bg: "rgba(139,58,46,0.1)", color: "var(--danger)" },
          ]}
          title="PFAS Remediation Cost-Share Agreement — Tucson AFB Adjacent Sites"
          preview="EPA and DoD resolving cost allocation under CERCLA for PFAS plume originating at Air Force installation. Draft MOA under legal review at both agencies."
          status="open"
          statusLabel="Active"
          messages="22 messages"
          ago="yesterday"
        />
        <Thread
          tags={[
            { label: "USACE", bg: "rgba(184,134,11,0.1)", color: "var(--gold-btn)" },
            { label: "NMFS", bg: "rgba(74,124,89,0.1)", color: "var(--success)" },
          ]}
          title="Biological Opinion — Yuma Irrigation District Diversion Structure"
          preview="BiOp issued with Reasonable and Prudent Alternatives. USACE confirming Section 404 permit conditions align with NMFS RPAs. Final coordination memo due May 20."
          status="review"
          statusLabel="In Review"
          messages="9 messages"
          ago="3 days ago"
        />
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
        <div
          className="agency-icon"
          style={{
            background: tagBg,
            color: tagColor,
            border: `1px solid ${tagBorder}`,
          }}
        >
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
            <div
              className="agency-metric-val"
              style={m.color ? { color: m.color } : undefined}
            >
              {m.val}
            </div>
            <div className="agency-metric-lbl">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Thread({
  unread,
  tags,
  title,
  preview,
  status,
  statusLabel,
  messages,
  ago,
}: {
  unread?: boolean;
  tags: { label: string; bg: string; color: string }[];
  title: string;
  preview: string;
  status: "urgent" | "review" | "open" | "closed";
  statusLabel: string;
  messages: string;
  ago: string;
}) {
  return (
    <div className="thread-item">
      {unread && <div className="thread-unread"></div>}
      <div className="thread-agencies">
        {tags.map((t, i) => (
          <div
            key={i}
            className="thread-agency-tag"
            style={{ background: t.bg, color: t.color }}
          >
            {t.label}
          </div>
        ))}
      </div>
      <div className="thread-body">
        <div className="thread-title">{title}</div>
        <div className="thread-preview">{preview}</div>
        <div className="thread-meta">
          <span className={`status-pill status-${status}`}>{statusLabel}</span>
          <span>{messages}</span>
          <span>{ago}</span>
        </div>
      </div>
    </div>
  );
}

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

.demo-app-root .status-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--success); display: inline-block; margin-right: 6px;
}

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
  background: var(--cream-card); border: 1px solid var(--border);
  border-radius: 10px; padding: 22px 24px; margin-bottom: 24px;
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

.demo-app-root ::-webkit-scrollbar { width: 5px; }
.demo-app-root ::-webkit-scrollbar-track { background: transparent; }
.demo-app-root ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

@keyframes demoFadeSlide { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
.demo-app-root .animate-in { animation: demoFadeSlide 0.22s ease forwards; }
`;
