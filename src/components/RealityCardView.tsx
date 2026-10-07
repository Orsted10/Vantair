"use client";

import React from "react";
import { ShieldAlert, CheckCircle2, HelpCircle, Layers, FileCode, Activity, Terminal } from "lucide-react";
import { RealityCard } from "@/reality/ledger/evidence_ledger";

interface RealityCardViewProps {
  card: RealityCard;
  onReproduce?: () => void;
  onSimulate?: () => void;
}

export const RealityCardView: React.FC<RealityCardViewProps> = ({
  card,
  onReproduce,
  onSimulate,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OBSERVED":
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">OBSERVED</span>;
      case "DERIVED":
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">DERIVED</span>;
      case "CONTRADICTED":
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-rose-950/80 text-rose-400 border border-rose-800/60">CONTRADICTED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">HYPOTHESIZED</span>;
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 font-sans text-zinc-200 shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase mb-1">
            CLAIM ID: {card.claimId} · {card.category}
          </div>
          <h3 className="text-base font-semibold text-zinc-100 leading-snug">
            {card.statement}
          </h3>
        </div>
        <div>{getStatusBadge(card.status)}</div>
      </div>

      {/* Evidence Breakdown Grid */}
      <div className="grid grid-cols-4 gap-2 py-3 px-3 bg-zinc-950/60 border border-zinc-800/60 rounded mb-4 text-xs font-mono">
        <div>
          <div className="text-zinc-500 text-[10px]">TOTAL EVIDENCE</div>
          <div className="text-zinc-200 font-medium text-sm">{card.evidenceCount.total} items</div>
        </div>
        <div>
          <div className="text-zinc-500 text-[10px]">SOURCE CODE</div>
          <div className="text-cyan-400 font-medium text-sm">{card.evidenceCount.code} files</div>
        </div>
        <div>
          <div className="text-zinc-500 text-[10px]">TEST FIXTURES</div>
          <div className="text-blue-400 font-medium text-sm">{card.evidenceCount.tests} suites</div>
        </div>
        <div>
          <div className="text-zinc-500 text-[10px]">RUNTIME TRACES</div>
          <div className="text-emerald-400 font-medium text-sm">{card.evidenceCount.runtime} telemetry</div>
        </div>
      </div>

      {/* Epistemic Vector Dimensions */}
      <div className="mb-4">
        <div className="text-[11px] font-mono text-zinc-400 mb-2 uppercase tracking-wide flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-zinc-500" />
          Epistemic Dimensions (Certainty Vector)
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-zinc-950/40 border border-zinc-800/40 p-2 rounded">
            <div className="flex justify-between text-zinc-400 mb-1">
              <span>Source Reliability</span>
              <span className="font-mono text-zinc-200">{(card.epistemicDimensions.sourceReliability * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${card.epistemicDimensions.sourceReliability * 100}%` }} />
            </div>
          </div>
          <div className="bg-zinc-950/40 border border-zinc-800/40 p-2 rounded">
            <div className="flex justify-between text-zinc-400 mb-1">
              <span>Coverage Surface</span>
              <span className="font-mono text-zinc-200">{(card.epistemicDimensions.coverage * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${card.epistemicDimensions.coverage * 100}%` }} />
            </div>
          </div>
          <div className="bg-zinc-950/40 border border-zinc-800/40 p-2 rounded">
            <div className="flex justify-between text-zinc-400 mb-1">
              <span>Reproducibility</span>
              <span className="font-mono text-zinc-200">{(card.epistemicDimensions.reproducibility * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${card.epistemicDimensions.reproducibility * 100}%` }} />
            </div>
          </div>
          <div className="bg-zinc-950/40 border border-zinc-800/40 p-2 rounded">
            <div className="flex justify-between text-zinc-400 mb-1">
              <span>Model Dependence</span>
              <span className="font-mono text-zinc-200">{(card.epistemicDimensions.modelDependence * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${card.epistemicDimensions.modelDependence * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* What Would Change My Mind */}
      {card.whatWouldChangeMind.length > 0 && (
        <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded text-xs mb-4">
          <div className="font-mono text-amber-400 font-medium mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            WHAT WOULD CHANGE THIS CONCLUSION?
          </div>
          <ul className="list-disc list-inside text-zinc-400 space-y-0.5">
            {card.whatWouldChangeMind.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs font-mono">
        <div className="text-zinc-500">
          SNAPSHOT: {card.snapshotId.substring(0, 12)}...
        </div>
        <div className="flex gap-2">
          {onReproduce && (
            <button
              onClick={onReproduce}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded border border-zinc-700 transition-colors flex items-center gap-1.5"
            >
              <Terminal className="w-3 h-3 text-cyan-400" />
              REPRODUCE
            </button>
          )}
          {onSimulate && (
            <button
              onClick={onSimulate}
              className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded border border-cyan-800 transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-3 h-3 text-cyan-400" />
              SIMULATE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
