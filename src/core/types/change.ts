/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Core Domain: Change Compiler & Verification Gate Types
 */

export interface UnifiedDiffFile {
  filePath: string;
  diff: string;
  addedLinesCount: number;
  removedLinesCount: number;
}

export interface VerificationCheck {
  id: string;
  title: string;
  category: "BUILD" | "UNIT_TESTS" | "CONTRACT_INTEGRITY" | "INVARIANT_PROOF" | "SECURITY" | "REGRESSION";
  passed: boolean;
  message: string;
  durationMs: number;
  evidenceIds: string[];
}

export interface ChangeProposal {
  id: string;
  projectId: string;
  simulationId?: string;
  title: string;
  intentDescription: string;
  affectedFiles: string[];
  affectedServiceIds: string[];
  unifiedDiffs: UnifiedDiffFile[];
  synthesizedCodeFiles: Array<{ filePath: string; content: string; purpose: string }>;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED" | "REQUIRES_REVIEW";
  verificationChecks: VerificationCheck[];
  unresolvedUnknownDelta: number;
  branchName: string;
  createdAt: number;
  appliedAt?: number;
}
