/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Core Domain: Versioned System Model Schema
 */

import { TruthStatus, EvidenceItem } from "./evidence";

export type EntityKind =
  | "SERVICE"
  | "PACKAGE"
  | "MODULE"
  | "CLASS"
  | "FUNCTION"
  | "API_ENDPOINT"
  | "DATABASE"
  | "TABLE"
  | "QUEUE_TOPIC"
  | "EXTERNAL_API"
  | "CONFIGURATION";

export type RelationshipKind =
  | "IMPORTS"
  | "CALLS"
  | "READS_FROM"
  | "WRITES_TO"
  | "EMITS_EVENT"
  | "CONSUMES_EVENT"
  | "DEPENDS_ON"
  | "EXPOSES_CONTRACT"
  | "IMPLEMENTS_INTERFACE"
  | "TRANSACTION_BOUND";

export interface SystemEntity {
  id: string;
  name: string;
  kind: EntityKind;
  filePath?: string;
  location?: { startLine: number; endLine: number };
  truthStatus: TruthStatus;
  confidence: number;
  description: string;
  tags: string[];
  metrics?: Record<string, number>;
  evidenceIds: string[];
}

export interface SystemRelationship {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  kind: RelationshipKind;
  truthStatus: TruthStatus;
  confidence: number;
  protocol?: string; // e.g., "HTTP_REST", "GRPC", "POSTGRES_SQL", "KAFKA"
  description?: string;
  evidenceIds: string[];
}

export interface ContractDefinition {
  id: string;
  title: string;
  protocol: "REST" | "GRAPHQL" | "GRPC" | "KAFKA" | "SQL_DDL" | "ASYNC_API";
  specLocation?: string;
  endpointOrMethod: string;
  requestSchema?: Record<string, unknown>;
  responseSchema?: Record<string, unknown>;
  declaredInDocs: boolean;
  implementedInCode: boolean;
  exercisedInTests: boolean;
  observedInRuntime: boolean;
  driftDetected: boolean;
  driftDescription?: string;
  evidenceIds: string[];
}

export interface WorkflowTransition {
  fromState: string;
  toState: string;
  triggerEvent: string;
  condition?: string;
  isHappyPath: boolean;
  isFailurePath: boolean;
  isRetry: boolean;
  evidenceIds: string[];
}

export interface SystemWorkflow {
  id: string;
  name: string;
  entrypointEntityId: string;
  states: string[];
  transitions: WorkflowTransition[];
  involvedEntityIds: string[];
  isIdempotent: boolean;
  riskRating: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  evidenceIds: string[];
}

export interface DiscoveredInvariant {
  id: string;
  statement: string;
  category: "SECURITY" | "DATA_INTEGRITY" | "TRANSACTION" | "AVAILABILITY" | "PERFORMANCE";
  formalFormula?: string;
  truthStatus: TruthStatus;
  confidence: number;
  isUserAccepted: boolean;
  counterexampleWitness?: string;
  evidenceIds: string[];
}

export interface SystemUnknown {
  id: string;
  title: string;
  category: "UNREACHABLE" | "UNTESTED" | "UNOBSERVED_RUNTIME" | "MISSING_CONFIG" | "AMBIGUOUS_SPEC";
  location?: string;
  reason: string;
  potentialRisk: string;
  suggestedAction: string;
  relatedEntityIds: string[];
}

export interface SystemContradiction {
  id: string;
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  sourceA: { type: string; claim: string; location?: string };
  sourceB: { type: string; claim: string; location?: string };
  impactSummary: string;
  firstObservedCommit?: string;
  culpabilityScore: number;
  evidenceIds: string[];
}

export interface SystemModelSnapshot {
  id: string;
  projectId: string;
  analysisId: string;
  version: number;
  createdAt: number;
  commitSha: string;
  branch: string;
  entities: SystemEntity[];
  relationships: SystemRelationship[];
  contracts: ContractDefinition[];
  workflows: SystemWorkflow[];
  invariants: DiscoveredInvariant[];
  unknowns: SystemUnknown[];
  contradictions: SystemContradiction[];
  evidenceMap: Record<string, EvidenceItem>;
  stats: {
    totalEntities: number;
    totalRelationships: number;
    understandingScorePercent: number; // Defensible metric based on verified evidence
    runtimeAvailable: boolean;
    criticalRisksCount: number;
  };
  fingerprint?: any;
  metadata?: {
    totalFiles: number;
    totalLinesOfCode: number;
    totalSizeBytes: number;
    languages: Array<{ language: string; percentage: number; fileCount: number; lineCount: number }>;
    dependencies: Array<{ name: string; version: string; isDev: boolean; license?: string }>;
    stars?: string;
    forks?: string;
    architectureSummary?: string;
    recommendations?: Array<{
      title: string;
      priority: "HIGH" | "CRITICAL" | "MEDIUM";
      targetFile?: string;
      explanation: string;
      proposedFix?: string;
    }>;
    hardware?: string;
  };
}
