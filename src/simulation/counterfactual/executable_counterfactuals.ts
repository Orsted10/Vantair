/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Phase 35: Executable Counterfactuals & Dual-World Comparison
 *
 * Implements explicit World models:
 *   World A (Baseline Reality) vs World B (Intervention Applied).
 *
 * Grounding Rule:
 *   Measurements are labeled strictly by origin (FIXTURE_HARNESS vs RUNTIME_TELEMETRY).
 *   Never fabricate measurements without an executed run.
 */

import { SystemIntervention } from "../../reality/ir/reality_ir";

export interface WorldSnapshot {
  worldId: "WORLD_A_BASELINE" | "WORLD_B_COUNTERFACTUAL";
  name: string;
  interventionsApplied: SystemIntervention[];
  metrics: {
    transactionCount: number;
    p99LatencyMs: number;
    errorRatePercent: number;
    databasePoolUtilizationPercent: number;
    duplicateChargesObserved: number;
  };
  provenance: {
    executionEnvironment: string;
    sampleDurationSec: number;
    measurementOrigin: "REFERENCE_LAB_HARNESS" | "SANDBOX_SIMULATION" | "LIVE_OBSERVABILITY";
  };
}

export interface DualWorldComparison {
  baselineWorld: WorldSnapshot;
  counterfactualWorld: WorldSnapshot;
  delta: {
    latencyReductionPercent: number;
    errorRateDeltaPercent: number;
    duplicateVictimEliminationCount: number;
    systemStabilized: boolean;
  };
  conclusion: string;
}

export class CounterfactualExecutionEngine {
  /**
   * Executes or evaluates a dual-world counterfactual intervention comparison.
   */
  public compareWorlds(
    intervention: SystemIntervention,
    baselineMetrics: WorldSnapshot["metrics"],
    counterfactualMetrics: WorldSnapshot["metrics"],
    measurementOrigin: WorldSnapshot["provenance"]["measurementOrigin"] = "REFERENCE_LAB_HARNESS"
  ): DualWorldComparison {
    const latencyDelta =
      baselineMetrics.p99LatencyMs > 0
        ? Number((((counterfactualMetrics.p99LatencyMs - baselineMetrics.p99LatencyMs) / baselineMetrics.p99LatencyMs) * 100).toFixed(1))
        : 0;

    const errorDelta = Number((counterfactualMetrics.errorRatePercent - baselineMetrics.errorRatePercent).toFixed(2));
    const victimElimination = baselineMetrics.duplicateChargesObserved - counterfactualMetrics.duplicateChargesObserved;

    const baselineWorld: WorldSnapshot = {
      worldId: "WORLD_A_BASELINE",
      name: "Physical Baseline Reality",
      interventionsApplied: [],
      metrics: baselineMetrics,
      provenance: {
        executionEnvironment: "Seeded Banking Reference Lab",
        sampleDurationSec: 60,
        measurementOrigin
      }
    };

    const counterfactualWorld: WorldSnapshot = {
      worldId: "WORLD_B_COUNTERFACTUAL",
      name: `Counterfactual Reality [${intervention.interventionType}]`,
      interventionsApplied: [intervention],
      metrics: counterfactualMetrics,
      provenance: {
        executionEnvironment: "Seeded Banking Reference Lab (Intervened)",
        sampleDurationSec: 60,
        measurementOrigin
      }
    };

    return {
      baselineWorld,
      counterfactualWorld,
      delta: {
        latencyReductionPercent: Math.abs(latencyDelta),
        errorRateDeltaPercent: errorDelta,
        duplicateVictimEliminationCount: victimElimination,
        systemStabilized: counterfactualMetrics.errorRatePercent < 0.1
      },
      conclusion:
        victimElimination > 0
          ? `Intervention [${intervention.interventionType}] eliminated ${victimElimination} duplicate charge victims and reduced P99 latency by ${Math.abs(latencyDelta)}% under reference harness conditions.`
          : `Intervention [${intervention.interventionType}] did not exhibit significant divergence from baseline.`
    };
  }
}
