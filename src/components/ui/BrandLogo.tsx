"use client";

import React from "react";

interface BrandLogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 28,
  className = "",
  showWordmark = true,
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Computational Orbital Symbol */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]"
        >
          {/* Outer Reality Ring */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="url(#ring-grad)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            className="opacity-70"
          />

          {/* Core Topology Nodes & Hex Grid */}
          <polygon
            points="20,6 32,13 32,27 20,34 8,27 8,13"
            stroke="url(#core-grad)"
            strokeWidth="1.25"
            fill="rgba(14, 22, 36, 0.6)"
          />

          {/* Inner Interconnected Matrix Lines */}
          <line x1="20" y1="6" x2="20" y2="34" stroke="rgba(56,189,248,0.4)" strokeWidth="1" />
          <line x1="8" y1="13" x2="32" y2="27" stroke="rgba(56,189,248,0.4)" strokeWidth="1" />
          <line x1="8" y1="27" x2="32" y2="13" stroke="rgba(56,189,248,0.4)" strokeWidth="1" />

          {/* Central Singularity Node */}
          <circle cx="20" cy="20" r="4.5" fill="url(#singularity-grad)" />
          <circle cx="20" cy="20" r="2" fill="#ffffff" />

          {/* Orbital Satellite Vertices */}
          <circle cx="20" cy="6" r="2" fill="#38bdf8" />
          <circle cx="32" cy="13" r="2" fill="#818cf8" />
          <circle cx="32" cy="27" r="2" fill="#38bdf8" />
          <circle cx="20" cy="34" r="2" fill="#818cf8" />
          <circle cx="8" cy="27" r="2" fill="#38bdf8" />
          <circle cx="8" cy="13" r="2" fill="#818cf8" />

          <defs>
            <linearGradient id="ring-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="0.5" stopColor="#818cf8" />
              <stop offset="1" stopColor="#c084fc" />
            </linearGradient>
            <linearGradient id="core-grad" x1="8" y1="6" x2="32" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
            <radialGradient id="singularity-grad" cx="20" cy="20" r="4.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="0.7" stopColor="#4f46e5" />
              <stop offset="1" stopColor="#0f172a" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Product Wordmark */}
      {showWordmark && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-mono font-black text-sm tracking-[0.22em] text-white">
              VANTAIR
            </span>
          </div>
          <span className="text-[9px] font-mono tracking-wider text-slate-400 font-medium uppercase mt-0.5">
            THE COMPUTATIONAL SOFTWARE REALITY ENGINE
          </span>
        </div>
      )}
    </div>
  );
};
