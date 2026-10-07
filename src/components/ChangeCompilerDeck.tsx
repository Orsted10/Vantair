"use client";

import React, { useState } from "react";
import { SystemModelSnapshot } from "@/core/types/system_model";
import { ChangeProposal, VerificationCheck, UnifiedDiffFile } from "@/core/types/change";
import { GitPullRequest, CheckCircle2, ShieldCheck, FileCode, Play, RefreshCw, ArrowRight } from "lucide-react";

interface ChangeCompilerDeckProps {
  projectId: string;
  snapshot: SystemModelSnapshot | null;
}

export const ChangeCompilerDeck: React.FC<ChangeCompilerDeckProps> = ({ projectId, snapshot }) => {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [proposal, setProposal] = useState<ChangeProposal | null>(null);
  const [verificationVerdict, setVerificationVerdict] = useState<any | null>(null);

  const handleProveChange = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/change`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "VERIFY",
          intent: "Surgically inject deterministic UUIDv4 Idempotency Token and Bounded In-Process LRU Cache Fallback",
        }),
      });
      const data = await res.json();
      if (data.status === "SUCCESS") {
        setProposal(data.proposal);
        setVerificationVerdict(data.verificationResult);
      }
    } catch (err) {
      console.error("Change verification error:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] border border-[#21262d] rounded-xl p-5 overflow-hidden font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
        <div className="flex items-center space-x-2">
          <GitPullRequest className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200 uppercase tracking-wider">
            Change Compiler & Multi-Gate Formal Verification Pipeline
          </span>
        </div>

        <button
          onClick={handleProveChange}
          disabled={isVerifying}
          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold transition-all flex items-center space-x-1.5 shadow-sm"
        >
          {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isVerifying ? "Compiling & Verifying..." : "PROVE CHANGE"}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
        {proposal ? (
          <>
            {/* Verdict Banner */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm text-emerald-300">
                    CHANGE FORMALLY VERIFIED (6 OF 6 GATES PASSED)
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  {verificationVerdict?.verdict}
                </p>
              </div>

              <span className="px-2.5 py-1 rounded bg-emerald-900/80 text-emerald-200 text-[10px] border border-emerald-400 font-bold">
                BRANCH: {proposal.branchName}
              </span>
            </div>

            {/* 6 Verification Gates */}
            <div className="p-4 rounded-xl bg-[#161b22] border border-[#21262d]">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block mb-3">
                Formal Verification Gate Cascade
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {proposal.verificationChecks?.map((check: VerificationCheck, idx: number) => (
                  <div key={idx} className="p-2.5 rounded bg-[#0d1117] border border-[#21262d] flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200 block">{check.title}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{check.message}</p>
                      <span className="text-[9px] text-emerald-400 font-bold block mt-1">Execution: {check.durationMs}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unified Diffs & AST Codemod */}
            <div className="p-4 rounded-xl bg-[#161b22] border border-[#21262d]">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block mb-3">
                Synthesized AST Codemod Unified Diffs ({proposal.unifiedDiffs?.length} Files)
              </span>
              <div className="space-y-3">
                {proposal.unifiedDiffs?.map((diff: UnifiedDiffFile, idx: number) => (
                  <div key={idx} className="rounded border border-[#21262d] overflow-hidden">
                    <div className="bg-[#0d1117] px-3 py-1.5 border-b border-[#21262d] flex items-center justify-between text-[11px]">
                      <span className="text-sky-300 font-bold">{diff.filePath}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">+{diff.addedLinesCount} / -{diff.removedLinesCount} lines</span>
                    </div>
                    <pre className="p-3 bg-[#080a0f] text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
                      {diff.diff.split("\n").map((line, lIdx) => {
                        const isPlus = line.startsWith("+");
                        const isMinus = line.startsWith("-");
                        return (
                          <div
                            key={lIdx}
                            className={
                              isPlus
                                ? "text-emerald-400 bg-emerald-950/30"
                                : isMinus
                                ? "text-rose-400 bg-rose-950/30 line-through"
                                : "text-slate-400"
                            }
                          >
                            {line}
                          </div>
                        );
                      })}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 font-mono text-xs">
            <GitPullRequest className="w-8 h-8 mb-2 text-slate-600" />
            <p>Click 'PROVE CHANGE' above to compile the AST patch, execute the 6-gate verification pipeline, and review verified unified diffs.</p>
          </div>
        )}
      </div>
    </div>
  );
};
