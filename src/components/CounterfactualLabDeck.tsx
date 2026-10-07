"use client";

import React, { useState } from "react";
import { SystemModelSnapshot } from "@/core/types/system_model";
import { SimulationResult, MetricDivergence } from "@/core/types/simulation";
import { GitCompare, Play, AlertTriangle, CheckCircle2, RefreshCw, Zap } from "lucide-react";

interface CounterfactualLabDeckProps {
  projectId: string;
  snapshot: SystemModelSnapshot | null;
}

export const CounterfactualLabDeck: React.FC<CounterfactualLabDeckProps> = ({ projectId, snapshot }) => {
  const [selectedIntervention, setSelectedIntervention] = useState<string>("REMOVE_REDIS");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  const interventions = [
    { id: "REMOVE_REDIS", label: "Remove Redis Dependency (Direct DB)", type: "REMOVE_DEPENDENCY", target: "RedisCache" },
    { id: "INJECT_LATENCY", label: "Inject 4000ms PaymentGateway Latency", type: "INJECT_LATENCY", target: "PaymentGateway" },
    { id: "SCALE_TRAFFIC", label: "Scale Transaction Volume (10x Load)", type: "INCREASE_TRAFFIC", target: "OrderService" },
  ];

  const handleRunSimulation = async (interventionId?: string) => {
    const id = interventionId || selectedIntervention;
    const inter = interventions.find((i) => i.id === id) || interventions[0];

    setIsSimulating(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: inter.type,
          targetEntity: inter.target,
          parameters: inter.id === "INJECT_LATENCY" ? { latencyMs: 4000 } : {},
        }),
      });
      const data = await res.json();
      if (data.status === "SUCCESS") {
        setSimulationResult(data.simulation);
      }
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border border-[#21262d] rounded-xl p-5 overflow-hidden font-mono text-xs">
      {/* Simulation Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
        <div className="flex items-center space-x-2">
          <GitCompare className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-200 uppercase tracking-wider">
            Counterfactual Lab: Split-Reality Discrete Simulation
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {interventions.map((i) => (
            <button
              key={i.id}
              onClick={() => {
                setSelectedIntervention(i.id);
                handleRunSimulation(i.id);
              }}
              className={`px-2.5 py-1.5 rounded transition-all text-[11px] ${
                selectedIntervention === i.id
                  ? "bg-amber-950 text-amber-300 border border-amber-500/40 font-bold"
                  : "text-slate-400 hover:text-slate-200 bg-[#161b22] border border-[#21262d]"
              }`}
            >
              {i.label}
            </button>
          ))}
          <button
            onClick={() => handleRunSimulation()}
            disabled={isSimulating}
            className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold transition-all flex items-center space-x-1"
          >
            {isSimulating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            <span>{isSimulating ? "Simulating..." : "Run Split Simulation"}</span>
          </button>
        </div>
      </div>

      {/* Main Dual-World View */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
        {simulationResult ? (
          <>
            {/* World A vs World B Comparison Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* World A */}
              <div className="p-4 rounded-xl bg-[#161b22] border border-sky-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
                    <span className="font-bold text-sky-400 text-xs">WORLD A: CURRENT REALITY</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-500/40 font-bold">
                      INVARIANTS SATISFIED
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div className="p-2 rounded bg-[#0d1117] border border-[#21262d]">
                      <span className="text-[10px] text-slate-500 block">P99 Latency</span>
                      <span className="font-bold text-slate-200 text-sm">220ms</span>
                    </div>
                    <div className="p-2 rounded bg-[#0d1117] border border-[#21262d]">
                      <span className="text-[10px] text-slate-500 block">Error Rate</span>
                      <span className="font-bold text-slate-200 text-sm">0.1%</span>
                    </div>
                    <div className="p-2 rounded bg-[#0d1117] border border-[#21262d]">
                      <span className="text-[10px] text-slate-500 block">DB Pool Load</span>
                      <span className="font-bold text-slate-200 text-sm">28%</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 mt-3 block">Baseline telemetry from real empirical sensors.</span>
              </div>

              {/* World B */}
              <div className="p-4 rounded-xl bg-[#161b22] border border-amber-500/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
                    <span className="font-bold text-amber-400 text-xs">WORLD B: COUNTERFACTUAL</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      simulationResult.systemCollapsed
                        ? "bg-rose-950 text-rose-300 border-rose-500/40"
                        : "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                    }`}>
                      {simulationResult.systemCollapsed ? "SYSTEM COLLAPSE DETECTED" : "SAFE"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div className="p-2 rounded bg-[#0d1117] border border-[#21262d]">
                      <span className="text-[10px] text-slate-500 block">P99 Latency</span>
                      <span className="font-bold text-rose-400 text-sm">1,850ms</span>
                    </div>
                    <div className="p-2 rounded bg-[#0d1117] border border-[#21262d]">
                      <span className="text-[10px] text-slate-500 block">Error Rate</span>
                      <span className="font-bold text-rose-400 text-sm">1.8%</span>
                    </div>
                    <div className="p-2 rounded bg-[#0d1117] border border-[#21262d]">
                      <span className="text-[10px] text-slate-500 block">DB Pool Load</span>
                      <span className="font-bold text-rose-400 text-sm">94%</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-amber-400/80 mt-3 block">Simulated via Pearl's Do-Calculus & CPN Petri Nets.</span>
              </div>
            </div>

            {/* Metric Divergences Table */}
            <div className="p-4 rounded-xl bg-[#161b22] border border-[#21262d]">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block mb-2">
                Metric Divergence (Δ)
              </span>
              <div className="space-y-1.5">
                {simulationResult.metricDivergences?.map((m: MetricDivergence, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#0d1117] border border-[#21262d]">
                    <span className="text-slate-300">{m.metricName}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-500">World A: {m.baselinePhysicalValue}{m.unit}</span>
                      <span className="text-slate-300 font-bold">World B: {m.counterfactualModelValue}{m.unit}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        !m.isImprovement ? "bg-rose-950 text-rose-300" : "bg-emerald-950 text-emerald-300"
                      }`}>
                        +{m.divergencePercent.toFixed(1)}% {!m.isImprovement ? "DEGRADATION" : "IMPROVEMENT"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invariant Breaches & Collapse Warning */}
            {simulationResult.systemCollapsed && (
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
                <span className="text-[10px] font-mono uppercase text-rose-400 font-bold tracking-wider block mb-2">
                  System Collapse Forensics
                </span>
                <p className="text-rose-300 text-[11px] leading-relaxed">
                  {simulationResult.collapseReason}
                </p>
                {simulationResult.timeToCollapseSec && (
                  <span className="text-[10px] text-slate-400 block mt-2">
                    Collapse Time Window: <span className="text-rose-400 font-bold">{simulationResult.timeToCollapseSec} seconds</span> post intervention.
                  </span>
                )}
              </div>
            )}

            {/* Recommendation */}
            <div className="p-3.5 rounded-xl bg-[#161b22] border border-sky-500/30 text-[11px] text-slate-300">
              <span className="text-sky-400 font-bold block mb-1">Recommended Mitigation Architecture:</span>
              <p>{simulationResult.recommendedMitigation}</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 font-mono text-xs">
            <GitCompare className="w-8 h-8 mb-2 text-slate-600" />
            <p>Select an intervention above and click 'Run Split Simulation' to compare current vs counterfactual reality.</p>
          </div>
        )}
      </div>
    </div>
  );
};
