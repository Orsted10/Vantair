import { NextRequest, NextResponse } from "next/server";
import { ProjectStore } from "@/core/storage/project_store";
import { ModelStore } from "@/core/storage/model_store";

export async function GET(request: NextRequest) {
  try {
    const projectStore = ProjectStore.getInstance();
    const modelStore = ModelStore.getInstance();
    const projects = projectStore.getAllProjects();

    const enrichedProjects = projects.map((p) => {
      const latestSnapshot = modelStore.getLatestSnapshotForProject(p.id);
      const latestAnalysis = p.latestAnalysisId ? projectStore.getAnalysisRun(p.latestAnalysisId) : undefined;
      return {
        ...p,
        latestSnapshotStats: latestSnapshot?.stats,
        latestAnalysis,
      };
    });

    return NextResponse.json({
      status: "SUCCESS",
      projects: enrichedProjects,
      totalCount: enrichedProjects.length,
    });
  } catch (error: any) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ status: "ERROR", message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urlOrPath, description, autoAnalyze = true, tags = [] } = body;

    if (!urlOrPath) {
      return NextResponse.json(
        { status: "ERROR", message: "'urlOrPath' is required (e.g., GitHub URL or local path)." },
        { status: 400 }
      );
    }

    // Auto-detect project name from URL or path
    const trimmedPath = urlOrPath.trim();
    let detectedName = body.name?.trim();
    if (!detectedName) {
      const parts = trimmedPath.replace(/\.git$/i, "").split(/[\/\\]/);
      detectedName = parts[parts.length - 1] || "Analyzed Repository";
      if (detectedName === "" && parts.length > 1) {
        detectedName = parts[parts.length - 2];
      }
    }

    // Auto-detect provider
    let detectedProvider: any = "LOCAL";
    if (trimmedPath.includes("github.com")) {
      detectedProvider = "GITHUB";
    } else if (trimmedPath.includes("gitlab.com")) {
      detectedProvider = "GITLAB";
    } else if (trimmedPath.includes("bitbucket.org")) {
      detectedProvider = "BITBUCKET";
    }

    const projectStore = ProjectStore.getInstance();
    const project = projectStore.createProject(
      detectedName,
      description || `Repository ${detectedName} onboarded into VANTAIR Reality Engine.`,
      trimmedPath,
      detectedProvider,
      tags
    );

    let snapshot = null;
    if (autoAnalyze) {
      const { AnalysisPipelineOrchestrator } = await import("@/pipeline/orchestrator");
      const analysisRun = projectStore.createAnalysisRun(project.id, "STANDARD");
      const orchestrator = new AnalysisPipelineOrchestrator();
      snapshot = await orchestrator.executeAnalysis(project.id, analysisRun.id);
    }

    return NextResponse.json({
      status: "SUCCESS",
      project,
      snapshot,
    });
  } catch (error: any) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ status: "ERROR", message: error.message }, { status: 500 });
  }
}
