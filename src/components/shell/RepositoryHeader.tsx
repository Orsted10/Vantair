"use client";

import React, { useState } from "react";
import {
  GitBranch,
  RefreshCw,
  FileText,
  MoreHorizontal,
  ChevronDown,
  GitCommit,
} from "lucide-react";

interface RepositoryHeaderProps {
  repoName?: string;
  repoOwner?: string;
  isPublic?: boolean;
  description?: string;
  stars?: string;
  forks?: string;
  branches?: string[];
  currentBranch?: string;
  currentCommit?: string;
  analyzedTimeAgo?: string;
  isAnalyzing?: boolean;
  onReanalyze?: () => void;
  onBranchChange?: (branch: string) => void;
  onOpenSettings?: () => void;
}

export const RepositoryHeader: React.FC<RepositoryHeaderProps> = ({
  repoName = "Vantair",
  isPublic = true,
  description = "Repository Vantair onboarded into VANTAIR Reality Engine.",
  branches = ["main", "v2.0", "staging"],
  currentBranch = "main",
  currentCommit = "3124fa1",
  analyzedTimeAgo = "Just now",
  isAnalyzing = false,
  onReanalyze,
  onBranchChange,
  onOpenSettings,
}) => {
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  return (
    <div className="relative border-b border-[#16202f] px-6 py-4 flex flex-wrap items-center justify-between gap-4 z-10 overflow-hidden">
      {/* Background Atmospheric Curved Horizon */}
      <div className="atmospheric-horizon-bg" />

      {/* Left: Project Title & Description (Matching Image 2) */}
      <div className="relative z-10 space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            {repoName}
          </h1>
          {isPublic && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider bg-[#1d68f2]/15 text-[#38bdf8] border border-[#1d68f2]/40 font-semibold">
              PUBLIC
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 font-sans max-w-xl">
          {description}
        </p>
      </div>

      {/* Right: Branch Selector, Commit Sha, Status & Action Buttons */}
      <div className="relative z-10 flex items-center gap-2.5 font-mono text-xs ml-auto flex-wrap">
        {/* Branch Selector */}
        <div className="relative">
          <button
            onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b111a]/80 backdrop-blur-md hover:bg-[#111a26] text-slate-200 border border-[#1c2738] transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-sans font-medium">{currentBranch}</span>
            <ChevronDown className="w-3 h-3 text-slate-500 ml-0.5" />
          </button>

          {branchDropdownOpen && (
            <div className="absolute top-full mt-1.5 right-0 z-50 w-36 bg-[#0b111a] border border-[#1c2738] rounded-xl shadow-2xl py-1 text-xs">
              <div className="px-2.5 py-1 text-[10px] text-slate-500 uppercase tracking-wider font-mono">
                Branches
              </div>
              {branches.map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    onBranchChange?.(b);
                    setBranchDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 flex items-center justify-between hover:bg-[#152234] transition-colors ${
                    b === currentBranch ? "text-cyan-400 font-semibold" : "text-slate-300"
                  }`}
                >
                  <span>{b}</span>
                  {b === currentBranch && <span className="text-[10px] text-cyan-400">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Commit Hash Pill (e.g. -o- 3124fa1 latest) */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0b111a]/80 backdrop-blur-md text-slate-400 border border-[#1c2738] text-[11px]">
          <GitCommit className="w-3 h-3 text-slate-500" />
          <span className="text-slate-300">{currentCommit.slice(0, 7)}</span>
          <span className="px-1 py-0.2 rounded text-[9px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold">
            latest
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0b111a]/80 backdrop-blur-md text-slate-300 border border-[#1c2738] text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span>Analyzed {analyzedTimeAgo} • 100% complete</span>
        </div>

        {/* Primary Action Button: Re-analyze */}
        <button
          onClick={onReanalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1d68f2] hover:bg-[#2563eb] disabled:opacity-50 text-white font-sans font-semibold text-xs transition-all shadow-[0_0_15px_rgba(29,104,242,0.4)]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
          <span>Re-analyze</span>
        </button>

        {/* Secondary Action: Docs */}
        <button
          onClick={() => window.open("/VANTAIR_SYSTEM_BUILD_REPORT.md", "_blank")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b111a]/80 hover:bg-[#111a26] text-slate-300 border border-[#1c2738] font-sans text-xs transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>Docs</span>
        </button>

        {/* More Options Menu */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg bg-[#0b111a]/80 hover:bg-[#111a26] text-slate-400 hover:text-slate-200 border border-[#1c2738] transition-colors"
          title="Project Options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
