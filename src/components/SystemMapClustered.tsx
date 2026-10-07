"use client";

import React, { useState } from "react";
import { SystemModelSnapshot, SystemEntity, SystemRelationship } from "@/core/types/system_model";
import { EvidenceItem } from "@/core/types/evidence";
import { Layers, Server, Database, Cloud, Shield, Activity, FileCode, CheckCircle2, AlertTriangle, ArrowRight, Eye } from "lucide-react";

interface SystemMapClusteredProps {
  snapshot: SystemModelSnapshot | null;
  onSelectEntity?: (entity: SystemEntity) => void;
  onOpenEvidence?: (evidenceId: string) => void;
}

export const SystemMapClustered: React.FC<SystemMapClusteredProps> = ({
  snapshot,
  onSelectEntity,
  onOpenEvidence,
}) => {
  const [selectedEntity, setSelectedEntity] = useState<SystemEntity | null>(null);
  const [filterKind, setFilterKind] = useState<string>("ALL");

  if (!snapshot) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 font-mono text-sm p-8 bg-[#0d1117] border border-[#21262d] rounded-xl">
        <Activity className="w-8 h-8 text-sky-400 mb-3 animate-pulse" />
        <p>No active System Reality Model loaded.</p>
        <span className="text-xs text-slate-500 mt-1">Connect a repository and run analysis to populate computational topology.</span>
      </div>
    );
  }

  const entities = snapshot.entities || [];
  const filteredEntities = filterKind === "ALL" 
    ? entities 
    : entities.filter(e => e.kind === filterKind || (filterKind === "SERVICE" && e.tags?.includes("Service")));

  const handleEntityClick = (ent: SystemEntity) => {
    setSelectedEntity(ent);
    if (onSelectEntity) onSelectEntity(ent);
  };

  const getKindIcon = (kind: string) => {
    switch (kind) {
      case "SERVICE": return <Server className="w-4 h-4 text-sky-400" />;
      case "DATABASE": return <Database className="w-4 h-4 text-emerald-400" />;
      case "QUEUE": return <Layers className="w-4 h-4 text-purple-400" />;
      case "API": return <Cloud className="w-4 h-4 text-amber-400" />;
      default: return <FileCode className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OBSERVED":
        return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">OBSERVED (100%)</span>;
      case "CONTRADICTED":
        return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-rose-950/80 border border-rose-500/40 text-rose-300">CONTRADICTED</span>;
      case "INFERRED":
        return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-sky-950/80 border border-sky-500/40 text-sky-300">INFERRED (85%)</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 border border-slate-700 text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-full min-h-[550px]">
      {/* Topology Nodes Grid (8 Cols) */}
      <div className="col-span-8 flex flex-col bg-[#0d1117] border border-[#21262d] rounded-xl p-4 overflow-hidden">
        {/* Filter bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#21262d] text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Topology Filter:</span>
            {["ALL", "SERVICE", "MODULE", "DATABASE", "API"].map((k) => (
              <button
                key={k}
                onClick={() => setFilterKind(k)}
                className={`px-2 py-1 rounded transition-colors ${
                  filterKind === k ? "bg-sky-950 text-sky-400 border border-sky-500/30 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <span className="text-slate-500">
            {filteredEntities.length} of {entities.length} Nodes Discovered
          </span>
        </div>

        {/* Clustered Node Cards */}
        <div className="flex-1 overflow-y-auto mt-3 grid grid-cols-2 gap-2.5 pr-1">
          {filteredEntities.map((ent) => {
            const isSelected = selectedEntity?.id === ent.id;
            return (
              <div
                key={ent.id}
                onClick={() => handleEntityClick(ent)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#161b22] border-sky-400 shadow-md ring-1 ring-sky-400/20"
                    : "bg-[#0f141c] border-[#21262d] hover:border-slate-600 hover:bg-[#131822]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getKindIcon(ent.kind)}
                    <span className="font-mono text-xs font-bold text-slate-200 truncate max-w-[160px]">
                      {ent.name}
                    </span>
                  </div>
                  {getStatusBadge(ent.truthStatus)}
                </div>

                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {ent.description}
                </p>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#21262d]/60 text-[10px] font-mono text-slate-500">
                  <span className="truncate max-w-[140px]">{ent.filePath || "Virtual"}</span>
                  <span className="text-sky-400">{ent.metrics?.loc ? `${ent.metrics.loc} LOC` : "Module"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Entity Deep-Inspector (4 Cols) */}
      <div className="col-span-4 flex flex-col bg-[#0d1117] border border-[#21262d] rounded-xl p-4 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#21262d] text-xs font-mono">
          <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>Entity Inspector</span>
          </span>
          {selectedEntity && getStatusBadge(selectedEntity.truthStatus)}
        </div>

        {selectedEntity ? (
          <div className="flex-1 overflow-y-auto mt-3 space-y-4 pr-1 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Entity Identity</span>
              <h3 className="font-mono font-bold text-sm text-sky-300">{selectedEntity.name}</h3>
              <p className="font-mono text-[11px] text-slate-400 mt-0.5">{selectedEntity.filePath || "In-Memory AST Node"}</p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Semantic Purpose</span>
              <p className="text-slate-300 text-[11px] leading-relaxed bg-[#161b22] p-2.5 rounded border border-[#21262d]">
                {selectedEntity.description}
              </p>
            </div>

            {selectedEntity.location && (
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Code Span & Boundaries</span>
                <div className="font-mono text-[11px] text-slate-300 bg-[#161b22] p-2.5 rounded border border-[#21262d] flex justify-between">
                  <span>Lines {selectedEntity.location.startLine} - {selectedEntity.location.endLine}</span>
                  <span className="text-emerald-400 font-bold">100% Hermetic</span>
                </div>
              </div>
            )}

            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5">Evidence Provenance ({selectedEntity.evidenceIds?.length || 0} claims)</span>
              {selectedEntity.evidenceIds && selectedEntity.evidenceIds.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedEntity.evidenceIds.map((evId) => {
                    const ev = snapshot.evidenceMap[evId];
                    if (!ev) return null;
                    return (
                      <div
                        key={evId}
                        onClick={() => onOpenEvidence && onOpenEvidence(evId)}
                        className="p-2 rounded bg-[#161b22] border border-[#21262d] hover:border-sky-500/40 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-sky-400 font-semibold">{ev.title}</span>
                          <span className="text-slate-500">{ev.sourceType}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{ev.description}</p>
                        {ev.location && (
                          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-1.5">
                            <span>{ev.location.filePath}:{ev.location.startLine}</span>
                            <span className="text-emerald-400">Confidence: {(ev.confidence * 100).toFixed(0)}%</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-500 italic text-[11px]">No external evidence items linked.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 font-mono text-xs p-4">
            <Eye className="w-6 h-6 mb-2 text-slate-600" />
            <p>Select any node on the left to inspect ground-truth evidence, symbol bindings, and contract relationships.</p>
          </div>
        )}
      </div>
    </div>
  );
};
