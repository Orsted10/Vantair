/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Reality IR: Contract Model & 3-Way Divergence
 */

import { EpistemicStatus, SourceLocation } from "../ledger/evidence_ledger";

export type ContractFormat =
  | "OPENAPI"
  | "GRAPHQL"
  | "PROTOBUF"
  | "ASYNCAPI"
  | "POSTGRES_DDL"
  | "TYPESCRIPT_INTERFACE";

export interface ContractEndpoint {
  pathOrMethod: string;
  verb?: string; // GET, POST, RPC name
  requestSchema?: Record<string, any>;
  responseSchemas?: Record<string, any>; // Status code -> Schema
  declaredHeaders?: string[];
  observedStatusCodes?: number[];
  documentedErrors?: number[];
}

export interface ContractRealityComparison {
  isCompliant: boolean;
  divergences: Array<{
    type: "UNDOCUMENTED_STATUS" | "MISSING_IMPLEMENTATION" | "SCHEMA_MISMATCH" | "UNDECLARED_PARAMETER";
    endpoint: string;
    description: string;
    declared: any;
    implemented?: any;
    observed?: any;
    evidenceIds: string[];
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  }>;
}

export interface SystemContract {
  id: string;
  name: string;
  format: ContractFormat;
  declaredLocation?: SourceLocation;
  status: EpistemicStatus;
  endpoints: ContractEndpoint[];
  comparison?: ContractRealityComparison;
  evidenceIds: string[];
}
