/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Phase 32: System Constitution & Versioned Invariant Engine
 *
 * Implements the Invariant lifecycle:
 *   Discovery -> Candidate Invariant -> Formalization -> Counterexample Search -> Acceptance -> Policy.
 *
 * Grounding Rule:
 *   Invariants are user-owned executable project policies, NOT universal cosmic laws.
 */

import { CandidateInvariant } from "../../reality/ir/reality_ir";
import { EvidenceLedger } from "../../reality/ledger/evidence_ledger";

export interface InvariantProposal {
  name: string;
  intent: string;
  formalExpression?: string;
  scope: CandidateInvariant["scope"];
  targetEntityIds: string[];
}

export class InvariantEngine {
  private invariants: Map<string, CandidateInvariant> = new Map();

  /**
   * Initializes standard baseline candidate invariants for a repository.
   */
  public proposeStandardInvariants(
    entityIds: string[],
    commitSha: string,
    ledger: EvidenceLedger
  ): CandidateInvariant[] {
    const proposals: InvariantProposal[] = [
      {
        name: "INV-IDEMPOTENT-REFUND",
        intent: "Every refund operation must be strictly idempotent under network retries.",
        formalExpression: "G(retry(RefundRequest, req_id) -> result(retry) == result(first))",
        scope: "WORKFLOW",
        targetEntityIds: entityIds.filter(id => id.toLowerCase().includes("refund"))
      },
      {
        name: "INV-NO-DOUBLE-CHARGE",
        intent: "Payment authorization must never execute multiple debits for a single checkout session.",
        formalExpression: "G(debit(session_id) -> X G(!debit(session_id)))",
        scope: "SERVICE",
        targetEntityIds: entityIds.filter(id => id.toLowerCase().includes("payment"))
      },
      {
        name: "INV-BOUNDED-CONNECTION-POOL",
        intent: "Database connections must never leak across unclosed error handling branches.",
        formalExpression: "G(acquire(conn) -> F release(conn))",
        scope: "GLOBAL",
        targetEntityIds: entityIds.filter(id => id.toLowerCase().includes("postgres") || id.toLowerCase().includes("db"))
      }
    ];

    const result: CandidateInvariant[] = [];

    for (const p of proposals) {
      const id = p.name.toLowerCase().replace(/_/g, "-");
      const inv: CandidateInvariant = {
        id,
        name: p.name,
        naturalLanguageIntent: p.intent,
        formalExpression: p.formalExpression,
        scope: p.scope,
        targetEntityIds: p.targetEntityIds,
        status: "PROPOSED",
        evidenceIds: [],
        counterexampleIds: [],
        lastCheckedCommit: commitSha
      };

      this.invariants.set(id, inv);
      result.push(inv);
    }

    return result;
  }

  /**
   * Accepts a candidate invariant, promoting it to official project policy.
   */
  public acceptInvariant(invariantId: string): CandidateInvariant {
    const inv = this.invariants.get(invariantId);
    if (!inv) throw new Error(`Invariant '${invariantId}' not found.`);

    inv.status = "ACCEPTED_POLICY";
    return inv;
  }

  /**
   * Marks an invariant as contradicted when a counterexample is discovered.
   */
  public contradictInvariant(invariantId: string, counterexampleId: string): CandidateInvariant {
    const inv = this.invariants.get(invariantId);
    if (!inv) throw new Error(`Invariant '${invariantId}' not found.`);

    inv.status = "CONTRADICTED";
    if (!inv.counterexampleIds.includes(counterexampleId)) {
      inv.counterexampleIds.push(counterexampleId);
    }
    return inv;
  }

  /**
   * Returns all tracked invariants.
   */
  public getAllInvariants(): CandidateInvariant[] {
    return Array.from(this.invariants.values());
  }
}
