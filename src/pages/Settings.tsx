import { Shield, Lock, Eye, Bell, Database, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">System configuration and security settings</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "FedRAMP Authorization", desc: "System meets FedRAMP High baseline requirements", icon: Shield, enabled: true },
            { label: "Multi-Factor Authentication", desc: "PIV/CAC card authentication enforced", icon: Key, enabled: true },
            { label: "Audit Logging", desc: "All user actions logged with timestamps", icon: Eye, enabled: true },
            { label: "Data Classification Enforcement", desc: "CUI marking on all generated artifacts", icon: Lock, enabled: true },
            { label: "FIPS 140-2 Encryption", desc: "All data encrypted at rest and in transit", icon: Database, enabled: true },
            { label: "Session Timeout (30 min)", desc: "Automatic logout after inactivity", icon: Bell, enabled: true },
          ].map((setting, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <setting.icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{setting.label}</p>
                  <p className="text-xs text-muted-foreground">{setting.desc}</p>
                </div>
              </div>
              <Switch checked={setting.enabled} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Data Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { level: "CUI // SP-PRVCY", desc: "Controlled Unclassified Information — Privacy", color: "gov-badge-warning" },
              { level: "CUI // SP-BUDG", desc: "Controlled Unclassified Information — Budget Sensitive", color: "gov-badge-info" },
              { level: "FOUO", desc: "For Official Use Only", color: "gov-badge-neutral" },
              { level: "PUBLIC", desc: "Approved for public release", color: "gov-badge-success" },
            ].map((cl, i) => (
              <div key={i} className="flex items-center gap-3 py-1.5">
                <span className={`${cl.color} text-[9px] min-w-[140px] justify-center`}>{cl.level}</span>
                <span className="text-xs text-muted-foreground">{cl.desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
