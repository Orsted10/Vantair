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
        const candidateFiles = [
          "src/lib/groq.ts",
          "src/app/api/ai/quest/route.ts",
          "src/app/api/ai/generate/route.ts",
          "src/app/api/verify/route.ts",
          "src/app/page.tsx",
          "package.json",
        ];

        for (const relFile of candidateFiles) {
          const full = path.join(repoBase, relFile);
          if (fs.existsSync(full) && fs.statSync(full).isFile()) {
            try {
              const lines = fs.readFileSync(full, "utf-8").split("\n").slice(0, 45).join("\n");
              codeExcerpts += `\n--- File: ${relFile} ---\n${lines}\n`;
              if (codeExcerpts.length > 3000) break;
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
