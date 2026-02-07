import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlayCircle,
  FileText,
  Brain,
  Users,
  Settings,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/execution", label: "Execution", icon: PlayCircle },
  { to: "/reporting", label: "Reporting", icon: FileText },
  { to: "/knowledge", label: "Knowledge", icon: Brain },
  { to: "/talent", label: "Talent", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
];

interface AppSidebarProps {
  open: boolean;
}

export function AppSidebar({ open }: AppSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-200 flex flex-col",
        open ? "w-56" : "w-0 overflow-hidden"
      )}
    >
      <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-md bg-sidebar-primary flex items-center justify-center">
          <Shield className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-sidebar-accent-foreground tracking-wide">ORDINANCE</span>
          <span className="text-[10px] text-sidebar-foreground opacity-60 uppercase tracking-widest">AI Operating Layer</span>
        </div>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </RouterNavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-primary">
            SC
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-sidebar-accent-foreground">Sarah Chen</span>
            <span className="text-[10px] text-sidebar-foreground opacity-60">Program Director</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
