"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

export type MetricVisualType = "bars" | "donut" | "cube" | "wave" | "layers" | "radial" | "none";

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: string;
  visualType?: MetricVisualType;
  gaugePercent?: number; // 0 to 100
  gaugeColor?: string;
  donutData?: Array<{ value: number; color: string; label?: string }>;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  subValue,
  trend,
  visualType = "none",
  gaugePercent,
  gaugeColor = "#10b981",
  donutData,
  onClick,
  className = "",
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col justify-between p-3.5 bg-[#0b111a] hover:bg-[#0e1622] border border-[#1c2738] hover:border-[#25354c] rounded-xl transition-all duration-200 select-none ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Top Row: Icon + Label + Optional Chevron */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-[#111a26] border border-[#1e2a3c] text-slate-300">
            {icon}
          </div>
          <span className="text-[11px] font-mono font-medium text-slate-400 tracking-wider uppercase">
            {label}
          </span>
        </div>
        {onClick && (
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors" />
        )}
      </div>

      {/* Main Content: Value + Micro Visualization */}
      <div className="flex items-end justify-between gap-3 mt-1">
        <div>
          <div className="text-xl font-bold font-mono text-white tracking-tight leading-none">
            {value}
          </div>
          {subValue && (
            <div className="text-[11px] font-sans text-slate-400 mt-1.5 flex items-center gap-1.5">
              <span>{subValue}</span>
              {trend && (
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                  {trend}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Micro Visualizations Matching Image 2 */}
        {visualType === "bars" && (
          <div className="flex items-end gap-1 h-9 px-1">
            <span className="w-1.5 h-3 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-sm" />
            <span className="w-1.5 h-5 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-sm" />
            <span className="w-1.5 h-7 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-sm" />
            <span className="w-1.5 h-4 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-sm" />
            <span className="w-1.5 h-8 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-sm shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
          </div>
        )}

        {visualType === "donut" && (
          <div className="relative w-9 h-9 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="transparent"
                stroke="#16202f"
                strokeWidth="4"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="transparent"
                stroke="#00e5ff"
                strokeWidth="4"
                strokeDasharray="88 12"
                strokeLinecap="round"
                className="drop-shadow-[0_0_6px_rgba(0,229,255,0.6)]"
              />
            </svg>
          </div>
        )}

        {visualType === "cube" && (
          <div className="w-9 h-9 flex items-center justify-center shrink-0 text-amber-400/80">
            <svg viewBox="0 0 32 32" className="w-7 h-7 stroke-current fill-none stroke-[1.5]">
              <path d="M16 4 L28 11 L16 18 L4 11 Z" fill="rgba(245,158,11,0.1)" />
              <path d="M4 11 L4 21 L16 28 L16 18 Z" fill="rgba(245,158,11,0.05)" />
              <path d="M28 11 L28 21 L16 28 L16 18 Z" fill="rgba(245,158,11,0.15)" />
            </svg>
          </div>
        )}

        {visualType === "wave" && (
          <div className="w-14 h-7 shrink-0">
            <svg viewBox="0 0 60 28" className="w-full h-full fill-none">
              <defs>
                <linearGradient id="wave-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 24 Q 15 22, 28 14 T 50 6 T 60 18 L 60 28 L 0 28 Z"
                fill="url(#wave-grad)"
              />
              <path
                d="M 0 24 Q 15 22, 28 14 T 50 6 T 60 18"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeLinecap="round"
                className="drop-shadow-[0_0_6px_rgba(244,63,94,0.5)]"
              />
            </svg>
          </div>
        )}

        {visualType === "layers" && (
          <div className="w-16 h-3 shrink-0 flex items-center">
            <div className="w-full h-1.5 bg-[#16202f] rounded-full overflow-hidden p-0.2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                style={{ width: "82%" }}
              />
            </div>
          </div>
        )}

        {visualType === "radial" && (
          <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="transparent"
                stroke="#16202f"
                strokeWidth="4"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="transparent"
                stroke={gaugeColor}
                strokeWidth="4"
                strokeDasharray={`${gaugePercent || 82} 100`}
                strokeLinecap="round"
                className="drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]"
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-emerald-400">
              {gaugePercent || 82}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
