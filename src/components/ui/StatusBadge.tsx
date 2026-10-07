"use client";

import React from "react";

export type EpistemicBadgeStatus =
  | "OBSERVED"
  | "VALIDATED"
  | "INFERRED"
  | "HYPOTHESIZED"
  | "UNKNOWN"
  | "CONFLICTED"
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "FORMALLY_VERIFIED"
  | "RUNTIME_VALIDATED"
  | "REPOSITORY_VALIDATED"
  | "FIXTURE_VALIDATED"
  | "EXPERIMENTAL"
  | "UNSUPPORTED";

interface StatusBadgeProps {
  status: EpistemicBadgeStatus | string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  className = "",
  showDot = true,
}) => {
  const normStatus = (status || "UNKNOWN").toUpperCase();

  const getStyles = () => {
    switch (normStatus) {
      case "OBSERVED":
      case "VALIDATED":
      case "RUNTIME_VALIDATED":
        return {
          bg: "bg-emerald-950/70",
          border: "border-emerald-500/40",
          text: "text-emerald-300",
          dot: "bg-emerald-400",
        };
      case "FORMALLY_VERIFIED":
        return {
          bg: "bg-purple-950/70",
          border: "border-purple-500/40",
          text: "text-purple-300",
          dot: "bg-purple-400",
        };
      case "REPOSITORY_VALIDATED":
        return {
          bg: "bg-cyan-950/70",
          border: "border-cyan-500/40",
          text: "text-cyan-300",
          dot: "bg-cyan-400",
        };
      case "FIXTURE_VALIDATED":
      case "INFERRED":
        return {
          bg: "bg-sky-950/70",
          border: "border-sky-500/40",
          text: "text-sky-300",
          dot: "bg-sky-400",
        };
      case "HYPOTHESIZED":
      case "EXPERIMENTAL":
        return {
          bg: "bg-indigo-950/70",
          border: "border-indigo-500/40",
          text: "text-indigo-300",
          dot: "bg-indigo-400",
        };
      case "CONFLICTED":
      case "CRITICAL":
        return {
          bg: "bg-rose-950/70",
          border: "border-rose-500/50",
          text: "text-rose-300",
          dot: "bg-rose-400",
        };
      case "HIGH":
        return {
          bg: "bg-amber-950/70",
          border: "border-amber-500/40",
          text: "text-amber-300",
          dot: "bg-amber-400",
        };
      case "MEDIUM":
        return {
          bg: "bg-yellow-950/60",
          border: "border-yellow-500/40",
          text: "text-yellow-300",
          dot: "bg-yellow-400",
        };
      case "LOW":
        return {
          bg: "bg-slate-900/80",
          border: "border-slate-700/60",
          text: "text-slate-300",
          dot: "bg-slate-400",
        };
      default:
        return {
          bg: "bg-slate-900/80",
          border: "border-slate-800",
          text: "text-slate-400",
          dot: "bg-slate-500",
        };
    }
  };

  const style = getStyles();

  const sizeClass =
    size === "sm"
      ? "text-[9px] px-1.5 py-0.5"
      : size === "lg"
      ? "text-xs px-2.5 py-1"
      : "text-[10px] px-2 py-0.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded border ${style.bg} ${style.border} ${style.text} ${sizeClass} tracking-wider select-none ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
      )}
      <span>{normStatus.replace(/_/g, " ")}</span>
    </span>
  );
};
