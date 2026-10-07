/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Reality IR: System Relationships
 */

import { EpistemicStatus } from "../ledger/evidence_ledger";

export type RelationshipKind =
  | "CALLS"
  | "IMPORTS"
  | "READS_STATE"
  | "WRITES_STATE"
  | "EMITS_EVENT"
  | "SUBSCRIBES_TO"
  | "DEPENDS_ON"
  | "IMPLEMENTS_CONTRACT"
  | "TAINT_FLOWS_TO"
  | "RETRIES_ON_FAILURE"
  | "CASCADES_FAILURE_TO";

export interface SystemRelationship {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  kind: RelationshipKind;
  status: EpistemicStatus;
  evidenceIds: string[];
  attributes: {
    isSynchronous?: boolean;
    networkBoundaryCrossed?: boolean;
    retryCount?: number;
    backoffMs?: number;
    payloadType?: string;
    weight?: number;
    failureImpactWeight?: number;
    isContradictedByRuntime?: boolean;
    explanation?: string;
  };
}
