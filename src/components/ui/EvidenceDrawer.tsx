"use client";

import React from "react";
import {
  X,
  ShieldCheck,
  FileCode,
  Activity,
  Layers,
  Terminal,
  Clock,
  Hash,
  HelpCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export interface EvidenceDetail {
  id: string;
  statement: string;
  status: string;
  type: string;
  sourceFile?: string;
  lineRange?: string;
  codeSnippet?: string;
  producer: string;
  producerVersion: string;
  timestamp: string;
  environment: string;
  contentHash: string;
  epistemicVector: {
    sourceReliability: number;
    coverage: number;
    recency: number;
    independence: number;
    reproducibility: number;
  };
  assumptions?: string[];
  limitations?: string[];
  whatWouldChangeMind?: string[];
}

interface EvidenceDrawerProps {
  isOpen: boolean;
  evidence: EvidenceDetail | null;
  onClose: () => void;
  onReproduce?: (evidenceId: string) => void;
  onSimulate?: (evidenceId: string) => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  evidence,
  onClose,
  onReproduce,
  onSimulate,
}) => {
  if (!isOpen || !evidence) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#090d14] border-l border-[#21262d] h-full flex flex-col shadow-2xl font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c2431] bg-[#0c121b]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                EVIDENCE PROVENANCE LEDGER · {evidence.id}
              </div>
              <h3 className="text-sm font-bold text-white leading-tight mt-0.5">
                Forensic Ground-Truth Inspection
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#161f2e] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Statement & Status */}
          <div className="p-4 rounded-xl bg-[#0f1622] border border-[#212d3d]">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[10px] font-mono uppercase text-slate-400">
                GROUND-TRUTH CLAIM
              </span>
              <StatusBadge status={evidence.status} size="sm" />
            </div>
            <p className="text-sm font-semibold text-slate-100 leading-snug">
              {evidence.statement}
            </p>
          </div>

          {/* Source Location & Code Snippet */}
          {evidence.sourceFile && (
            <div className="p-4 rounded-xl bg-[#0b1018] border border-[#1e2837] space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  {evidence.sourceFile}
                </span>
                {evidence.lineRange && (
                  <span className="text-slate-500">{evidence.lineRange}</span>
                )}
              </div>
              {evidence.codeSnippet && (
                <pre className="p-3 rounded-lg bg-[#05070a] border border-[#161d27] text-xs font-mono text-cyan-300/90 overflow-x-auto leading-relaxed">
                  <code>{evidence.codeSnippet}</code>
                </pre>
              )}
            </div>
          )}

          {/* Epistemic Dimensions */}
          <div className="p-4 rounded-xl bg-[#0f1622] border border-[#212d3d] space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-300">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>EPISTEMIC VECTOR DIMENSIONS</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#090d14] p-2.5 rounded-lg border border-[#1a2330]">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Source Reliability</span>
                  <span className="text-cyan-400 font-bold">
                    {(evidence.epistemicVector.sourceReliability * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${evidence.epistemicVector.sourceReliability * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#090d14] p-2.5 rounded-lg border border-[#1a2330]">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Coverage Surface</span>
                  <span className="text-blue-400 font-bold">
                    {(evidence.epistemicVector.coverage * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${evidence.epistemicVector.coverage * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#090d14] p-2.5 rounded-lg border border-[#1a2330]">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Reproducibility</span>
                  <span className="text-emerald-400 font-bold">
                    {(evidence.epistemicVector.reproducibility * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${evidence.epistemicVector.reproducibility * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#090d14] p-2.5 rounded-lg border border-[#1a2330]">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Independence</span>
                  <span className="text-purple-400 font-bold">
                    {(evidence.epistemicVector.independence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-400 rounded-full"
                    style={{ width: `${evidence.epistemicVector.independence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* What would change my mind */}
          {evidence.whatWouldChangeMind && evidence.whatWouldChangeMind.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs">
              <div className="flex items-center gap-1.5 font-mono text-amber-400 font-semibold mb-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>WHAT WOULD CHANGE THIS CONCLUSION?</span>
              </div>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {evidence.whatWouldChangeMind.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Metadata Ledger */}
          <div className="p-3.5 rounded-xl bg-[#070a0f] border border-[#171f2b] space-y-2 text-[11px] font-mono text-slate-500">
            <div className="flex justify-between">
              <span>PRODUCER:</span>
              <span className="text-slate-300">{evidence.producer} v{evidence.producerVersion}</span>
            </div>
            <div className="flex justify-between">
              <span>ENVIRONMENT:</span>
              <span className="text-slate-300">{evidence.environment}</span>
            </div>
            <div className="flex justify-between">
              <span>OBSERVED AT:</span>
              <span className="text-slate-300">{new Date(evidence.timestamp).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>SHA-256 HASH:</span>
              <span className="text-slate-400 truncate max-w-[200px]">{evidence.contentHash}</span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 border-t border-[#1c2431] bg-[#0c121b] flex items-center justify-between gap-3">
          <button
            onClick={() => onReproduce && onReproduce(evidence.id)}
            className="flex-1 py-2 px-3 rounded-lg bg-[#141e2e] hover:bg-[#1a283e] border border-[#27384e] text-xs font-mono font-medium text-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>REPRODUCE IN SANDBOX</span>
          </button>
          <button
            onClick={() => onSimulate && onSimulate(evidence.id)}
            className="flex-1 py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-mono font-bold text-slate-950 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>SIMULATE INTERVENTION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
