import { NextRequest, NextResponse } from "next/server";
import * as path from "path";
import { GenesisWorkspaceEngine } from "../../../engine/genesis_workspace";
import { UniversalASTParser } from "../../../engine/ast_universal_parser";
import { WireSchemaIngestor } from "../../../engine/wire_schemas_ingest";
import { CFGDfgTaintEngine } from "../../../engine/cfg_dfg_taint";
import { CPNConcurrencyEngine } from "../../../engine/petri_concurrency";
import { ChronoGitDAGEngine } from "../../../engine/chrono_git_dag";
import { TeleologicalIntentCompiler } from "../../../engine/ltl_intent_compiler";
import { EmpiricalEBPFSensorsEngine } from "../../../engine/ebpf_sensors";
import { PolygraphContradictionEngine } from "../../../engine/polygraph_bisim";
import { SystemConstitutionEngine } from "../../../engine/constitution_laws";
import { DarkMatterHarvestEngine } from "../../../engine/dark_matter_harvest";
import { IncidentAutopsyEngine } from "../../../engine/autopsy_forensics";

export async function GET(request: NextRequest) {
  try {
    const workspaceRoot = process.cwd();

    // 1. Genesis Workspace
    const genesis = new GenesisWorkspaceEngine(100000);
    genesis.bootstrap(workspaceRoot);
    const hg = genesis.hypergraph;

    // 2. Parse Syntactic ASTs
    const parser = new UniversalASTParser();
    const demoFiles = [
      path.join(workspaceRoot, "src/demo_repo/services/OrderService.ts"),
      path.join(workspaceRoot, "src/demo_repo/services/RefundOrchestrator.ts"),
      path.join(workspaceRoot, "src/demo_repo/services/PaymentGateway.ts"),
      path.join(workspaceRoot, "src/demo_repo/services/RedisCache.ts"),
      path.join(workspaceRoot, "src/demo_repo/services/PostgresDB.ts"),
    ];
    const astRoots = [];
    for (const fPath of demoFiles) {
      const res = parser.parseFile(fPath);
      parser.ingestToHypergraph(res, hg);
      astRoots.push(res.rootNode);
    }

    // 3. Ingest Wire Schemas
    const wire = new WireSchemaIngestor();
    const restEndpoints = wire.parseOpenAPI(
      JSON.stringify({
        openapi: "3.0.0",
        paths: { "/api/v1/refund": { post: { operationId: "executeRefund" } } },
      })
    );
    wire.ingestToHypergraph(
      { restEndpoints, grpcMethods: [], graphQLOps: [], eventTopics: [], dbTables: [], ingestionTimeMs: 1 },
      hg
    );

    // 4. CFG & Taint Analysis
    const cfgEngine = new CFGDfgTaintEngine();
    const cfgResult = cfgEngine.analyzeProgram(astRoots, "src/demo_repo/services/RefundOrchestrator.ts");
    cfgEngine.ingestToHypergraph(cfgResult, hg);

    // 5. Petri Net Concurrency
    const petriEngine = new CPNConcurrencyEngine();
    const petriResult = petriEngine.analyzeConcurrency();
    petriEngine.ingestToHypergraph(petriResult, hg);

    // 6. Chrono-DAG
    const chronoEngine = new ChronoGitDAGEngine();
    const chronoResult = chronoEngine.analyzeChronoDAG(workspaceRoot);
    chronoEngine.ingestToHypergraph(chronoResult, hg);

    // 7. LTL Intent
    const ltlEngine = new TeleologicalIntentCompiler();
    const ltlResult = ltlEngine.compileIntentDirectory(workspaceRoot);
    ltlEngine.ingestToHypergraph(ltlResult, hg);

    // 8. eBPF Empirical Sensors
    const ebpfEngine = new EmpiricalEBPFSensorsEngine();
    const empiricalResult = ebpfEngine.runEmpiricalAnalysis(workspaceRoot);
    ebpfEngine.ingestToHypergraph(empiricalResult, hg);

    // 10. Polygraph Bi-Simulation
    const polygraph = new PolygraphContradictionEngine();
    const polygraphResult = polygraph.runPolygraphAnalysis(hg);
    polygraph.ingestToHypergraph(polygraphResult, hg);

    // 12. Constitution Laws
    const constEngine = new SystemConstitutionEngine();
    const constReport = constEngine.verifyConstitution(hg, false);
    constEngine.ingestToHypergraph(constReport, hg);

    // 13. Dark Matter Harvester
    const darkMatterEngine = new DarkMatterHarvestEngine();
    const darkMatterReport = darkMatterEngine.harvestDarkMatter(cfgResult.cfgs, petriResult, hg);
    darkMatterEngine.ingestToHypergraph(darkMatterReport, hg);

    // 14. Incident Autopsy
    const autopsyEngine = new IncidentAutopsyEngine();
    const autopsyReport = autopsyEngine.performAutopsy(
      {
        incidentId: "INC-2024-BLACKFRIDAY-9901",
        incidentTimestampMs: Date.now() - 1000 * 60 * 30,
        initialAlertSymptom: "OrderService HTTP 503 Outage",
        affectedEntrypointUrl: "/api/v1/refund",
        reportedErrorCodes: ["HTTP_503", "PG_CONN_TIMEOUT", "GATEWAY_TIMEOUT"],
        telemetrySpikeMetrics: {
          PaymentGateway_P99Ms: 4810,
          Postgres_Connections: 100,
          DuplicateRefundCount: 412,
        },
      },
      chronoResult,
      hg
    );
    autopsyEngine.ingestToHypergraph(autopsyReport, hg);

    return NextResponse.json({
      status: "SUCCESS",
      totalNodes: hg.getAllNodes().length,
      totalEdges: hg.getAllEdges().length,
      polygraph: polygraphResult,
      constitution: constReport,
      darkMatter: darkMatterReport,
      autopsy: autopsyReport,
    });
  } catch (error: any) {
    console.error("API /api/analyze error:", error);
    return NextResponse.json({ status: "ERROR", message: error.message }, { status: 500 });
  }
}
