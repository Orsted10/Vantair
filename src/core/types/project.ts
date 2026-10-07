/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Core Domain: Project, Repository & Analysis Job Types
 */

export type RepositoryProviderType = "LOCAL" | "GITHUB" | "GITLAB" | "BITBUCKET" | "ZIP_UPLOAD";

export type AnalysisStatus =
  | "PENDING"
  | "INITIALIZING"
  | "FINGERPRINTING"
  | "PARSING"
  | "TOPOLOGY_RECONSTRUCTION"
  | "BEHAVIOR_RECONSTRUCTION"
  | "CONTRACT_ANALYSIS"
  | "HISTORY_CHRONOLOGY"
  | "EVIDENCE_COMPILATION"
  | "POLYGRAPH_CHECK"
  | "CONSTITUTION_EVALUATION"
  | "DARK_MATTER_HARVEST"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type AnalysisDepth = "QUICK" | "STANDARD" | "DEEP" | "FORENSIC";

export interface SystemFingerprint {
  primaryLanguages: Array<{ language: string; percentage: number; fileCount: number; lineCount: number }>;
  frameworks: string[];
  packageManagers: string[];
  buildSystems: string[];
  databases: string[];
  queues: string[];
  apiProtocols: string[];
  testFrameworks: string[];
  infrastructure: string[];
  isMonorepo: boolean;
  totalFiles: number;
  totalLinesOfCode: number;
  detectedServicesCount: number;
}

export interface RepositoryConnection {
  provider: RepositoryProviderType;
  urlOrPath: string;
  defaultBranch: string;
  currentBranch: string;
  currentCommitSha: string;
  authConfigured: boolean;
  lastSyncedAt: number;
}

export interface AnalysisProgressEvent {
  jobId: string;
  phase: AnalysisStatus;
  progressPercent: number;
  message: string;
  timestamp: number;
  stats?: Record<string, number>;
}

export interface AnalysisRun {
  id: string;
  projectId: string;
  status: AnalysisStatus;
  depth: AnalysisDepth;
  branch: string;
  commitSha: string;
  startedAt: number;
  completedAt?: number;
  durationMs?: number;
  fingerprint?: SystemFingerprint;
  progressPercent: number;
  currentPhaseMessage: string;
  warnings: string[];
  errors: string[];
  modelSnapshotId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  repository: RepositoryConnection;
  latestAnalysisId?: string;
  latestSnapshotId?: string;
  tags: string[];
}
