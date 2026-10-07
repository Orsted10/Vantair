"use client";

import React, { useState } from "react";
import { Terminal, Send, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { VRQLQueryResult } from "@/reasoning/query/vrql";

interface VRQLConsoleDeckProps {
  onExecuteQuery: (query: string) => VRQLQueryResult;
}

export const VRQLConsoleDeck: React.FC<VRQLConsoleDeckProps> = ({ onExecuteQuery }) => {
  const [queryInput, setQueryInput] = useState<string>("WHY can refund happen twice?");
  const [lastResult, setLastResult] = useState<VRQLQueryResult | null>(null);

  const sampleQueries = [
    "WHY can refund happen twice?",
    "SHOW services affected if RedisCache is unavailable",
    "SHOW CONTRACT DIVERGENCE",
    "SHOW UNKNOWN FRONTIER FOR checkout",
  ];

  const handleRun = (qToRun?: string) => {
    const q = qToRun || queryInput;
    if (!q.trim()) return;
    const res = onExecuteQuery(q);
    setLastResult(res);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 font-sans text-zinc-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            COMPUTATIONAL INTERFACE TO SOFTWARE REALITY
          </span>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2 mt-1">
            <Terminal className="w-5 h-5 text-cyan-400" />
            VRQL Console · Reality Query Engine
          </h2>
        </div>
      </div>

      {/* Query Input Bar */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRun()}
            placeholder="Type a VRQL query (e.g. WHY can refund happen twice?)..."
            className="w-full bg-zinc-900 border border-zinc-700/80 rounded px-4 py-2.5 font-mono text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <button
          onClick={() => handleRun()}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-mono font-semibold text-xs rounded transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-950/40"
        >
          <Send className="w-3.5 h-3.5" />
          EXECUTE
        </button>
      </div>

      {/* Quick Suggestions */}
      <div className="flex items-center gap-2 mb-6 text-xs font-mono">
        <span className="text-zinc-500">SUGGESTED:</span>
        {sampleQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQueryInput(q);
              handleRun(q);
            }}
            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded transition-colors text-[11px]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Query Execution Output */}
      {lastResult && (
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-5 font-mono text-xs">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                OPERATION: {lastResult.plan.operation}
              </span>
              <span className="text-zinc-400">{lastResult.plan.originalQuery}</span>
            </div>
            <div className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              STATUS: {lastResult.status}
            </div>
          </div>

          <div className="mb-4">
            <span className="text-zinc-500 text-[10px] uppercase block mb-1">REALITY EXPLANATION</span>
            <p className="text-zinc-200 text-sm font-sans leading-relaxed">
              {lastResult.explanation}
            </p>
          </div>

          {/* Execution Plan Steps */}
          <div className="mb-4 bg-zinc-950/60 p-3 rounded border border-zinc-800/60">
            <span className="text-zinc-500 text-[10px] uppercase block mb-1.5">INSPECTABLE QUERY PLAN STEPS</span>
            <ol className="list-decimal list-inside space-y-1 text-zinc-400">
              {lastResult.plan.executionSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Caveats */}
          {lastResult.caveats.length > 0 && (
            <div className="p-3 bg-amber-950/20 border border-amber-900/30 rounded text-amber-300/90 text-[11px]">
              <span className="font-semibold block mb-0.5">EPISTEMIC CAVEATS:</span>
              <ul className="list-disc list-inside space-y-0.5 text-zinc-400">
                {lastResult.caveats.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
