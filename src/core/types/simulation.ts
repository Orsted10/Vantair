/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Core Domain: Counterfactual Simulation & Dual-World Types
 */

import { SystemModelSnapshot } from "./system_model";

export type InterventionType =
  | "REMOVE_DEPENDENCY"
  | "REPLACE_COMPONENT"
  | "INJECT_LATENCY"
  | "SIMULATE_PARTITION"
  | "INCREASE_TRAFFIC"
  | "MODIFY_CONFIG"
  | "APPLY_CODE_PATCH";

export interface CounterfactualIntervention {
  id: string;
  type: InterventionType;
  targetEntityId: string;
  targetName: string;
  parameters: Record<string, unknown>;
  rationale: string;
}

export interface MetricDivergence {
  metricName: string;
  baselinePhysicalValue: number;
  counterfactualModelValue: number;
  unit: string;
  divergencePercent: number;
  isImprovement: boolean;
}

export interface SimulationResult {
  id: string;
  projectId: string;
  baselineSnapshotId: string;
  title: string;
  intervention: CounterfactualIntervention;
  isSafe: boolean;
  systemCollapsed: boolean;
  timeToCollapseSec?: number;
  collapseReason?: string;
  blastRadiusEntityIds: string[];
  metricDivergences: MetricDivergence[];
  violatedInvariantIds: string[];
  remediatedInvariantIds: string[];
  causalChain: string[];
  recommendedMitigation?: string;
  createdAt: number;
}
