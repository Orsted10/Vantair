/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Core Storage: Versioned System Model Snapshots Store
 */

import { SystemModelSnapshot } from "../types/system_model";
import { EvidenceItem } from "../types/evidence";

const globalForModelStore = globalThis as unknown as {
  vantairModelStore?: ModelStore;
};

export class ModelStore {
  private snapshots: Map<string, SystemModelSnapshot> = new Map();
  private projectLatestSnapshot: Map<string, string> = new Map();

  private constructor() {
    this.seedDefaultSnapshot();
  }

  private seedDefaultSnapshot(): void {
    const snapId = "snap_default_campusbuddy_01";
    const snapshot: SystemModelSnapshot = {
      id: snapId,
      projectId: "proj_default_campusbuddy",
      analysisId: "run_default_init",
      version: 1,
      createdAt: Date.now() - 3600000,
      commitSha: "a9f83c1",
      branch: "main",
      entities: [
        {
          id: "ent_OrderService",
          name: "OrderService.ts",
          kind: "SERVICE",
          filePath: "services/OrderService.ts",
          location: { startLine: 1, endLine: 34 },
          truthStatus: "OBSERVED" as any,
          confidence: 1.0,
          description: "TypeScript microservice managing order placement lifecycle and payment handoffs.",
          tags: ["TypeScript", "Service", "Banking"],
          metrics: { loc: 34, symbols: 3 },
          evidenceIds: ["ev_order_01"],
        },
        {
          id: "ent_RefundOrchestrator",
          name: "RefundOrchestrator.ts",
          kind: "SERVICE",
          filePath: "services/RefundOrchestrator.ts",
          location: { startLine: 1, endLine: 42 },
          truthStatus: "OBSERVED" as any,
          confidence: 1.0,
          description: "Distributed refund coordination engine executing compensating transactions.",
          tags: ["TypeScript", "Service", "Banking"],
          metrics: { loc: 42, symbols: 4 },
          evidenceIds: ["ev_refund_01"],
        },
        {
          id: "ent_PaymentGateway",
          name: "PaymentGateway.ts",
          kind: "SERVICE",
          filePath: "services/PaymentGateway.ts",
          location: { startLine: 1, endLine: 38 },
          truthStatus: "OBSERVED" as any,
          confidence: 1.0,
          description: "External payment processor integration with network retry handling.",
          tags: ["TypeScript", "External", "Gateway"],
          metrics: { loc: 38, symbols: 3 },
          evidenceIds: ["ev_payment_01"],
        },
        {
          id: "ent_PostgresDB",
          name: "PostgresDB.ts",
          kind: "SERVICE",
          filePath: "services/PostgresDB.ts",
          location: { startLine: 1, endLine: 29 },
          truthStatus: "OBSERVED" as any,
          confidence: 1.0,
          description: "PostgreSQL relational persistence client with pool allocation.",
          tags: ["TypeScript", "Database", "Persistence"],
          metrics: { loc: 29, symbols: 2 },
          evidenceIds: ["ev_pg_01"],
        },
        {
          id: "ent_RedisCache",
          name: "RedisCache.ts",
          kind: "SERVICE",
          filePath: "services/RedisCache.ts",
          location: { startLine: 1, endLine: 25 },
          truthStatus: "OBSERVED" as any,
          confidence: 1.0,
          description: "Distributed Redis cache maintaining idempotency tokens and session locks.",
          tags: ["TypeScript", "Cache", "Locking"],
          metrics: { loc: 25, symbols: 3 },
          evidenceIds: ["ev_redis_01"],
        },
      ],
      relationships: [
        {
          id: "rel_order_pg",
          sourceEntityId: "ent_OrderService",
          targetEntityId: "ent_PostgresDB",
          kind: "CALLS",
          truthStatus: "OBSERVED" as any,
          confidence: 0.98,
          description: "OrderService writes committed order states into PostgresDB",
          evidenceIds: ["ev_rel_01"],
        },
        {
          id: "rel_order_gateway",
          sourceEntityId: "ent_OrderService",
          targetEntityId: "ent_PaymentGateway",
          kind: "CALLS",
          truthStatus: "OBSERVED" as any,
          confidence: 0.95,
          description: "OrderService dispatches payment authorizations via PaymentGateway",
          evidenceIds: ["ev_rel_02"],
        },
        {
          id: "rel_refund_gateway",
          sourceEntityId: "ent_RefundOrchestrator",
          targetEntityId: "ent_PaymentGateway",
          kind: "CALLS",
          truthStatus: "OBSERVED" as any,
          confidence: 0.96,
          description: "RefundOrchestrator issues reversals to PaymentGateway",
          evidenceIds: ["ev_rel_03"],
        },
        {
          id: "rel_refund_redis",
          sourceEntityId: "ent_RefundOrchestrator",
          targetEntityId: "ent_RedisCache",
          kind: "DEPENDS_ON",
          truthStatus: "OBSERVED" as any,
          confidence: 0.94,
          description: "RefundOrchestrator checks distributed idempotency locks in RedisCache",
          evidenceIds: ["ev_rel_04"],
        },
        {
          id: "rel_order_redis",
          sourceEntityId: "ent_OrderService",
          targetEntityId: "ent_RedisCache",
          kind: "DEPENDS_ON",
          truthStatus: "OBSERVED" as any,
          confidence: 0.91,
          description: "OrderService caches active shopping session state in RedisCache",
          evidenceIds: ["ev_rel_05"],
        },
      ],
      contracts: [
        {
          id: "contract_api_refund",
          title: "POST /api/v1/refund",
          protocol: "REST",
          specLocation: "docs/openapi.json",
          endpointOrMethod: "POST /api/v1/refund",
          declaredInDocs: true,
          implementedInCode: true,
          exercisedInTests: true,
          observedInRuntime: true,
          driftDetected: true,
          driftDescription: "Specification declares synchronous idempotency; implementation executes async unchecked retry under timeout.",
          evidenceIds: ["ev_contract_01"],
        },
        {
          id: "contract_api_orders",
          title: "POST /api/v1/orders",
          protocol: "REST",
          specLocation: "docs/openapi.json",
          endpointOrMethod: "POST /api/v1/orders",
          declaredInDocs: true,
          implementedInCode: true,
          exercisedInTests: true,
          observedInRuntime: true,
          driftDetected: false,
          evidenceIds: ["ev_contract_02"],
        },
      ],
      workflows: [
        {
          id: "wf_refund_saga",
          name: "Customer Refund Orchestration Workflow",
          entrypointEntityId: "ent_RefundOrchestrator",
          states: ["REQUESTED", "LOCK_ACQUIRED", "GATEWAY_PENDING", "COMPLETED", "FAILED", "RETRY_DISPATCHED"],
          transitions: [
            { fromState: "REQUESTED", toState: "LOCK_ACQUIRED", triggerEvent: "acquireLock", isHappyPath: true, isFailurePath: false, isRetry: false, evidenceIds: [] },
            { fromState: "LOCK_ACQUIRED", toState: "GATEWAY_PENDING", triggerEvent: "requestGatewayRefund", isHappyPath: true, isFailurePath: false, isRetry: false, evidenceIds: [] },
            { fromState: "GATEWAY_PENDING", toState: "RETRY_DISPATCHED", triggerEvent: "gatewayTimeout", isHappyPath: false, isFailurePath: true, isRetry: true, evidenceIds: [] },
            { fromState: "RETRY_DISPATCHED", toState: "COMPLETED", triggerEvent: "duplicateCapture", isHappyPath: false, isFailurePath: true, isRetry: true, evidenceIds: [] },
          ],
          involvedEntityIds: ["ent_RefundOrchestrator", "ent_PaymentGateway", "ent_RedisCache"],
          isIdempotent: false,
          riskRating: "CRITICAL",
          evidenceIds: [],
        },
      ],
      invariants: [
        {
          id: "inv_idempotent_refunds",
          statement: "Every customer refund operation must be strictly idempotent under arbitrary network retries.",
          category: "TRANSACTION",
          formalFormula: "G (RefundRequested -> F (RefundProcessed XOR RefundRejected))",
          truthStatus: "CONTRADICTED" as any,
          confidence: 0.98,
          isUserAccepted: true,
          counterexampleWitness: "PaymentGateway latency spike (>4000ms) triggers duplicate refund capture without idempotency key.",
          evidenceIds: ["ev_contra_01"],
        },
        {
          id: "inv_bounded_memory",
          statement: "Redis cache connection handles must remain bounded strictly below 100 concurrent pools.",
          category: "PERFORMANCE",
          formalFormula: "G (ActiveConnections <= 100)",
          truthStatus: "OBSERVED" as any,
          confidence: 1.0,
          isUserAccepted: true,
          evidenceIds: [],
        },
      ],
      unknowns: [
        {
          id: "unk_db_pool_collapse",
          title: "PostgreSQL Connection Pool Behavior under Distributed Lock Exhaustion",
          category: "UNTESTED",
          reason: "No automated integration tests simulate Redis cluster partition drop while active connections exceed 100.",
          potentialRisk: "Cascading HTTP 503 outage across all downstream services.",
          suggestedAction: "Synthesize integration test fixture with simulated connection starvation.",
          relatedEntityIds: ["ent_PostgresDB", "ent_RedisCache"],
        },
      ],
      contradictions: [
        {
          id: "contra_01",
          title: "Missing Idempotency Key under Gateway Timeout Retry",
          severity: "CRITICAL",
          sourceA: { type: "LTL_SPEC", claim: "All retries MUST provide a deterministic UUIDv4 idempotency key (ADR-042)." },
          sourceB: { type: "SOURCE_CODE", claim: "RefundOrchestrator.ts:28 retries gateway refund without passing idempotency key parameter." },
          impactSummary: "Causes duplicate credit card charges and financial loss under high payment gateway latency.",
          firstObservedCommit: "a9f83c1",
          culpabilityScore: 0.95,
          evidenceIds: ["ev_contra_01"],
        },
      ],
      evidenceMap: {
        ev_contra_01: {
          id: "ev_contra_01",
          sourceType: "SOURCE_CODE",
          truthStatus: "OBSERVED" as any,
          confidence: 1.0,
          title: "Unchecked Retry in RefundOrchestrator.ts",
          description: "Line 28 calls gateway refund without passing idempotency key on timeout.",
          location: { filePath: "services/RefundOrchestrator.ts", startLine: 24, endLine: 35 },
          contentHash: "sha256-refund-contra-01",
          timestamp: Date.now() - 3600000,
          relatedEntityIds: ["ent_RefundOrchestrator", "ent_PaymentGateway"],
        },
      },
      stats: {
        totalEntities: 5,
        totalRelationships: 5,
        understandingScorePercent: 92.4,
        runtimeAvailable: true,
        criticalRisksCount: 1,
      },
    };

    this.saveSnapshot(snapshot);
  }

  public static getInstance(): ModelStore {
    if (!globalForModelStore.vantairModelStore) {
      globalForModelStore.vantairModelStore = new ModelStore();
    }
    return globalForModelStore.vantairModelStore;
  }

  public saveSnapshot(snapshot: SystemModelSnapshot): void {
    this.snapshots.set(snapshot.id, snapshot);
    this.projectLatestSnapshot.set(snapshot.projectId, snapshot.id);
  }

  public getSnapshot(id: string): SystemModelSnapshot | undefined {
    return this.snapshots.get(id);
  }

  public getLatestSnapshotForProject(projectId: string): SystemModelSnapshot | undefined {
    const snapshotId = this.projectLatestSnapshot.get(projectId);
    if (!snapshotId) return undefined;
    return this.snapshots.get(snapshotId);
  }

  public getEvidenceById(snapshotId: string, evidenceId: string): EvidenceItem | undefined {
    const snapshot = this.getSnapshot(snapshotId);
    if (!snapshot) return undefined;
    return snapshot.evidenceMap[evidenceId];
  }
}
