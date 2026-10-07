"use client";

import React from "react";
import { AlertCircle, CheckCircle, FileText, Server, Activity, ArrowRight } from "lucide-react";

export interface ContractDivergenceItem {
  type: "UNDOCUMENTED_STATUS" | "MISSING_IMPLEMENTATION" | "SCHEMA_MISMATCH" | "UNDECLARED_PARAMETER";
  endpoint: string;
  description: string;
  declared: any;
  implemented?: any;
  observed?: any;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

interface ContractRealityDeckProps {
  contractName: string;
  divergences: ContractDivergenceItem[];
}

export const ContractRealityDeck: React.FC<ContractRealityDeckProps> = ({
  contractName,
  divergences,
}) => {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 font-sans text-zinc-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            3-WAY CONTRACT COMPARISON ENGINE
          </span>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2 mt-1">
            <FileText className="w-5 h-5 text-cyan-400" />
            {contractName} · Reality Divergence Matrix
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
            <span className="text-zinc-400">DECLARED (OpenAPI)</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
            <span className="text-zinc-400">IMPLEMENTED (AST)</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span className="text-zinc-400">OBSERVED (Traces)</span>
          </div>
        </div>
      </div>

      {divergences.length === 0 ? (
        <div className="p-8 text-center bg-zinc-900/40 border border-zinc-800 rounded text-zinc-400 font-mono text-sm">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          Zero contract divergences detected. Implemented code and runtime telemetry strictly satisfy declared schemas.
        </div>
      ) : (
        <div className="space-y-4">
          {divergences.map((div, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border text-sm font-sans ${
                div.severity === "CRITICAL"
                  ? "bg-rose-950/20 border-rose-800/60"
                  : div.severity === "HIGH"
                  ? "bg-amber-950/20 border-amber-800/60"
                  : "bg-zinc-900/60 border-zinc-800"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                      div.severity === "CRITICAL"
                        ? "bg-rose-900/80 text-rose-300"
                        : div.severity === "HIGH"
                        ? "bg-amber-900/80 text-amber-300"
                        : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {div.type}
                  </span>
                  <span className="font-mono font-semibold text-zinc-200">
                    {div.endpoint}
                  </span>
                </div>
                <span className="text-xs font-mono text-zinc-400 uppercase">
                  SEVERITY: {div.severity}
                </span>
              </div>

              <p className="text-zinc-300 mb-3">{div.description}</p>

              {/* 3-Way Triangulation comparison pills */}
              <div className="grid grid-cols-3 gap-2 bg-zinc-950/80 p-2.5 rounded border border-zinc-800/60 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px]">DECLARED SPEC</span>
                  <span className="text-cyan-400">
                    {div.declared ? JSON.stringify(div.declared) : "NONE (Absent)"}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">IMPLEMENTED CODE</span>
                  <span className="text-blue-400">
                    {div.implemented ? JSON.stringify(div.implemented) : "NO HANDLER FOUND"}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">OBSERVED RUNTIME</span>
                  <span className="text-emerald-400">
                    {div.observed ? JSON.stringify(div.observed) : "NO TELEMETRY"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
