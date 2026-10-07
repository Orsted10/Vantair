"use client";

import React, { useState } from "react";
import { EyeOff, AlertTriangle, CheckCircle2, Code2, Sparkles, Database } from "lucide-react";

export const DarkMatterDeck: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"BLIND_SPOTS" | "FIXTURES">("BLIND_SPOTS");

  const unvisitedTraps = [
    {
      id: "DARK-001",
      location: "RefundOrchestrator.ts:28",
      branch: "if (!response.success || response.latencyMs > 4000)",
      risk: "CRITICAL FAILURE TRAP",
      description: "Blind retry branch executes when Gateway P99 exceeds 4,000ms. Drops idempotency key.",
      reachabilityProb: 0.12,
    },
    {
      id: "DARK-002",
      location: "PostgresDB.ts:42",
      branch: "if (this.activePool >= this.maxCapacity)",
      risk: "CASCADING CRITICAL",
      description: "Deadlock trap when active pool exceeds 100/100 connections. Throws unhandled PG error.",
      reachabilityProb: 0.08,
    },
    {
      id: "DARK-003",
      location: "RedisCache.ts:31",
      branch: "catch (clusterPartitionError)",
      risk: "HIGH SILENT FAILURE",
      description: "Partition drop causes silent lock release without rolling back order status.",
      reachabilityProb: 0.05,
    },
  ];

  const symbolicFixture = `describe("Dark Matter Illumination: Failure Traps", () => {
  it("DARK-001: Forces high latency on PaymentGateway to verify idempotency key preservation", async () => {
    const orchestrator = new RefundOrchestrator();
    const gatewayMock = jest.spyOn(orchestrator["gateway"], "requestGatewayRefund")
      .mockResolvedValueOnce({ success: false, latencyMs: 4810 });
      
    // Must NOT retry with duplicate transaction ID without idempotency key
    await expect(orchestrator.executeRefund("ord_test_01", "usr_99", 250))
      .rejects.toThrow();
  });
});`;

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 flex flex-col h-full shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-purple-400 font-mono tracking-wider flex items-center space-x-2">
            <EyeOff className="w-4 h-4 text-purple-400" />
            <span>THE DARK MATTER & MISSING STATE SPACE HARVESTER</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-mono">
            Reachability Discrepancy & Product Automaton Void Volume
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/40">
          V_dark = 68.1%
        </span>
      </div>

      {/* Discrepancy Metrics Bar */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-mono">
        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[10px] block">LINE COVERAGE (NAIVE)</span>
          <span className="text-emerald-400 font-bold text-sm">90.1%</span>
        </div>
        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-purple-500/30">
          <span className="text-slate-400 text-[10px] block">REACHABLE STATE SPACE</span>
          <span className="text-purple-400 font-bold text-sm">31.9% (174/546)</span>
        </div>
        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-red-500/30">
          <span className="text-slate-400 text-[10px] block">DISCREPANCY GAP</span>
          <span className="text-red-400 font-bold text-sm">+58.2% BLIND SPOT</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-3 flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
        <button
          onClick={() => setActiveTab("BLIND_SPOTS")}
          className={`flex-1 py-1 rounded ${
            activeTab === "BLIND_SPOTS" ? "bg-purple-950 text-purple-300 border border-purple-500/30" : "text-slate-400"
          }`}
        >
          HARVESTED FAILURE TRAPS
        </button>
        <button
          onClick={() => setActiveTab("FIXTURES")}
          className={`flex-1 py-1 rounded ${
            activeTab === "FIXTURES" ? "bg-purple-950 text-purple-300 border border-purple-500/30" : "text-slate-400"
          }`}
        >
          GENERATED JEST FIXTURES
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-3 flex-1 overflow-y-auto pr-1">
        {activeTab === "BLIND_SPOTS" ? (
          <div className="space-y-2">
            {unvisitedTraps.map((trap) => (
              <div
                key={trap.id}
                className="p-3 bg-slate-950/80 border border-purple-500/30 rounded-lg text-xs font-mono space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-purple-300 font-bold flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span>{trap.id} :: {trap.location}</span>
                  </span>
                  <span className="text-[10px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30">
                    {trap.risk}
                  </span>
                </div>
                <div className="text-cyan-400 text-[11px] font-mono bg-slate-900 p-1 rounded">
                  {trap.branch}
                </div>
                <div className="text-slate-300 text-[11px]">{trap.description}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-[11px] text-purple-300">
            <pre className="leading-relaxed">{symbolicFixture}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
