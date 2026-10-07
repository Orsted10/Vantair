"use client";

import React, { useState } from "react";
import { Zap, GitCommit, AlertTriangle, ShieldCheck, Play, Sliders, ArrowRight } from "lucide-react";
import { CausalDoCalculusEngine, CounterfactualSimulationResult } from "../engine/causal_docalculus";

export const CausalDoCalculusDeck: React.FC = () => {
  const [selectedVar, setSelectedVar] = useState<string>("RedisCache_Available");
  const [action, setAction] = useState<"EXCISE" | "MUTATE_VALUE">("EXCISE");
  const [forcedValue, setForcedValue] = useState<number>(0);
  const [result, setResult] = useState<CounterfactualSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const causalEngine = new CausalDoCalculusEngine();

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = causalEngine.executeCounterfactualIntervention({
        targetVariableId: selectedVar,
        action,
        forcedValue,
      });
      setResult(res);
      setIsSimulating(false);
    }, 400);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 flex flex-col h-full shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-amber-400 font-mono tracking-wider flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>PEARL&apos;S CAUSAL DO-CALCULUS ENGINE</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-mono">
            Structural Equation Models & Graph Surgery $do(X = c)$
          </p>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
          JUDEA PEARL SEM
        </span>
      </div>

      {/* Control Form */}
      <div className="mt-3 grid grid-cols-3 gap-2 bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs font-mono">
        <div>
          <label className="text-slate-400 text-[10px] block mb-1">TARGET VARIABLE</label>
          <select
            value={selectedVar}
            onChange={(e) => setSelectedVar(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="RedisCache_Available">RedisCache_Available (Binary)</option>
            <option value="PaymentGateway_LatencyMs">PaymentGateway_LatencyMs (ms)</option>
            <option value="Postgres_ConnectionPool_Usage">Postgres_ConnectionPool_Usage (%)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 text-[10px] block mb-1">SURGERY ACTION</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="EXCISE">do(X = 0) [Sever & Excise]</option>
            <option value="MUTATE_VALUE">do(X = c) [Forced Value]</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="w-full py-1.5 px-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded flex items-center justify-center space-x-1 shadow-lg transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isSimulating ? "SURGERY..." : "RUN SURGERY"}</span>
          </button>
        </div>
      </div>

      {/* Simulation Result */}
      {result ? (
        <div className="mt-4 space-y-3 font-mono text-xs">
          {/* Main Status Banner */}
          <div
            className={`p-3 rounded-lg border flex items-center justify-between ${
              result.isCascadeFailure
                ? "bg-red-950/70 border-red-500/50 text-red-200"
                : "bg-emerald-950/70 border-emerald-500/50 text-emerald-200"
            }`}
          >
            <div className="flex items-center space-x-2">
              {result.isCascadeFailure ? (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              )}
              <span className="font-bold">
                {result.isCascadeFailure
                  ? `SYSTEM COLLAPSE PROVEN IN ${result.systemSurvivalSeconds} SECONDS`
                  : "SYSTEM STABLE UNDER INTERVENTION"}
              </span>
            </div>
            <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
              {result.intervention?.action || "EXCISE"}
            </span>
          </div>

          {/* Cascade Domino Chain */}
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2 font-bold">
              CAUSAL DOMINO CASCADE SEQUENCE
            </span>
            <div className="space-y-1.5">
              {result.cascadeChain?.map((step, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-[11px] text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[9px]">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shockwave Timeline */}
          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-2 font-bold">
              PROPAGATED SHOCKWAVE TIMELINE
            </span>
            <div className="grid grid-cols-5 gap-2">
              {result.shockwaveTimeline?.slice(0, 5).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 p-2 rounded border border-slate-800 text-center"
                >
                  <div className="text-amber-400 font-bold text-[10px]">T+{item.virtualTimeSec}s</div>
                  <div className="text-slate-300 text-[10px] font-semibold mt-1 truncate">{item.variableName}</div>
                  <div className="text-red-400 text-[9px] mt-1 font-mono">
                    {item.newValue} {item.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blast Radius & Risk Summary */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">AFFECTED BLAST RADIUS</span>
              <span className="text-cyan-300 font-bold">{result.affectedServices?.join(", ") || "OrderService, PostgresDB"}</span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[10px]">ESTIMATED FINANCIAL EXPOSURE</span>
              <span className="text-red-400 font-bold">${result.estimatedFinancialLossDollars?.toLocaleString() || "250,000"} USD</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex-1 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
          <Sliders className="w-8 h-8 text-slate-600 mb-2" />
          <span>Select target variable and execute do(X) graph surgery to simulate causal failure.</span>
        </div>
      )}
    </div>
  );
};
