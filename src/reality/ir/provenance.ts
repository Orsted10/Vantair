/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Reality IR: Provenance Graph
 */

export interface ProvenanceNode {
  id: string;
  type: "SOURCE_FILE" | "DERIVATION_RUN" | "ENGINE_TRANSFORMATION" | "HUMAN_ASSERTION" | "RUNTIME_SESSION";
  name: string;
  version: string;
  timestamp: string;
  hash: string;
  metadata?: Record<string, any>;
}

export interface ProvenanceEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  relation: "DERIVED_FROM" | "PRODUCED_BY" | "SUPERSEDES" | "VALIDATED_BY";
  timestamp: string;
}

export interface ProvenanceGraph {
  nodes: ProvenanceNode[];
  edges: ProvenanceEdge[];
}
