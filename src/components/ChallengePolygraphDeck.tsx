"use client";

import React, { useState } from "react";
import { SystemModelSnapshot } from "@/core/types/system_model";
import { AlertTriangle, ShieldAlert, Scale, EyeOff, CheckCircle2, XCircle, FileWarning, ArrowRight } from "lucide-react";

interface ChallengePolygraphDeckProps {
  snapshot: SystemModelSnapshot | null;
}

export const ChallengePolygraphDeck: React.FC<ChallengePolygraphDeckProps> = ({ snapshot }) => {
  const [subTab, setSubTab] = useState<"POLYGRAPH" | "UNKNOWN_SPACE" | "CONSTITUTION">("POLYGRAPH");

  if (!snapshot) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono text-xs p-8 bg-[#0d1117] border border-[#21262d] rounded-xl">
        <ShieldAlert className="w-8 h-8 text-rose-400 mb-2 animate-pulse" />
        <p>No reality verification report available. Run analysis on a repository to detect contradictions.</p>
      </div>
    );
  }

  const contradictions = snapshot.contradictions || [];
  const unknowns = snapshot.unknowns || [];
  const invariants = snapshot.invariants || [];

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border border-[#21262d] rounded-xl p-5 overflow-hidden font-mono text-xs">
      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSubTab("POLYGRAPH")}
            className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
              subTab === "POLYGRAPH"
                ? "bg-rose-950/80 text-rose-300 border border-rose-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>REALITY POLYGRAPH ({contradictions.length})</span>
          </button>

          <button
            onClick={() => setSubTab("UNKNOWN_SPACE")}
            className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
              subTab === "UNKNOWN_SPACE"
                ? "bg-purple-950/80 text-purple-300 border border-purple-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>DARK MATTER / UNKNOWNS ({unknowns.length})</span>
          </button>

          <button
            onClick={() => setSubTab("CONSTITUTION")}
            className={`px-3 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
              subTab === "CONSTITUTION"
                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>CONSTITUTIONAL LAWS ({invariants.length})</span>
          </button>
        </div>

        <span className="text-[10px] text-slate-500">
          Bisimulation Metric: d_bisim = 0.425
        </span>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 overflow-y-auto mt-4 pr-1">
        {subTab === "POLYGRAPH" && (
          <div className="space-y-3">
            {contradictions.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-[#161b22] border border-rose-500/30">
                <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-bold text-[10px] border border-rose-500/40">
                      {c.severity} CONTRADICTION
                    </span>
                    <span className="font-bold text-slate-200 text-xs">{c.title}</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">Commit {c.firstObservedCommit}</span>
                </div>

                {/* 2-Way Conflict Comparison */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="p-2.5 rounded bg-[#0d1117] border border-[#21262d]">
                    <span className="text-[10px] text-sky-400 font-bold block mb-1">
                      {c.sourceA.type}: DECLARED CONTRACT
                    </span>
                    <p className="text-[11px] text-slate-300">{c.sourceA.claim}</p>
                  </div>

                  <div className="p-2.5 rounded bg-[#0d1117] border border-rose-900/50">
                    <span className="text-[10px] text-rose-400 font-bold block mb-1">
                      {c.sourceB.type}: ACTUAL IMPLEMENTATION
                    </span>
                    <p className="text-[11px] text-slate-300">{c.sourceB.claim}</p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#21262d] flex items-center justify-between text-[11px] text-slate-400">
                  <span>Impact: <span className="text-rose-300">{c.impactSummary}</span></span>
                  <span className="text-emerald-400 font-bold">Culpability Score: {(c.culpabilityScore * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {subTab === "UNKNOWN_SPACE" && (
          <div className="space-y-3">
            {unknowns.map((u) => (
              <div key={u.id} className="p-4 rounded-xl bg-[#161b22] border border-purple-500/30">
                <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold text-[10px] border border-purple-500/40">
                      CATEGORY: {u.category}
                    </span>
                    <span className="font-bold text-slate-200 text-xs">{u.title}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 mt-2.5 leading-relaxed">
                  {u.reason}
                </p>

                <div className="mt-3 p-2.5 rounded bg-[#0d1117] border border-[#21262d] text-[11px]">
                  <span className="text-purple-400 font-bold block mb-0.5">Potential System Risk:</span>
                  <span className="text-slate-300">{u.potentialRisk}</span>
                </div>

                <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Suggested Action: <span className="text-sky-300">{u.suggestedAction}</span></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {subTab === "CONSTITUTION" && (
          <div className="space-y-3">
            {invariants.map((inv) => (
              <div key={inv.id} className="p-4 rounded-xl bg-[#161b22] border border-[#21262d]">
                <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold text-[10px]">
                    {inv.category} LAW
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    inv.truthStatus === "OBSERVED" ? "bg-emerald-950 text-emerald-300 border-emerald-500/40" : "bg-rose-950 text-rose-300 border-rose-500/40"
                  }`}>
                    {inv.truthStatus === "OBSERVED" ? "FORMALLY PROVEN (SAT)" : "BREACH DETECTED (UNSAT)"}
                  </span>
                </div>

                <p className="text-xs text-slate-200 font-bold mt-2">{inv.statement}</p>
                {inv.formalFormula && (
                  <div className="p-2 rounded bg-[#0d1117] border border-[#21262d] text-sky-400 text-[11px] mt-2">
                    LTL Formula: <code>{inv.formalFormula}</code>
                  </div>
                )}

                {inv.counterexampleWitness && (
                  <div className="mt-2 text-[10px] text-rose-400 bg-rose-950/40 p-2 rounded border border-rose-900/40">
                    Witness Counterexample: {inv.counterexampleWitness}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
