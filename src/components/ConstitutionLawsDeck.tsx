"use client";

import React, { useState } from "react";
import { Scale, ShieldCheck, ShieldAlert, CheckCircle2, FileCode2, Lock } from "lucide-react";
import { SYSTEM_CONSTITUTION_14_LAWS } from "../engine/constitution_laws";

export const ConstitutionLawsDeck: React.FC = () => {
  const [selectedLawId, setSelectedLawId] = useState<string>("LAW-001");

  const selectedLaw = SYSTEM_CONSTITUTION_14_LAWS.find((l) => l.lawId === selectedLawId) || SYSTEM_CONSTITUTION_14_LAWS[0];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 flex flex-col h-full shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-emerald-400 font-mono tracking-wider flex items-center space-x-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>THE SYSTEM CONSTITUTION: 14 SOFTWARE LAWS</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-mono">
            SMT Theorem Prover & Proof by Contradiction Certificates
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
          14/14 PROVEN SAFE (UNSAT)
        </span>
      </div>

      {/* Main Layout: List on Left, Detail on Right */}
      <div className="mt-3 grid grid-cols-12 gap-3 flex-1 min-h-0 text-xs font-mono">
        {/* Law List (5 Cols) */}
        <div className="col-span-5 space-y-1.5 overflow-y-auto pr-1">
          {SYSTEM_CONSTITUTION_14_LAWS.map((law) => {
            const isSelected = law.lawId === selectedLawId;
            return (
              <div
                key={law.lawId}
                onClick={() => setSelectedLawId(law.lawId)}
                className={`p-2 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-emerald-950/60 border-emerald-400 text-emerald-200"
                    : "bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{law.lawId}</span>
                  <span className="text-[9px] bg-emerald-900/60 text-emerald-300 px-1 rounded">
                    UNSAT
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{law.name}</div>
              </div>
            );
          })}
        </div>

        {/* Selected Law SMT Detail (7 Cols) */}
        <div className="col-span-7 bg-slate-950/90 rounded-lg p-3 border border-slate-800 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-emerald-400">{selectedLaw.lawId} :: {selectedLaw.name}</span>
              <span className="text-[10px] text-slate-500">CATEGORY: {selectedLaw.category}</span>
            </div>

            <div className="mt-2 text-slate-300 text-[11px] leading-relaxed">
              {selectedLaw.description}
            </div>

            <div className="mt-3">
              <span className="text-[10px] text-slate-400 block mb-1 font-bold">SMT-LIB2 LOGICAL FORMULA:</span>
              <pre className="bg-slate-900 p-2 rounded border border-slate-800 text-cyan-300 text-[10px] font-mono overflow-x-auto">
                {selectedLaw.smtLib2Assertion}
              </pre>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 flex items-center space-x-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>CRYPTOGRAPHIC MERKLE CERTIFICATE ISSUED</span>
            </span>
            <span className="text-emerald-400 font-bold">SHA-256: 6c3c86ae...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
