import { Users, AlertTriangle, TrendingDown, DollarSign, Sparkles, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { staffingData } from "@/data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const fillData = [
  { name: "Filled", value: staffingData.filled },
  { name: "Vacant", value: staffingData.vacant },
];

const PIE_COLORS = ["hsl(var(--accent))", "hsl(var(--muted))"];

const gapChartData = staffingData.gaps.map((g) => ({
  name: g.role.length > 20 ? g.role.substring(0, 20) + "..." : g.role,
  needed: g.needed,
  filled: g.filled,
}));

const savingsData = [
  { name: "Consulting PMO", value: staffingData.costComparison.consultingAnnual / 1e6 },
  { name: "Ordinance AI", value: staffingData.costComparison.ordinanceAnnual / 1e6 },
];

function getUrgencyBadge(urgency: string) {
  switch (urgency) {
    case "Critical": return "gov-badge-destructive";
    case "High": return "gov-badge-warning";
    case "Medium": return "gov-badge-info";
    default: return "gov-badge-neutral";
  }
}

export default function Talent() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Talent & Staffing Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-1">Workforce planning, capability gap detection, and cost optimization</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="data-label mb-1">Total Positions</div>
            <div className="data-value">{staffingData.totalPositions}</div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="data-label mb-1">Filled</div>
            <div className="data-value text-accent">{staffingData.filled}</div>
            <Progress value={(staffingData.filled / staffingData.totalPositions) * 100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="data-label mb-1">Vacant</div>
            <div className="data-value text-warning">{staffingData.vacant}</div>
          </CardContent>
        </Card>
        <Card className="stat-card border-success/20">
          <CardContent className="p-4">
            <div className="data-label mb-1">Annual Savings</div>
            <div className="data-value text-success">${(staffingData.costComparison.savings / 1e6).toFixed(1)}M</div>
            <p className="text-[10px] text-success mt-1">{staffingData.costComparison.savingsPercent}% vs. consulting</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gap Detection */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Capability Gap Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {staffingData.gaps.map((gap, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium">{gap.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground">{gap.filled}/{gap.needed} filled</span>
                    <Progress value={(gap.filled / gap.needed) * 100} className="w-16 h-1" />
                  </div>
                </div>
                <span className={`${getUrgencyBadge(gap.urgency)} text-[9px]`}>{gap.urgency}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Workforce Fill Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Workforce Fill Rate</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={fillData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {fillData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cost Comparison */}
      <Card className="border-success/20 bg-success/[0.02]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-success" />
            Cost Savings: Consulting PMO vs. Ordinance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={savingsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} unit="M" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={100} />
                <Tooltip
                  formatter={(value: number) => [`$${value}M`, "Annual Cost"]}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center space-y-3">
              <div>
                <div className="data-label">Traditional Consulting PMO</div>
                <div className="text-xl font-bold text-destructive">${(staffingData.costComparison.consultingAnnual / 1e6).toFixed(0)}M <span className="text-xs font-normal text-muted-foreground">/ year</span></div>
              </div>
              <div>
                <div className="data-label">Ordinance AI Platform</div>
                <div className="text-xl font-bold text-success">${(staffingData.costComparison.ordinanceAnnual / 1e6).toFixed(1)}M <span className="text-xs font-normal text-muted-foreground">/ year</span></div>
              </div>
              <div className="border-t pt-2">
                <div className="data-label">Net Annual Savings</div>
                <div className="text-2xl font-bold text-success">${(staffingData.costComparison.savings / 1e6).toFixed(1)}M</div>
                <p className="text-xs text-muted-foreground mt-1">Represents {staffingData.costComparison.savingsPercent}% reduction in PMO operational costs</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="border-accent/20 bg-accent/[0.02]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            AI Staffing Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-xs leading-relaxed">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="font-medium mb-1">🔴 Critical: Cloud Security Engineers</p>
              <p className="text-muted-foreground">Only 33% fill rate creates direct risk to Milestone M5. Recommend: (1) Expand DHS Cybersecurity Fellowship program, (2) Initiate inter-agency detail agreements with DoD Cyber Command, (3) Consider GS-15 direct hire authority for critical positions.</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="font-medium mb-1">🟡 High: Data Integration Specialists</p>
              <p className="text-muted-foreground">Current gap of 3 positions impacting DOE energy grid integration. Recommend cross-training existing data analysts and exploring Pathways Program for recent graduates with relevant skills.</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="font-medium mb-1">💡 Optimization: Resource Reallocation</p>
              <p className="text-muted-foreground">Phase 1 assessment staff (4 FTEs) can be reallocated to Phase 2 execution roles following completion of assessment milestones, reducing net hiring requirement by 12%.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
