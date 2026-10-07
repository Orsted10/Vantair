/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Phase 23: Canonical Reality Intermediate Representation (Reality IR)
 *
 * The unified intermediate representation representing software's observable reality.
 * Replaces disparate, ad-hoc engine outputs with a single canonical substrate.
 *
 * SEARCH, TRACE, WHY, SIMULATE, COMPARE, CHANGE, VERIFY all operate over this IR.
 */

import { SnapshotRef } from "../snapshot/snapshot_protocol";
import { SystemEntity } from "./entity";
import { SystemRelationship } from "./relationship";
import { SystemContract } from "./contract";
import { SystemWorkflow } from "./workflow";
import { SystemStateMachine } from "./state";
import { SystemDataFlow } from "./dataflow";
import { ProvenanceGraph } from "./provenance";
import { EpistemicStatus, SourceLocation } from "../ledger/evidence_ledger";

export interface CandidateInvariant {
  id: string;
  name: string;
  naturalLanguageIntent: string;
  formalExpression?: string; // LTL or SMT-LIB2 formula
  scope: "GLOBAL" | "SERVICE" | "WORKFLOW" | "FUNCTION";
  targetEntityIds: string[];
  status: "PROPOSED" | "ACCEPTED_POLICY" | "REJECTED" | "CONTRADICTED";
  evidenceIds: string[];
  counterexampleIds: string[];
  lastCheckedCommit: string;
}

export interface InvariantCounterexample {
  id: string;
  invariantId: string;
  trace: Array<{
    step: number;
    entityId: string;
    state: Record<string, any>;
    action: string;
  }>;
  violationReason: string;
  discoveryMethod: "STATIC_PATH_SEARCH" | "SYMBOLIC_EXECUTION" | "RUNTIME_OBSERVATION" | "SIMULATION";
  reproductionCommand?: string;
  evidenceIds: string[];
}

export interface SystemContradiction {
  id: string;
  title: string;
  category: "SPEC_VS_CODE" | "CODE_VS_RUNTIME" | "SPEC_VS_RUNTIME" | "INVARIANT_BREACH" | "DOC_VS_IMPL";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "ACTIVE_CONTRADICTION" | "RESOLVED" | "ACCEPTED_EXCEPTION";
  involvedEntities: string[];
  divergenceDetails: {
    declaredOrExpected: string;
    actualDemonstrated: string;
    gapExplanation: string;
  };
  evidenceIds: string[];
  discoveredAtCommit: string;
}

export type UnknownReason =
  | "MISSING_TEST"
  | "MISSING_RUNTIME"
  | "UNRESOLVED_DYNAMIC_BEHAVIOR"
  | "MISSING_CONFIGURATION"
  | "EXTERNAL_DEPENDENCY"
  | "UNSUPPORTED_LANGUAGE"
  | "INSUFFICIENT_TELEMETRY"
  | "STATE_EXPLOSION"
  | "TIMEOUT"
  | "MODEL_LIMITATION";

export interface SystemUnknown {
  id: string;
  title: string;
  reason: UnknownReason;
  targetEntityId?: string;
  sourceLocation?: SourceLocation;
  impactAssessment: "CRITICAL_PATH" | "EDGE_CASE" | "BACKGROUND_JOB" | "AUXILIARY";
  recommendedExperiment: {
    description: string;
    actionType: "WRITE_UNIT_TEST" | "DEPLOY_OTEL_PROBE" | "EXECUTE_SMOKE_RUN" | "ADD_TYPE_ANNOTATION";
    estimatedCost: "LOW" | "MEDIUM" | "HIGH";
    estimatedUncertaintyReduction: number; // [0, 1]
  };
  evidenceIds: string[];
}

export interface CausalHypothesis {
  id: string;
  treatmentVariable: string;
  outcomeVariable: string;
  hypothesisStatement: string;
  structuralEquations: string[];
  assumptions: string[];
  confoundersIdentified: string[];
  experimentalEvidenceLevel:
    | "CORRELATED"
    | "TEMPORAL_ASSOCIATION"
    | "DEPENDENT"
    | "MECHANISTIC"
    | "REPRODUCED_IN_SANDBOX"
    | "INTERVENTION_SUPPORTED";
  isSimulatedOnly: boolean;
  simulationResultSummary?: string;
  evidenceIds: string[];
}

export interface SystemIntervention {
  id: string;
  targetEntityId: string;
  interventionType:
    | "REMOVE_SERVICE"
    | "INJECT_LATENCY"
    | "DROP_DATABASE_CONNECTION"
    | "MUTATE_ENVIRONMENT_VARIABLE"
    | "DISABLE_CACHE";
  parameters: Record<string, any>;
  observedConsequence?: string;
  evidenceIds: string[];
}

export interface VerificationArtifact {
  id: string;
  name: string;
  type: "TEST_SUITE_RESULT" | "SMT_PROOF_CERTIFICATE" | "DIFF_PATCH" | "RUNTIME_TRACE" | "BENCHMARK_RUN";
  sha256: string;
  sizeBytes: number;
  environmentFingerprint: string;
  createdAt: string;
  reproducible: boolean;
}

export interface RuntimeObservation {
  id: string;
  traceId?: string;
  spanId?: string;
  serviceName: string;
  endpoint?: string;
  observedLatencyMs: number;
  statusCode?: number;
  timestamp: string;
  environment: "PRODUCTION" | "STAGING" | "SANDBOX_SIMULATION";
  correlatedEntityId?: string;
  evidenceId: string;
}

export interface RealityIR {
  schemaVersion: "3.0.0";
  engineVersion: string;
  revision: string;
  createdAt: string;
  sourceSnapshot: SnapshotRef;
  entities: SystemEntity[];
  relationships: SystemRelationship[];
  contracts: SystemContract[];
  workflows: SystemWorkflow[];
  stateMachines: SystemStateMachine[];
  dataFlows: SystemDataFlow[];
  runtimeObservations: RuntimeObservation[];
  invariants: CandidateInvariant[];
  counterexamples: InvariantCounterexample[];
  contradictions: SystemContradiction[];
  unknowns: SystemUnknown[];
  causalHypotheses: CausalHypothesis[];
  interventions: SystemIntervention[];
  verificationArtifacts: VerificationArtifact[];
  provenance: ProvenanceGraph;
  statistics: {
    totalEntities: number;
    totalRelationships: number;
    totalContracts: number;
    totalInvariants: number;
    totalContradictions: number;
    totalUnknowns: number;
    epistemicCounts: Record<EpistemicStatus, number>;
  };
}
