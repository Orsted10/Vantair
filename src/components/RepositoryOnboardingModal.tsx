"use client";

import React, { useState } from "react";
import { X, FolderGit2, Github, Upload, Sparkles, CheckCircle2, AlertCircle, ArrowRight, RefreshCw } from "lucide-react";

interface RepositoryOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: any, snapshot: any) => void;
}

export const RepositoryOnboardingModal: React.FC<RepositoryOnboardingModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const [provider, setProvider] = useState<"LOCAL" | "GITHUB" | "ZIP_UPLOAD">("LOCAL");
  const [name, setName] = useState<string>("");
  const [urlOrPath, setUrlOrPath] = useState<string>("src");
  const [depth, setDepth] = useState<"QUICK" | "STANDARD" | "DEEP" | "FORENSIC">("STANDARD");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !urlOrPath.trim()) return;

    setIsSubmitting(true);
    setProgressMsg("Creating project record...");
    setProgressPercent(5);

    try {
      // 1. Create Project
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          urlOrPath: urlOrPath.trim(),
          provider,
          description: `Repository onboarded via ${provider} provider.`,
        }),
      });
      const data = await res.json();
      if (data.status !== "SUCCESS") {
        throw new Error(data.message || "Failed to create project");
      }

      const project = data.project;
      setProgressMsg("Triggering dynamic analysis pipeline...");
      setProgressPercent(15);

      // 2. Trigger Real Analysis
      const analyzeRes = await fetch(`/api/projects/${project.id}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depth, synchronous: true }),
      });
      const analyzeData = await analyzeRes.json();

      if (analyzeData.status === "SUCCESS") {
        setProgressPercent(100);
        setProgressMsg("System Reality Model successfully constructed!");
        setTimeout(() => {
          onProjectCreated(project, analyzeData.snapshot);
          onClose();
        }, 500);
      } else {
        throw new Error(analyzeData.message || "Analysis failed");
      }
    } catch (err: any) {
      console.error("Onboarding error:", err);
      setProgressMsg(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono text-xs">
      <div className="w-full max-w-lg bg-[#0d1117] border border-[#21262d] rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-[#161b22] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center space-x-2 text-sky-400 font-bold mb-1">
            <FolderGit2 className="w-5 h-5" />
            <h2 className="text-sm tracking-wider uppercase">Connect Arbitrary Repository</h2>
          </div>
          <p className="text-slate-400 text-[11px]">
            Ingest real source trees, discover AST symbols, and construct a permanent computational reality model.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="text-[10px] text-slate-500 uppercase block mb-1.5">Repository Provider</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setProvider("LOCAL"); if (!urlOrPath) setUrlOrPath("src"); }}
                className={`p-2.5 rounded-lg border flex flex-col items-center space-y-1 transition-all ${
                  provider === "LOCAL"
                    ? "bg-sky-950/80 border-sky-500 text-sky-300 font-bold"
                    : "bg-[#161b22] border-[#21262d] text-slate-400 hover:text-slate-200"
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span className="text-[10px]">Local Path</span>
              </button>

              <button
                type="button"
                onClick={() => { setProvider("GITHUB"); setUrlOrPath("github.com/"); }}
                className={`p-2.5 rounded-lg border flex flex-col items-center space-y-1 transition-all ${
                  provider === "GITHUB"
                    ? "bg-sky-950/80 border-sky-500 text-sky-300 font-bold"
                    : "bg-[#161b22] border-[#21262d] text-slate-400 hover:text-slate-200"
                }`}
              >
                <Github className="w-4 h-4" />
                <span className="text-[10px]">GitHub URL</span>
              </button>

              <button
                type="button"
                onClick={() => { setProvider("ZIP_UPLOAD"); setUrlOrPath("uploads/repo.zip"); }}
                className={`p-2.5 rounded-lg border flex flex-col items-center space-y-1 transition-all ${
                  provider === "ZIP_UPLOAD"
                    ? "bg-sky-950/80 border-sky-500 text-sky-300 font-bold"
                    : "bg-[#161b22] border-[#21262d] text-slate-400 hover:text-slate-200"
                }`}
              >
                <Upload className="w-4 h-4" />
                <span className="text-[10px]">ZIP Archive</span>
              </button>
            </div>
          </div>

          {/* Project Name */}
          <div>
            <label className="text-[10px] text-slate-500 uppercase block mb-1">Project System Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MyProductionCore or CampusBuddy"
              className="w-full bg-[#161b22] border border-[#30363d] focus:border-sky-400 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Path or URL */}
          <div>
            <label className="text-[10px] text-slate-500 uppercase block mb-1">
              {provider === "LOCAL" ? "Directory Path (Workspace Relative)" : provider === "GITHUB" ? "Repository URL" : "ZIP Location"}
            </label>
            <input
              type="text"
              required
              value={urlOrPath}
              onChange={(e) => setUrlOrPath(e.target.value)}
              placeholder="e.g. src or src/demo_repo"
              className="w-full bg-[#161b22] border border-[#30363d] focus:border-sky-400 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Depth selection */}
          <div>
            <label className="text-[10px] text-slate-500 uppercase block mb-1">Analysis Depth</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(["QUICK", "STANDARD", "DEEP", "FORENSIC"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDepth(d)}
                  className={`py-1.5 rounded border text-[10px] transition-colors ${
                    depth === d
                      ? "bg-[#161b22] border-sky-400 text-sky-300 font-bold"
                      : "bg-[#0d1117] border-[#21262d] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Progress or Actions */}
          {isSubmitting ? (
            <div className="pt-2">
              <div className="flex items-center justify-between text-[10px] text-sky-400 mb-1">
                <span>{progressMsg}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#161b22] rounded-full overflow-hidden border border-[#21262d]">
                <div
                  className="h-full bg-sky-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#21262d]">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <span>Connect & Analyze</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
