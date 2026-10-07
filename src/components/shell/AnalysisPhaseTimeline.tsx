"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Info,
  Clock,
  Layers,
  FlaskConical,
} from "lucide-react";

export interface PhaseInfo {
  number: string;
  name: string;
  status: "COMPLETED" | "RUNNING" | "READY" | "UPCOMING";
  evidenceCount: number;
  durationMs: number;
  description: string;
}

const DEFAULT_PHASES: PhaseInfo[] = [
  { number: "01", name: "Genesis", status: "COMPLETED", evidenceCount: 14, durationMs: 120, description: "Repository ingestion, content hashing, and snapshot genesis." },
  { number: "02", name: "Parser", status: "COMPLETED", evidenceCount: 312, durationMs: 450, description: "AST parsing, symbol table extraction, and syntax trees." },
  { number: "03", name: "Schemas", status: "COMPLETED", evidenceCount: 88, durationMs: 230, description: "Type schemas, interfaces, and wire protocol contracts." },
  { number: "04", name: "Taint", status: "COMPLETED", evidenceCount: 42, durationMs: 310, description: "Source-to-sink data flow, taint tracking, and sanitizers." },
  { number: "05", name: "Petri Net", status: "COMPLETED", evidenceCount: 19, durationMs: 280, description: "Concurrency semantics, transition invariants, and deadlock checks." },
  { number: "06", name: "Git DAG", status: "COMPLETED", evidenceCount: 1240, durationMs: 540, description: "Commit graph lineage, temporal blame, and churn attribution." },
  { number: "07", name: "Intent", status: "COMPLETED", evidenceCount: 34, durationMs: 190, description: "LTL temporal specifications, PR intent, and requirement extraction." },
  { number: "08", name: "Runtime", status: "COMPLETED", evidenceCount: 450, durationMs: 620, description: "Dynamic sensor telemetry correlation and span linking." },
  { number: "09", name: "Hypergraph", status: "COMPLETED", evidenceCount: 890, durationMs: 390, description: "Multi-relational epistemic hypergraph consolidation." },
  { number: "10", name: "Bisimulation", status: "COMPLETED", evidenceCount: 28, durationMs: 410, description: "Behavioral equivalence and abstraction quotient computation." },
  { number: "11", name: "Causal", status: "COMPLETED", evidenceCount: 65, durationMs: 350, description: "Pearl causal DAGs, do-calculus, and intervention estimates." },
  { number: "12", name: "Invariants", status: "COMPLETED", evidenceCount: 52, durationMs: 270, description: "State invariants, contract preconditions, and postconditions." },
  { number: "13", name: "Unknown", status: "COMPLETED", evidenceCount: 17, durationMs: 180, description: "Unknown frontier mapping and underdetermined space quantification." },
  { number: "14", name: "Forensics", status: "COMPLETED", evidenceCount: 83, durationMs: 490, description: "Incident autopsy, regression attribution, and blast radius." },
  { number: "15", name: "Migration", status: "COMPLETED", evidenceCount: 110, durationMs: 510, description: "Semantic diff, API migration verification, and drift detection." },
  { number: "16", name: "Counterfactual", status: "COMPLETED", evidenceCount: 46, durationMs: 380, description: "Dual-world branch simulation and speculative divergence." },
  { number: "17", name: "Visualization", status: "COMPLETED", evidenceCount: 78, durationMs: 220, description: "7-layer coordinate projection, clustering, and LOD culling." },
  { number: "18", name: "LLM Bridge", status: "COMPLETED", evidenceCount: 95, durationMs: 340, description: "Ground-truth context assembly and epistemic prompt grounding." },
  { number: "19", name: "Ref Lab", status: "COMPLETED", evidenceCount: 130, durationMs: 430, description: "Empirical reference fixtures and benchmark calibration." },
  { number: "20", name: "Workspace", status: "COMPLETED", evidenceCount: 210, durationMs: 290, description: "Persistent interactive reality workspace and active snapshot." },
];

interface AnalysisPhaseTimelineProps {
  onContinueToNext?: () => void;
  onSelectPhase?: (phase: PhaseInfo) => void;
}

export const AnalysisPhaseTimeline: React.FC<AnalysisPhaseTimelineProps> = ({
  onContinueToNext,
  onSelectPhase,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<PhaseInfo | null>(null);

  const handlePhaseClick = (p: PhaseInfo) => {
    setSelectedPhase(p);
    onSelectPhase?.(p);
  };

  return (
    <div className="bg-[#070b11] border-t border-[#1c2431] px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono relative z-10 select-none">
      {/* Left: Phase Title & Connected Chain */}
      <div className="flex items-center space-x-3 overflow-x-auto scrollbar-none py-1">
        <div className="flex items-center space-x-1.5 text-zinc-300 font-semibold shrink-0">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Analysis Phases</span>
          <span className="text-[11px] text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-1.5 py-0.2 rounded">
            20/20
          </span>
        </div>

        {/* The connected dots chain */}
        <div className="flex items-center space-x-1 shrink-0">
          {DEFAULT_PHASES.map((phase, idx) => {
            const isSelected = selectedPhase?.number === phase.number;
            return (
              <React.Fragment key={phase.number}>
                <button
                  onClick={() => handlePhaseClick(phase)}
                  title={`Phase ${phase.number}: ${phase.name} (${phase.evidenceCount} evidence items)`}
                  className={`group relative flex items-center justify-center transition-all ${
                    isSelected
                      ? "ring-2 ring-cyan-400 ring-offset-1 ring-offset-[#070b11]"
                      : ""
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-transform group-hover:scale-125 ${
                      phase.status === "COMPLETED"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 group-hover:bg-emerald-500/40"
                        : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/60"
                    }`}
                  >
                    <span className="scale-75">{phase.number}</span>
                  </div>

                  {/* Tooltip on hover */}
                  <span className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-[#0f1622] text-zinc-200 border border-[#232f42] rounded px-2 py-1 shadow-2xl text-[10px] whitespace-nowrap z-50 pointer-events-none">
                    <span className="font-bold text-cyan-300">{phase.number} {phase.name}</span>
                    <span className="text-zinc-400">{phase.evidenceCount} evidence items • {phase.durationMs}ms</span>
                  </span>
                </button>

                {/* Connecting connector line */}
                {idx < DEFAULT_PHASES.length - 1 && (
                  <div className="w-2 sm:w-3 h-0.5 bg-emerald-500/50 shrink-0" />
                )}
              </React.Fragment>
            );
          })}

          <div className="w-2.5 h-0.5 bg-cyan-500/50 border-dashed" />
          <div className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700/60">
            21+
          </div>
        </div>
      </div>

      {/* Right: Next Stage Indicator & Continue CTA */}
      <div className="flex items-center space-x-3 shrink-0 ml-auto">
        <div className="hidden sm:flex items-center space-x-2 text-[11px]">
          <span className="text-zinc-400">Next:</span>
          <span className="text-indigo-300 font-semibold flex items-center space-x-1">
            <FlaskConical className="w-3 h-3 text-indigo-400" />
            <span>Phase 21 — Experiment Region</span>
          </span>
          <span className="text-zinc-600">•</span>
          <div className="flex items-center space-x-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ready to proceed</span>
          </div>
        </div>

        <button
          onClick={onContinueToNext}
          className="flex items-center space-x-1 px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-md shadow-indigo-950/40 text-[11px]"
        >
          <span>Continue</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Selected Phase Modal / Dropdown info */}
      {selectedPhase && (
        <div className="absolute bottom-full left-5 mb-2 w-80 bg-[#0d141f] border border-[#222e42] rounded-lg shadow-2xl p-3 z-50">
          <div className="flex items-center justify-between border-b border-[#1c2637] pb-2 mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700">
                Phase {selectedPhase.number}
              </span>
              <span className="font-bold text-zinc-100">{selectedPhase.name}</span>
            </div>
            <button
              onClick={() => setSelectedPhase(null)}
              className="text-zinc-500 hover:text-zinc-300 text-xs"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed mb-2 font-sans">
            {selectedPhase.description}
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 pt-1 border-t border-[#1a2332]">
            <div>
              Status: <span className="text-emerald-400 font-semibold">{selectedPhase.status}</span>
            </div>
            <div>
              Duration: <span className="text-cyan-300">{selectedPhase.durationMs}ms</span>
            </div>
            <div className="col-span-2">
              Ground-Truth Evidence: <span className="text-indigo-300 font-bold">{selectedPhase.evidenceCount} verified claims</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
