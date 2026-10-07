/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Core Domain: Evidence Fabric & Epistemic Truth Types
 *
 * Grounding:
 *   Every single fact, entity, relationship, invariant, contradiction, or claim
 *   in VANTAIR must be backed by concrete, verifiable evidence with provenance.
 */

export enum TruthStatus {
  OBSERVED = "OBSERVED",         // Directly verified via runtime trace, empirical sensor, or AST fact
  DERIVED = "DERIVED",           // Formally derived through deterministic graph algorithms or SMT solver
  INFERRED = "INFERRED",         // Structurally deduced through heuristic static analysis
  HYPOTHESIZED = "HYPOTHESIZED", // Proposed by reasoning models; requires validation before promotion
  UNKNOWN = "UNKNOWN",           // Evidence gap; cannot be determined from available data
  CONTRADICTED = "CONTRADICTED", // Formally conflicted across two or more evidence layers
}

export type EvidenceSourceType =
  | "SOURCE_CODE"
  | "AST_NODE"
  | "API_SCHEMA"
  | "DATABASE_SCHEMA"
  | "TEST_EXECUTION"
  | "RUNTIME_TRACE"
  | "EBPF_SENSOR"
  | "GIT_COMMIT"
  | "DOCUMENTATION"
  | "CONFIGURATION"
  | "FORMAL_PROOF"
  | "SIMULATION_RESULT";

export interface CodeLocation {
  filePath: string;
  startLine: number;
  endLine: number;
  startColumn?: number;
  endColumn?: number;
  symbolName?: string;
  codeSnippet?: string;
}

export interface EvidenceItem {
  id: string;
  sourceType: EvidenceSourceType;
  truthStatus: TruthStatus;
  confidence: number; // [0.0, 1.0]
  title: string;
  description: string;
  location?: CodeLocation;
  rawPayload?: Record<string, unknown>;
  contentHash: string;
  timestamp: number;
  relatedEntityIds: string[];
}

export interface ProvenanceChain {
  claim: string;
  truthStatus: TruthStatus;
  overallConfidence: number;
  primaryEvidence: EvidenceItem[];
  supportingEvidence: EvidenceItem[];
  contradictingEvidence?: EvidenceItem[];
  reasoningSteps: string[];
  unresolvedQuestions: string[];
}
