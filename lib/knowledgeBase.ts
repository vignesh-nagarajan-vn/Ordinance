// Shared knowledge base types and the built-in document corpus.
// Imported by both the server (the /api/query retrieval step) and the client
// (the demo UI, which renders document cards and types uploaded documents).

export type KbDoc = {
  id: string;
  title: string;
  type: string;
  summary: string;
  keywords: string[];
  /** Display metadata for document cards. */
  source?: string;
  date?: string;
  /** True for documents a user uploaded at runtime (not part of the corpus). */
  uploaded?: boolean;
};

export const KNOWLEDGE_BASE: KbDoc[] = [
  {
    id: "EPA-HQ-OAR-2024-0041",
    title: "Revised Air Quality Index Thresholds for PM2.5 (Final Rule)",
    type: "Federal Register",
    source: "EPA",
    date: "Mar 14, 2025",
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
    source: "White House",
    date: "Jan 20, 2025",
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
    source: "CEQ",
    date: "Feb 28, 2025",
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
    source: "CISA",
    date: "Apr 3, 2025",
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
    source: "EPA",
    date: "Apr 18, 2025",
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
    source: "OMB",
    date: "Mar 30, 2025",
    summary:
      "Updates OMB Circular A-123 to integrate Enterprise Risk Management (ERM) with internal control assessments. Requires agency CFOs to establish risk profiles aligned with strategic objectives, and report material risks to OMB annually. Aligns federal practice with COSO 2017 ERM framework and adds explicit cybersecurity and supply chain risk categories.",
    keywords: [
      "omb", "a-123", "enterprise risk management", "erm", "circular",
      "internal controls", "cfo", "coso", "supply chain", "risk profile",
    ],
  },
];
