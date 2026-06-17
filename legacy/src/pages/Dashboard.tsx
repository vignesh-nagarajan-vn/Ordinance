import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Target,
  Shield,
  Sparkles,
  Activity,
} from "lucide-react";
import { programs, milestones, risks, activities, budgetData, aiHealthSummary } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const program = programs[0];

const statCards = [
  {
    label: "Budget Utilization",
    value: `$${(program.budget.spent / 1e9).toFixed(2)}B`,
    sub: `of $${(program.budget.total / 1e9).toFixed(1)}B total`,
    percent: Math.round((program.budget.spent / program.budget.total) * 100),
    icon: DollarSign,
    trend: "up" as const,
  },
  {
    label: "Milestone Completion",
    value: `${program.milestoneCompletion}%`,
    sub: `${milestones.filter((m) => m.status === "Completed").length} of ${milestones.length} milestones`,
    percent: program.milestoneCompletion,
    icon: Target,
    trend: "up" as const,
  },
  {
    label: "Compliance Score",
    value: `${program.compliance}%`,
    sub: "Across all requirements",
    percent: program.compliance,
    icon: Shield,
    trend: "up" as const,
  },
  {
    label: "Open Risks",
    value: risks.filter((r) => r.status !== "Resolved").length.toString(),
    sub: `${risks.filter((r) => r.severity === "High").length} high severity`,
    percent: 100 - (risks.filter((r) => r.status === "Resolved").length / risks.length) * 100,
    icon: AlertTriangle,
    trend: "down" as const,
  },
];

function getActivityIcon(type: string) {
  switch (type) {
    case "ai": return <Sparkles className="w-3.5 h-3.5 text-accent" />;
    case "risk": return <AlertTriangle className="w-3.5 h-3.5 text-warning" />;
    case "budget": return <DollarSign className="w-3.5 h-3.5 text-success" />;
    case "staffing": return <Activity className="w-3.5 h-3.5 text-info" />;
    case "compliance": return <Shield className="w-3.5 h-3.5 text-primary" />;
    default: return <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />;
  }
}

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Executive Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {program.name} — {program.phase}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className="stat-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="data-label">{card.label}</span>
                <card.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="data-value">{card.value}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">{card.sub}</span>
                {card.trend === "up" ? (
                  <TrendingUp className="w-3.5 h-3.5 text-success" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                )}
              </div>
              <Progress value={card.percent} className="mt-3 h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Budget Execution ($M)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="planned" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2} />
                <Area type="monotone" dataKey="actual" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activities.map((a) => (
              <div key={a.id} className="flex items-start gap-2">
                <div className="mt-0.5">{getActivityIcon(a.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed">{a.text}</p>
                  <span className="text-[10px] text-muted-foreground">{a.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Milestones + Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Milestone Tracker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {milestones.map((m) => (
                <div key={m.id} className="flex items-center gap-3 py-1.5 border-b last:border-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    m.status === "Completed" ? "bg-success" :
                    m.status === "In Progress" ? "bg-accent" :
                    m.status === "At Risk" ? "bg-warning" : "bg-muted-foreground"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground">{m.owner}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-muted-foreground">{m.date}</span>
                    <div className={`text-[10px] font-medium ${
                      m.status === "Completed" ? "text-success" :
                      m.status === "At Risk" ? "text-warning" :
                      m.status === "In Progress" ? "text-accent" : "text-muted-foreground"
                    }`}>{m.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Risk Register</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {risks.map((r) => (
                <div key={r.id} className="flex items-start gap-3 py-1.5 border-b last:border-0">
                  <div className={`mt-0.5 gov-badge ${
                    r.severity === "High" ? "gov-badge-destructive" :
                    r.severity === "Medium" ? "gov-badge-warning" : "gov-badge-neutral"
                  }`}>
                    {r.severity}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">{r.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{r.mitigation}</p>
                  </div>
                  <span className={`text-[10px] font-medium ${
                    r.status === "Resolved" ? "text-success" :
                    r.status === "Mitigating" ? "text-accent" : "text-muted-foreground"
                  }`}>{r.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Health Summary */}
      <Card className="border-accent/20 bg-accent/[0.02]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            AI Program Health Summary
            <span className="gov-badge-info ml-2">Auto-Generated</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-0 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_strong]:text-foreground [&_li]:text-xs [&_p]:text-xs">
            {aiHealthSummary.split("\n").map((line, i) => {
              if (line.startsWith("## ")) return <h2 key={i}>{line.replace("## ", "")}</h2>;
              if (line.startsWith("### ")) return <h3 key={i}>{line.replace("### ", "")}</h3>;
              if (line.startsWith("- ")) return <p key={i} className="ml-4">• {line.replace("- ", "")}</p>;
              if (line.match(/^\d\./)) return <p key={i} className="ml-4">{line}</p>;
              if (line.trim() === "") return null;
              return <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
