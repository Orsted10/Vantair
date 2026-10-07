"use client";

import React from "react";
import { ArrowDownRight, ArrowUpRight, Activity } from "lucide-react";

interface CompactRuntimeCardProps {
  onOpenFullView?: () => void;
}

export const CompactRuntimeCard: React.FC<CompactRuntimeCardProps> = ({ onOpenFullView }) => {
  return (
    <div
      onClick={onOpenFullView}
      className="h-full bg-[#0b111a] hover:bg-[#0e1622] border border-[#1c2738] hover:border-[#25354c] rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all select-none group"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <h3 className="text-sm font-bold text-white font-sans">Runtime Evidence</h3>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
            Live
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">v3.0</span>
      </div>

      {/* Metrics Row (Exact Image 2) */}
      <div className="grid grid-cols-4 gap-2 pt-2">
        {/* REQUESTS / SEC */}
        <div>
          <div className="text-[10px] font-mono uppercase text-slate-500">Requests / sec</div>
          <div className="text-base font-bold font-mono text-white mt-0.5">1,284</div>
          <div className="text-[10px] font-mono text-rose-400 flex items-center gap-0.5 mt-0.5">
            <ArrowDownRight className="w-2.5 h-2.5" />
            <span>-10.8%</span>
          </div>
        </div>

        {/* AVG RESPONSE */}
        <div>
          <div className="text-[10px] font-mono uppercase text-slate-500">Avg Response</div>
          <div className="text-base font-bold font-mono text-white mt-0.5">12.4ms</div>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5 mt-0.5">
            <ArrowDownRight className="w-2.5 h-2.5" />
            <span>-6.1%</span>
          </div>
        </div>

        {/* ERROR RATE */}
        <div>
          <div className="text-[10px] font-mono uppercase text-slate-500">Error Rate</div>
          <div className="text-base font-bold font-mono text-white mt-0.5">0.2%</div>
          <div className="text-[10px] font-mono text-amber-400 flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" />
            <span>+0.2%</span>
          </div>
        </div>

        {/* CPU RANGE */}
        <div>
          <div className="text-[10px] font-mono uppercase text-slate-500">CPU Range</div>
          <div className="text-base font-bold font-mono text-white mt-0.5">34%</div>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5 mt-0.5">
            <ArrowDownRight className="w-2.5 h-2.5" />
            <span>-5.3%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
