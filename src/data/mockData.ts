export const agencies = [
  { id: "dhs", name: "Department of Homeland Security", abbr: "DHS" },
  { id: "dot", name: "Department of Transportation", abbr: "DOT" },
  { id: "doe", name: "Department of Energy", abbr: "DOE" },
  { id: "dod", name: "Department of Defense", abbr: "DoD" },
];

export const programs = [
  {
    id: "niri",
    name: "National Infrastructure Resilience Initiative",
    abbr: "NIRI",
    agency: "DHS",
    status: "Active",
    phase: "Phase 2 — Execution",
    budget: { total: 2400000000, obligated: 1680000000, spent: 1120000000 },
    startDate: "2024-01-15",
    endDate: "2028-09-30",
    riskLevel: "Medium",
    compliance: 87,
    milestoneCompletion: 62,
    description: "Multi-agency initiative to modernize and strengthen national infrastructure against emerging threats including cyber, climate, and physical disruption.",
  },
];

export const milestones = [
  { id: "m1", name: "Requirements Baseline Approved", status: "Completed", date: "2024-03-15", owner: "DHS CISA" },
  { id: "m2", name: "Inter-Agency MOU Signed", status: "Completed", date: "2024-06-01", owner: "DHS / DOT / DOE" },
  { id: "m3", name: "Phase 1 Assessment Complete", status: "Completed", date: "2024-09-30", owner: "DHS CISA" },
  { id: "m4", name: "Regional Pilot Deployment", status: "In Progress", date: "2025-03-31", owner: "DOT / DOE" },
  { id: "m5", name: "Cybersecurity Framework Integration", status: "In Progress", date: "2025-06-30", owner: "DHS CISA / DoD" },
  { id: "m6", name: "Congressional Q2 Report Submission", status: "At Risk", date: "2025-07-15", owner: "OMB / DHS" },
  { id: "m7", name: "Full Operational Capability", status: "Planned", date: "2027-12-31", owner: "All Agencies" },
  { id: "m8", name: "Program Closeout & Transition", status: "Planned", date: "2028-09-30", owner: "DHS" },
];

export const risks = [
  { id: "r1", title: "Cybersecurity talent gap in regional offices", severity: "High", likelihood: "High", impact: "Critical", mitigation: "Accelerating hiring pipeline; cross-training existing staff", category: "Workforce", status: "Open" },
  { id: "r2", title: "Budget sequestration risk for FY26", severity: "Medium", likelihood: "Medium", impact: "High", mitigation: "Developing reduced-scope contingency plan", category: "Budget", status: "Monitoring" },
  { id: "r3", title: "Inter-agency data sharing agreement delays", severity: "Medium", likelihood: "High", impact: "Medium", mitigation: "Escalated to Deputy Secretary level", category: "Governance", status: "Open" },
  { id: "r4", title: "Legacy system integration complexity", severity: "High", likelihood: "Medium", impact: "High", mitigation: "Phased migration approach with fallback protocols", category: "Technical", status: "Mitigating" },
  { id: "r5", title: "Congressional reporting timeline compression", severity: "Low", likelihood: "Low", impact: "Medium", mitigation: "Automated report generation via Ordinance", category: "Compliance", status: "Resolved" },
];

export const stakeholders = [
  { id: "s1", name: "Sarah Chen", role: "Program Director", agency: "DHS", availability: "Full-time" },
  { id: "s2", name: "James Rodriguez", role: "Deputy PM", agency: "DOT", availability: "Full-time" },
  { id: "s3", name: "Dr. Aisha Patel", role: "Technical Lead", agency: "DOE", availability: "Part-time" },
  { id: "s4", name: "Col. Michael Torres", role: "Security Liaison", agency: "DoD", availability: "Part-time" },
  { id: "s5", name: "Lisa Washington", role: "Budget Analyst", agency: "OMB", availability: "Matrixed" },
  { id: "s6", name: "Robert Kim", role: "Oversight Coordinator", agency: "GAO", availability: "Quarterly" },
];

export const tasks = [
  { id: "t1", title: "Complete regional site assessments", status: "In Progress", priority: "High", assignee: "DOT Team", dueDate: "2025-02-28", progress: 75 },
  { id: "t2", title: "Finalize cybersecurity baseline requirements", status: "In Progress", priority: "Critical", assignee: "DHS CISA", dueDate: "2025-03-15", progress: 60 },
  { id: "t3", title: "Submit OMB budget justification for FY26", status: "Not Started", priority: "High", assignee: "Lisa Washington", dueDate: "2025-04-01", progress: 0 },
  { id: "t4", title: "Draft Congressional quarterly briefing", status: "In Progress", priority: "Medium", assignee: "Sarah Chen", dueDate: "2025-03-31", progress: 30 },
  { id: "t5", title: "Integrate DOE energy grid data feeds", status: "Blocked", priority: "High", assignee: "Dr. Aisha Patel", dueDate: "2025-05-15", progress: 15 },
  { id: "t6", title: "Security clearance processing for new hires", status: "In Progress", priority: "Medium", assignee: "Col. Michael Torres", dueDate: "2025-04-30", progress: 40 },
];

export const activities = [
  { id: "a1", text: "AI generated quarterly compliance report draft", time: "2 hours ago", type: "ai" as const },
  { id: "a2", text: "Sarah Chen updated milestone M4 status to 'In Progress'", time: "4 hours ago", type: "update" as const },
  { id: "a3", text: "Risk R3 escalated to Deputy Secretary level", time: "1 day ago", type: "risk" as const },
  { id: "a4", text: "DOT submitted regional assessment for Northeast corridor", time: "1 day ago", type: "update" as const },
  { id: "a5", text: "Budget reallocation approved for cybersecurity training", time: "2 days ago", type: "budget" as const },
  { id: "a6", text: "New workforce gap identified: Cloud Security Engineers", time: "3 days ago", type: "staffing" as const },
  { id: "a7", text: "GAO audit review scheduled for Q3 2025", time: "3 days ago", type: "compliance" as const },
];

export const reports = [
  { id: "rpt1", title: "Q4 2024 Congressional Oversight Report", status: "Published", date: "2025-01-15", type: "Congressional", version: "3.2" },
  { id: "rpt2", title: "FY25 Q1 Budget Execution Summary", status: "Published", date: "2025-01-30", type: "Budget", version: "2.0" },
  { id: "rpt3", title: "Inter-Agency Coordination Status Brief", status: "Draft", date: "2025-02-10", type: "Coordination", version: "1.1" },
  { id: "rpt4", title: "Cybersecurity Risk Assessment Update", status: "Under Review", date: "2025-02-05", type: "Risk", version: "1.0" },
  { id: "rpt5", title: "Q1 2025 Congressional Oversight Report", status: "AI Generating", date: "2025-03-15", type: "Congressional", version: "0.1" },
];

export const knowledgeItems = [
  { id: "k1", title: "Infrastructure Assessment Methodology v3.0", type: "Policy", date: "2024-06-15", connections: 12, agency: "DHS" },
  { id: "k2", title: "Inter-Agency Data Sharing Protocol", type: "Agreement", date: "2024-08-20", connections: 8, agency: "Multi-Agency" },
  { id: "k3", title: "FY24 Lessons Learned — Regional Pilot", type: "Lesson", date: "2024-12-01", connections: 15, agency: "DOT" },
  { id: "k4", title: "Cybersecurity Workforce Development Framework", type: "Framework", date: "2024-09-10", connections: 6, agency: "DHS CISA" },
  { id: "k5", title: "Congressional Reporting Requirements Matrix", type: "Compliance", date: "2024-03-01", connections: 20, agency: "OMB" },
  { id: "k6", title: "Previous Program Closeout: NIPP 2020", type: "Historical", date: "2023-09-30", connections: 18, agency: "DHS" },
];

export const staffingData = {
  totalPositions: 342,
  filled: 287,
  vacant: 55,
  gaps: [
    { role: "Cloud Security Engineer", needed: 12, filled: 4, urgency: "Critical" },
    { role: "Data Integration Specialist", needed: 8, filled: 5, urgency: "High" },
    { role: "Program Analyst (GS-13)", needed: 15, filled: 11, urgency: "Medium" },
    { role: "Infrastructure Assessment Lead", needed: 6, filled: 4, urgency: "High" },
    { role: "Congressional Liaison", needed: 3, filled: 2, urgency: "Low" },
  ],
  costComparison: {
    consultingAnnual: 48000000,
    ordinanceAnnual: 8500000,
    savings: 39500000,
    savingsPercent: 82,
  },
};

export const budgetData = [
  { month: "Oct", planned: 95, actual: 88 },
  { month: "Nov", planned: 110, actual: 102 },
  { month: "Dec", planned: 125, actual: 118 },
  { month: "Jan", planned: 140, actual: 135 },
  { month: "Feb", planned: 155, actual: 148 },
  { month: "Mar", planned: 170, actual: 0 },
  { month: "Apr", planned: 185, actual: 0 },
  { month: "May", planned: 200, actual: 0 },
  { month: "Jun", planned: 215, actual: 0 },
];

export const aiHealthSummary = `## Program Health Assessment — NIRI

**Overall Status: ON TRACK with MODERATE RISK**

The National Infrastructure Resilience Initiative continues to execute within acceptable parameters. Phase 2 execution is 62% complete against milestones, with budget utilization at 66.7% ($1.12B of $1.68B obligated).

### Key Findings
- **Regional pilot deployments** are progressing ahead of schedule in the Northeast and Southeast corridors
- **Cybersecurity talent gap** remains the primary risk driver, with only 33% of Cloud Security Engineer positions filled
- **Inter-agency coordination** has improved following Deputy Secretary escalation of data sharing agreements
- **Congressional reporting** is on track with automated draft generation reducing preparation time by 78%

### Recommended Actions
1. Accelerate cybersecurity hiring pipeline through expanded fellowship programs
2. Pre-position FY26 budget justification materials ahead of sequestration risk
3. Schedule quarterly sync with GAO ahead of planned Q3 audit
4. Begin drafting contingency scope reduction plan for budget risk scenarios`;
