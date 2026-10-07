"use client";

import React from "react";
import {
  Users,
  FolderGit2,
  Plus,
  Shield,
  Activity,
  CheckCircle2,
  GitBranch,
  Crown,
  ExternalLink,
  Code2,
} from "lucide-react";
import { Project } from "@/core/types/project";
import { SystemModelSnapshot } from "@/core/types/system_model";

interface TeamProjectsDeckProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onOpenOnboarding: () => void;
  activeSnapshot?: SystemModelSnapshot | null;
}

export const TeamProjectsDeck: React.FC<TeamProjectsDeckProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onOpenOnboarding,
  activeSnapshot,
}) => {
  const teamMembers = [
    {
      name: "Orsted10",
      email: "architect@vantair.internal",
      role: "Principal Forensic Architect",
      level: "ADMIN",
      avatar: "O",
    },
    {
      name: "Vantair Astra AI",
      email: "astra-core@reasoner.internal",
      role: "Automated Epistemic Reasoner",
      level: "VERIFIER",
      avatar: "VA",
    },
    {
      name: "Sensor Agent v3.8",
      email: "ebpf-telemetry@daemon.internal",
      role: "Runtime Invariant Sensor",
      level: "AGENT",
      avatar: "SA",
    },
  ];

  const auditEvents = [
    {
      time: "Just now",
      actor: "Vantair Reality Engine",
      action: "Completed 20-phase forensic AST & runtime analysis",
      repo: projects.find((p) => p.id === activeProjectId)?.name || "TaskMesh",
      status: "SUCCESS",
    },
    {
      time: "2 mins ago",
      actor: "Groq LPU Hardware",
      action: "Executed ultra-fast reasoning loop (Qwen-27B, 1766ms)",
      repo: "TaskMesh",
      status: "SUCCESS",
    },
    {
      time: "15 mins ago",
      actor: "Orsted10",
      action: "Onboarded repository from GitHub source",
      repo: "TaskMesh",
      status: "SUCCESS",
    },
  ];

  return (
    <div className="space-y-4 font-mono text-xs select-none">
      {/* Top Banner */}
      <div className="bg-[#0b1018] border border-[#1e2a3b] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-zinc-100 font-sans tracking-tight">
              Team & Repository Workspace
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
              {projects.length} PROJECTS INDEXED
            </span>
          </div>
          <p className="text-zinc-400 text-xs font-sans">
            Manage multi-repository reality state, organization access controls, and forensic audit activity logs.
          </p>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Repository</span>
        </button>
      </div>

      {/* Onboarded Projects List */}
      <div className="bg-[#080d15] border border-[#1b2637] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#182333] pb-2.5">
          <div className="flex items-center space-x-2">
            <FolderGit2 className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-zinc-200">Active Repositories ({projects.length})</h3>
          </div>
          <span className="text-[10px] text-zinc-500">Click to switch primary active reality model</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map((p) => {
            const isActive = p.id === activeProjectId;
            return (
              <div
                key={p.id}
                onClick={() => onSelectProject(p.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isActive
                    ? "bg-[#101826] border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50"
                    : "bg-[#0c121c] border-[#1d2839] hover:border-zinc-600 hover:bg-[#0e1622]"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 truncate">
                      <FolderGit2 className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-400" : "text-zinc-500"}`} />
                      <span className="font-bold text-zinc-100 truncate text-xs">{p.name}</span>
                    </div>
                    {isActive ? (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-700 font-bold shrink-0">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-500 shrink-0">Select</span>
                    )}
                  </div>
                  <p className="text-zinc-400 text-[11px] line-clamp-2 font-sans">
                    {p.description || "Computational software reality repository."}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#182333] flex items-center justify-between text-[10px] text-zinc-500">
                  <span className="flex items-center space-x-1">
                    <GitBranch className="w-3 h-3 text-zinc-400" />
                    <span>{p.repository?.currentBranch || "main"}</span>
                  </span>
                  <span className="text-cyan-400 font-mono">
                    {p.repository?.currentCommitSha?.slice(0, 7) || "HEAD"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Team Members & Access Roles + Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Team Members */}
        <div className="lg:col-span-5 bg-[#080d15] border border-[#1b2637] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#182333] pb-2.5">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-zinc-200">Organization Access & Roles</h3>
            </div>
            <span className="text-[10px] text-zinc-500">RBAC Active</span>
          </div>

          <div className="space-y-2">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#0d141f] border border-[#1d293a] flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold flex items-center justify-center text-xs shrink-0">
                    {member.avatar}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-zinc-200 truncate">{member.name}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{member.role}</div>
                  </div>
                </div>

                <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#141e2e] text-cyan-300 border border-cyan-800/50 font-bold shrink-0">
                  {member.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Forensic Activity Audit Log */}
        <div className="lg:col-span-7 bg-[#080d15] border border-[#1b2637] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#182333] pb-2.5">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-zinc-200">Workspace Activity Ledger</h3>
            </div>
            <span className="text-[10px] text-zinc-500">Live Ring Buffer</span>
          </div>

          <div className="space-y-2">
            {auditEvents.map((ev, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-[#0d141f] border border-[#1d293a] flex items-center justify-between text-[11px]"
              >
                <div className="space-y-0.5 truncate mr-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-zinc-200 font-semibold">{ev.actor}</span>
                    <span className="text-[10px] text-cyan-400">[{ev.repo}]</span>
                  </div>
                  <p className="text-zinc-400 text-[10px] truncate">{ev.action}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-zinc-500 text-[10px] block">{ev.time}</span>
                  <span className="text-emerald-400 font-bold text-[9px]">VERIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
