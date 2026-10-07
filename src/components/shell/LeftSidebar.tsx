"use client";

import React from "react";
import {
  LayoutDashboard,
  GitBranch,
  Layers,
  Code2,
  ShieldAlert,
  Activity,
  GitFork,
  GitCompare,
  GitPullRequest,
  Compass,
  Terminal,
  FileText,
  Boxes,
  Users,
  Settings,
  Zap,
  ArrowRight,
} from "lucide-react";

export type SidebarNavId =
  | "dashboard"
  | "repo_analysis"
  | "reality_graph"
  | "code_intel"
  | "security"
  | "runtime"
  | "causal"
  | "counterfactuals"
  | "change_compiler"
  | "experiments"
  | "vrql"
  | "reports"
  | "integrations"
  | "team"
  | "settings";

interface LeftSidebarProps {
  activeNav: SidebarNavId;
  onSelectNav: (id: SidebarNavId) => void;
  activeProjectName?: string;
  activeBranch?: string;
  onOpenSettings?: () => void;
  recentRepos?: Array<{ id: string; name: string; active?: boolean }>;
  onSelectRepo?: (id: string) => void;
  totalAnalyzedFiles?: number;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeNav,
  onSelectNav,
  activeProjectName = "Vantair",
  activeBranch = "main",
  onOpenSettings,
  recentRepos,
  onSelectRepo,
  totalAnalyzedFiles,
}) => {
  const analyzeNavItems = [
    { id: "repo_analysis" as SidebarNavId, label: "Repository Analysis", icon: <GitBranch className="w-4 h-4" /> },
    { id: "reality_graph" as SidebarNavId, label: "Reality Graph", icon: <Layers className="w-4 h-4" /> },
    { id: "code_intel" as SidebarNavId, label: "Code Intelligence", icon: <Code2 className="w-4 h-4" /> },
    { id: "security" as SidebarNavId, label: "Security & Taint", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: "runtime" as SidebarNavId, label: "Runtime Evidence", icon: <Activity className="w-4 h-4" /> },
    { id: "causal" as SidebarNavId, label: "Causal Analysis", icon: <GitFork className="w-4 h-4" /> },
  ];

  const experimentNavItems = [
    { id: "counterfactuals" as SidebarNavId, label: "Counterfactual Worlds", icon: <GitCompare className="w-4 h-4" /> },
    { id: "change_compiler" as SidebarNavId, label: "Change Compiler", icon: <GitPullRequest className="w-4 h-4" /> },
    { id: "experiments" as SidebarNavId, label: "Experiments", icon: <Compass className="w-4 h-4" /> },
    { id: "vrql" as SidebarNavId, label: "VRQL Query Console", icon: <Terminal className="w-4 h-4" /> },
  ];

  const otherNavItems = [
    { id: "reports" as SidebarNavId, label: "Reports & Export", icon: <FileText className="w-4 h-4" /> },
    { id: "integrations" as SidebarNavId, label: "Integrations", icon: <Boxes className="w-4 h-4" /> },
    { id: "team" as SidebarNavId, label: "Team & Projects", icon: <Users className="w-4 h-4" /> },
    { id: "settings" as SidebarNavId, label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-56 bg-[#070b12] border-r border-[#16202f] flex flex-col justify-between shrink-0 font-sans select-none z-20 h-full overflow-hidden relative">
      {/* Background Topographic Wave Hint */}
      <div className="absolute inset-0 topographic-wireframe-bg pointer-events-none opacity-40" />

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 relative z-10">
        {/* Top Hero Dashboard Button (Matching Image 2) */}
        <div>
          <button
            onClick={() => onSelectNav("dashboard")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              activeNav === "dashboard" || activeNav === "repo_analysis"
                ? "bg-[#1d68f2] text-white shadow-[0_0_20px_rgba(29,104,242,0.45)] font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-[#0e1622]"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* SECTION: ANALYZE */}
        <div className="space-y-0.5">
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            ANALYZE
          </div>
          {analyzeNavItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all text-left group ${
                  isActive
                    ? "bg-[#111a26] text-cyan-300 font-semibold border-l-2 border-cyan-400 pl-2.5 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0c121b]"
                }`}
              >
                <span className={isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* SECTION: EXPERIMENT */}
        <div className="space-y-0.5">
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            EXPERIMENT
          </div>
          {experimentNavItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all text-left group ${
                  isActive
                    ? "bg-[#111a26] text-cyan-300 font-semibold border-l-2 border-cyan-400 pl-2.5 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0c121b]"
                }`}
              >
                <span className={isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* SECTION: OTHER */}
        <div className="space-y-0.5">
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
            OTHER
          </div>
          {otherNavItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all text-left group ${
                  isActive
                    ? "bg-[#111a26] text-cyan-300 font-semibold border-l-2 border-cyan-400 pl-2.5 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#0c121b]"
                }`}
              >
                <span className={isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Cards (Matching Image 2) */}
      <div className="p-2.5 border-t border-[#16202f] bg-[#05080d]/90 space-y-2 relative z-10">
        {/* Current Project Card */}
        <div className="p-2.5 rounded-xl bg-[#0b111a] border border-[#1c2738] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 font-mono">Current Project</div>
            <div className="text-xs font-bold text-slate-200 font-sans mt-0.5">{activeProjectName}</div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
              <GitBranch className="w-2.5 h-2.5 text-slate-500" />
              <span>{activeBranch}</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
        </div>

        {/* Ultimate Plan Card */}
        <button
          onClick={onOpenSettings}
          className="w-full p-2.5 rounded-xl bg-[#0b111a] border border-[#1c2738] hover:border-amber-500/40 flex items-center justify-between text-left transition-colors group"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 fill-amber-400/30" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-white leading-tight">Ultimate Plan</div>
              <div className="text-[9px] text-slate-400 mt-0.5 font-mono">Engine Active</div>
            </div>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
        </button>
      </div>
    </aside>
  );
};
