import { NextRequest, NextResponse } from "next/server";
import { ProjectStore } from "@/core/storage/project_store";
import * as fs from "fs";
import * as path from "path";
import {
  getRepoCacheDir,
  getAllPossibleRepoDirs,
  isDemoRepoPath,
  ensureDemoRepoOnDisk,
  getDemoFile,
} from "@/core/utils/repo_cache";
import { EMBEDDED_DEMO_FILES } from "@/engine/embedded_demo_repo";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectStore = ProjectStore.getInstance();
    const project = projectStore.getProject(id);

    if (!project) {
      return NextResponse.json({ status: "ERROR", message: "Project not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const requestedFile = searchParams.get("file");

    const rawPath = (project.repository.urlOrPath || "").trim();
    const isDemo = isDemoRepoPath(rawPath) || isDemoRepoPath(project.name);

    // 1. Handle Seeded CampusBuddy Banking Project (Virtual & On-Disk)
    if (isDemo) {
      if (requestedFile) {
        // Direct in-memory lookup first
        const embedded = getDemoFile(requestedFile);
        if (embedded) {
          return NextResponse.json({
            status: "SUCCESS",
            file: requestedFile,
            content: embedded.content,
            lineCount: embedded.content.split("\n").length,
          });
        }

        // Try reading from disk fallback
        const diskPath = ensureDemoRepoOnDisk();
        const diskFile = path.join(diskPath, requestedFile);
        if (fs.existsSync(diskFile) && fs.statSync(diskFile).isFile()) {
          const content = fs.readFileSync(diskFile, "utf-8");
          return NextResponse.json({
            status: "SUCCESS",
            file: requestedFile,
            content,
            lineCount: content.split("\n").length,
          });
        }

        return NextResponse.json({ status: "ERROR", message: "File not found" }, { status: 404 });
      }

      // Return complete demo file tree
      const demoFiles: Array<{ path: string; name: string; isDir: boolean; size: number }> = [
        { path: "services", name: "services", isDir: true, size: 0 },
        { path: "docs", name: "docs", isDir: true, size: 0 },
        { path: "telemetry", name: "telemetry", isDir: true, size: 0 },
      ];

      for (const f of EMBEDDED_DEMO_FILES) {
        demoFiles.push({
          path: f.relativePath,
          name: path.basename(f.relativePath),
          isDir: false,
          size: Buffer.byteLength(f.content, "utf-8"),
        });
      }

      demoFiles.sort((a, b) => {
        if (a.isDir === b.isDir) return a.path.localeCompare(b.path);
        return a.isDir ? -1 : 1;
      });

      return NextResponse.json({
        status: "SUCCESS",
        root: project.name,
        files: demoFiles,
      });
    }

    // 2. Handle Arbitrary Local and Remote Repositories
    let repoBase = "";
    const isRemoteUrl = /^https?:\/\//i.test(rawPath) || /^git@/i.test(rawPath);
    const safeRepoName = rawPath.replace(/https?:\/\/github\.com\//i, "").replace(/[^a-zA-Z0-9_.-]/g, "_").replace(/\.git$/, "");

    const candidates = getAllPossibleRepoDirs(safeRepoName);
    if (fs.existsSync(rawPath)) {
      candidates.unshift(rawPath);
    }
    const cwdDirect = path.resolve(process.cwd(), rawPath);
    if (fs.existsSync(cwdDirect)) {
      candidates.unshift(cwdDirect);
    }

    const hasValidFiles = (dirPath: string) => {
      try {
        if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) return false;
        const entries = fs.readdirSync(dirPath).filter((e) => !e.startsWith("."));
        return entries.length > 0;
      } catch {
        return false;
      }
    };

    for (const cand of candidates) {
      if (hasValidFiles(cand)) {
        repoBase = cand;
        break;
      }
    }

    if (!repoBase || !hasValidFiles(repoBase)) {
      if (project.name.toLowerCase().includes("vantair") || rawPath.toLowerCase().includes("vantair")) {
        repoBase = process.cwd();
      } else {
        const cacheDir = getRepoCacheDir();
        if (fs.existsSync(cacheDir)) {
          const matching = fs.readdirSync(cacheDir).find((d) => {
            const p = path.join(cacheDir, d);
            return d.toLowerCase().includes(project.name.toLowerCase()) && hasValidFiles(p);
          });
          if (matching) {
            repoBase = path.join(cacheDir, matching);
          }
        }
      }
    }

    if (!repoBase || !hasValidFiles(repoBase)) {
      repoBase = process.cwd();
    }

    // If specific file requested, return its content
    if (requestedFile) {
      const fullPath = path.join(repoBase, requestedFile);
      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
        return NextResponse.json({ status: "ERROR", message: "File not found" }, { status: 404 });
      }

      const content = fs.readFileSync(fullPath, "utf-8");
      return NextResponse.json({
        status: "SUCCESS",
        file: requestedFile,
        content,
        lineCount: content.split("\n").length,
      });
    }

    // Otherwise return file tree
    const maxFiles = 600;
    const files: Array<{ path: string; name: string; isDir: boolean; size: number }> = [];

    const walk = (curr: string) => {
      if (files.length >= maxFiles) return;
      try {
        const entries = fs.readdirSync(curr, { withFileTypes: true });
        for (const entry of entries) {
          if (files.length >= maxFiles) break;
          if (
            entry.name.startsWith(".git") ||
            entry.name === "node_modules" ||
            entry.name === "dist" ||
            entry.name === "build" ||
            entry.name === "out" ||
            entry.name === ".next" ||
            entry.name === ".turbo" ||
            entry.name === ".temp_repos" ||
            entry.name === "vantair_repos" ||
            entry.name === ".agents" ||
            entry.name === ".claude" ||
            entry.name === ".gemini" ||
            entry.name === ".system_generated" ||
            entry.name === ".vscode" ||
            entry.name === ".idea"
          ) {
            continue;
          }

          const full = path.join(curr, entry.name);
          const rel = path.relative(repoBase, full).replace(/\\/g, "/");

          if (entry.isDirectory()) {
            files.push({ path: rel, name: entry.name, isDir: true, size: 0 });
            walk(full);
          } else {
            const stats = fs.statSync(full);
            files.push({ path: rel, name: entry.name, isDir: false, size: stats.size });
          }
        }
      } catch {}
    };

    walk(repoBase);

    // Sort folders first, then files
    files.sort((a, b) => {
      if (a.isDir === b.isDir) return a.path.localeCompare(b.path);
      return a.isDir ? -1 : 1;
    });

    return NextResponse.json({
      status: "SUCCESS",
      root: project.name,
      files,
    });
  } catch (error: any) {
    console.error("GET /api/projects/[id]/files error:", error);
    return NextResponse.json({ status: "ERROR", message: error.message }, { status: 500 });
  }
}
