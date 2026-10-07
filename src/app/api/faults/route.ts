import { NextRequest, NextResponse } from "next/server";
import { SeededBankingFaultHarness, FaultScenarioType } from "../../../engine/seeded_banking_repo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const scenario: FaultScenarioType = body.scenario || "GATEWAY_LATENCY_SPIKE";

    const harness = new SeededBankingFaultHarness();
    const report = harness.executeFaultRun(scenario, body.overrideConfig);

    return NextResponse.json({
      status: "SUCCESS",
      report,
    });
  } catch (error: any) {
    console.error("API /api/faults error:", error);
    return NextResponse.json({ status: "ERROR", message: error.message }, { status: 500 });
  }
}
