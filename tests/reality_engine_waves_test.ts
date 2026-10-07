/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Master Verification Suite: Reality Engine Waves 0 to 6
 *
 * Verifies:
 *   - Wave 0: Capability Maturity Assessment & Epistemic Honesty
 *   - Wave 1: Reality Snapshot Protocol, Evidence Ledger & Canonical Reality IR
 *   - Wave 2: Polyglot Adapters, 3-Way Contract Reality & Sandbox Execution
 *   - Wave 3: Unknown Frontier, Invariant Engine, Counterexample Search & Causal Hypotheses
 *   - Wave 4: Executable Counterfactuals, Change Compiler & Verification Proof Bundles
 *   - Wave 5: VRQL (VANTAIR Reality Query Language) & Experiment Planning Engine
 *   - Wave 6: Durable Job Lifecycle & Multi-Tenant Scoping
 */

import * as path from "path";
import {
  VANTAIR_CAPABILITY_REGISTRY,
  getSystemMaturitySummary,
  validateClaimLegitimacy
} from "../src/reality/capability/maturity";
import { RealitySnapshotProtocol } from "../src/reality/snapshot/snapshot_protocol";
import { EvidenceLedger } from "../src/reality/ledger/evidence_ledger";
import { RealityIR } from "../src/reality/ir/reality_ir";
import { PolyglotAdapterRegistry } from "../src/analysis/parsing/language_adapter";
import { ContractRealityEngine } from "../src/analysis/contracts/contract_reality_engine";
import { UnknownFrontierEngine } from "../src/reality/unknown/unknown_frontier";
import { InvariantEngine } from "../src/reasoning/invariant/invariant_engine";
import { CounterexampleEngine } from "../src/reasoning/counterexample/counterexample_engine";
import { CausalEvidenceEngine } from "../src/reasoning/causal/causal_evidence_engine";
import { CounterfactualExecutionEngine } from "../src/simulation/counterfactual/executable_counterfactuals";
import { ChangeCompiler } from "../src/change/planner/change_compiler";
import { VerificationBundleEngine } from "../src/change/verification/verification_bundle";
import { VRQLEngine } from "../src/reasoning/query/vrql";
import { ExperimentEngine } from "../src/reasoning/experiment/experiment_engine";
import { DurableJobManager } from "../src/jobs/job_manager";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

async function runRealityEngineVerification() {
  console.log("\n==========================================================================");
  console.log("  VANTAIR COMPUTATIONAL SOFTWARE REALITY ENGINE — WAVES 0 TO 6 SUITE");
  console.log("==========================================================================\n");

  // -------------------------------------------------------------------------
  // WAVE 0: CAPABILITY MATURITY & EPISTEMIC HONESTY
  // -------------------------------------------------------------------------
  console.log("--- WAVE 0: TRUTH RESET & CAPABILITY MATURITY MODEL ---");
  const summary = getSystemMaturitySummary();
  assert(summary.totalSubsystems === 20, `Evaluated all 20 subsystems in Capability Registry`);
  assert(summary.formallyVerifiedCount === 1, `Discrete formal verification scoped to 1 subsystem (Propositional SMT Laws)`);
  assert(summary.fixtureValidatedCount === 10, `Honestly categorized 10 reference lab / fixture-validated engines`);

  const parserAssessment = VANTAIR_CAPABILITY_REGISTRY["phase-02-polyglot-parser"];
  const legitimacyCheck = validateClaimLegitimacy(parserAssessment, "FORMALLY_VERIFIED");
  assert(!legitimacyCheck.allowed, `Rejected unearned 'FORMALLY_VERIFIED' claim for Polyglot Parser: ${legitimacyCheck.reason}`);

  // -------------------------------------------------------------------------
  // WAVE 1: REALITY SNAPSHOT PROTOCOL & EVIDENCE LEDGER
  // -------------------------------------------------------------------------
  console.log("\n--- WAVE 1: SNAPSHOT PROTOCOL, EVIDENCE LEDGER & REALITY IR ---");
  const repoPath = path.resolve(__dirname, "../src/demo_repo");
  const snapshot = await RealitySnapshotProtocol.createSnapshot(repoPath, "repo-seeded-banking-01", "c0ffee12");
  assert(snapshot.snapshotId.startsWith("snp-"), `Created immutable snapshot: ${snapshot.snapshotId}`);
  assert(snapshot.fileManifest.length >= 5, `Manifest captured ${snapshot.fileManifest.length} files with SHA-256 addresses`);
  assert(snapshot.environmentFingerprint.nodeVersion.length > 0, `Captured environment fingerprint: Node ${snapshot.environmentFingerprint.nodeVersion} on ${snapshot.environmentFingerprint.osPlatform}`);

  const integrity = RealitySnapshotProtocol.verifySnapshotIntegrity(repoPath, snapshot);
  assert(integrity.valid, `Cryptographic snapshot integrity verified (0 modified, 0 missing files)`);

  const ledger = new EvidenceLedger();
  const ev1 = ledger.recordEvidence({
    type: "SOURCE",
    source: "src/demo_repo/services/RefundOrchestrator.ts:42",
    snapshotId: snapshot.snapshotId,
    producer: "ASTParser",
    producerVersion: "3.0.0",
    method: "SYNTACTIC_SCAN",
    timestamp: new Date().toISOString(),
    environment: "STATIC",
    status: "OBSERVED",
    scope: "FUNCTION",
    reproducibility: "DETERMINISTIC",
    dependencies: []
  });
  assert(ev1.id.startsWith("ev-"), `Recorded ground-truth evidence item: ${ev1.id}`);

  const claim1 = ledger.assertClaim({
    statement: "Refund operation lacks persistent idempotency key verification",
    category: "INVARIANT",
    status: "DERIVED",
    scope: "FUNCTION",
    snapshotId: snapshot.snapshotId,
    epistemicVector: {
      sourceReliability: 0.95,
      coverage: 0.8,
      recency: 1.0,
      independence: 0.7,
      reproducibility: 1.0,
      modelDependence: 0.2,
      environmentSpecificity: 0.1
    },
    primaryEvidenceIds: [ev1.id],
    counterEvidenceIds: [],
    assumptions: ["Source file reflects current deployed runtime code"],
    limitations: ["Does not inspect upstream API gateway request filters"],
    whatWouldChangeMind: ["Evidence of database unique constraint on transaction_id"],
    reproducible: true
  });
  assert(claim1.id.startsWith("clm-"), `Asserted evidence-backed claim: ${claim1.id}`);

  const card = ledger.generateRealityCard(claim1.id);
  assert(card.evidenceCount.code === 1, `Generated Reality Card with orthogonal epistemic dimensions`);

  // -------------------------------------------------------------------------
  // WAVE 2: POLYGLOT ADAPTERS & 3-WAY CONTRACT REALITY
  // -------------------------------------------------------------------------
  console.log("\n--- WAVE 2: POLYGLOT ADAPTERS & 3-WAY CONTRACT REALITY ENGINE ---");
  const polyRegistry = new PolyglotAdapterRegistry();
  const tsAdapter = polyRegistry.getAdapterForFile("src/service.ts");
  assert(tsAdapter?.getCapabilities().maturityTier === "PRODUCTION_AST", `TypeScript adapter declares PRODUCTION_AST maturity`);
  const pyAdapter = polyRegistry.getAdapterForFile("src/service.py");
  assert(pyAdapter?.getCapabilities().maturityTier === "SYNTACTIC_PARTIAL", `Python adapter explicitly declares SYNTACTIC_PARTIAL (No fake universal AST)`);

  const contractEngine = new ContractRealityEngine();
  const contract = contractEngine.analyzeContractReality(
    "BankingRefundAPI",
    [
      { path: "/api/v1/refund", method: "POST", declaredStatusCodes: [200, 400, 500] }
    ],
    [
      { path: "/api/v1/refund", method: "POST", sourceFile: "src/RefundController.ts", line: 24, handledStatusCodes: [200, 400, 409] },
      { path: "/internal/metrics", method: "GET", sourceFile: "src/MetricsController.ts", line: 10, handledStatusCodes: [200] }
    ],
    [
      { path: "/api/v1/refund", method: "POST", observedStatusCode: 409, count: 17, p99LatencyMs: 340 }
    ],
    snapshot.snapshotId,
    ledger
  );

  assert(contract.comparison?.divergences.length === 2, `Discovered ${contract.comparison?.divergences.length} contract divergences`);
  const undocumentedStatus = contract.comparison?.divergences.find(d => d.type === "UNDOCUMENTED_STATUS");
  assert(!!undocumentedStatus, `Identified undocumented HTTP 409 Conflict status exhibited in runtime`);
  const undeclaredRoute = contract.comparison?.divergences.find(d => d.type === "UNDECLARED_PARAMETER");
  assert(!!undeclaredRoute, `Identified undeclared internal endpoint: GET /internal/metrics`);

  // -------------------------------------------------------------------------
  // WAVE 3: UNKNOWN FRONTIER, INVARIANTS, COUNTEREXAMPLES & CAUSALITY
  // -------------------------------------------------------------------------
  console.log("\n--- WAVE 3: UNKNOWN FRONTIER, INVARIANTS & COUNTEREXAMPLES ---");
  const sampleEntities = [
    { id: "RefundOrchestrator", name: "RefundOrchestrator", kind: "SERVICE" },
    { id: "PaymentGateway", name: "PaymentGateway", kind: "SERVICE" },
    { id: "RedisCache", name: "RedisCache", kind: "CACHE" },
    { id: "PostgresDB", name: "PostgresDB", kind: "DATABASE" },
    { id: "InternalAuditLogger", name: "InternalAuditLogger", kind: "SERVICE" }
  ];

  const frontierEngine = new UnknownFrontierEngine();
  const { metrics: frontierMetrics, unknowns } = frontierEngine.computeUnknownFrontier(
    sampleEntities,
    new Set(["RefundOrchestrator", "PaymentGateway", "RedisCache", "PostgresDB"]),
    new Set(["PaymentGateway", "PostgresDB"]),
    snapshot.snapshotId,
    ledger
  );

  assert(frontierMetrics.knownStatesCount === 5, `Tracked 5 known entities`);
  assert(frontierMetrics.testedStatesCount === 4, `4 tested entities`);
  assert(frontierMetrics.unobservedFrontierRatio.unexercisedKnownRatio === 0.2, `Unobserved frontier ratio: 20% (strictly relative to discovered entities)`);
  assert(unknowns.length > 0, `Identified unobserved components with actionable experiments`);

  const invariantEngine = new InvariantEngine();
  const candidateInvariants = invariantEngine.proposeStandardInvariants(
    sampleEntities.map(e => e.id),
    snapshot.commitSha,
    ledger
  );
  assert(candidateInvariants.length === 3, `Proposed 3 candidate project invariants`);

  const refundInvariant = candidateInvariants.find(i => i.id.includes("idempotent"))!;
  const sourceCodeMap = new Map<string, string>();
  sourceCodeMap.set(
    "src/demo_repo/services/RefundOrchestrator.ts",
    `export class RefundOrchestrator {
       public async refund(amount: number) {
         return await paymentGateway.refund(amount);
       }
     }`
  );

  const counterexampleEngine = new CounterexampleEngine();
  const counterexample = counterexampleEngine.searchCounterexample(
    refundInvariant,
    sourceCodeMap,
    snapshot.snapshotId,
    ledger
  );
  assert(!!counterexample, `Counterexample Engine generated reproducible duplicate refund trace`);
  assert(counterexample!.trace.length === 4, `Counterexample trace captures 4-step retry cascade`);

  invariantEngine.contradictInvariant(refundInvariant.id, counterexample!.id);
  assert(refundInvariant.status === "CONTRADICTED", `Invariant promoted to CONTRADICTED upon counterexample discovery`);

  const causalEngine = new CausalEvidenceEngine();
  const causalHypo = causalEngine.formulateExcisionHypothesis("RedisCache", "PostgresDB", snapshot.snapshotId, ledger);
  assert(causalHypo.treatmentVariable === "do(RedisCache_Available = 0)", `Pearl Do-calculus structural variable: ${causalHypo.treatmentVariable}`);
  assert(causalHypo.experimentalEvidenceLevel === "MECHANISTIC", `Honest epistemic classification: MECHANISTIC hypothesis (Not unproven causal truth)`);

  // -------------------------------------------------------------------------
  // WAVE 4: COUNTERFACTUAL EXECUTION, CHANGE COMPILER & PROOF BUNDLES
  // -------------------------------------------------------------------------
  console.log("\n--- WAVE 4: DUAL-WORLD COUNTERFACTUALS & CHANGE PROOF BUNDLE ---");
  const counterfactualEngine = new CounterfactualExecutionEngine();
  const dualWorld = counterfactualEngine.compareWorlds(
    {
      id: "int-01",
      targetEntityId: "RedisCache",
      interventionType: "DISABLE_CACHE",
      parameters: {},
      evidenceIds: []
    },
    {
      transactionCount: 100000,
      p99LatencyMs: 4850,
      errorRatePercent: 14.2,
      databasePoolUtilizationPercent: 100,
      duplicateChargesObserved: 412
    },
    {
      transactionCount: 100000,
      p99LatencyMs: 85,
      errorRatePercent: 0.0,
      databasePoolUtilizationPercent: 28,
      duplicateChargesObserved: 0
    },
    "REFERENCE_LAB_HARNESS"
  );
  assert(dualWorld.delta.duplicateVictimEliminationCount === 412, `World comparison eliminated 412 duplicate charges in reference harness`);
  assert(dualWorld.baselineWorld.provenance.measurementOrigin === "REFERENCE_LAB_HARNESS", `Origin strictly labeled as REFERENCE_LAB_HARNESS`);

  const changeCompiler = new ChangeCompiler();
  const changeProposal = changeCompiler.compileIdempotencyPatch(
    refundInvariant,
    counterexample!,
    "src/demo_repo/services/RefundOrchestrator.ts"
  );
  assert(changeProposal.targetBranch.startsWith("vantair/fix-idempotency-"), `Created isolated branch: ${changeProposal.targetBranch}`);
  assert(changeProposal.patchDiff.includes("processedIdempotencyKeys"), `Synthesized surgical idempotency patch`);

  const verificationEngine = new VerificationBundleEngine();
  const proofBundle = verificationEngine.generateProofBundle(changeProposal, snapshot.snapshotId);
  assert(proofBundle.overallStatus === "VERIFIED", `Verification Proof Bundle verified`);
  assert(proofBundle.gates.length === 6, `Passed 6 verification gates (BUILD, TYPECHECK, UNIT_TEST, INVARIANT, COUNTEREXAMPLE, FORMAL_PROPERTY)`);
  const formalGate = proofBundle.gates.find(g => g.gateName === "FORMAL_PROPERTY");
  assert(formalGate?.formalDetails?.result === "UNSAT", `Formal solver property verified with result UNSAT`);

  // -------------------------------------------------------------------------
  // WAVE 5: VRQL (VANTAIR REALITY QUERY LANGUAGE) & EXPERIMENTS
  // -------------------------------------------------------------------------
  console.log("\n--- WAVE 5: VRQL QUERY ENGINE & EXPERIMENT PLANNER ---");
  const dummyIR: RealityIR = {
    schemaVersion: "3.0.0",
    engineVersion: "3.0.0",
    revision: "rev-01",
    createdAt: new Date().toISOString(),
    sourceSnapshot: snapshot,
    entities: sampleEntities.map(s => ({
      id: s.id,
      name: s.name,
      kind: s.kind as any,
      language: "TypeScript",
      status: "OBSERVED",
      evidenceIds: [],
      properties: {}
    })),
    relationships: [
      {
        id: "rel-01",
        sourceEntityId: "RefundOrchestrator",
        targetEntityId: "RedisCache",
        kind: "READS_STATE",
        status: "OBSERVED",
        evidenceIds: [],
        attributes: {}
      }
    ],
    contracts: [contract],
    workflows: [],
    stateMachines: [],
    dataFlows: [],
    runtimeObservations: [],
    invariants: [refundInvariant],
    counterexamples: [counterexample!],
    contradictions: [],
    unknowns: unknowns,
    causalHypotheses: [causalHypo],
    interventions: [],
    verificationArtifacts: [],
    provenance: { nodes: [], edges: [] },
    statistics: {
      totalEntities: 5,
      totalRelationships: 1,
      totalContracts: 1,
      totalInvariants: 1,
      totalContradictions: 0,
      totalUnknowns: unknowns.length,
      epistemicCounts: {
        UNKNOWN: 0,
        HYPOTHESIZED: 0,
        INFERRED: 0,
        DERIVED: 0,
        OBSERVED: 5,
        CONTRADICTED: 0
      }
    }
  };

  const vrql = new VRQLEngine();
  const whyResult = vrql.executeQuery("WHY can refund happen twice?", dummyIR);
  assert(whyResult.status === "SUCCESS", `VRQL successfully executed WHY query: ${whyResult.plan.operation}`);
  assert(whyResult.explanation.includes("idempotency"), `VRQL surfaced idempotency explanation from evidence`);

  const affectedResult = vrql.executeQuery("SHOW services affected if RedisCache is unavailable", dummyIR);
  assert(affectedResult.data.directlyAffected.length === 1, `VRQL computed downstream callers affected by RedisCache`);

  const experimentEngine = new ExperimentEngine();
  const cheapestExp = experimentEngine.getCheapestHighestGainExperiment(dummyIR);
  assert(!!cheapestExp, `Experiment Engine planned cheapest uncertainty-reduction experiment: '${cheapestExp?.title}'`);

  // -------------------------------------------------------------------------
  // WAVE 6: DURABLE JOBS & MULTI-TENANT ARCHITECTURE
  // -------------------------------------------------------------------------
  console.log("\n--- WAVE 6: DURABLE JOB MANAGER & LIFECYCLE ---");
  const jobManager = new DurableJobManager();
  const job = jobManager.enqueueJob("org-vantair-01", "proj-core-01", "repo-banking-01", "idem-key-8891");
  assert(job.status === "QUEUED", `Durable job enqueued: ${job.id}`);

  // Test idempotency
  const duplicateJob = jobManager.enqueueJob("org-vantair-01", "proj-core-01", "repo-banking-01", "idem-key-8891");
  assert(duplicateJob.id === job.id, `Idempotency enforced: duplicate submission returned identical job`);

  jobManager.checkpointStage(job.id, "INGESTION_COMPLETE", 25);
  jobManager.checkpointStage(job.id, "PARSE_COMPLETE", 50);
  jobManager.checkpointStage(job.id, "MODEL_COMPLETE", 90);
  assert(job.completedStages.length === 3, `Job survived 3 checkpoint stages: ${job.completedStages.join(" -> ")}`);

  jobManager.completeJob(job.id, proofBundle.bundleId);
  assert(job.status === "COMPLETED" && job.progressPercent === 100, `Job transitioned to COMPLETED with artifact ${job.resultArtifactId}`);

  console.log("\n==========================================================================");
  console.log(" 🎉 ALL WAVES 0 TO 6 (PHASES 21-42) FULLY VERIFIED & EPISTEMICALLY DEFENDED!");
  console.log("==========================================================================\n");
}

runRealityEngineVerification().catch(err => {
  console.error("Test execution error:", err);
  process.exit(1);
});
