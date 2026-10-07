"use client";

import React from "react";
import { ShieldCheck, AlertCircle, CheckCircle2, FileSearch, Info } from "lucide-react";
import { CapabilityAssessment, ClaimLevel } from "@/reality/capability/maturity";

interface CapabilityMaturityDeckProps {
  assessments: CapabilityAssessment[];
}

export const CapabilityMaturityDeck: React.FC<CapabilityMaturityDeckProps> = ({ assessments }) => {
  const getBadge = (level: ClaimLevel) => {
    switch (level) {
      case "FORMALLY_VERIFIED":
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-purple-950/80 text-purple-300 border border-purple-800">FORMALLY VERIFIED</span>;
      case "RUNTIME_VALIDATED":
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800">RUNTIME VALIDATED</span>;
      case "REPOSITORY_VALIDATED":
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-cyan-950/80 text-cyan-400 border border-cyan-800">REPOSITORY VALIDATED</span>;
      case "FIXTURE_VALIDATED":
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-blue-950/80 text-blue-300 border border-blue-800">FIXTURE VALIDATED</span>;
      case "EXPERIMENTAL":
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-950/80 text-amber-300 border border-amber-800">EXPERIMENTAL</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">UNSUPPORTED</span>;
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 font-sans text-zinc-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            FORENSIC AUDIT BASELINE & TRUTH REGISTRY
          </span>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2 mt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            VANTAIR Capability Maturity Model
          </h2>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          20 SUBSYSTEMS AUDITED · ZERO UNGROUNDED CLAIMS
        </div>
      </div>

      <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded text-xs text-zinc-400 mb-6 font-mono leading-relaxed flex items-center gap-2">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          Replaced all binary &ldquo;100% Verified&rdquo; claims with forensic capability assessments. Claims are bounded by actual evidence, test methods, and declared limitations.
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 font-mono">
              <th className="pb-3 pr-4">SUBSYSTEM</th>
              <th className="pb-3 pr-4">CAPABILITY</th>
              <th className="pb-3 pr-4">CLAIM LEVEL</th>
              <th className="pb-3 pr-4">LANGUAGES</th>
              <th className="pb-3">DECLARED BOUNDARY / LIMITATIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 font-sans">
            {assessments.map((a) => (
              <tr key={a.capabilityId} className="hover:bg-zinc-900/40 transition-colors">
                <td className="py-3 pr-4 font-mono text-zinc-400">{a.capabilityId}</td>
                <td className="py-3 pr-4 font-semibold text-zinc-200">{a.name}</td>
                <td className="py-3 pr-4">{getBadge(a.claimLevel)}</td>
                <td className="py-3 pr-4 text-zinc-400 font-mono text-[11px]">
                  {a.languageCoverage.slice(0, 2).join(", ")}
                  {a.languageCoverage.length > 2 && "..."}
                </td>
                <td className="py-3 text-zinc-400 text-[11px] max-w-md">
                  {a.limitations[0] || "None declared."}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
