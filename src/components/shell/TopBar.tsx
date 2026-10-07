"use client";

import React, { useState } from "react";
import { BrandLogo } from "../ui/BrandLogo";
import {
  ArrowRight,
  Bell,
  Sun,
  Moon,
  Github,
  Command,
} from "lucide-react";

interface TopBarProps {
  onOpenCommandPalette: () => void;
  onAnalyzeUrl: (url: string) => void;
  onOpenSettings?: () => void;
  isAnalyzing?: boolean;
  currentRepoUrl?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCommandPalette,
  onAnalyzeUrl,
  onOpenSettings,
  isAnalyzing = false,
  currentRepoUrl = "https://github.com/Orsted10/Vantair",
}) => {
  const [urlInput, setUrlInput] = useState(currentRepoUrl);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onAnalyzeUrl(urlInput.trim());
    }
  };

  return (
    <header className="h-14 bg-[#05080d] border-b border-[#16202f] px-4 flex items-center justify-between z-30 shrink-0 font-sans select-none relative">
      {/* Left: Brand Logo & Subtitle */}
      <div className="flex items-center gap-3">
        <BrandLogo size={28} />
      </div>

      {/* Center: Command Palette / Repo URL Search Input (Exact Image 2) */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 max-w-xl mx-6 relative flex items-center"
      >
        <div className="relative w-full flex items-center bg-[#0b111a] border border-[#1c2738] hover:border-[#25354c] focus-within:border-blue-500 rounded-full py-1 pl-3.5 pr-2 transition-all shadow-inner">
          <Github className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://github.com/owner/repository"
            className="w-full bg-transparent text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none pr-16"
          />

          <div className="flex items-center gap-1.5 shrink-0 ml-1">
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
              title="Command Palette (⌘K)"
            >
              <Command className="w-3.5 h-3.5" />
            </button>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-2.5 py-1 bg-[#1d68f2] hover:bg-[#2563eb] disabled:opacity-50 text-white rounded-full text-[11px] font-sans font-semibold transition-all flex items-center gap-1 shadow-sm"
            >
              <span>Analyze</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </form>

      {/* Right Controls: Theme Toggle, Notifications, User Avatar */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#0e1622] transition-colors"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications with Red Indicator */}
        <button
          type="button"
          onClick={() => alert("1 system notification: Vantair Reality Engine initialized.")}
          className="relative p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#0e1622] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1 right-1 ring-2 ring-[#05080d]" />
        </button>

        {/* User Avatar Circle VK */}
        <div
          onClick={onOpenSettings}
          className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-[11px] cursor-pointer ring-1 ring-white/20 shadow-md hover:ring-blue-400 transition-all ml-1"
          title="User Profile & Settings"
        >
          VK
        </div>
      </div>
    </header>
  );
};
