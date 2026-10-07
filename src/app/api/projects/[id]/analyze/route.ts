import { NextRequest, NextResponse } from "next/server";
import { ProjectStore } from "@/core/storage/project_store";
import { AnalysisPipelineOrchestrator } from "@/pipeline/orchestrator";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json().catch(() => ({}));
    const { depth = "STANDARD" } = body;

    const projectStore = ProjectStore.getInstance();
    const project = projectStore.getProject(projectId);
    if (!project) {
      return NextResponse.json(
        { status: "ERROR", message: `Project not found: ${projectId}` },
        { status: 404 }
      );
    }

    // Create analysis run record
    const analysisRun = projectStore.createAnalysisRun(projectId, depth);
    const orchestrator = new AnalysisPipelineOrchestrator();

    // Start execution in background (or await if synchronous query requested)
    const synchronous = body.synchronous === true;

    if (synchronous) {
      const snapshot = await orchestrator.executeAnalysis(projectId, analysisRun.id);
      return NextResponse.json({
        status: "SUCCESS",
        analysisRun: projectStore.getAnalysisRun(analysisRun.id),
        snapshot,
      });
    } else {
      // Async trigger
      orchestrator
        .executeAnalysis(projectId, analysisRun.id)
        .catch((err) => {
          console.error(`Analysis run ${analysisRun.id} failed:`, err);
          projectStore.updateAnalysisProgress(
            analysisRun.id,
            "FAILED",
            100,
            `Analysis failed: ${err.message}`
          );
        });

      return NextResponse.json({
        status: "PENDING",
        analysisRun,
        message: "Analysis pipeline initiated.",
      });
    }
  } catch (error: any) {
    console.error("POST /api/projects/[id]/analyze error:", error);
    return NextResponse.json({ status: "ERROR", message: error.message }, { status: 500 });
  }
}
