/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Reality IR: Data Flow, Taint Paths & Security Grounding
 *
 * Grounding Rule:
 *   A taint path is NOT automatically an exploitable vulnerability.
 *   VANTAIR requires:
 *   TAINT SOURCE -> PROPAGATION -> SANITIZER -> SINK -> EXECUTION CONDITION -> EXPLOITABILITY -> REACHABILITY.
 */

import { SourceLocation } from "../ledger/evidence_ledger";

export type TaintPathClassification =
  | "POTENTIAL_TAINT_PATH"
  | "SANITIZED_DATA_FLOW"
  | "REACHABLE_UNSANITIZED"
  | "CONFIRMED_VULNERABILITY"
  | "FALSE_POSITIVE_DISPROVEN";

export interface TaintNode {
  symbolName: string;
  location: SourceLocation;
  operation: "READ_INPUT" | "ASSIGNMENT" | "FUNCTION_ARG" | "CONCAT" | "CALL_SINK";
}

export interface SystemDataFlow {
  id: string;
  sourceSymbol: string;
  sourceType: "HTTP_QUERY" | "HTTP_BODY" | "ENVIRONMENT_VAR" | "FILE_READ" | "UNTRUSTED_SOCKET";
  sourceLocation: SourceLocation;
  sinkSymbol: string;
  sinkType: "SQL_QUERY" | "EVAL_EXEC" | "FILE_SYSTEM_WRITE" | "LOG_OUTPUT" | "OUTBOUND_HTTP";
  sinkLocation: SourceLocation;
  propagationPath: TaintNode[];
  sanitizerDetected?: {
    sanitizerFunction: string;
    location: SourceLocation;
    effectiveness: "TOTAL" | "PARTIAL" | "BYPASSABLE";
  };
  classification: TaintPathClassification;
  reachabilityEvidence?: {
    isStaticallyReachable: boolean;
    isDynamicallyObserved: boolean;
    requiredInputCondition?: string;
  };
  evidenceIds: string[];
}
