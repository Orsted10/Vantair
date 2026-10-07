/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Phase 28: Spatiotemporal Model Graph & Architecture Drift
 *
 * Implements historical model diffing across immutable snapshots.
 * Answers: "When did this architectural dependency appear? How has reality drifted?"
 */

import { RealityIR } from "../ir/reality_ir";

export interface ModelDelta {
  fromSnapshotId: string;
  toSnapshotId: string;
  fromCommitSha: string;
  toCommitSha: string;
  timestamp: string;
  addedEntities: string[];
  removedEntities: string[];
  addedRelationships: string[];
  removedRelationships: string[];
  contractDivergencesIntroduced: string[];
  contractDivergencesResolved: string[];
  newContradictions: string[];
  resolvedContradictions: string[];
  unknownsReduced: string[];
  unknownsIntroduced: string[];
  architecturalDriftScore: number; // [0, 1]
}

export class TemporalSnapshotGraph {
  private snapshots: Map<string, RealityIR> = new Map();
  private commitOrder: string[] = []; // Chronological snapshot IDs

  /**
   * Registers a versioned Reality IR into the temporal graph.
   */
  public registerSnapshotIR(ir: RealityIR): void {
    this.snapshots.set(ir.sourceSnapshot.snapshotId, ir);
    if (!this.commitOrder.includes(ir.sourceSnapshot.snapshotId)) {
      this.commitOrder.push(ir.sourceSnapshot.snapshotId);
    }
  }

  /**
   * Computes a structured delta between two snapshot models.
   */
  public computeDelta(fromSnapshotId: string, toSnapshotId: string): ModelDelta {
    const fromIR = this.snapshots.get(fromSnapshotId);
    const toIR = this.snapshots.get(toSnapshotId);

    if (!fromIR || !toIR) {
      throw new Error(`One or both snapshot IDs not found in temporal graph: ${fromSnapshotId}, ${toSnapshotId}`);
    }

    const fromEntityNames = new Set(fromIR.entities.map(e => e.name));
    const toEntityNames = new Set(toIR.entities.map(e => e.name));

    const addedEntities = toIR.entities.filter(e => !fromEntityNames.has(e.name)).map(e => e.name);
    const removedEntities = fromIR.entities.filter(e => !toEntityNames.has(e.name)).map(e => e.name);

    const fromRelKeys = new Set(fromIR.relationships.map(r => `${r.sourceEntityId}->${r.targetEntityId}:${r.kind}`));
    const toRelKeys = new Set(toIR.relationships.map(r => `${r.sourceEntityId}->${r.targetEntityId}:${r.kind}`));

    const addedRelationships = toIR.relationships.filter(r => !fromRelKeys.has(`${r.sourceEntityId}->${r.targetEntityId}:${r.kind}`)).map(r => `${r.sourceEntityId} ${r.kind} ${r.targetEntityId}`);
    const removedRelationships = fromIR.relationships.filter(r => !toRelKeys.has(`${r.sourceEntityId}->${r.targetEntityId}:${r.kind}`)).map(r => `${r.sourceEntityId} ${r.kind} ${r.targetEntityId}`);

    const fromContraTitles = new Set(fromIR.contradictions.map(c => c.title));
    const toContraTitles = new Set(toIR.contradictions.map(c => c.title));

    const newContradictions = toIR.contradictions.filter(c => !fromContraTitles.has(c.title)).map(c => c.title);
    const resolvedContradictions = fromIR.contradictions.filter(c => !toContraTitles.has(c.title)).map(c => c.title);

    const fromUnknownTitles = new Set(fromIR.unknowns.map(u => u.title));
    const toUnknownTitles = new Set(toIR.unknowns.map(u => u.title));

    const unknownsIntroduced = toIR.unknowns.filter(u => !fromUnknownTitles.has(u.title)).map(u => u.title);
    const unknownsReduced = fromIR.unknowns.filter(u => !toUnknownTitles.has(u.title)).map(u => u.title);

    // Architectural drift calculation
    const totalEntities = Math.max(1, fromIR.entities.length + toIR.entities.length);
    const totalRels = Math.max(1, fromIR.relationships.length + toIR.relationships.length);
    const entityChurn = (addedEntities.length + removedEntities.length) / totalEntities;
    const relChurn = (addedRelationships.length + removedRelationships.length) / totalRels;
    const driftScore = Math.min(1.0, Number((entityChurn * 0.4 + relChurn * 0.6).toFixed(4)));

    return {
      fromSnapshotId,
      toSnapshotId,
      fromCommitSha: fromIR.sourceSnapshot.commitSha,
      toCommitSha: toIR.sourceSnapshot.commitSha,
      timestamp: new Date().toISOString(),
      addedEntities,
      removedEntities,
      addedRelationships,
      removedRelationships,
      contractDivergencesIntroduced: [],
      contractDivergencesResolved: [],
      newContradictions,
      resolvedContradictions,
      unknownsReduced,
      unknownsIntroduced,
      architecturalDriftScore: driftScore
    };
  }

  /**
   * Returns all available snapshots in temporal order.
   */
  public getChronology(): string[] {
    return [...this.commitOrder];
  }
}
