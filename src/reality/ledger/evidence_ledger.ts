/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Phase 22: Ground-Truth Evidence Ledger & Claim System
 *
 * Implements the immutable evidence ledger. Every factual claim made by VANTAIR
 * must be backed by concrete evidence items.
 *
 * Epistemic Rules:
 *   1. No LLM output can become OBSERVED merely because an LLM generated it.
 *   2. Taint paths are POTENTIAL until reachability and sanitization are proven.
 *   3. Certainty is represented as an orthogonal multi-dimensional vector,
 *      not a single deceptive scalar kappa.
 *   4. Every claim must explicitly declare what evidence would change its conclusion.
 */

import * as crypto from "crypto";

export type EpistemicStatus =
  | "UNKNOWN"
  | "HYPOTHESIZED"
  | "INFERRED"
  | "DERIVED"
  | "OBSERVED"
  | "CONTRADICTED";

export type EvidenceType =
  | "SOURCE"
  | "TEST"
  | "RUNTIME"
  | "TRACE"
  | "LOG"
  | "METRIC"
  | "GIT"
  | "DOCUMENTATION"
  | "CONFIGURATION"
  | "SCHEMA"
  | "SIMULATION"
  | "FORMAL_PROOF"
  | "USER_ASSERTION"
  | "INFERENCE";

export type EvidenceScope =
  | "FILE"
  | "FUNCTION"
  | "SERVICE"
  | "PROJECT"
  | "ENVIRONMENT"
  | "DEPLOYMENT"
  | "VERSION";

export type ReproducibilityLevel =
  | "DETERMINISTIC"
  | "ENVIRONMENT_DEPENDENT"
  | "FLAKY"
  | "NON_REPRODUCIBLE";

export interface SourceLocation {
  file: string;
  startLine: number;
  endLine: number;
  startColumn?: number;
  endColumn?: number;
  snippet?: string;
}

export interface EpistemicVector {
  sourceReliability: number;       // [0, 1]: Static code = 0.95, runtime trace = 0.99, LLM = 0.40
  coverage: number;                // [0, 1]: Proportion of execution surface covered
  recency: number;                 // [0, 1]: Proximity to latest commit
  independence: number;            // [0, 1]: Number of orthogonal sources corroborating
  reproducibility: number;         // [0, 1]: Degree to which run yields identical result
  modelDependence: number;         // [0, 1]: Extent to which claim relies on model assumptions
  environmentSpecificity: number;  // [0, 1]: How tightly bound to specific OS/hardware
}

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  source: string;
  snapshotId: string;
  location?: SourceLocation;
  producer: string;
  producerVersion: string;
  method: string;
  timestamp: string;
  environment: string;
  contentHash: string;
  status: EpistemicStatus;
  scope: EvidenceScope;
  validFromCommit?: string;
  validUntilCommit?: string;
  reproducibility: ReproducibilityLevel;
  reproductionCommand?: string;
  dependencies: string[];
  rawPayload?: any;
}

export interface Claim {
  id: string;
  statement: string;
  category: "ARCHITECTURE" | "CONTRACT" | "SECURITY" | "PERFORMANCE" | "BEHAVIOR" | "INVARIANT";
  status: EpistemicStatus;
  scope: EvidenceScope;
  targetSymbol?: string;
  targetFile?: string;
  snapshotId: string;
  epistemicVector: EpistemicVector;
  primaryEvidenceIds: string[];
  counterEvidenceIds: string[];
  assumptions: string[];
  limitations: string[];
  whatWouldChangeMind: string[];
  reproducible: boolean;
  reproductionCommand?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RealityCard {
  claimId: string;
  statement: string;
  status: EpistemicStatus;
  category: string;
  evidenceCount: {
    total: number;
    code: number;
    tests: number;
    runtime: number;
    formal: number;
  };
  lastObserved: string;
  snapshotId: string;
  reproducible: boolean;
  counterexampleFound: boolean;
  whatWouldChangeMind: string[];
  primaryLocations: SourceLocation[];
  epistemicDimensions: EpistemicVector;
}

export class EvidenceLedger {
  private evidenceMap: Map<string, EvidenceItem> = new Map();
  private claimsMap: Map<string, Claim> = new Map();
  private snapshotClaimsIndex: Map<string, Set<string>> = new Map(); // snapshotId -> Set<claimId>

  /**
   * Records a new ground-truth evidence item.
   */
  public recordEvidence(item: Omit<EvidenceItem, "id" | "contentHash">): EvidenceItem {
    const rawString = `${item.type}:${item.source}:${JSON.stringify(item.location || {})}:${item.snapshotId}:${item.timestamp}`;
    const contentHash = crypto.createHash("sha256").update(rawString).digest("hex");
    const id = `ev-${contentHash.substring(0, 12)}`;

    const fullItem: EvidenceItem = {
      ...item,
      id,
      contentHash
    };

    this.evidenceMap.set(id, fullItem);
    return fullItem;
  }

  /**
   * Retrieves an evidence item by ID.
   */
  public getEvidence(id: string): EvidenceItem | undefined {
    return this.evidenceMap.get(id);
  }

  /**
   * Creates or registers a formal claim backed by evidence.
   */
  public assertClaim(claimInput: Omit<Claim, "id" | "createdAt" | "updatedAt">): Claim {
    // Validate that evidence IDs actually exist in the ledger
    for (const evId of claimInput.primaryEvidenceIds) {
      if (!this.evidenceMap.has(evId)) {
        throw new Error(`Evidence ID '${evId}' not found in Evidence Ledger. Cannot assert unsupported claim.`);
      }
    }

    const claimId = `clm-${crypto.createHash("sha256").update(claimInput.statement + claimInput.snapshotId).digest("hex").substring(0, 12)}`;
    const now = new Date().toISOString();

    const claim: Claim = {
      ...claimInput,
      id: claimId,
      createdAt: now,
      updatedAt: now
    };

    this.claimsMap.set(claimId, claim);

    if (!this.snapshotClaimsIndex.has(claim.snapshotId)) {
      this.snapshotClaimsIndex.set(claim.snapshotId, new Set());
    }
    this.snapshotClaimsIndex.get(claim.snapshotId)!.add(claimId);

    return claim;
  }

  /**
   * Challenges an existing claim by attaching counter-evidence.
   */
  public challengeClaim(
    claimId: string,
    counterEvidenceId: string,
    explanation: string
  ): Claim {
    const claim = this.claimsMap.get(claimId);
    if (!claim) throw new Error(`Claim '${claimId}' not found.`);

    if (!this.evidenceMap.has(counterEvidenceId)) {
      throw new Error(`Counter-evidence ID '${counterEvidenceId}' not found.`);
    }

    claim.counterEvidenceIds.push(counterEvidenceId);
    claim.status = "CONTRADICTED";
    claim.epistemicVector.modelDependence = Math.min(1.0, claim.epistemicVector.modelDependence + 0.3);
    claim.epistemicVector.sourceReliability = Math.max(0.1, claim.epistemicVector.sourceReliability - 0.4);
    claim.limitations.push(`Contradicted by evidence ${counterEvidenceId}: ${explanation}`);
    claim.updatedAt = new Date().toISOString();

    return claim;
  }

  /**
   * Generates a structured "Reality Card" for presentation in the UI or report.
   */
  public generateRealityCard(claimId: string): RealityCard {
    const claim = this.claimsMap.get(claimId);
    if (!claim) throw new Error(`Claim '${claimId}' not found.`);

    const primaryEvs = claim.primaryEvidenceIds
      .map(id => this.evidenceMap.get(id))
      .filter((e): e is EvidenceItem => !!e);

    const codeCount = primaryEvs.filter(e => e.type === "SOURCE").length;
    const testCount = primaryEvs.filter(e => e.type === "TEST").length;
    const runtimeCount = primaryEvs.filter(e => e.type === "RUNTIME" || e.type === "TRACE" || e.type === "METRIC").length;
    const formalCount = primaryEvs.filter(e => e.type === "FORMAL_PROOF").length;

    const locations: SourceLocation[] = [];
    for (const ev of primaryEvs) {
      if (ev.location) locations.push(ev.location);
    }

    return {
      claimId: claim.id,
      statement: claim.statement,
      status: claim.status,
      category: claim.category,
      evidenceCount: {
        total: primaryEvs.length,
        code: codeCount,
        tests: testCount,
        runtime: runtimeCount,
        formal: formalCount
      },
      lastObserved: claim.updatedAt,
      snapshotId: claim.snapshotId,
      reproducible: claim.reproducible,
      counterexampleFound: claim.counterEvidenceIds.length > 0,
      whatWouldChangeMind: claim.whatWouldChangeMind,
      primaryLocations: locations,
      epistemicDimensions: claim.epistemicVector
    };
  }

  /**
   * Retrieves all claims associated with a given snapshot.
   */
  public getClaimsForSnapshot(snapshotId: string): Claim[] {
    const claimIds = this.snapshotClaimsIndex.get(snapshotId);
    if (!claimIds) return [];
    return Array.from(claimIds)
      .map(id => this.claimsMap.get(id))
      .filter((c): c is Claim => !!c);
  }

  /**
   * Returns all evidence items in the ledger.
   */
  public getAllEvidence(): EvidenceItem[] {
    return Array.from(this.evidenceMap.values());
  }

  /**
   * Returns all claims in the ledger.
   */
  public getAllClaims(): Claim[] {
    return Array.from(this.claimsMap.values());
  }
}
