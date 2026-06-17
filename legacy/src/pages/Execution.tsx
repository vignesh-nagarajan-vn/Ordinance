import { useState } from "react";
import {
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Ban,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { milestones, tasks, stakeholders } from "@/data/mockData";

const aiResponses = [
  "Based on current velocity, the Regional Pilot Deployment milestone is tracking 5 days ahead of schedule. However, Task T5 (DOE energy grid data integration) is blocked and may create downstream delays for the Cybersecurity Framework Integration milestone.",
  "Recommended next actions:\n1. Escalate DOE data feed blocker to Dr. Patel's leadership\n2. Pre-draft the Congressional Q2 report using available data\n3. Schedule cross-agency sync for dependency resolution\n4. Begin FY26 budget justification preparation",
  "Risk assessment: The cybersecurity talent gap (R1) is the highest-impact risk. Current fill rate of 33% for Cloud Security Engineers creates a critical path dependency for milestone M5. Recommend expanding hiring channels and considering inter-agency detail assignments.",
];

function getStatusColor(status: string) {
  switch (status) {
    case "Completed": case "In Progress": return "text-success";
    case "At Risk": case "Blocked": return "text-warning";
    case "Not Started": case "Planned": return "text-muted-foreground";
    default: return "text-foreground";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Completed": return <CheckCircle2 className="w-3.5 h-3.5 text-success" />;
    case "In Progress": return <Clock className="w-3.5 h-3.5 text-accent" />;
    case "At Risk": return <AlertTriangle className="w-3.5 h-3.5 text-warning" />;
    case "Blocked": return <Ban className="w-3.5 h-3.5 text-destructive" />;
    default: return <Clock className="w-3.5 h-3.5 text-muted-foreground" />;
  }
}

function getPriorityClass(priority: string) {
  switch (priority) {
    case "Critical": return "gov-badge-destructive";
    case "High": return "gov-badge-warning";
    case "Medium": return "gov-badge-info";
    default: return "gov-badge-neutral";
  }
}

export default function Execution() {
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleAiSend = () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setAiInput("");
    setIsTyping(true);
    setTimeout(() => {
      const response = aiResponses[aiMessages.filter((m) => m.role === "ai").length % aiResponses.length];
      setAiMessages((prev) => [...prev, { role: "ai", text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Program Execution Workspace</h1>
        <p className="text-sm text-muted-foreground mt-1">Task orchestration, milestone tracking, and AI-assisted coordination</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Program Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
              {milestones.map((m, i) => (
                <div key={m.id} className="relative flex items-start gap-4 pb-4 last:pb-0 ml-1">
                  <div className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    m.status === "Completed" ? "border-success bg-success/10" :
                    m.status === "In Progress" ? "border-accent bg-accent/10" :
                    m.status === "At Risk" ? "border-warning bg-warning/10" :
                    "border-muted-foreground bg-muted"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      m.status === "Completed" ? "bg-success" :
                      m.status === "In Progress" ? "bg-accent" :
                      m.status === "At Risk" ? "bg-warning" :
                      "bg-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{m.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{m.date}</span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] text-muted-foreground">{m.owner}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold ${getStatusColor(m.status)}`}>{m.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stakeholders */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Stakeholder Tracker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stakeholders.map((s) => (
              <div key={s.id} className="flex items-center gap-3 py-1.5 border-b last:border-0">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                  {s.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground">{s.role} — {s.agency}</p>
                </div>
                <span className="gov-badge-neutral text-[9px]">{s.availability}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Task Board */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Task Orchestration Board</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tasks.map((t) => (
              <div key={t.id} className="flex items-center gap-4 py-2 border-b last:border-0">
                {getStatusIcon(t.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-[10px] text-muted-foreground">{t.assignee} • Due {t.dueDate}</p>
                </div>
                <span className={`${getPriorityClass(t.priority)} text-[9px]`}>{t.priority}</span>
                <div className="w-24">
                  <Progress value={t.progress} className="h-1.5" />
                </div>
                <span className="text-xs text-muted-foreground w-8 text-right">{t.progress}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant */}
      <Card className="border-accent/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            AI Execution Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-3 min-h-[160px] max-h-[300px] overflow-auto mb-3 space-y-3">
            {aiMessages.length === 0 && (
              <p className="text-xs text-muted-foreground italic">
                Ask about execution progress, risks, next actions, or request draft briefs...
              </p>
            )}
            {aiMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border"
                }`}>
                  {msg.text.split("\n").map((line, j) => <p key={j}>{line}</p>)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3 animate-pulse text-accent" />
                Analyzing program data...
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAiSend()}
              placeholder="Ask Ordinance AI about program execution..."
              className="flex-1 bg-muted rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-accent"
            />
            <Button size="sm" onClick={handleAiSend} className="gap-1">
              <Send className="w-3.5 h-3.5" />
              Send
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            {["Summarize progress", "What are the risks?", "Draft update brief", "Suggest next actions"].map((q) => (
              <button
                key={q}
                onClick={() => { setAiInput(q); }}
                className="text-[10px] px-2 py-1 rounded-md bg-muted hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
