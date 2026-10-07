"use client";

import React, { useState } from "react";
import { Play, CheckCircle2, AlertTriangle, Cpu, ShieldCheck, Zap, Radio, FileCode2, RefreshCw } from "lucide-react";

export interface DemoStep {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  status: "IDLE" | "RUNNING" | "COMPLETED" | "ERROR";
  metric?: string;
}

interface StageDemoDeckProps {
  onExecuteStep: (stepId: number) => Promise<void>;
  onRunAll: () => Promise<void>;
  activeStep: number;
  isRunningAll: boolean;
}

export const StageDemoDeck: React.FC<StageDemoDeckProps> = ({
  onExecuteStep,
  onRunAll,
  activeStep,
  isRunningAll,
}) => {
  const steps: DemoStep[] = [
    {
      id: 1,
      title: "1. System Genesis & 7-Layer Ingestion",
      subtitle: "Bootstrap ASTs, Wire Schemas, CFG/DFG, Petri Nets",
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      status: activeStep >= 1 ? "COMPLETED" : "IDLE",
      metric: "122 Nodes, 55 Edges",
    },
    {
      id: 2,
      title: "2. Execute 5-Way Polygraph (Lie Detector)",
      subtitle: "Milner Weak Bisimulation Game against LTL Specs",
      icon: <Radio className="w-4 h-4 text-crimson-400 text-red-400" />,
      status: activeStep >= 2 ? "COMPLETED" : "IDLE",
      metric: "5 Contradictions (d_bisim=0.425)",
    },
    {
      id: 3,
      title: "3. Simulate Pearl's Do-Calculus",
      subtitle: "Evaluate do(Remove(RedisCache)) Cascade Failure",
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      status: activeStep >= 3 ? "COMPLETED" : "IDLE",
      metric: "System Collapse in 14s (PG 100/100)",
    },
    {
      id: 4,
      title: "4. Harvest Dark Matter State Space",
      subtitle: "Compute Reachability Discrepancy & Blind Spots",
      icon: <AlertTriangle className="w-4 h-4 text-purple-400" />,
      status: activeStep >= 4 ? "COMPLETED" : "IDLE",
      metric: "68.1% Untested Dark Space",
    },
    {
      id: 5,
      title: "5. Autonomous Migration Compiler",
      subtitle: "Synthesize InProcessLRUCache & Inject UUIDv4",
      icon: <FileCode2 className="w-4 h-4 text-emerald-400" />,
      status: activeStep >= 5 ? "COMPLETED" : "IDLE",
      metric: "Z3 Equivalence PROVEN (UNSAT)",
    },
    {
      id: 6,
      title: "6. Dual-World Split Reality Simulation",
      subtitle: "World_Physical (Cyan) vs World_Model (Amber)",
      icon: <RefreshCw className="w-4 h-4 text-cyan-400" />,
      status: activeStep >= 6 ? "COMPLETED" : "IDLE",
      metric: "P99 -98.2% | 0 Victims (100% Fixed)",
    },
    {
      id: 7,
      title: "7. Issue SMT Proof & Forensics Report",
      subtitle: "Issue SHA-256 Merkle Proof & Post-Mortem",
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      status: activeStep >= 7 ? "COMPLETED" : "IDLE",
      metric: "14/14 Laws Satisfied (bb963932...)",
    },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 flex flex-col h-full shadow-2xl">
      {/* Header with Run All Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-cyan-400 font-mono tracking-wider flex items-center space-x-2">
            <span>1-CLICK AUTONOMOUS STAGE DEMO</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-mono">End-to-end procedural proof suite</p>
        </div>
        <button
          onClick={onRunAll}
          disabled={isRunningAll}
          className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isRunningAll ? "EXECUTING..." : "AUTONOMOUS RUN"}</span>
        </button>
      </div>

      {/* Step Sequence List */}
      <div className="mt-3 space-y-2 flex-1 overflow-y-auto pr-1">
        {steps.map((step) => {
          const isCurrent = activeStep + 1 === step.id && isRunningAll;
          const isDone = activeStep >= step.id;

          return (
            <div
              key={step.id}
              onClick={() => !isRunningAll && onExecuteStep(step.id)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                isDone
                  ? "bg-slate-800/40 border-cyan-500/40"
                  : isCurrent
                  ? "bg-cyan-950/40 border-cyan-400 animate-pulse-glow"
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  <div className="mt-0.5">{step.icon}</div>
                  <div>
                    <div className="text-xs font-bold font-mono text-slate-200">{step.title}</div>
                    <div className="text-[10px] text-slate-400">{step.subtitle}</div>
                  </div>
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin flex-shrink-0" />
                ) : (
                  <span className="text-[10px] text-slate-600 font-mono">READY</span>
                )}
              </div>
              {step.metric && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">OUTPUT:</span>
                  <span className={isDone ? "text-cyan-300 font-bold" : "text-slate-600"}>
                    {step.metric}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
