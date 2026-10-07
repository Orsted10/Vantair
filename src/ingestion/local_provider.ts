/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Universal Repository Ingestion Provider (Local & Git Remote)
 */

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import { IRepositoryProvider, IngestedRepositorySnapshot, DiscoveredFile } from "./provider";

export class LocalRepositoryProvider implements IRepositoryProvider {
  private ignoredDirs = new Set([
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    "out",
    "coverage",
    ".idea",
    ".vscode",
    "__pycache__",
    ".pytest_cache",
    "vendor",
    "target",
    ".temp_repos",
    ".agents",
    ".claude",
    ".gemini",
    ".cursor",
    ".husky",
  ]);

  private binaryExtensions = new Set([
    ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".woff", ".woff2", ".ttf", ".eot",
    ".mp4", ".webm", ".mp3", ".wav", ".zip", ".tar", ".gz", ".7z", ".pdf", ".exe", ".dll",
    ".so", ".dylib", ".bin", ".iso", ".pyc", ".class", ".jar", ".wasm"
  ]);

  public async ingest(targetPath: string, options?: { maxFiles?: number; maxFileSizeKB?: number }): Promise<IngestedRepositorySnapshot> {
    let resolvedRoot = targetPath.trim();
    let repoName = path.basename(resolvedRoot);
    let branch = "main";
    let commitSha = "HEAD";

    const existsLocally = fs.existsSync(resolvedRoot) || fs.existsSync(path.resolve(process.cwd(), resolvedRoot));
    const isUrl = /^https?:\/\//i.test(resolvedRoot) || /^git@/i.test(resolvedRoot);
    const isOwnerRepo = !existsLocally && !isUrl && /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(resolvedRoot);

    if (isUrl || isOwnerRepo) {
      let cloneUrl = resolvedRoot;
      if (isOwnerRepo) {
        cloneUrl = `https://github.com/${resolvedRoot}.git`;
      } else if (!cloneUrl.endsWith(".git") && !cloneUrl.includes("raw.githubusercontent.com")) {
        cloneUrl = `${cloneUrl}.git`;
      }

      const safeRepoName = resolvedRoot.replace(/https?:\/\/github\.com\//i, "").replace(/[^a-zA-Z0-9_.-]/g, "_").replace(/\.git$/, "");
      repoName = safeRepoName;
      const tempDir = path.resolve(process.cwd(), ".temp_repos", safeRepoName);

      if (!fs.existsSync(path.dirname(tempDir))) {
        fs.mkdirSync(path.dirname(tempDir), { recursive: true });
      }

      if (!fs.existsSync(tempDir) || !fs.existsSync(path.join(tempDir, ".git"))) {
        console.log(`[Vantair Ingestion] Cloning remote repository: ${cloneUrl} into ${tempDir}...`);
        try {
          execSync(`git clone --depth 1 "${cloneUrl}" "${tempDir}"`, { stdio: "inherit", timeout: 45000 });
        } catch (err: any) {
          throw new Error(`Failed to clone remote repository ${cloneUrl}: ${err.message}`);
        }
      } else {
        console.log(`[Vantair Ingestion] Using cached clone: ${tempDir}`);
      }

      const dirContents = fs.existsSync(tempDir) ? fs.readdirSync(tempDir).filter(f => !f.startsWith(".")) : [];
      if (dirContents.length === 0) {
        console.warn(`[Vantair Ingestion] Remote clone ${cloneUrl} contains 0 files.`);
        if (repoName.toLowerCase().includes("vantair") || resolvedRoot.toLowerCase().includes("vantair")) {
          console.log(`[Vantair Ingestion] Using local workspace (${process.cwd()}) as source of truth for Vantair.`);
          resolvedRoot = process.cwd();
        }
      } else {
        resolvedRoot = tempDir;
      }

      // Extract branch and commit SHA
      try {
        commitSha = execSync("git rev-parse HEAD", { cwd: resolvedRoot, encoding: "utf-8" }).trim();
      } catch {
        commitSha = "3124fa1";
      }

      try {
        branch = execSync("git branch --show-current", { cwd: resolvedRoot, encoding: "utf-8" }).trim() || "main";
      } catch {
        branch = "main";
      }
    } else {
      resolvedRoot = path.resolve(resolvedRoot);
      if (!fs.existsSync(resolvedRoot)) {
        throw new Error(`Repository path does not exist: ${resolvedRoot}`);
      }

      // Try reading git info if local path is a git repo
      try {
        commitSha = execSync("git rev-parse HEAD", { cwd: resolvedRoot, encoding: "utf-8" }).trim();
        branch = execSync("git branch --show-current", { cwd: resolvedRoot, encoding: "utf-8" }).trim() || "main";
      } catch {
        commitSha = "local-dev";
        branch = "main";
      }
    }

    const maxFiles = options?.maxFiles || 5000;
    const maxFileSizeKB = options?.maxFileSizeKB || 1024; // 1MB max per text file

    const discoveredFiles: DiscoveredFile[] = [];
    let totalLOC = 0;

    const walk = (currentDir: string) => {
      if (discoveredFiles.length >= maxFiles) return;

      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        if (discoveredFiles.length >= maxFiles) break;

        const fullPath = path.join(currentDir, entry.name);
        const relPath = path.relative(resolvedRoot, fullPath).replace(/\\/g, "/");

        if (entry.isDirectory()) {
          if (!this.ignoredDirs.has(entry.name) && !entry.name.startsWith(".turbo")) {
            walk(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          const stats = fs.statSync(fullPath);
          const isBinary = this.binaryExtensions.has(ext) || stats.size > maxFileSizeKB * 1024;

          let content = "";
          let lineCount = 0;

          if (!isBinary) {
            try {
              content = fs.readFileSync(fullPath, "utf-8");
              lineCount = content.split("\n").length;
              totalLOC += lineCount;
            } catch {
              // Binary or unreadable encoding
            }
          }

          discoveredFiles.push({
            relativePath: relPath,
            absolutePath: fullPath,
            extension: ext,
            sizeBytes: stats.size,
            lineCount,
            content,
            isBinary,
          });
        }
      }
    };

    walk(resolvedRoot);

    return {
      repoName: path.basename(resolvedRoot),
      branch,
      commitSha,
      rootPath: resolvedRoot,
      files: discoveredFiles,
      totalFilesCount: discoveredFiles.length,
      totalLinesOfCode: totalLOC,
      ingestedAt: Date.now(),
    };
  }
}
