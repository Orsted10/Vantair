import { NextRequest, NextResponse } from "next/server";
import { CausalDoCalculusEngine } from "../../../engine/causal_docalculus";
import { DualWorldSimulationEngine } from "../../../engine/dual_world_sim";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const targetVariableId = body.targetVariableId || "RedisCache_Available";
    const forcedValue = body.forcedValue !== undefined ? Number(body.forcedValue) : 0.0;
    const action = body.action || (forcedValue === 0 ? "EXCISE" : "MUTATE_VALUE");

    const causalEngine = new CausalDoCalculusEngine();
    const causalResult = causalEngine.executeCounterfactualIntervention({
      targetVariableId,
      action,
      forcedValue,
    });

    const dualWorldEngine = new DualWorldSimulationEngine();
    const dualWorldResult = dualWorldEngine.runDualWorldSimulation(100000, 60.0);

    return NextResponse.json({
      status: "SUCCESS",
      causalIntervention: causalResult,
      dualWorldSimulation: dualWorldResult,
    });
  } catch (error: any) {
    console.error("API /api/simulate error:", error);
    return NextResponse.json({ status: "ERROR", message: error.message }, { status: 500 });
  }
}
