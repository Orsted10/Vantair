/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Reality IR: Entity Definitions
 */

import { EpistemicStatus, SourceLocation } from "../ledger/evidence_ledger";

export type EntityKind =
  | "SERVICE"
  | "MODULE"
  | "CLASS"
  | "FUNCTION"
  | "ENDPOINT"
  | "DATABASE"
  | "CACHE"
  | "QUEUE"
  | "TABLE"
  | "FIELD"
  | "CONFIG";

export interface SystemEntity {
  id: string;
  name: string;
  kind: EntityKind;
  language: string;
  sourceLocation?: SourceLocation;
  status: EpistemicStatus;
  evidenceIds: string[];
  properties: {
    isAsync?: boolean;
    visibility?: "PUBLIC" | "PRIVATE" | "PROTECTED";
    parameters?: Array<{ name: string; type: string; optional?: boolean }>;
    returnType?: string;
    routePath?: string;
    httpMethod?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    databaseType?: "POSTGRES" | "REDIS" | "MONGO" | "KAFKA";
    retriesConfigured?: number;
    timeoutMs?: number;
    isIdempotent?: boolean;
    attributes?: Record<string, any>;
  };
}
