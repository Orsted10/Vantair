"use client";

import React from "react";
import { Zap, Play, FileText, Download, Code2 } from "lucide-react";

interface QuickActionsCardProps {
  onRunAnalysis?: () => void;
  onViewReports?: () => void;
  onExportData?: () => void;
  onOpenIDE?: () => void;
  isAnalyzing?: boolean;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onRunAnalysis,
  onViewReports,
  onExportData,
  onOpenIDE,
  isAnalyzing = false,
}) => {
  return (
    <div className="h-full bg-[#0b111a] border border-[#1c2738] rounded-xl p-4 flex flex-col justify-between select-none">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400">
            <Zap className="w-4 h-4 fill-blue-400/20" />
          </div>
          <h3 className="text-sm font-bold text-white font-sans">Quick Actions</h3>
        </div>
        <p className="text-[11px] text-slate-400 font-sans">
          Run analysis, view reports or open in your IDE
        </p>
      </div>

      {/* Action Buttons Row (Clean and readable without truncation) */}
      <div className="grid grid-cols-4 gap-1.5 mt-3">
        {/* Primary Action Button */}
        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          title="Run Full Analysis"
          className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-[#1d68f2] hover:bg-[#2563eb] text-white text-[11px] font-semibold font-sans transition-all shadow-[0_0_12px_rgba(29,104,242,0.4)] disabled:opacity-50"
        >
          <Play className="w-3 h-3 fill-current shrink-0" />
          <span className="whitespace-nowrap">{isAnalyzing ? "Analyzing..." : "Analyze"}</span>
        </button>

        {/* View Reports */}
        <button
          onClick={onViewReports}
          title="View Comprehensive Reports"
          className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-[#111a26] hover:bg-[#152234] border border-[#1c2738] hover:border-slate-600 text-slate-300 text-[11px] font-sans transition-colors"
        >
          <FileText className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="whitespace-nowrap">Reports</span>
        </button>

        {/* Export Data */}
        <button
          onClick={onExportData}
          title="Export Reality Model JSON"
          className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-[#111a26] hover:bg-[#152234] border border-[#1c2738] hover:border-slate-600 text-slate-300 text-[11px] font-sans transition-colors"
        >
          <Download className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="whitespace-nowrap">Export</span>
        </button>

        {/* Open in IDE */}
        <button
          onClick={onOpenIDE}
          title="Open in Code Intelligence IDE"
          className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-[#111a26] hover:bg-[#152234] border border-[#1c2738] hover:border-slate-600 text-slate-300 text-[11px] font-sans transition-colors"
        >
          <Code2 className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="whitespace-nowrap">Open IDE</span>
        </button>
      </div>
    </div>
  );
};
