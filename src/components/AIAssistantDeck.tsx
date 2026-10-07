"use client";

import React, { useState } from "react";
import { Sparkles, Send, Bot, ShieldCheck, Terminal, Lightbulb } from "lucide-react";
import { EpistemicHypothesis } from "../engine/sse_groq_loop";

export const AIAssistantDeck: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [hypothesis, setHypothesis] = useState<EpistemicHypothesis | null>(null);

  const samplePrompts = [
    "Why did OrderService crash at T+14s on Black Friday?",
    "What is Dave Miller's exact culpability in commit a9f83c1?",
    "Explain the SMT Proof by Contradiction for LAW-001.",
    "How does InProcessLRUCache eliminate PostgreSQL pool exhaustion?",
  ];

  const handleAsk = async (promptText: string) => {
    setQuery(promptText);
    setLoading(true);
    try {
      const res = await fetch("/api/reason", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: promptText }),
      });
      const data = await res.json();
      if (data.status === "SUCCESS") {
        setHypothesis(data.hypothesis);
      }
    } catch (err) {
      console.error("Reasoning error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 flex flex-col h-full shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-amber-400 font-mono tracking-wider flex items-center space-x-2">
            <Bot className="w-4 h-4 text-amber-400" />
            <span>ASTRA: CHIEF EPISTEMIC REASONER (GROQ & AIR-GAP)</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-mono">
            800+ Tokens/Sec Llama-3 Reasoner with Epistemic Guard
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
          GUARDED HYPOTHESIZED (kappa = 0.72)
        </span>
      </div>

      {/* Suggested Prompts */}
      <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-mono">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(p)}
            className="px-2 py-1 bg-slate-950/80 hover:bg-cyan-950/80 text-slate-300 hover:text-cyan-300 border border-slate-800 rounded transition-all text-left"
          >
            💡 {p}
          </button>
        ))}
      </div>

      {/* Query Input */}
      <div className="mt-3 flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && query && handleAsk(query)}
          placeholder="Ask Astra anything about the software reality, root causes, or formal proofs..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 outline-none focus:border-cyan-500"
        />
        <button
          onClick={() => query && handleAsk(query)}
          disabled={loading || !query}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono font-bold text-xs rounded-lg transition-all disabled:opacity-50 flex items-center space-x-1"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{loading ? "THINKING..." : "REASON"}</span>
        </button>
      </div>

      {/* Output Card */}
      {hypothesis && (
        <div className="mt-3 bg-slate-950/90 rounded-lg p-3 border border-amber-500/40 font-mono text-xs space-y-2 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="font-bold text-amber-400">EPISTEMIC HYPOTHESIS</span>
            <span className="text-[10px] text-slate-400">
              Generated in {hypothesis.generationDurationMs}ms ({hypothesis.isAirGappedFallback ? "Air-Gapped Deterministic" : "Live Groq Cloud"})
            </span>
          </div>

          <div className="text-slate-200 text-[11px] leading-relaxed">
            {hypothesis.summary}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block font-bold">ROOT CAUSE CANDIDATE</span>
              <span className="text-red-400">{hypothesis.rootCauseCandidate}</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block font-bold">PROPOSED INTERVENTION</span>
              <span className="text-emerald-400">{hypothesis.proposedIntervention}</span>
            </div>
          </div>

          {hypothesis.reasoningSteps && (
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">REASONING CHAIN</span>
              <div className="space-y-1 text-[10px] text-slate-300">
                {hypothesis.reasoningSteps.map((step, idx) => (
                  <div key={idx}>{step}</div>
                ))}
              </div>
            </div>
          )}

          {hypothesis.remediationSnippet && (
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">PROPOSED CODEMOD PATCH</span>
              <pre className="text-emerald-400 text-[10px]">{hypothesis.remediationSnippet}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
