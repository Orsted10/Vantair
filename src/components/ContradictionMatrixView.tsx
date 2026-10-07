"use client";

import React from "react";
import { ShieldX, ShieldCheck, Terminal, AlertOctagon, FileCheck2 } from "lucide-react";

export const ContradictionMatrixView: React.FC = () => {
  const contradictions = [
    {
      id: "CONTRA-001",
      layer1: "V_Syntactic",
      layer2: "V_Intent",
      symbol: "RefundOrchestrator.executeRefund",
      description: "Missing idempotency key on gateway retry violates ADR-042 LTL safety invariant.",
      divergence: 0.425,
      culprit: "Dave Miller (commit a9f83c1)",
      severity: "CRITICAL",
    },
    {
      id: "CONTRA-002",
      layer1: "V_Wire",
      layer2: "V_Behavior",
      symbol: "/api/v1/refund (OpenAPI)",
      description: "Wire schema specifies synchronous idempotency; implementation executes async unchecked retry.",
      divergence: 0.380,
      culprit: "Dave Miller (commit a9f83c1)",
      severity: "HIGH",
    },
    {
      id: "CONTRA-003",
      layer1: "V_Temporal",
      layer2: "V_Empirical",
      symbol: "RedisCache.acquireLock",
      description: "Git history indicates 5s lock timeout; empirical eBPF traces reveal 14s cascading block.",
      divergence: 0.510,
      culprit: "Historical Tech Debt (730d ago)",
      severity: "HIGH",
    },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 flex flex-col h-full shadow-2xl">
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-red-400 font-mono tracking-wider flex items-center space-x-2">
            <ShieldX className="w-4 h-4 text-red-400" />
            <span>THE POLYGRAPH: 5-WAY CONTRADICTION MATRIX</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-mono">
            Milner Weak Bisimulation Lie Detector & Proof Certificates
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-red-950 text-red-400 px-2 py-1 rounded border border-red-500/30">
          d_bisim = 0.425
        </span>
      </div>

      <div className="mt-3 space-y-2 flex-1 overflow-y-auto pr-1">
        {contradictions.map((c) => (
          <div
            key={c.id}
            className="p-3 bg-slate-950/80 border border-red-500/30 rounded-lg text-xs font-mono space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-red-400 font-bold flex items-center space-x-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                <span>{c.id} :: {c.symbol}</span>
              </span>
              <span className="text-[10px] text-slate-400">
                {c.layer1} vs {c.layer2}
              </span>
            </div>
            <div className="text-slate-300 text-[11px]">{c.description}</div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-500">
              <span>CULPRIT: <span className="text-amber-400">{c.culprit}</span></span>
              <span>DIVERGENCE: <span className="text-red-400 font-bold">{c.divergence.toFixed(3)}</span></span>
            </div>
          </div>
        ))}
      </div>

      {/* SMT Proof Certificate Badge */}
      <div className="mt-3 p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-emerald-400 font-bold text-[11px]">SMT MERKLE PROOF CERTIFICATE</div>
            <div className="text-[10px] text-slate-400">SHA-256: 6c3c86ae6b10c373...</div>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
          PROVEN SAFE (UNSAT)
        </span>
      </div>
    </div>
  );
};
