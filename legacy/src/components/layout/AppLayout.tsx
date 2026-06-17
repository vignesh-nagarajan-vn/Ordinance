import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";

export type UserRole = "Admin" | "Program Manager" | "Oversight Viewer";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedAgency, setSelectedAgency] = useState("dhs");
  const [selectedProgram, setSelectedProgram] = useState("niri");
  const [selectedRole, setSelectedRole] = useState<UserRole>("Admin");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="classification-banner">CUI // DEMO — UNCLASSIFIED // FOR OFFICIAL USE ONLY</div>
      <TopBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        selectedAgency={selectedAgency}
        onAgencyChange={setSelectedAgency}
        selectedProgram={selectedProgram}
        onProgramChange={setSelectedProgram}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
      />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar open={sidebarOpen} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
