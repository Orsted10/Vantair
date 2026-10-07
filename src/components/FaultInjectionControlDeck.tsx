"use client";

import React, { useState } from "react";
import { Flame, Play, ShieldAlert, CheckCircle2, RefreshCw, Zap } from "lucide-react";
import { SeededBankingFaultHarness, FaultExecutionReport, FaultScenarioType } from "../engine/seeded_banking_repo";

export const FaultInjectionControlDeck: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<FaultScenarioType>("GATEWAY_LATENCY_SPIKE");
  const [requestVolume, setRequestVolume] = useState<number>(1000);
  const [report, setReport] = useState<FaultExecutionReport | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const harness = new SeededBankingFaultHarness();

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const res = harness.executeFaultRun(selectedScenario, { requestVolume });
      setReport(res);
      setIsExecuting(false);
    }, 500);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 flex flex-col h-full shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-red-400 font-mono tracking-wider flex items-center space-x-2">
            <Flame className="w-4 h-4 text-red-400" />
            <span>FAULT INJECTION HARNESS & LIVE RUNTIME</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-mono">
            Multi-Service Chaos Engineering & Victim Accounting
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-red-300 bg-red-950 px-2 py-0.5 rounded border border-red-500/40">
          PHASE 19
        </span>
      </div>

      {/* Control Form */}
      <div className="mt-3 grid grid-cols-3 gap-2 bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs font-mono">
        <div>
          <label className="text-slate-400 text-[10px] block mb-1">CHAOS SCENARIO</label>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value as FaultScenarioType)}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:border-cyan-500 outline-none"
          >
            <option value="GATEWAY_LATENCY_SPIKE">Gateway Latency Spike (4810ms)</option>
            <option value="REDIS_SPLIT_BRAIN_COLLAPSE">Redis Split-Brain & Memory Leak</option>
            <option value="POSTGRES_POOL_EXHAUSTION">Postgres Pool Saturation (100/100)</option>
            <option value="CHAOS_BLACK_FRIDAY_STORM">Chaos Black Friday Multi-Fault Storm</option>
            <option value="BASELINE_HEALTHY">Baseline Healthy Run</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 text-[10px] block mb-1">TRANSACTION VOLUME</label>
          <select
            value={requestVolume}
            onChange={(e) => setRequestVolume(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:border-cyan-500 outline-none"
          >
            <option value="500">500 Transactions</option>
            <option value="1000">1,000 Transactions</option>
            <option value="5000">5,000 Transactions</option>
            <option value="10000">10,000 Transactions</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="w-full py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded text-xs shadow-lg shadow-red-500/20 transition-all flex items-center justify-center space-x-1"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isExecuting ? "INJECTING FAULT..." : "FIRE SCENARIO"}</span>
          </button>
        </div>
      </div>

      {/* Report Result */}
      {report ? (
        <div className="mt-3 space-y-3 flex-1 text-xs font-mono">
          <div
            className={`p-3 rounded-lg border flex items-center justify-between ${
              report.systemCollapsed || report.duplicateRefundVictimsCount > 0
                ? "bg-red-950/50 border-red-500/40 text-red-300"
                : "bg-emerald-950/50 border-emerald-500/40 text-emerald-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span className="font-bold">
                {report.systemCollapsed
                  ? `SYSTEM COLLAPSED: ${report.collapseReason}`
                  : `FAULT IMPACT: ${report.duplicateRefundVictimsCount} DUPLICATE CHARGES`}
              </span>
            </div>
            <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
              {report.executionDurationMs}ms runtime
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block">P99 LATENCY</span>
              <span className="text-red-400 font-bold text-sm">{report.latencyP99Ms} ms</span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block">DUPLICATE VICTIMS</span>
              <span className="text-red-400 font-bold text-sm">{report.duplicateRefundVictimsCount}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block">FINANCIAL RISK</span>
              <span className="text-amber-400 font-bold text-sm">${report.financialRiskUSD.toLocaleString()}</span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block">PG POOL USAGE</span>
              <span className="text-cyan-400 font-bold text-sm">{report.maxPostgresConnectionsUsed}/100</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex-1 flex flex-col items-center justify-center text-slate-500 font-mono text-xs">
          <Flame className="w-8 h-8 text-slate-600 mb-2" />
          <span>Select a chaos scenario and trigger fault injection to test live microservice resilience.</span>
        </div>
      )}
    </div>
  );
};
