"use client";

import React, { useState } from "react";
import { Activity, ShieldAlert, CheckCircle, Flame, Droplets, Database, Clock, Play, RotateCcw } from "lucide-react";

interface DualWorldTelemetryDeckProps {
  simulationActive: boolean;
}

export const DualWorldTelemetryDeck: React.FC<DualWorldTelemetryDeckProps> = ({ simulationActive }) => {
  const [timelineSec, setTimelineSec] = useState<number>(60);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Time-interpolated metrics
  const progress = timelineSec / 60;
  
  // Physical world deteriorates over time
  const physicalLatency = Math.round(120 + progress * (4810 - 120));
  const physicalPool = Math.min(100, Math.floor(18 + progress * (100 - 18)));
  const physicalVictims = Math.floor(progress * 412);
  const physicalLossUSD = physicalVictims * 250;
  const physicalErrors = (progress * 14.8).toFixed(1);

  // Model world twin stays consistently high-performance
  const modelLatency = 85;
  const modelPool = 24 + Math.floor(Math.sin(timelineSec) * 3);
  const modelVictims = 0;
  const modelLossUSD = 0;
  const modelErrors = "0.0";

  // Play timeline automatically
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelineSec((prev) => {
          if (prev >= 60) {
            setIsPlaying(false);
            return 60;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 flex flex-col h-full shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-amber-400 font-mono tracking-wider flex items-center space-x-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>DUAL-WORLD SPLIT REALITY MONITOR</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-mono">
            Physical Reality (Cyan) vs In-Silico Model Digital Twin (Amber)
          </p>
        </div>

        {/* Time Travel Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setTimelineSec(0);
              setIsPlaying(true);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-500/40 rounded text-xs font-mono transition-all"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>PLAY REPLAY</span>
          </button>
          <button
            onClick={() => {
              setTimelineSec(60);
              setIsPlaying(false);
            }}
            className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
            title="Fast Forward to T+60s"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Time-Travel Timeline Slider */}
      <div className="mt-3 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 font-mono text-xs">
        <div className="flex justify-between text-[11px] mb-1">
          <span className="text-slate-400 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>TIME-TRAVEL SCRUBBER</span>
          </span>
          <span className="text-amber-400 font-bold">VIRTUAL TIME: T+{timelineSec}s</span>
        </div>
        <input
          type="range"
          min="0"
          max="60"
          value={timelineSec}
          onChange={(e) => {
            setTimelineSec(Number(e.target.value));
            setIsPlaying(false);
          }}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
        <div className="flex justify-between text-[9px] text-slate-500 mt-1">
          <span>T+00s (Baseline)</span>
          <span>T+14s (PG Collapse)</span>
          <span>T+30s (Retry Storm)</span>
          <span>T+60s (Final State)</span>
        </div>
      </div>

      {/* Side-by-Side Cards */}
      <div className="mt-3 grid grid-cols-2 gap-3 flex-1 min-h-0">
        {/* Physical Reality Card */}
        <div className="bg-slate-950/70 border border-cyan-500/40 rounded-lg p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-cyan-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>WORLD_PHYSICAL</span>
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                timelineSec >= 14 ? "text-red-400 bg-red-950/60 border-red-500/30" : "text-amber-400 bg-amber-950/60 border-amber-500/30"
              }`}>
                {timelineSec >= 14 ? "CRITICAL FAILURE" : "DEGRADING"}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>P99 LATENCY:</span>
                  <span className="text-red-400 font-bold">{physicalLatency} ms</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-red-500 h-full transition-all duration-150"
                    style={{ width: `${Math.min(100, (physicalLatency / 4810) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>POSTGRES POOL:</span>
                  <span className="text-red-400 font-bold">{physicalPool} / 100 ({physicalPool}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-red-500 h-full transition-all duration-150"
                    style={{ width: `${physicalPool}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>DUPLICATE VICTIMS:</span>
                  <span className="text-red-400 font-bold">{physicalVictims} ACCOUNTS</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>EXPOSURE RISK:</span>
                  <span className="text-red-400 font-bold">${physicalLossUSD.toLocaleString()} USD</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500">
            CONSTITUTION: <span className="text-red-400">3/14 LAWS BREACHED</span>
          </div>
        </div>

        {/* Model World Digital Twin Card */}
        <div className="bg-slate-950/70 border border-amber-500/40 rounded-lg p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-amber-400 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>WORLD_MODEL</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                PROVEN SAFE
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>P99 LATENCY:</span>
                  <span className="text-emerald-400 font-bold">{modelLatency} ms (-98.2%)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[8%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>POSTGRES POOL:</span>
                  <span className="text-emerald-400 font-bold">{modelPool} / 100 (-76%)</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-150"
                    style={{ width: `${modelPool}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>DUPLICATE VICTIMS:</span>
                  <span className="text-emerald-400 font-bold">0 (100% FIXED)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>EXPOSURE RISK:</span>
                  <span className="text-emerald-400 font-bold">$0 USD</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500">
            CONSTITUTION: <span className="text-emerald-400">14/14 LAWS PROVEN (UNSAT)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
