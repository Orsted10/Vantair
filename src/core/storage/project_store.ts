/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Core Storage: In-Memory / Persistent Project & Analysis Store
 */

import { Project, AnalysisRun, AnalysisStatus, SystemFingerprint } from "../types/project";

const globalForProjectStore = globalThis as unknown as {
  vantairProjectStore?: ProjectStore;
};

export class ProjectStore {
  private projects: Map<string, Project> = new Map();
  private analyses: Map<string, AnalysisRun> = new Map();

  private constructor() {
    // Initialize with a default seed project for immediate testing/exploration
    this.seedDefaultProject();
  }

  public static getInstance(): ProjectStore {
    if (!globalForProjectStore.vantairProjectStore) {
      globalForProjectStore.vantairProjectStore = new ProjectStore();
    }
    return globalForProjectStore.vantairProjectStore;
  }

  public createProject(
    name: string,
    description: string,
    urlOrPath: string,
    provider: "LOCAL" | "GITHUB" | "ZIP_UPLOAD" = "LOCAL",
    tags: string[] = []
  ): Project {
    const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const project: Project = {
      id,
      name,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      repository: {
        provider,
        urlOrPath,
        defaultBranch: "main",
        currentBranch: "main",
        currentCommitSha: "HEAD",
        authConfigured: false,
        lastSyncedAt: Date.now(),
      },
      tags,
    };
    this.projects.set(id, project);
    return project;
  }

  public getProject(id: string): Project | undefined {
    return this.projects.get(id);
  }

  public getAllProjects(): Project[] {
    return Array.from(this.projects.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  public createAnalysisRun(projectId: string, depth: "QUICK" | "STANDARD" | "DEEP" | "FORENSIC" = "STANDARD"): AnalysisRun {
    const project = this.getProject(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);

    const id = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const run: AnalysisRun = {
      id,
      projectId,
      status: "PENDING",
      depth,
      branch: project.repository.currentBranch,
      commitSha: project.repository.currentCommitSha,
      startedAt: Date.now(),
      progressPercent: 0,
      currentPhaseMessage: "Queued for analysis...",
      warnings: [],
      errors: [],
    };
    this.analyses.set(id, run);
    project.latestAnalysisId = id;
    project.updatedAt = Date.now();
    return run;
  }

  public getAnalysisRun(id: string): AnalysisRun | undefined {
    return this.analyses.get(id);
  }

  public updateAnalysisProgress(
    id: string,
    status: AnalysisStatus,
    progressPercent: number,
    message: string,
    fingerprint?: SystemFingerprint
  ): AnalysisRun {
    const run = this.analyses.get(id);
    if (!run) throw new Error(`Analysis run not found: ${id}`);

    run.status = status;
    run.progressPercent = progressPercent;
    run.currentPhaseMessage = message;
    if (fingerprint) {
      run.fingerprint = fingerprint;
    }
    if (status === "COMPLETED" || status === "FAILED") {
      run.completedAt = Date.now();
      run.durationMs = run.completedAt - run.startedAt;
    }
    return run;
  }

  private seedDefaultProject(): void {
    const defaultProj: Project = {
      id: "proj_default_campusbuddy",
      name: "CampusBuddy Banking & Microservices",
      description: "Distributed banking microservices handling order orchestration, refund workflows, and payment captures.",
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
      updatedAt: Date.now(),
      repository: {
        provider: "LOCAL",
        urlOrPath: "src/demo_repo",
        defaultBranch: "main",
        currentBranch: "main",
        currentCommitSha: "a9f83c1",
        authConfigured: true,
        lastSyncedAt: Date.now(),
      },
      tags: ["Banking", "TypeScript", "PostgreSQL", "Microservices"],
    };
    this.projects.set(defaultProj.id, defaultProj);
  }
}
