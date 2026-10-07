/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Phase 41: Uncertainty Reduction & Experiment Engine
 *
 * Grounding Rule:
 *   VANTAIR turns UNKNOWN spaces into actionable empirical experiments.
 *   Finds the single cheapest experiment that maximizes information gain while
 *   minimizing execution risk and cost.
 *
 * Loop:
 *   UNKNOWN -> EXPERIMENT PLAN -> EXECUTION -> OBSERVATION -> EVIDENCE -> MODEL UPDATE.
 */

import { SystemUnknown, RealityIR } from "../../reality/ir/reality_ir";

export interface SystemExperiment {
  experimentId: string;
  targetUnknownId: string;
  title: string;
  hypothesis: string;
  actionPlan: {
    commandOrAction: string;
    targetFileOrService: string;
    executionMode: "LOCAL_UNIT_TEST" | "OTEL_SENSOR_ATTACH" | "SANDBOX_SMOKE_RUN";
    estimatedRuntimeSec: number;
    safetyRisk: "ZERO" | "LOW_SANDBOX" | "REQUIRES_STAGING";
  };
  expectedInformationGainScore: number; // [0, 1]
  costScore: number;                    // [1 (cheap), 10 (expensive)]
  efficiencyRatio: number;              // informationGain / costScore
}

export class ExperimentEngine {
  /**
   * Plans and ranks the cheapest experiments to reduce system uncertainty.
   */
  public planOptimalExperiments(ir: RealityIR): SystemExperiment[] {
    const experiments: SystemExperiment[] = [];

    for (const unk of ir.unknowns) {
      let cost = 1;
      let gain = unk.recommendedExperiment.estimatedUncertaintyReduction || 0.2;
      let safetyRisk: SystemExperiment["actionPlan"]["safetyRisk"] = "ZERO";

      switch (unk.recommendedExperiment.actionType) {
        case "WRITE_UNIT_TEST":
          cost = 2;
          gain = 0.35;
          safetyRisk = "ZERO";
          break;
        case "DEPLOY_OTEL_PROBE":
          cost = 4;
          gain = 0.55;
          safetyRisk = "LOW_SANDBOX";
          break;
        case "EXECUTE_SMOKE_RUN":
          cost = 3;
          gain = 0.40;
          safetyRisk = "LOW_SANDBOX";
          break;
        default:
          cost = 2;
          gain = 0.20;
          safetyRisk = "ZERO";
      }

      const efficiency = Number((gain / cost).toFixed(3));

      experiments.push({
        experimentId: `exp-${unk.id}`,
        targetUnknownId: unk.id,
        title: `Illuminate ${unk.title}`,
        hypothesis: `Executing ${unk.recommendedExperiment.actionType} will resolve unexercised states in ${unk.targetEntityId || "system"}.`,
        actionPlan: {
          commandOrAction: unk.recommendedExperiment.description,
          targetFileOrService: unk.targetEntityId || "global",
          executionMode:
            unk.recommendedExperiment.actionType === "DEPLOY_OTEL_PROBE"
              ? "OTEL_SENSOR_ATTACH"
              : "LOCAL_UNIT_TEST",
          estimatedRuntimeSec: cost * 3,
          safetyRisk
        },
        expectedInformationGainScore: gain,
        costScore: cost,
        efficiencyRatio: efficiency
      });
    }

    // Sort by efficiency (maximum information gain per unit cost)
    experiments.sort((a, b) => b.efficiencyRatio - a.efficiencyRatio);

    return experiments;
  }

  /**
   * Finds the single cheapest experiment that eliminates the most uncertainty.
   */
  public getCheapestHighestGainExperiment(ir: RealityIR): SystemExperiment | null {
    const sorted = this.planOptimalExperiments(ir);
    return sorted.length > 0 ? sorted[0] : null;
  }
}
