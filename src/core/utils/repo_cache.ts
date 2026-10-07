/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Resilient Repository Cache & Filesystem Abstraction
 *
 * Handles serverless execution environments (e.g. Vercel, AWS Lambda)
 * where /var/task is strictly read-only and writes must route to os.tmpdir().
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { EMBEDDED_DEMO_FILES, EmbeddedFile } from "../../engine/embedded_demo_repo";

let cachedWritableDir: string | null = null;

/**
 * Returns a guaranteed writable directory for caching repository clones,
 * dynamically testing local workspace permissions and falling back to os.tmpdir().
 */
export function getRepoCacheDir(): string {
  if (cachedWritableDir && fs.existsSync(cachedWritableDir)) {
    return cachedWritableDir;
  }

  // 1. Try local workspace .temp_repos directory (ideal for local dev)
  try {
    const localDir = path.resolve(process.cwd(), ".temp_repos");
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    // Verify write permission
    const testFile = path.join(localDir, `.write_check_${Date.now()}`);
    fs.writeFileSync(testFile, "vantair_ok");
    fs.unlinkSync(testFile);
    cachedWritableDir = localDir;
    return localDir;
  } catch {
    // 2. Read-only filesystem detected (Vercel / AWS Lambda /var/task)
    // Fall back to os.tmpdir() (/tmp on Linux)
    const tmpBase = path.join(os.tmpdir(), "vantair_repos");
    try {
      if (!fs.existsSync(tmpBase)) {
        fs.mkdirSync(tmpBase, { recursive: true });
      }
      cachedWritableDir = tmpBase;
      return tmpBase;
    } catch {
      // Emergency fallback to root tempdir
      cachedWritableDir = os.tmpdir();
      return os.tmpdir();
    }
  }
}

/**
 * Returns candidate directory paths where a repository or clone might reside.
 */
export function getAllPossibleRepoDirs(subDir?: string): string[] {
  const candidates: string[] = [];

  if (subDir) {
    // Direct path relative to cwd
    candidates.push(path.resolve(process.cwd(), subDir));
    // Subdirectory in .temp_repos
    candidates.push(path.resolve(process.cwd(), ".temp_repos", subDir));
    // Subdirectory in os.tmpdir
    candidates.push(path.join(os.tmpdir(), "vantair_repos", subDir));
    candidates.push(path.join(os.tmpdir(), subDir));
  }

  // Base roots
  candidates.push(path.resolve(process.cwd(), ".temp_repos"));
  candidates.push(path.join(os.tmpdir(), "vantair_repos"));
  candidates.push(process.cwd());

  return Array.from(new Set(candidates));
}

/**
 * Identifies whether a path or project identifier refers to the bundled CampusBuddy Banking repo.
 */
export function isDemoRepoPath(targetPath: string): boolean {
  const norm = (targetPath || "").trim().toLowerCase();
  return (
    norm === "src/demo_repo" ||
    norm === "demo_repo" ||
    norm === "./src/demo_repo" ||
    norm === "campusbuddy" ||
    norm.includes("campusbuddy") ||
    norm.includes("banking") ||
    norm.endsWith("demo_repo")
  );
}

/**
 * Ensures the demo repository files exist on disk for tools that inspect physical paths.
 * Returns the resolved disk path.
 */
export function ensureDemoRepoOnDisk(): string {
  // Check if original src/demo_repo exists on disk
  const localSrcDemo = path.resolve(process.cwd(), "src/demo_repo");
  if (fs.existsSync(localSrcDemo) && fs.existsSync(path.join(localSrcDemo, "services"))) {
    return localSrcDemo;
  }

  // Otherwise, write embedded demo files to writable cache directory
  const cacheBase = getRepoCacheDir();
  const demoDir = path.join(cacheBase, "demo_repo");

  try {
    for (const file of EMBEDDED_DEMO_FILES) {
      const fullPath = path.join(demoDir, file.relativePath);
      const dirName = path.dirname(fullPath);
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, file.content, "utf-8");
      }
    }
  } catch (err) {
    console.warn("[Vantair Cache] Could not write demo files to disk, will use in-memory fallback:", err);
  }

  return demoDir;
}

/**
 * Retrieves demo file content directly from in-memory embedded storage.
 */
export function getDemoFile(relativePath: string): EmbeddedFile | undefined {
  const norm = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  return EMBEDDED_DEMO_FILES.find((f) => f.relativePath === norm || f.relativePath.endsWith(norm));
}

/**
 * Generates file tree items for demo repo directly from in-memory definitions.
 */
export function getDemoFileTree(): Array<{ path: string; name: string; isDir: boolean; size: number; lineCount: number }> {
  return EMBEDDED_DEMO_FILES.map((f) => {
    const lines = f.content.split("\n").length;
    return {
      path: f.relativePath,
      name: path.basename(f.relativePath),
      isDir: false,
      size: Buffer.byteLength(f.content, "utf-8"),
      lineCount: lines,
    };
  });
}
