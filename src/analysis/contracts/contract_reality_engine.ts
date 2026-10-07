/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Phase 25: Contract Reality Engine
 *
 * Implements 3-Way Contract Divergence Analysis:
 *   1. DECLARED CONTRACT: What OpenAPI, GraphQL, Protobuf, or DDL schemas claim.
 *   2. IMPLEMENTED CONTRACT: What source code routes and controllers actually handle.
 *   3. OBSERVED CONTRACT: What runtime HTTP logs and telemetry traces exhibit.
 *
 * Grounding Rule:
 *   DECLARED != IMPLEMENTED  (Missing routes, undeclared endpoints)
 *   IMPLEMENTED != OBSERVED  (Undocumented error status codes, e.g. 409 Conflict)
 *   OBSERVED != DECLARED     (Runtime reality violating declared API schema)
 */

import { SystemContract, ContractEndpoint, ContractRealityComparison } from "../../reality/ir/contract";
import { EvidenceLedger } from "../../reality/ledger/evidence_ledger";

export interface DeclaredEndpoint {
  path: string;
  method: string;
  declaredStatusCodes: number[];
  schemaRef?: string;
}

export interface ImplementedRoute {
  path: string;
  method: string;
  sourceFile: string;
  line: number;
  handledStatusCodes: number[];
}

export interface ObservedTrafficSample {
  path: string;
  method: string;
  observedStatusCode: number;
  count: number;
  p99LatencyMs: number;
}

export class ContractRealityEngine {
  /**
   * Compares Declared vs Implemented vs Observed contracts to discover divergences.
   */
  public analyzeContractReality(
    contractName: string,
    declaredEndpoints: DeclaredEndpoint[],
    implementedRoutes: ImplementedRoute[],
    observedTraffic: ObservedTrafficSample[],
    snapshotId: string,
    ledger: EvidenceLedger
  ): SystemContract {
    const divergences: ContractRealityComparison["divergences"] = [];
    const endpoints: ContractEndpoint[] = [];

    // Map implemented routes by method:path
    const implementedMap = new Map<string, ImplementedRoute>();
    for (const route of implementedRoutes) {
      implementedMap.set(`${route.method.toUpperCase()}:${route.path.toLowerCase()}`, route);
    }

    // Map observed traffic by method:path
    const observedMap = new Map<string, ObservedTrafficSample[]>();
    for (const sample of observedTraffic) {
      const key = `${sample.method.toUpperCase()}:${sample.path.toLowerCase()}`;
      if (!observedMap.has(key)) observedMap.set(key, []);
      observedMap.get(key)!.push(sample);
    }

    // 1. Check DECLARED vs IMPLEMENTED
    for (const decl of declaredEndpoints) {
      const key = `${decl.method.toUpperCase()}:${decl.path.toLowerCase()}`;
      const impl = implementedMap.get(key);
      const observedList = observedMap.get(key) || [];

      const observedStatusCodes = observedList.map(o => o.observedStatusCode);

      // Record endpoint in IR
      endpoints.push({
        pathOrMethod: decl.path,
        verb: decl.method,
        declaredHeaders: ["Authorization", "Content-Type"],
        observedStatusCodes,
        documentedErrors: decl.declaredStatusCodes.filter(c => c >= 400)
      });

      // Divergence A: Declared endpoint has no implementation in code
      if (!impl) {
        const ev = ledger.recordEvidence({
          type: "SCHEMA",
          source: `contract:${contractName}`,
          snapshotId,
          producer: "ContractRealityEngine",
          producerVersion: "3.0.0",
          method: "STATIC_DIFF",
          timestamp: new Date().toISOString(),
          environment: "STATIC",
          status: "DERIVED",
          scope: "FUNCTION",
          reproducibility: "DETERMINISTIC",
          dependencies: []
        });

        divergences.push({
          type: "MISSING_IMPLEMENTATION",
          endpoint: `${decl.method} ${decl.path}`,
          description: `Contract declares '${decl.method} ${decl.path}' but no corresponding HTTP handler or controller was discovered in source code.`,
          declared: decl,
          evidenceIds: [ev.id],
          severity: "HIGH"
        });
        continue;
      }

      // 2. Check IMPLEMENTED vs OBSERVED (Undocumented runtime status codes)
      for (const obs of observedList) {
        if (!decl.declaredStatusCodes.includes(obs.observedStatusCode)) {
          const ev = ledger.recordEvidence({
            type: "RUNTIME",
            source: `traffic:${obs.method} ${obs.path}`,
            snapshotId,
            producer: "ContractRealityEngine",
            producerVersion: "3.0.0",
            method: "RUNTIME_OBSERVATION",
            timestamp: new Date().toISOString(),
            environment: "RUNTIME",
            status: "OBSERVED",
            scope: "FUNCTION",
            reproducibility: "ENVIRONMENT_DEPENDENT",
            dependencies: []
          });

          divergences.push({
            type: "UNDOCUMENTED_STATUS",
            endpoint: `${decl.method} ${decl.path}`,
            description: `Runtime observation exhibits HTTP ${obs.observedStatusCode} (observed ${obs.count} times), but schema only declares [${decl.declaredStatusCodes.join(", ")}].`,
            declared: decl.declaredStatusCodes,
            implemented: impl.handledStatusCodes,
            observed: obs.observedStatusCode,
            evidenceIds: [ev.id],
            severity: obs.observedStatusCode >= 500 ? "CRITICAL" : "MEDIUM"
          });
        }
      }
    }

    // 3. Check IMPLEMENTED endpoints NOT in DECLARED contract
    for (const [key, impl] of Array.from(implementedMap.entries())) {
      const isDeclared = declaredEndpoints.some(
        d => `${d.method.toUpperCase()}:${d.path.toLowerCase()}` === key
      );

      if (!isDeclared) {
        const ev = ledger.recordEvidence({
          type: "SOURCE",
          source: `${impl.sourceFile}:${impl.line}`,
          snapshotId,
          producer: "ContractRealityEngine",
          producerVersion: "3.0.0",
          method: "AST_ROUTE_SCAN",
          timestamp: new Date().toISOString(),
          environment: "STATIC",
          status: "OBSERVED",
          scope: "FUNCTION",
          reproducibility: "DETERMINISTIC",
          dependencies: []
        });

        divergences.push({
          type: "UNDECLARED_PARAMETER",
          endpoint: `${impl.method} ${impl.path}`,
          description: `Route '${impl.method} ${impl.path}' is implemented in '${impl.sourceFile}' but completely absent from the declared contract specification.`,
          declared: null,
          implemented: impl,
          evidenceIds: [ev.id],
          severity: "HIGH"
        });
      }
    }

    const comparison: ContractRealityComparison = {
      isCompliant: divergences.length === 0,
      divergences
    };

    return {
      id: `ctr-${contractName.toLowerCase()}`,
      name: contractName,
      format: "OPENAPI",
      status: divergences.length === 0 ? "OBSERVED" : "CONTRADICTED",
      endpoints,
      comparison,
      evidenceIds: divergences.flatMap(d => d.evidenceIds)
    };
  }
}
