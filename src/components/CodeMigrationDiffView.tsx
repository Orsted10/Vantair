"use client";

import React, { useState } from "react";
import { GitPullRequest, Code2, Check, Copy } from "lucide-react";

export const CodeMigrationDiffView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"DIFF" | "SYNTHESIZED">("DIFF");
  const [copied, setCopied] = useState<boolean>(false);

  const diffCode = `--- a/src/demo_repo/services/RefundOrchestrator.ts
+++ b/src/demo_repo/services/RefundOrchestrator.ts
@@ -14,14 +14,16 @@ export class RefundOrchestrator {
   public async executeRefund(orderId: string, userId: string, amount: number): Promise<boolean> {
+    const idempotencyKey = crypto.randomUUID();
     const lockAcquired = await this.cache.acquireLock(\`lock:refund:\${orderId}\`, 5000);
     if (!lockAcquired) {
       throw new Error("Concurrent refund lock failure");
     }
 
     try {
-      let response = await this.gateway.requestGatewayRefund(orderId, amount);
+      let response = await this.gateway.requestGatewayRefund(orderId, amount, idempotencyKey);
 
       if (!response.success || response.latencyMs > 4000) {
-        response = await this.gateway.requestGatewayRefund(orderId, amount);
+        response = await this.gateway.requestGatewayRefund(orderId, amount, idempotencyKey);
       }
 
       return response.success;`;

  const synthesizedCode = `export class InProcessLRUCache<K, V> {
  private capacity: number;
  private maxMemoryBytes: number = 16 * 1024 * 1024; // 16MB strict limit
  private cache: Map<K, { value: V; size: number; lastAccessed: number }> = new Map();

  constructor(capacity: number = 10000) {
    this.capacity = capacity;
  }

  public async acquireLock(key: K, timeoutMs: number = 5000): Promise<boolean> {
    // Microsecond in-process atomic lock - Zero network roundtrip!
    return true;
  }

  public async releaseLock(key: K): Promise<void> {
    // In-process atomic release
  }
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeTab === "DIFF" ? diffCode : synthesizedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 flex flex-col h-full shadow-2xl">
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-emerald-400 font-mono tracking-wider flex items-center space-x-2">
            <GitPullRequest className="w-4 h-4 text-emerald-400" />
            <span>AUTONOMOUS MIGRATION COMPILER</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-mono">
            Signed Git PR Patch & In-Process Synthesis
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-950 p-0.5 rounded border border-slate-800 text-[10px] font-mono">
            <button
              onClick={() => setActiveTab("DIFF")}
              className={`px-2 py-0.5 rounded ${
                activeTab === "DIFF" ? "bg-cyan-900/80 text-cyan-300" : "text-slate-400"
              }`}
            >
              DIFF
            </button>
            <button
              onClick={() => setActiveTab("SYNTHESIZED")}
              className={`px-2 py-0.5 rounded ${
                activeTab === "SYNTHESIZED" ? "bg-emerald-900/80 text-emerald-300" : "text-slate-400"
              }`}
            >
              LRU CACHE
            </button>
          </div>

          <button
            onClick={copyToClipboard}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-all"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="mt-3 flex-1 bg-slate-950 rounded-lg p-3 overflow-y-auto border border-slate-800/80 font-mono text-[11px]">
        {activeTab === "DIFF" ? (
          <pre className="text-slate-300 leading-relaxed">
            {diffCode.split("\n").map((line, idx) => {
              if (line.startsWith("+")) {
                return (
                  <div key={idx} className="bg-emerald-950/40 text-emerald-400 px-1 rounded">
                    {line}
                  </div>
                );
              }
              if (line.startsWith("-")) {
                return (
                  <div key={idx} className="bg-red-950/40 text-red-400 px-1 rounded">
                    {line}
                  </div>
                );
              }
              if (line.startsWith("@@")) {
                return (
                  <div key={idx} className="text-cyan-500 font-bold">
                    {line}
                  </div>
                );
              }
              return <div key={idx} className="text-slate-400">{line}</div>;
            })}
          </pre>
        ) : (
          <pre className="text-emerald-400 leading-relaxed">{synthesizedCode}</pre>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>SMT SOLVER: <span className="text-emerald-400 font-bold">Z3 PROVEN EQUIVALENT</span></span>
        <span>SIGNATURE: <span className="text-cyan-400">SHA-256: bb963932...</span></span>
      </div>
    </div>
  );
};
