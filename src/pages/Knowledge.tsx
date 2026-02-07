import { useState } from "react";
import { Search, Brain, Link2, Calendar, FileText, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { knowledgeItems } from "@/data/mockData";

const timelineEvents = [
  { date: "2024-01-15", event: "NIRI Program Authorized", type: "Milestone" },
  { date: "2024-03-15", event: "Requirements Baseline Approved", type: "Milestone" },
  { date: "2024-05-10", event: "Policy: Infrastructure Assessment Methodology v3.0 adopted", type: "Policy" },
  { date: "2024-06-01", event: "Inter-Agency MOU Signed (DHS/DOT/DOE)", type: "Agreement" },
  { date: "2024-08-20", event: "Data Sharing Protocol established", type: "Agreement" },
  { date: "2024-09-30", event: "Phase 1 Assessment Complete", type: "Milestone" },
  { date: "2024-12-01", event: "Lessons Learned captured from Regional Pilot", type: "Knowledge" },
  { date: "2025-01-15", event: "Q4 2024 Congressional Report published", type: "Report" },
];

const graphNodes = [
  { id: 1, label: "NIRI Program", x: 50, y: 50, type: "program" },
  { id: 2, label: "DHS", x: 20, y: 25, type: "agency" },
  { id: 3, label: "DOT", x: 80, y: 20, type: "agency" },
  { id: 4, label: "DOE", x: 75, y: 75, type: "agency" },
  { id: 5, label: "Cyber Framework", x: 15, y: 70, type: "policy" },
  { id: 6, label: "Regional Pilots", x: 85, y: 48, type: "initiative" },
  { id: 7, label: "Budget Auth", x: 35, y: 80, type: "compliance" },
  { id: 8, label: "NIPP 2020", x: 55, y: 15, type: "historical" },
];

const graphEdges = [
  [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [2, 5], [3, 6], [4, 6], [1, 8], [2, 8], [5, 7],
];

function getNodeColor(type: string) {
  switch (type) {
    case "program": return "bg-primary text-primary-foreground";
    case "agency": return "bg-accent text-accent-foreground";
    case "policy": return "bg-success/80 text-success-foreground";
    case "initiative": return "bg-warning/80 text-warning-foreground";
    case "compliance": return "bg-destructive/80 text-destructive-foreground";
    case "historical": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-foreground";
  }
}

export default function Knowledge() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const filteredItems = knowledgeItems.filter(
    (k) =>
      k.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Institutional Knowledge Layer</h1>
        <p className="text-sm text-muted-foreground mt-1">Persistent program intelligence, cross-reference search, and institutional memory</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search policies, stakeholders, prior decisions, and program knowledge..."
          className="w-full bg-card border rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Knowledge Graph */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Knowledge Graph
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-muted/30 rounded-lg h-[320px] overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                {graphEdges.map(([from, to], i) => {
                  const a = graphNodes.find((n) => n.id === from)!;
                  const b = graphNodes.find((n) => n.id === to)!;
                  const isHighlighted = selectedNode === from || selectedNode === to;
                  return (
                    <line
                      key={i}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={isHighlighted ? "hsl(var(--accent))" : "hsl(var(--border))"}
                      strokeWidth={isHighlighted ? 0.6 : 0.3}
                      opacity={isHighlighted ? 1 : 0.5}
                    />
                  );
                })}
              </svg>
              {graphNodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-md text-[9px] font-semibold transition-all cursor-pointer ${getNodeColor(node.type)} ${
                    selectedNode === node.id ? "ring-2 ring-accent scale-110 z-10" : "hover:scale-105"
                  }`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  {node.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Items */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Cross-Program Memory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredItems.map((k) => (
              <div key={k.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{k.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="gov-badge-neutral text-[9px]">{k.type}</span>
                    <span className="text-[10px] text-muted-foreground">{k.agency}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Link2 className="w-2.5 h-2.5" /> {k.connections} connections
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">{k.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Institutional Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
            {timelineEvents.map((event, i) => (
              <div key={i} className="relative flex items-start gap-4 pb-3 last:pb-0 ml-1">
                <div className="relative z-10 w-5 h-5 rounded-full bg-card border-2 border-accent flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium">{event.event}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">{event.date}</span>
                    <span className="gov-badge-neutral text-[9px]">{event.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Contextual Retrieval */}
      <Card className="border-accent/20 bg-accent/[0.02]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            AI Contextual Retrieval
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Ordinance maintains persistent institutional memory across all programs, policies, and decisions.
            The knowledge graph above shows relationships between entities that inform AI-generated insights and recommendations.
          </p>
          <div className="bg-muted/50 rounded-lg p-3 text-xs leading-relaxed">
            <p className="font-medium mb-1">Context Retrieved for Current Session:</p>
            <p>Based on your current program context (NIRI), Ordinance has loaded 6 policy documents, 18 historical references from NIPP 2020, 
            12 inter-agency agreements, and 34 stakeholder interaction records. This institutional memory enables AI-generated reports to 
            reference prior decisions and maintain continuity across personnel changes.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
