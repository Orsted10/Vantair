"use client";

import React, { useState } from "react";
import { SystemModelSnapshot } from "@/core/types/system_model";
import { EvidenceItem, TruthStatus } from "@/core/types/evidence";
import { Search, Sparkles, ArrowRight, ShieldCheck, AlertCircle, FileCode, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

interface ProbeSearchExplorerProps {
  projectId: string;
  snapshot: SystemModelSnapshot | null;
  onNavigateToSimulate?: () => void;
  onNavigateToChange?: () => void;
}

export const ProbeSearchExplorer: React.FC<ProbeSearchExplorerProps> = ({
  projectId,
  snapshot,
  onNavigateToSimulate,
  onNavigateToChange,
}) => {
  const [query, setQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [expandedWhy, setExpandedWhy] = useState<boolean>(false);

  const sampleQueries = [
    "Why can users receive duplicate orders?",
    "What depends on Redis?",
    "Show all active contradictions",
    "What is unknown about the database pool?",
  ];

  const handleSearch = async (qText?: string) => {
    const q = qText !== undefined ? qText : query;
    if (!q.trim()) return;
    setQuery(q);
    setIsSearching(true);
    setSearchResult(null);
    setExpandedWhy(false);

    try {
      const res = await fetch(`/api/projects/${projectId}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (data.status === "SUCCESS") {
        setSearchResult(data);
      }
    } catch (err) {
      console.error("Search query error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case TruthStatus.CONTRADICTED:
        return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-rose-950/80 border border-rose-500/40 text-rose-300">CONTRADICTED (0% Truth)</span>;
      case TruthStatus.OBSERVED:
        return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">OBSERVED (100% Provenance)</span>;
      case TruthStatus.DERIVED:
        return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-sky-950/80 border border-sky-500/40 text-sky-300">DERIVED (Deterministic)</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 border border-slate-700 text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border border-[#21262d] rounded-xl p-5 overflow-hidden">
      {/* Search Header */}
      <div className="pb-4 border-b border-[#21262d]">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-2">
          <Search className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-slate-200 uppercase tracking-wider">System Query Planner & Causal Traversal (Cmd + K)</span>
        </div>

        {/* Input Bar */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ask anything about software behavior, causality, invariants, or unknowns (e.g. 'Why can users receive duplicate orders?')"
              className="w-full bg-[#161b22] border border-[#30363d] focus:border-sky-400 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-mono font-bold transition-all flex items-center space-x-1.5 shadow-sm"
          >
            {isSearching ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            <span>{isSearching ? "Traversing..." : "Traverse Reality"}</span>
          </button>
        </div>

        {/* Sample query tags */}
        <div className="flex items-center space-x-2 mt-2.5 text-[11px] font-mono text-slate-500 overflow-x-auto">
          <span className="text-slate-400">Quick queries:</span>
          {sampleQueries.map((sq) => (
            <button
              key={sq}
              onClick={() => handleSearch(sq)}
              className="px-2 py-0.5 rounded bg-[#161b22] hover:bg-[#21262d] text-slate-300 border border-[#21262d] hover:border-slate-600 transition-colors whitespace-nowrap"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Display */}
      <div className="flex-1 overflow-y-auto mt-4 pr-1">
        {searchResult ? (
          <div className="space-y-4">
            {/* Finding Card */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                  Computational Finding
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    Confidence: {(searchResult.confidence * 100).toFixed(0)}%
                  </span>
                  {getStatusBadge(searchResult.truthStatus)}
                </div>
              </div>

              <p className="text-xs text-slate-200 mt-2.5 font-medium leading-relaxed">
                {searchResult.finding}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#21262d] text-xs font-mono">
                <button
                  onClick={() => setExpandedWhy(!expandedWhy)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded bg-[#0d1117] border border-sky-500/40 text-sky-300 hover:bg-sky-950 font-bold transition-all"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{expandedWhy ? "Hide Evidence Proof" : "WHY? (Inspect Evidence Provenance)"}</span>
                </button>

                <div className="flex items-center space-x-2">
                  {onNavigateToSimulate && (
                    <button
                      onClick={onNavigateToSimulate}
                      className="px-3 py-1.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 hover:bg-amber-900 font-bold transition-all flex items-center space-x-1"
                    >
                      <span>Simulate Fix</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                  {onNavigateToChange && (
                    <button
                      onClick={onNavigateToChange}
                      className="px-3 py-1.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900 font-bold transition-all flex items-center space-x-1"
                    >
                      <span>Create Patch</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Causal Chain Walk */}
            {searchResult.causalChain && searchResult.causalChain.length > 0 && (
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block mb-3">
                  Reconstructed Causal Traversal Chain
                </span>
                <div className="space-y-2">
                  {searchResult.causalChain.map((step: any) => (
                    <div key={step.step} className="flex items-start space-x-3 text-xs font-mono p-2 rounded bg-[#0d1117] border border-[#21262d]">
                      <span className="w-5 h-5 rounded-full bg-sky-950 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {step.step}
                      </span>
                      <div className="flex-1">
                        <p className="text-slate-200">{step.event}</p>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Entity / Location: <span className="text-sky-300">{step.entity}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Inspector Accordion */}
            {expandedWhy && (
              <div className="bg-[#161b22] border border-sky-500/30 rounded-xl p-4 animate-in fade-in duration-200">
                <span className="text-[10px] font-mono uppercase text-sky-400 font-bold tracking-wider block mb-3">
                  Ground-Truth Provenance Witnesses ({searchResult.evidence?.length || 0} Artifacts)
                </span>
                {searchResult.evidence && searchResult.evidence.length > 0 ? (
                  <div className="space-y-2">
                    {searchResult.evidence.map((ev: EvidenceItem) => (
                      <div key={ev.id} className="p-2.5 rounded bg-[#0d1117] border border-[#21262d] font-mono text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sky-300">{ev.title}</span>
                          <span className="text-[10px] text-slate-500">{ev.sourceType}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">{ev.description}</p>
                        {ev.location && (
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1 border-t border-[#21262d]">
                            <span>File: <span className="text-slate-200">{ev.location.filePath}:{ev.location.startLine}-{ev.location.endLine}</span></span>
                            <span className="text-emerald-400">Confidence: {(ev.confidence * 100).toFixed(0)}%</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs italic">All causal claims derived directly from static AST flow and LTL invariant evaluation.</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 font-mono text-xs">
            <Search className="w-8 h-8 mb-2 text-slate-600" />
            <p>Type a question above or choose a quick query to explore software causality and proof chains.</p>
          </div>
        )}
      </div>
    </div>
  );
};
