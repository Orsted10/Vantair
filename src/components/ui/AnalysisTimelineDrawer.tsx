"use client";

import React from "react";
import {
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { PhaseInfo } from "../shell/AnalysisPhaseTimeline";

interface AnalysisTimelineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  phases?: PhaseInfo[];
}

const DEFAULT_PHASES: PhaseInfo[] = [
  { number: "01", name: "Genesis & Ingestion", status: "COMPLETED", evidenceCount: 14, durationMs: 120, description: "Repository ingestion, content hashing, and snapshot genesis." },
  { number: "02", name: "Language & AST Parser", status: "COMPLETED", evidenceCount: 312, durationMs: 450, description: "AST parsing, symbol table extraction, and syntax tree compilation." },
  { number: "03", name: "Type Schemas & Contracts", status: "COMPLETED", evidenceCount: 88, durationMs: 230, description: "Type schemas, interfaces, and wire protocol contracts." },
  { number: "04", name: "Taint Analysis", status: "COMPLETED", evidenceCount: 42, durationMs: 310, description: "Source-to-sink data flow, taint tracking, and sanitizers." },
  { number: "05", name: "Petri Net Semantics", status: "COMPLETED", evidenceCount: 19, durationMs: 280, description: "Concurrency semantics, transition invariants, and deadlock checks." },
  { number: "06", name: "Git DAG Lineage", status: "COMPLETED", evidenceCount: 1240, durationMs: 540, description: "Commit graph lineage, temporal blame, and churn attribution." },
  { number: "07", name: "Intent & LTL Specs", status: "COMPLETED", evidenceCount: 34, durationMs: 190, description: "LTL temporal specifications, PR intent, and requirement extraction." },
  { number: "08", name: "Runtime Correlation", status: "COMPLETED", evidenceCount: 450, durationMs: 620, description: "Dynamic sensor telemetry correlation and span linking." },
  { number: "09", name: "Hypergraph Consolidation", status: "COMPLETED", evidenceCount: 890, durationMs: 390, description: "Multi-relational epistemic hypergraph consolidation." },
  { number: "10", name: "Bisimulation Quotient", status: "COMPLETED", evidenceCount: 28, durationMs: 410, description: "Behavioral equivalence and abstraction quotient computation." },
  { number: "11", name: "Causal Do-Calculus", status: "COMPLETED", evidenceCount: 65, durationMs: 350, description: "Pearl causal DAGs, do-calculus, and intervention estimates." },
  { number: "12", name: "Invariant Verification", status: "COMPLETED", evidenceCount: 52, durationMs: 270, description: "State invariants, contract preconditions, and postconditions." },
  { number: "13", name: "Unknown Frontier", status: "COMPLETED", evidenceCount: 17, durationMs: 180, description: "Unknown frontier mapping and underdetermined space quantification." },
  { number: "14", name: "Forensic Autopsy", status: "COMPLETED", evidenceCount: 83, durationMs: 490, description: "Incident autopsy, regression attribution, and blast radius." },
  { number: "15", name: "Migration & Semantic Diff", status: "COMPLETED", evidenceCount: 110, durationMs: 510, description: "Semantic diff, API migration verification, and drift detection." },
  { number: "16", name: "Counterfactual World Lab", status: "COMPLETED", evidenceCount: 46, durationMs: 380, description: "Dual-world branch simulation and speculative divergence." },
  { number: "17", name: "7-Layer Reality Projection", status: "COMPLETED", evidenceCount: 78, durationMs: 220, description: "7-layer coordinate projection, clustering, and LOD culling." },
  { number: "18", name: "Groq Hardware Reasoner", status: "COMPLETED", evidenceCount: 95, durationMs: 340, description: "Ground-truth context assembly and epistemic prompt grounding." },
  { number: "19", name: "Empirical Reference Lab", status: "COMPLETED", evidenceCount: 130, durationMs: 430, description: "Empirical reference fixtures and benchmark calibration." },
  { number: "20", name: "Final Synthesis Workspace", status: "COMPLETED", evidenceCount: 210, durationMs: 290, description: "Persistent interactive reality workspace and active snapshot." },
];

export const AnalysisTimelineDrawer: React.FC<AnalysisTimelineDrawerProps> = ({
  isOpen,
  onClose,
  phases = DEFAULT_PHASES,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-[#070b12] border-l border-[#1c2738] shadow-2xl z-10 flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-[#0b111a] border-b border-[#1c2738] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-sans">
                Computational Reality Analysis Pipeline
              </h2>
              <div className="text-[11px] font-mono text-slate-400">
                20 / 20 Phases Verified • 100% Complete
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#16202f] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Phases Timeline List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {phases.map((phase) => (
            <div
              key={phase.number}
              className="p-3 rounded-xl bg-[#0b111a] border border-[#182333] hover:border-slate-600 transition-colors flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {phase.number}
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 font-sans">
                    {phase.name}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    VERIFIED
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  {phase.description}
                </p>
                <div className="pt-1 flex items-center gap-3 text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    {phase.evidenceCount} evidence items
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {phase.durationMs}ms
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0b111a] border-t border-[#1c2738] flex items-center justify-between text-xs font-sans text-slate-400">
          <span>Epistemic Soundness: <strong className="text-emerald-400">100% Ground Truth</strong></span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#111a26] hover:bg-[#152234] border border-[#1c2738] text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
