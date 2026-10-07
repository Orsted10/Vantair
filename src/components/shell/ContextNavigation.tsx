"use client";

import React from "react";
import {
  LayoutGrid,
  Layers,
  Code2,
  ShieldAlert,
  Activity,
  Boxes,
  GitFork,
  FlaskConical,
  Sparkles,
} from "lucide-react";

export type ContextTab =
  | "overview"
  | "architecture"
  | "code"
  | "security"
  | "runtime"
  | "dependencies"
  | "causal"
  | "counterfactuals"
  | "experiments"
  | "recommendations";

interface ContextNavigationProps {
  activeTab: ContextTab;
  onTabChange: (tab: ContextTab) => void;
  badgeCounts?: Partial<Record<ContextTab, number | string>>;
}

export const ContextNavigation: React.FC<ContextNavigationProps> = ({
  activeTab,
  onTabChange,
  badgeCounts = {},
}) => {
  const tabs: { id: ContextTab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "architecture", label: "Architecture", icon: Layers },
    { id: "code", label: "Code Intelligence", icon: Code2 },
    { id: "security", label: "Security", icon: ShieldAlert },
    { id: "runtime", label: "Runtime", icon: Activity },
    { id: "dependencies", label: "Dependencies", icon: Boxes },
    { id: "causal", label: "Causal Analysis", icon: GitFork },
    { id: "experiments", label: "Experiments", icon: FlaskConical },
    { id: "recommendations", label: "Recommendations", icon: Sparkles },
  ];

  return (
    <div className="bg-[#05080d] border-b border-[#16202f] px-6 flex items-center space-x-1 overflow-x-auto scrollbar-none select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const badge = badgeCounts[tab.id];

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-3.5 py-2.5 text-xs font-sans transition-all relative border-b-2 whitespace-nowrap rounded-t-lg ${
              isActive
                ? "text-white font-medium border-[#1d68f2] bg-[#111a26]/80 shadow-sm"
                : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-[#0c121b]"
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 transition-colors ${
                isActive ? "text-[#38bdf8]" : "text-slate-500"
              }`}
            />
            <span>{tab.label}</span>

            {badge !== undefined && (
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  badge === "Live"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    : isActive
                    ? "bg-blue-950 text-blue-300 border border-blue-700/50"
                    : "bg-[#16202f] text-slate-400 border border-[#22324b]"
                }`}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
