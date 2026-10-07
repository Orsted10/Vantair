/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Reality IR: Workflows & End-to-End Execution Journeys
 */

import { EpistemicStatus } from "../ledger/evidence_ledger";

export interface WorkflowStep {
  stepIndex: number;
  entityId: string;
  action: string;
  isAsync: boolean;
  canFail: boolean;
  retryPolicy?: {
    maxRetries: number;
    backoffMs: number;
  };
  compensationAction?: string; // e.g. Saga rollback
  evidenceIds: string[];
}

export interface SystemWorkflow {
  id: string;
  name: string;
  entryPointEntityId: string;
  status: EpistemicStatus;
  steps: WorkflowStep[];
  transactionalBoundary: "LOCAL" | "DISTRIBUTED_SAGA" | "NONE";
  isIdempotent: boolean;
  knownFailurePoints: Array<{
    stepIndex: number;
    failureReason: string;
    consequence: string;
  }>;
  evidenceIds: string[];
}
