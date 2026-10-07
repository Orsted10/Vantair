"use client";

import React, { useState } from "react";
import {
  Settings,
  Sliders,
  Palette,
  Cpu,
  Shield,
  Boxes,
  Bell,
  Users,
  Key,
  CreditCard,
  Check,
  Zap,
} from "lucide-react";
import { Project } from "@/core/types/project";

interface SettingsDeckProps {
  project?: Project | null;
}

type SettingsSection =
  | "general"
  | "appearance"
  | "analysis"
  | "ai"
  | "security"
  | "integrations"
  | "notifications"
  | "team"
  | "api"
  | "billing";

export const SettingsDeck: React.FC<SettingsDeckProps> = ({ project }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");
  const [savedNotification, setSavedNotification] = useState(false);

  const navItems: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
    { id: "general", label: "General", icon: Sliders },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "analysis", label: "Analysis Engine", icon: Settings },
    { id: "ai", label: "AI & Hardware", icon: Cpu },
    { id: "security", label: "Security & Invariants", icon: Shield },
    { id: "integrations", label: "Integrations", icon: Boxes },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "team", label: "Team & Access", icon: Users },
    { id: "api", label: "API & Keys", icon: Key },
    { id: "billing", label: "Billing & Plan", icon: CreditCard },
  ];

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  return (
    <div className="bg-[#0b111a] border border-[#1c2738] rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[580px] font-sans select-none">
      {/* Left Settings Sidebar */}
      <div className="w-full md:w-56 bg-[#070b12] border-r border-[#16202f] p-3 space-y-1 shrink-0">
        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
          Platform Settings
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors text-left font-medium ${
                isActive
                  ? "bg-[#111a26] text-cyan-300 font-semibold border-l-2 border-[#1d68f2] shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#0c121b]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-[#38bdf8]" : "text-slate-500"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Settings Content */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* SECTION: GENERAL */}
        {activeSection === "general" && (
          <div className="space-y-4 max-w-xl">
            <div>
              <h2 className="text-base font-bold text-white">General Project Settings</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure primary repository identity, tracking branches, and sync behavior.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  defaultValue={project?.name || "Vantair"}
                  className="w-full bg-[#070b12] border border-[#1c2738] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Repository Source</label>
                <input
                  type="text"
                  defaultValue={project?.repository?.urlOrPath || "https://github.com/Orsted10/Vantair"}
                  className="w-full bg-[#070b12] border border-[#1c2738] rounded-lg px-3 py-2 text-slate-300 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Default Monitored Branch</label>
                <input
                  type="text"
                  defaultValue="main"
                  className="w-full bg-[#070b12] border border-[#1c2738] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: AI & HARDWARE */}
        {activeSection === "ai" && (
          <div className="space-y-4 max-w-xl">
            <div>
              <h2 className="text-base font-bold text-white">AI Hardware & Reasoning Cluster</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ultra-fast reasoning configuration with Groq LPU acceleration.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#070b12] border border-[#1c2738] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">Active Inference Cluster</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  Paid Tier Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Primary model: <strong className="text-cyan-300 font-mono">qwen/qwen3.8-27b</strong> at ~800 tokens/sec.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Fallback Model</label>
                <input
                  type="text"
                  defaultValue="llama-3.3-70b-versatile"
                  className="w-full bg-[#070b12] border border-[#1c2738] rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Reasoning Temperature</label>
                <input
                  type="text"
                  defaultValue="0.15 (Strict Determinism)"
                  className="w-full bg-[#070b12] border border-[#1c2738] rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: BILLING */}
        {activeSection === "billing" && (
          <div className="space-y-4 max-w-xl">
            <div>
              <h2 className="text-base font-bold text-white">Plan & Resource Quota</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Current organization subscription and hardware bounds.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-white text-sm">Ultimate Plan</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Unlimited repository reality modeling, zero-latency eBPF sensor streaming, and enterprise cryptographic attestations.
              </p>
            </div>
          </div>
        )}

        {/* Fallback for other sections */}
        {activeSection !== "general" && activeSection !== "ai" && activeSection !== "billing" && (
          <div className="space-y-3 max-w-xl">
            <h2 className="text-base font-bold text-white capitalize">{activeSection} Configuration</h2>
            <p className="text-xs text-slate-400">
              Settings for {activeSection} are verified and adhering to Vantair computational reality invariants.
            </p>
            <div className="p-4 rounded-xl bg-[#070b12] border border-[#1c2738] text-xs text-slate-300 font-mono">
              Status: Invariants nominal • Auto-sync enabled
            </div>
          </div>
        )}

        {/* Bottom Save Action */}
        <div className="pt-4 border-t border-[#16202f] flex items-center justify-between">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1d68f2] hover:bg-[#2563eb] text-white text-xs font-semibold transition-all shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
          {savedNotification && (
            <span className="text-xs text-emerald-400 font-mono animate-fade-in">
              Configuration updated successfully!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
