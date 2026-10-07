"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface AnalysisProgressCardProps {
  onOpenDetails?: () => void;
  currentPhase?: number;
  totalPhases?: number;
}

export const AnalysisProgressCard: React.FC<AnalysisProgressCardProps> = ({
  onOpenDetails,
  currentPhase = 20,
  totalPhases = 20,
}) => {
  const percent = Math.round((currentPhase / totalPhases) * 100);

  return (
    <div className="h-full bg-[#0b111a] border border-[#1c2738] rounded-xl p-4 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-sans">Analysis Progress</h3>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
            Live
          </span>
        </div>
      </div>

      {/* Progress Bar + View Details Button */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex-1 space-y-1.5">
          <div className="w-full bg-[#111a26] rounded-full h-2.5 overflow-hidden p-0.5 border border-[#1c2738]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(56,189,248,0.6)] transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            {currentPhase} / {totalPhases} phases complete
          </div>
        </div>

        <button
          onClick={onOpenDetails}
          className="px-3.5 py-2 rounded-lg bg-[#111a26] hover:bg-[#152234] border border-[#1c2738] hover:border-slate-500 text-slate-200 text-xs font-sans font-medium transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
