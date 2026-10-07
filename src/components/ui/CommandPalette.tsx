"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Terminal,
  Layers,
  Shield,
  Activity,
  GitCompare,
  Compass,
  FileCheck,
  FolderGit2,
  ArrowRight,
  Sparkles,
  Command,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionId: string, payload?: any) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const commands = [
    {
      id: "nav:graph",
      title: "Open Reality Graph",
      category: "Navigation",
      icon: <Layers className="w-4 h-4 text-sky-400" />,
      shortcut: "G G",
    },
    {
      id: "nav:code",
      title: "Explore Code Intelligence",
      category: "Navigation",
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      shortcut: "G C",
    },
    {
      id: "nav:security",
      title: "Inspect Security & Taint Flow",
      category: "Navigation",
      icon: <Shield className="w-4 h-4 text-rose-400" />,
      shortcut: "G S",
    },
    {
      id: "nav:runtime",
      title: "View Live Runtime Telemetry",
      category: "Navigation",
      icon: <Activity className="w-4 h-4 text-amber-400" />,
      shortcut: "G R",
    },
    {
      id: "nav:counterfactuals",
      title: "Run Counterfactual Simulation",
      category: "Simulation",
      icon: <GitCompare className="w-4 h-4 text-purple-400" />,
    },
    {
      id: "nav:experiments",
      title: "View Unknown Frontier & Experiments",
      category: "Experiments",
      icon: <Compass className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: "nav:vrql",
      title: "Execute VRQL Query Console",
      category: "Query",
      icon: <Terminal className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: "nav:maturity",
      title: "Inspect Forensic Capability Truth Audit",
      category: "Verification",
      icon: <FileCheck className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: "vrql:why_refund",
      title: "VRQL: WHY can refund happen twice?",
      category: "Reality Query",
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      payload: "WHY can refund happen twice?",
    },
    {
      id: "vrql:affected_redis",
      title: "VRQL: SHOW services affected if RedisCache is unavailable",
      category: "Reality Query",
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      payload: "SHOW services affected if RedisCache is unavailable",
    },
    {
      id: "vrql:contract_divergence",
      title: "VRQL: SHOW CONTRACT DIVERGENCE",
      category: "Reality Query",
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      payload: "SHOW CONTRACT DIVERGENCE",
    },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        const cmd = filtered[selectedIndex];
        onSelectAction(cmd.id, cmd.payload);
        onClose();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onSelectAction, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 p-4 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-[#090d14] border border-[#21262d] rounded-2xl shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#1c2431] gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, query, or jump to view (e.g. WHY, Graph, Security)..."
            className="w-full bg-transparent text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
          />
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#161b22] border border-[#263142] text-[10px] font-mono text-slate-400">
            <span>ESC</span>
          </div>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-slate-500">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectAction(item.id, item.payload);
                    onClose();
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-xs ${
                    isSelected
                      ? "bg-[#141e2e] text-white border border-[#283b54]"
                      : "text-slate-300 hover:bg-[#0e141f]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-[#121926] border border-[#1e2a3a]">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-mono font-medium text-slate-200">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                    {item.shortcut && (
                      <span className="px-1.5 py-0.5 rounded bg-[#161f2e] border border-[#28394e]">
                        {item.shortcut}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#070a0f] border-t border-[#161d27] flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Command className="w-3 h-3" />
            <span>VANTAIR Reality Command Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
