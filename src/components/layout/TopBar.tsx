import { PanelLeftClose, PanelLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { agencies, programs } from "@/data/mockData";
import type { UserRole } from "./AppLayout";

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  selectedAgency: string;
  onAgencyChange: (id: string) => void;
  selectedProgram: string;
  onProgramChange: (id: string) => void;
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roles: UserRole[] = ["Admin", "Program Manager", "Oversight Viewer"];

export function TopBar({
  sidebarOpen,
  onToggleSidebar,
  selectedAgency,
  onAgencyChange,
  selectedRole,
  onRoleChange,
}: TopBarProps) {
  const agency = agencies.find((a) => a.id === selectedAgency);

  return (
    <header className="h-14 border-b bg-card flex items-center justify-between px-4 z-30">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-8 w-8">
          {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1 text-xs font-medium">
              {agency?.abbr || "Agency"}
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover z-50">
            {agencies.map((a) => (
              <DropdownMenuItem key={a.id} onClick={() => onAgencyChange(a.id)}>
                <span className="font-medium">{a.abbr}</span>
                <span className="ml-2 text-muted-foreground text-xs">{a.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-muted-foreground text-xs">/</span>

        <span className="text-sm font-semibold">{programs[0].abbr}: {programs[0].name}</span>

        <span className="gov-badge-info ml-2">
          {programs[0].phase}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="gov-badge-success text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-success inline-block mr-1" />
          FedRAMP Authorized
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              Role: {selectedRole}
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover z-50">
            {roles.map((r) => (
              <DropdownMenuItem key={r} onClick={() => onRoleChange(r)}>
                {r}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
