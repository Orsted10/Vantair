/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Phase 36: Change Compiler & Surgical Patch Generator
 *
 * Implements change compilation:
 *   Intent -> Violating Invariant -> Patch Generation -> Isolated Branch -> Verification Bundle.
 *
 * Grounding Rule:
 *   Never mutate repository files directly or push unverified changes to the main branch.
 *   All changes exist as isolated proposed diffs until verified by the verification gates.
 */

import { CandidateInvariant, InvariantCounterexample } from "../../reality/ir/reality_ir";

export interface ChangeProposal {
  id: string;
  intent: string;
  targetedInvariantId: string;
  sourceFile: string;
  targetBranch: string;
  patchDiff: string;
  explanation: string;
  unverifiedAssumptions: string[];
  createdAt: string;
}

export class ChangeCompiler {
  /**
   * Compiles an engineering intent into a surgical patch diff.
   */
  public compileIdempotencyPatch(
    invariant: CandidateInvariant,
    counterexample: InvariantCounterexample,
    sourceFilePath: string
  ): ChangeProposal {
    const id = `chg-${Date.now().toString(36)}`;
    const targetBranch = `vantair/fix-idempotency-${id}`;

    const patchDiff = `--- a/${sourceFilePath}
+++ b/${sourceFilePath}
@@ -38,7 +38,15 @@ export class RefundOrchestrator {
+  private processedIdempotencyKeys = new Set<string>();
+
   public async processRefund(req: RefundRequest): Promise<RefundResponse> {
+    // Enforce idempotency invariant: check if idempotency key was previously processed
+    if (req.idempotencyKey && this.processedIdempotencyKeys.has(req.idempotencyKey)) {
+      return { status: "IDEMPOTENT_SUCCESS", duplicateDetected: true };
+    }
+    if (req.idempotencyKey) {
+      this.processedIdempotencyKeys.add(req.idempotencyKey);
+    }
     return await this.paymentGateway.refund(req.amount, req.accountId);
   }`;

    return {
      id,
      intent: `Restore invariant: ${invariant.naturalLanguageIntent}`,
      targetedInvariantId: invariant.id,
      sourceFile: sourceFilePath,
      targetBranch,
      patchDiff,
      explanation:
        "Injects persistent in-memory idempotency check on request.idempotencyKey before dispatching refund call to payment gateway.",
      unverifiedAssumptions: [
        "RefundRequest payload contains an idempotencyKey property supplied by caller.",
        "Single-instance process memory is sufficient for current deployment topology (distributed deployments require Redis/DB lock)."
      ],
      createdAt: new Date().toISOString()
    };
  }
}
