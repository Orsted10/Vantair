import { NextRequest, NextResponse } from "next/server";
import { ProjectStore } from "@/core/storage/project_store";
import { ModelStore } from "@/core/storage/model_store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectStore = ProjectStore.getInstance();
    const modelStore = ModelStore.getInstance();

    const project = projectStore.getProject(id);
    if (!project) {
      return NextResponse.json(
        { status: "ERROR", message: `Project not found: ${id}` },
        { status: 404 }
      );
    }

    const latestAnalysis = project.latestAnalysisId
      ? projectStore.getAnalysisRun(project.latestAnalysisId)
      : undefined;

    const latestSnapshot = modelStore.getLatestSnapshotForProject(id);

    return NextResponse.json({
      status: "SUCCESS",
      project,
      latestAnalysis,
      snapshot: latestSnapshot,
    });
  } catch (error: any) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json({ status: "ERROR", message: error.message }, { status: 500 });
  }
}
