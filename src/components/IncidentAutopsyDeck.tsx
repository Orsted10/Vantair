"use client";

import React, { useState } from "react";
import { FileText, Download, UserX, AlertOctagon, CheckCircle2, History } from "lucide-react";

export const IncidentAutopsyDeck: React.FC = () => {
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const dominoTimeline = [
    { step: 1, time: "T+00:00", event: "Traffic surge on Black Friday creates PaymentGateway latency spike (4,810ms)." },
    { step: 2, time: "T+00:04", event: "RefundOrchestrator.ts:28 timeout trigger fires. Executes blind retry without idempotency key." },
    { step: 3, time: "T+00:06", event: "PaymentGateway successfully captures duplicate charge on secondary retry call." },
    { step: 4, time: "T+00:08", event: "RedisCache distributed lock times out under unthrottled concurrent retries." },
    { step: 5, time: "T+00:11", event: "RefundOrchestrator falls back to PostgreSQL connection pool for direct table locking." },
    { step: 6, time: "T+00:14", event: "PostgreSQL active connection pool reaches 100/100 (Max Capacity Exhaustion)." },
    { step: 7, time: "T+00:14", event: "OrderService crashes with HTTP 503 Service Unavailable. 412 victims billed twice ($103,000 USD risk)." },
  ];

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 flex flex-col h-full shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-red-400 font-mono tracking-wider flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span>AUTOMATED INCIDENT AUTOPSY & CAUSAL FORENSICS</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-mono">
            SEV-0 Post-Mortem & Historical Git Chrono-DAG Blame
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center space-x-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded border border-slate-700 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{downloaded ? "COPIED PDF/MD" : "EXPORT AUTOPSY"}</span>
        </button>
      </div>

      {/* Incident Summary Cards */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-mono">
        <div className="bg-slate-950/80 p-2.5 rounded border border-red-500/30">
          <span className="text-slate-400 text-[10px] block">INCIDENT SEVERITY</span>
          <span className="text-red-400 font-bold">SEV-0 CATASTROPHIC</span>
        </div>
        <div className="bg-slate-950/80 p-2.5 rounded border border-amber-500/30">
          <span className="text-slate-400 text-[10px] block">CULPABLE COMMIT</span>
          <span className="text-amber-400 font-bold">commit a9f83c1 (Dave Miller)</span>
        </div>
        <div className="bg-slate-950/80 p-2.5 rounded border border-cyan-500/30">
          <span className="text-slate-400 text-[10px] block">TOTAL AFFECTED VICTIMS</span>
          <span className="text-cyan-400 font-bold">412 Accounts ($103k USD)</span>
        </div>
      </div>

      {/* Chronological Causal Domino Timeline */}
      <div className="mt-3 bg-slate-950/80 p-3 rounded-lg border border-slate-800 flex-1 overflow-y-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
          7-STEP RECONSTRUCTED CAUSAL DOMINO CASCADE
        </span>
        <div className="space-y-2 font-mono text-xs">
          {dominoTimeline.map((item) => (
            <div key={item.step} className="flex items-start space-x-2 text-slate-300">
              <span className="w-5 h-5 rounded-full bg-red-950 text-red-400 border border-red-500/40 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                {item.step}
              </span>
              <div>
                <span className="text-amber-400 font-bold text-[10px] mr-2">{item.time}</span>
                <span className="text-[11px]">{item.event}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
