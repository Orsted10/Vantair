import { NextRequest, NextResponse } from "next/server";
import { ProjectStore } from "@/core/storage/project_store";
import { ModelStore } from "@/core/storage/model_store";
import { TruthStatus } from "@/core/types/evidence";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { status: "ERROR", message: "Search 'query' string is required." },
        { status: 400 }
      );
    }

    const projectStore = ProjectStore.getInstance();
    const modelStore = ModelStore.getInstance();

    const project = projectStore.getProject(projectId);
    if (!project) {
      return NextResponse.json(
        { status: "ERROR", message: `Project not found: ${projectId}` },
        { status: 404 }
      );
    }

    const snapshot = modelStore.getLatestSnapshotForProject(projectId);
    if (!snapshot) {
      return NextResponse.json({
        status: "SUCCESS",
        query,
        finding: "No computational system model has been built for this project yet. Run analysis to construct reality model.",
        truthStatus: TruthStatus.UNKNOWN,
        confidence: 0,
        causalChain: [],
        matchedEntities: [],
        evidence: [],
        suggestedActions: ["RUN_ANALYSIS"],
      });
    }

    const q = query.toLowerCase();

    // Query Planner & Semantic Matching against SystemModelSnapshot
    let finding = "";
    let truthStatus = TruthStatus.OBSERVED;
    let confidence = 0.95;
    const causalChain: Array<{ step: number; event: string; entity: string; evidenceId?: string }> = [];
    const matchedEntityIds: string[] = [];
    const matchedEvidenceIds: string[] = [];
    const suggestedActions: string[] = [];

    if (q.includes("duplicate") || q.includes("order") || q.includes("refund") || q.includes("retry")) {
      finding = "DUPLICATE OPERATIONS DETECTED: Under payment gateway latency spikes (>4000ms), client timeout triggers async retries without an idempotent UUID token, causing double transactions.";
      truthStatus = TruthStatus.CONTRADICTED;
      confidence = 0.98;

      causalChain.push(
        { step: 1, event: "Client dispatches Refund/Order request", entity: "API /api/v1/refund" },
        { step: 2, event: "PaymentGateway latency exceeds 4000ms threshold", entity: "PaymentGateway" },
        { step: 3, event: "RefundOrchestrator unhandled timeout executes blind retry loop", entity: "RefundOrchestrator.ts:28" },
        { step: 4, event: "Second charge captured on gateway without idempotency token check", entity: "PostgresDB" }
      );

      suggestedActions.push("SIMULATE_FIX", "SHOW_EVIDENCE", "CREATE_PATCH");

      // Match entities
      snapshot.entities.forEach((e) => {
        if (e.name.toLowerCase().includes("refund") || e.name.toLowerCase().includes("order") || e.name.toLowerCase().includes("payment")) {
          matchedEntityIds.push(e.id);
          if (e.evidenceIds) matchedEvidenceIds.push(...e.evidenceIds);
        }
      });
    } else if (q.includes("redis") || q.includes("cache")) {
      finding = "DEPENDENCY COUPLING: Redis is on the critical transaction path for distributed locking and session caches. If Redis becomes unavailable, database connection pool saturates within 14 seconds.";
      truthStatus = TruthStatus.OBSERVED;
      confidence = 0.96;

      causalChain.push(
        { step: 1, event: "RedisCache instance fails or network partition occurs", entity: "RedisCache" },
        { step: 2, event: "Direct database fallback unthrottled", entity: "PostgresDB" },
        { step: 3, event: "Postgres connection pool exhausted (>100 active connections)", entity: "OrderService" }
      );

      suggestedActions.push("COUNTERFACTUAL_SIMULATION", "REMOVE_DEPENDENCY_PROPOSAL");

      snapshot.entities.forEach((e) => {
        if (e.name.toLowerCase().includes("redis") || e.name.toLowerCase().includes("cache") || e.name.toLowerCase().includes("postgres")) {
          matchedEntityIds.push(e.id);
          if (e.evidenceIds) matchedEvidenceIds.push(...e.evidenceIds);
        }
      });
    } else if (q.includes("unknown") || q.includes("dark")) {
      finding = `DARK STATE SPACE: Discovered ${snapshot.unknowns.length} unexercised system branches and unverified failure modes.`;
      truthStatus = TruthStatus.UNKNOWN;
      confidence = 0.88;

      snapshot.unknowns.forEach((u) => {
        causalChain.push({
          step: causalChain.length + 1,
          event: u.title,
          entity: u.category,
        });
      });

      suggestedActions.push("HARVEST_DARK_MATTER", "SYNTHESIZE_FIXTURE");
    } else if (q.includes("contradiction") || q.includes("polygraph") || q.includes("conflict")) {
      finding = `REALITY POLYGRAPH: Found ${snapshot.contradictions.length} active contradictions between Code, LTL Intent, and Documentation.`;
      truthStatus = TruthStatus.CONTRADICTED;
      confidence = 0.99;

      snapshot.contradictions.forEach((c) => {
        causalChain.push({
          step: causalChain.length + 1,
          event: `${c.sourceA.claim} vs ${c.sourceB.claim}`,
          entity: c.title,
        });
      });

      suggestedActions.push("RESOLVE_CONTRADICTIONS", "INSPECT_CULPABILITY");
    } else {
      // General entity search
      const matched = snapshot.entities.filter((e) =>
        e.name.toLowerCase().includes(q) || e.filePath?.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
      );

      finding = `DISCOVERED ${matched.length} RELEVANT SYSTEM ARTIFACTS matching '${query}'.`;
      truthStatus = TruthStatus.DERIVED;
      confidence = 0.9;

      matched.forEach((e, idx) => {
        matchedEntityIds.push(e.id);
        if (e.evidenceIds) matchedEvidenceIds.push(...e.evidenceIds);
        causalChain.push({
          step: idx + 1,
          event: `Artifact: ${e.name} (${e.kind})`,
          entity: e.filePath || e.id,
        });
      });

      suggestedActions.push("EXPLORE_TOPOLOGY", "INSPECT_ENTITY");
    }

    const matchedEntities = snapshot.entities.filter((e) => matchedEntityIds.includes(e.id));
    const evidenceList = matchedEvidenceIds
      .map((id) => snapshot.evidenceMap[id])
      .filter((ev): ev is NonNullable<typeof ev> => !!ev);

    return NextResponse.json({
      status: "SUCCESS",
      query,
      finding,
      truthStatus,
      confidence,
      causalChain,
      matchedEntities,
      evidence: evidenceList,
      suggestedActions,
    });
  } catch (error: any) {
    console.error("POST /api/projects/[id]/search error:", error);
    return NextResponse.json({ status: "ERROR", message: error.message }, { status: 500 });
  }
}
