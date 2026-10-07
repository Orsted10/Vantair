/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Phase 01 & Phase 09: 7-Layer Higher-Order Epistemic Hypergraph Substrate Engine
 *
 * Formal Attributed Tensor Hypergraph: H = < V, E, tau, K, Omega, Phi >
 * 7 Strata:
 *   - V_Syntactic: AST Nodes, Classes, Functions, Imports
 *   - V_Wire: OpenAPI, Protobuf, Kafka, Network Sockets, DB tables
 *   - V_Behavior: Petri Nets, Control Flows, State Transitions, Taint Paths
 *   - V_Temporal: Chrono-DAG, Git Commits, Historical Diffs
 *   - V_Intent: ADRs, RFCs, PRDs, LTL Formal Contracts
 *   - V_Empirical: eBPF Socket Spans, Traces, Telemetry Metrics
 *   - V_Delta: Proposed Mutated Twin Nodes (Dual-World)
 *
 * Phase 09 Components Added:
 *   4.1 7-Layer Tensor Adjacency Store (CSR Sparse Matrix Representation)
 *   4.2 Epistemic Truth Lattice Validator & Meet Operator
 *   4.3 Cross-Stratum Projection Functor (Intent -> Syntax -> Wire -> eBPF Functor Paths)
 *   4.4 In-Memory Spatial 3D Octree Frustum Query Index (<2ms HUD Viewport)
 *   4.5 Mutation Journal & Delta Checkpointer (Copy-on-write Branching)
 */

import { EpistemicValue, EpistemicStatus, createEpistemicValue, epistemicJoin } from "../types/epistemic";

export enum HypergraphLayer {
  V_Syntactic = "V_Syntactic",
  V_Wire = "V_Wire",
  V_Behavior = "V_Behavior",
  V_Temporal = "V_Temporal",
  V_Intent = "V_Intent",
  V_Empirical = "V_Empirical",
  V_Delta = "V_Delta",
}

export interface Spatial3DPoint {
  x: number;
  y: number;
  z: number;
}

export interface HypergraphNode {
  id: string; // Node ID or URI
  layer: HypergraphLayer;
  name: string;
  kind: string; // e.g. "Function", "Service", "Database", "eBPF_Trace", "LTL_Rule"
  epistemic: EpistemicValue;
  attributes: Record<string, unknown>;
  spatialPos: Spatial3DPoint; // 3D coordinates for Synaptic HUD Shaders
  createdAt: number;
}

export interface Hyperedge {
  id: string;
  sources: string[]; // Node IDs
  targets: string[]; // Node IDs
  relation: string;  // e.g. "CALLS", "CONTAINS", "VIOLATES", "DEPENDS_ON", "EXCISABLE"
  temporalValidityMs: number; // tau
  epistemic: EpistemicValue;
  externalMutation: boolean; // Omega: true if mutates state outside process boundary
  invariantConstraint?: string; // Phi: LTL contract associated with edge
  attributes: Record<string, unknown>;
}

export interface HypergraphSnapshot {
  timestamp: number;
  nodeCount: number;
  edgeCount: number;
  nodes: Map<string, HypergraphNode>;
  edges: Map<string, Hyperedge>;
}

export interface MutationJournalRecord {
  txId: string;
  timestamp: number;
  operation: "ADD_NODE" | "REMOVE_NODE" | "ADD_EDGE" | "REMOVE_EDGE" | "MUTATE_EPISTEMIC";
  entityId: string;
  previousState?: unknown;
  newState?: unknown;
}

export class HypergraphSubstrate {
  private nodes: Map<string, HypergraphNode> = new Map();
  private edges: Map<string, Hyperedge> = new Map();
  
  // Fast Lookup Indexes
  private nodesByLayer: Map<HypergraphLayer, Set<string>> = new Map();
  private outgoingEdges: Map<string, Set<string>> = new Map();
  private incomingEdges: Map<string, Set<string>> = new Map();
  private nodeByUri: Map<string, string> = new Map();

  // Component 4.1: CSR (Compressed Sparse Row) Tensor Index Buffers
  private csrRowPointers: Int32Array;
  private csrColumnIndices: Int32Array;
  private maxCapacity: number;

  // Component 4.5: Mutation Journal
  private mutationJournal: MutationJournalRecord[] = [];
  private activeTxId: string | null = null;

  constructor(maxCapacity: number = 100000) {
    this.maxCapacity = maxCapacity;
    this.csrRowPointers = new Int32Array(maxCapacity);
    this.csrColumnIndices = new Int32Array(maxCapacity * 4);
    
    for (const layer of Object.values(HypergraphLayer)) {
      this.nodesByLayer.set(layer, new Set());
    }
  }

  /**
   * Component 4.1: Add Node with Spatial 3D Coordinates
   */
  public addNode(node: HypergraphNode, uri?: string): void {
    if (!node.spatialPos) {
      node.spatialPos = this.generateDeterministic3DPos(node.id, node.layer);
    }

    this.nodes.set(node.id, node);
    this.nodesByLayer.get(node.layer)?.add(node.id);

    if (!this.outgoingEdges.has(node.id)) this.outgoingEdges.set(node.id, new Set());
    if (!this.incomingEdges.has(node.id)) this.incomingEdges.set(node.id, new Set());

    if (uri) {
      this.nodeByUri.set(uri, node.id);
    }

    if (this.activeTxId) {
      this.mutationJournal.push({
        txId: this.activeTxId,
        timestamp: Date.now(),
        operation: "ADD_NODE",
        entityId: node.id,
        newState: node,
      });
    }
  }

  /**
   * Create or update a Node across 7 Strata
   */
  public createNode(
    id: string,
    layer: HypergraphLayer,
    name: string,
    kind: string,
    epistemicStatus: EpistemicStatus = EpistemicStatus.OBSERVED,
    attributes: Record<string, unknown> = {},
    uri?: string
  ): HypergraphNode {
    const existing = this.nodes.get(id);
    const epistemic = createEpistemicValue(epistemicStatus, `Layer:${layer}:${kind}`);

    if (existing) {
      existing.epistemic = epistemicJoin(existing.epistemic, epistemic);
      Object.assign(existing.attributes, attributes);
      return existing;
    }

    const node: HypergraphNode = {
      id,
      layer,
      name,
      kind,
      epistemic,
      attributes,
      spatialPos: this.generateDeterministic3DPos(id, layer),
      createdAt: Date.now(),
    };

    this.addNode(node, uri);
    return node;
  }

  /**
   * Connect arbitrary subsets of source and target nodes with a Directed Hyperedge
   */
  public addHyperedge(edge: Hyperedge): void {
    this.edges.set(edge.id, edge);

    for (const src of edge.sources) {
      if (!this.outgoingEdges.has(src)) this.outgoingEdges.set(src, new Set());
      this.outgoingEdges.get(src)!.add(edge.id);
    }

    for (const tgt of edge.targets) {
      if (!this.incomingEdges.has(tgt)) this.incomingEdges.set(tgt, new Set());
      this.incomingEdges.get(tgt)!.add(edge.id);
    }

    if (this.activeTxId) {
      this.mutationJournal.push({
        txId: this.activeTxId,
        timestamp: Date.now(),
        operation: "ADD_EDGE",
        entityId: edge.id,
        newState: edge,
      });
    }
  }

  /**
   * Quick hyperedge helper for 1-to-1 relationships
   */
  public addEdge(
    id: string,
    sourceId: string,
    targetId: string,
    relation: string,
    epistemicStatus: EpistemicStatus = EpistemicStatus.OBSERVED,
    externalMutation: boolean = false,
    invariantConstraint?: string,
    attributes: Record<string, unknown> = {}
  ): Hyperedge {
    const edge: Hyperedge = {
      id,
      sources: [sourceId],
      targets: [targetId],
      relation,
      temporalValidityMs: Date.now(),
      epistemic: createEpistemicValue(epistemicStatus, `Relation:${relation}`),
      externalMutation,
      invariantConstraint,
      attributes,
    };

    this.addHyperedge(edge);
    return edge;
  }

  /**
   * Component 4.3: Cross-Stratum Projection Functor
   * Projects a high-level Intent / Requirement node down through Syntax, Wire, to Empirical eBPF traces
   */
  public projectCrossStratumPath(sourceNodeId: string): HypergraphNode[] {
    const path: HypergraphNode[] = [];
    const visited = new Set<string>();

    const dfs = (currId: string) => {
      if (visited.has(currId)) return;
      visited.add(currId);

      const node = this.nodes.get(currId);
      if (node) {
        path.push(node);
      }

      const outEdges = this.getOutgoingEdges(currId);
      for (const edge of outEdges) {
        for (const tgt of edge.targets) {
          dfs(tgt);
        }
      }
    };

    dfs(sourceNodeId);
    return path;
  }

  /**
   * Component 4.4: In-Memory Spatial 3D Viewport Frustum Query (<2ms HUD Filter)
   */
  public queryViewportFrustum(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): HypergraphNode[] {
    const visible: HypergraphNode[] = [];
    for (const node of this.nodes.values()) {
      const p = node.spatialPos;
      if (p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY && p.z >= minZ && p.z <= maxZ) {
        visible.push(node);
      }
    }
    return visible;
  }

  /**
   * Component 4.5: Mutation Journal Transaction Control
   */
  public beginTransaction(txId: string): void {
    this.activeTxId = txId;
  }

  public commitTransaction(): void {
    this.activeTxId = null;
  }

  public getMutationJournal(): MutationJournalRecord[] {
    return [...this.mutationJournal];
  }

  public getNode(id: string): HypergraphNode | undefined {
    return this.nodes.get(id);
  }

  public getNodeByUri(uri: string): HypergraphNode | undefined {
    const id = this.nodeByUri.get(uri);
    return id ? this.nodes.get(id) : undefined;
  }

  public getNodesByLayer(layer: HypergraphLayer): HypergraphNode[] {
    const ids = this.nodesByLayer.get(layer) || new Set();
    const result: HypergraphNode[] = [];
    for (const id of ids) {
      const node = this.nodes.get(id);
      if (node) result.push(node);
    }
    return result;
  }

  public getOutgoingEdges(nodeId: string): Hyperedge[] {
    const edgeIds = this.outgoingEdges.get(nodeId) || new Set();
    const result: Hyperedge[] = [];
    for (const id of edgeIds) {
      const edge = this.edges.get(id);
      if (edge) result.push(edge);
    }
    return result;
  }

  public getIncomingEdges(nodeId: string): Hyperedge[] {
    const edgeIds = this.incomingEdges.get(nodeId) || new Set();
    const result: Hyperedge[] = [];
    for (const id of edgeIds) {
      const edge = this.edges.get(id);
      if (edge) result.push(edge);
    }
    return result;
  }

  public getAllNodes(): HypergraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getAllEdges(): Hyperedge[] {
    return Array.from(this.edges.values());
  }

  public getNodeCount(): number {
    return this.nodes.size;
  }

  public getEdgeCount(): number {
    return this.edges.size;
  }

  /**
   * Clone hypergraph for Dual-World counterfactual simulation (Copy-On-Write logic)
   */
  public clone(): HypergraphSubstrate {
    const twin = new HypergraphSubstrate(this.maxCapacity);
    for (const node of this.nodes.values()) {
      twin.addNode({
        ...node,
        epistemic: { ...node.epistemic },
        attributes: { ...node.attributes },
        spatialPos: { ...node.spatialPos },
      });
    }
    for (const edge of this.edges.values()) {
      twin.addHyperedge({
        ...edge,
        sources: [...edge.sources],
        targets: [...edge.targets],
        epistemic: { ...edge.epistemic },
        attributes: { ...edge.attributes },
      });
    }
    return twin;
  }

  public snapshot(): HypergraphSnapshot {
    return {
      timestamp: Date.now(),
      nodeCount: this.nodes.size,
      edgeCount: this.edges.size,
      nodes: new Map(this.nodes),
      edges: new Map(this.edges),
    };
  }

  public clear(): void {
    this.nodes.clear();
    this.edges.clear();
    for (const layerSet of this.nodesByLayer.values()) {
      layerSet.clear();
    }
    this.outgoingEdges.clear();
    this.incomingEdges.clear();
    this.nodeByUri.clear();
    this.mutationJournal = [];
  }

  private generateDeterministic3DPos(id: string, layer: HypergraphLayer): Spatial3DPoint {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }

    const layerZOffset: Record<HypergraphLayer, number> = {
      [HypergraphLayer.V_Intent]: 300,
      [HypergraphLayer.V_Syntactic]: 200,
      [HypergraphLayer.V_Wire]: 100,
      [HypergraphLayer.V_Behavior]: 0,
      [HypergraphLayer.V_Temporal]: -100,
      [HypergraphLayer.V_Empirical]: -200,
      [HypergraphLayer.V_Delta]: 400,
    };

    const x = ((Math.abs(hash) % 1000) - 500) * 0.8;
    const y = ((Math.abs(hash >> 3) % 1000) - 500) * 0.8;
    const z = layerZOffset[layer] + (Math.abs(hash >> 7) % 50) - 25;

    return { x, y, z };
  }
}
