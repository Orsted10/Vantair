import { NextRequest, NextResponse } from "next/server";
import { UltraFastGroqReasoner } from "@/engine/sse_groq_loop";
import { ProjectStore } from "@/core/storage/project_store";
import { ModelStore } from "@/core/storage/model_store";
import * as fs from "fs";
import * as path from "path";
import {
  getRepoCacheDir,
  getAllPossibleRepoDirs,
  isDemoRepoPath,
  ensureDemoRepoOnDisk,
  getDemoFile,
} from "@/core/utils/repo_cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const query = body.query || "Analyze system architecture and posture";
    const incidentContext = body.incidentContext || {};

    const projectStore = ProjectStore.getInstance();
    const modelStore = ModelStore.getInstance();

    // Identify target project
    const projectId = body.projectId || incidentContext.projectId || projectStore.getAllProjects()[0]?.id;
    const project = projectId ? projectStore.getProject(projectId) : undefined;
    const snapshot = projectId ? modelStore.getLatestSnapshotForProject(projectId) : undefined;

    const rawPath = (project?.repository?.urlOrPath || "").trim();
    const isDemo = isDemoRepoPath(rawPath) || isDemoRepoPath(project?.name || "");

    let codeExcerpts = "";

    if (isDemo) {
      // Seeded Banking Microservices excerpts
      const demoCandidateFiles = [
        "services/RefundOrchestrator.ts",
        "services/PaymentGateway.ts",
        "services/OrderService.ts",
        "services/PostgresDB.ts",
        "services/RedisCache.ts",
        "docs/ADR-042-refunds.md",
      ];

      for (const relFile of demoCandidateFiles) {
        const embedded = getDemoFile(relFile);
        if (embedded) {
          const lines = embedded.content.split("\n").slice(0, 50).join("\n");
          codeExcerpts += `\n--- File: ${relFile} ---\n${lines}\n`;
        }
      }
    } else {
      // Locate repository base directory on disk for arbitrary projects
      let repoBase = "";
      const safeRepoName = rawPath.replace(/https?:\/\/github\.com\//i, "").replace(/[^a-zA-Z0-9_.-]/g, "_").replace(/\.git$/, "");
      const candidates = getAllPossibleRepoDirs(safeRepoName);

      if (fs.existsSync(rawPath)) {
        candidates.unshift(rawPath);
      }
      const cwdDirect = path.resolve(process.cwd(), rawPath);
      if (fs.existsSync(cwdDirect)) {
        candidates.unshift(cwdDirect);
      }

      for (const cand of candidates) {
        if (fs.existsSync(cand) && fs.statSync(cand).isDirectory()) {
          repoBase = cand;
          break;
        }
      }

      if (repoBase && fs.existsSync(repoBase)) {
        const candidateFiles: string[] = [];

        // 1. Gather file paths from snapshot entities
        if (snapshot?.entities) {
          for (const ent of snapshot.entities) {
            if (ent.filePath && !candidateFiles.includes(ent.filePath)) {
              candidateFiles.push(ent.filePath);
              if (candidateFiles.length >= 8) break;
            }
          }
        }

        // 2. Discover key files on disk if list is still small
        if (candidateFiles.length < 5) {
          try {
            const walkDisk = (dir: string, depth: number = 0) => {
              if (depth > 2 || candidateFiles.length >= 12) return;
              const entries = fs.readdirSync(dir, { withFileTypes: true });
              for (const e of entries) {
                if (e.name.startsWith(".") || e.name === "node_modules" || e.name === "dist" || e.name === "build") continue;
                const full = path.join(dir, e.name);
                const rel = path.relative(repoBase, full).replace(/\\/g, "/");
                if (e.isDirectory()) {
                  walkDisk(full, depth + 1);
                } else if (e.isFile() && /\.(ts|js|tsx|jsx|py|go|rs|json)$/i.test(e.name)) {
                  if (!candidateFiles.includes(rel)) {
                    candidateFiles.push(rel);
                  }
                }
              }
            };
            walkDisk(repoBase);
          } catch {}
        }

        // 3. Read actual lines of code from discovered files
        for (const relFile of candidateFiles) {
          const full = path.join(repoBase, relFile);
          if (fs.existsSync(full) && fs.statSync(full).isFile()) {
            try {
              const lines = fs.readFileSync(full, "utf-8").split("\n").slice(0, 55).join("\n");
              codeExcerpts += `\n--- File: ${relFile} ---\n${lines}\n`;
              if (codeExcerpts.length > 8000) break;
            } catch {}
          }
        }
      }
    }

    // Assemble rich ground-truth context
    const enrichedContext = {
      projectId: project?.id || projectId,
      projectName: project?.name || incidentContext.repoName || (isDemo ? "CampusBuddy Banking" : "Vantair Reality Engine"),
      description: project?.description || "High-performance software reality substrate",
      repoPath: project?.repository?.urlOrPath || "local",
      languages: snapshot?.metadata?.languages || (isDemo ? { TypeScript: "85.4%", Markdown: "10.2%", JSON: "4.4%" } : { TypeScript: "77.7%", Rust: "14.2%" }),
      totalFiles: snapshot?.metadata?.totalFiles || snapshot?.entities?.length || (isDemo ? 7 : 109),
      totalLines: snapshot?.metadata?.totalLinesOfCode || (snapshot?.stats as any)?.linesOfCode || (isDemo ? 219 : 24726),
      dependencies: snapshot?.metadata?.dependencies || [],
      contracts: (snapshot?.contracts && snapshot.contracts.length > 0)
        ? snapshot.contracts.map((c: any) => ({
            endpoint: c.endpointOrMethod || c.title,
            specLocation: c.specLocation,
            invariants: c.invariants,
          }))
        : isDemo
        ? [
            { endpoint: "RefundOrchestrator.executeRefund", specLocation: "services/RefundOrchestrator.ts", invariants: ["LTL Law 01: G (refund_amount <= total_order_paid)", "LTL Law 02: G (timeout -> Next(idempotent_retry))"] },
            { endpoint: "PaymentGateway.requestGatewayRefund", specLocation: "services/PaymentGateway.ts" },
            { endpoint: "OrderService.processOrderRefund", specLocation: "services/OrderService.ts" },
          ]
        : [
            { endpoint: "POST /api/ai/quest", specLocation: "src/app/api/ai/quest/route.ts" },
            { endpoint: "POST /api/ai/generate", specLocation: "src/app/api/ai/generate/route.ts" },
            { endpoint: "POST /api/verify", specLocation: "src/app/api/verify/route.ts" },
          ],
      entities: (snapshot?.entities || []).slice(0, 30).map((e: any) => ({
        name: e.name,
        kind: e.kind,
        filePath: e.filePath,
      })),
      invariants: (snapshot?.invariants || []).map((i: any) => i.statement),
      contradictions: (snapshot?.contradictions || []).map((c: any) => c.title),
      unknowns: (snapshot?.unknowns || []).map((u: any) => u.title),
      codeExcerpts: codeExcerpts.trim(),
      queryCategory: body.category || incidentContext.queryCategory || "EXPLAIN",
      ...incidentContext,
    };

    const reasoner = new UltraFastGroqReasoner();
    const hypothesis = await reasoner.executeReasoning({
      query,
      incidentContext: enrichedContext,
    });

    return NextResponse.json({
      status: "SUCCESS",
      hypothesis,
    });
  } catch (error: any) {
    console.error("API /api/reason error:", error);
    return NextResponse.json({ status: "ERROR", message: error.message }, { status: 500 });
  }
}
