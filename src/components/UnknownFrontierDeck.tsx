"use client";

import React from "react";
import { Compass, Lightbulb, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import { UnknownFrontierMetrics } from "@/reality/unknown/unknown_frontier";
import { SystemExperiment } from "@/reasoning/experiment/experiment_engine";

interface UnknownFrontierDeckProps {
  metrics: UnknownFrontierMetrics;
  cheapestExperiment: SystemExperiment | null;
  onRunExperiment?: (exp: SystemExperiment) => void;
}

export const UnknownFrontierDeck: React.FC<UnknownFrontierDeckProps> = ({
  metrics,
  cheapestExperiment,
  onRunExperiment,
}) => {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 font-sans text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            UNCERTAINTY QUANTIFICATION & EXPERIMENT PLANNER
          </span>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2 mt-1">
            <Compass className="w-5 h-5 text-indigo-400" />
            Unknown State Frontier
          </h2>
        </div>
        <div className="text-xs font-mono text-zinc-400 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded">
          EXERCISED RATIO: {(metrics.unobservedFrontierRatio.testedVersusKnown * 100).toFixed(1)}%
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded">
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Discovered Entities</div>
          <div className="text-xl font-bold font-mono text-zinc-200 mt-1">{metrics.knownStatesCount}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Known in AST & Wire</div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded">
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Tested States</div>
          <div className="text-xl font-bold font-mono text-blue-400 mt-1">{metrics.testedStatesCount}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Exercised by unit/e2e tests</div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded">
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Observed in Telemetry</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{metrics.observedStatesCount}</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Verified via live OTel traces</div>
        </div>
        <div className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded">
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Unexercised Frontier</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {(metrics.unobservedFrontierRatio.unexercisedKnownRatio * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">Awaiting empirical tests</div>
        </div>
      </div>

      {/* Methodology Note */}
      <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded text-xs text-zinc-400 mb-6 font-mono leading-relaxed">
        <span className="text-zinc-300 font-semibold">METHODOLOGY: </span>
        {metrics.methodologyNote}
      </div>

      {/* The Single Cheapest Experiment */}
      {cheapestExperiment && (
        <div className="p-5 bg-indigo-950/20 border border-indigo-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-900/60 rounded text-indigo-300">
                <Lightbulb className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-semibold block">
                  RECOMMENDED EMPIRICAL INTERVENTION
                </span>
                <h4 className="text-base font-semibold text-zinc-100">
                  {cheapestExperiment.title}
                </h4>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono px-2 py-0.5 bg-indigo-900/80 text-indigo-200 rounded border border-indigo-700/60">
                EFFICIENCY: {cheapestExperiment.efficiencyRatio}
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 mb-4 leading-relaxed font-sans">
            {cheapestExperiment.hypothesis}
          </p>

          <div className="bg-zinc-950/80 p-3 rounded border border-zinc-800/80 text-xs font-mono mb-4 flex items-center justify-between">
            <div>
              <span className="text-zinc-500 text-[10px] block">PROPOSED ACTION</span>
              <span className="text-cyan-400">{cheapestExperiment.actionPlan.commandOrAction}</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 text-[10px] block">RUNTIME / RISK</span>
              <span className="text-zinc-300">~{cheapestExperiment.actionPlan.estimatedRuntimeSec}s · {cheapestExperiment.actionPlan.safetyRisk}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => onRunExperiment && onRunExperiment(cheapestExperiment)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-mono text-xs font-medium transition-colors flex items-center gap-1.5 shadow-lg shadow-indigo-950/40"
            >
              <Zap className="w-3.5 h-3.5" />
              EXECUTE EMPIRICAL EXPERIMENT
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
