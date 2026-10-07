/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Comprehensive Verification Test Suite for Phases 01 through 10
 */

import * as path from "path";
import { GenesisWorkspaceEngine } from "../src/engine/genesis_workspace";
import { HypergraphSubstrate, HypergraphLayer } from "../src/engine/hypergraph_substrate";
import { EpistemicStatus, createEpistemicValue, epistemicJoin } from "../src/types/epistemic";
import { UniversalASTParser } from "../src/engine/ast_universal_parser";
import { WireSchemaIngestor } from "../src/engine/wire_schemas_ingest";
import { CFGDfgTaintEngine } from "../src/engine/cfg_dfg_taint";
import { CPNConcurrencyEngine } from "../src/engine/petri_concurrency";
import { ChronoGitDAGEngine } from "../src/engine/chrono_git_dag";
import { TeleologicalIntentCompiler } from "../src/engine/ltl_intent_compiler";
import { EmpiricalEBPFSensorsEngine } from "../src/engine/ebpf_sensors";
import { PolygraphContradictionEngine } from "../src/engine/polygraph_bisim";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runPhases1To10Verification() {
  console.log("\n==========================================================================");
  console.log("  VANTAIR COMPUTATIONAL SOFTWARE REALITY ENGINE - PHASES 01-10 VERIFICATION");
  console.log("==========================================================================\n");

  const workspaceRoot = path.resolve(__dirname, "..");

  // --------------------------------------------------------------------------
  // TEST SECTION 1: PHASE 01 GENESIS WORKSPACE BOOTSTRAP
  // --------------------------------------------------------------------------
  console.log("--- PHASE 01: SYSTEM GENESIS & MONOREPO TOPOLOGY ---");
  const genesis = new GenesisWorkspaceEngine(100000);
  const bootstrapResult = genesis.bootstrap(workspaceRoot);
  assert(bootstrapResult.success, "Genesis Workspace bootstrap executed successfully");
  assert(bootstrapResult.durationMs < 1000, `Bootstrap completed in ${bootstrapResult.durationMs}ms`);

  const hg = genesis.hypergraph;
  const mem = genesis.governor.checkMemoryMetrics();
  assert(mem.heapUsedMB < 512, `Heap memory (${mem.heapUsedMB}MB) strictly below 512MB ceiling`);

  // --------------------------------------------------------------------------
  // TEST SECTION 2: PHASE 02 UNIVERSAL AST PARSER & POLYGLOT CORE
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 02: UNIVERSAL POLYGLOT PARSER & SYNTACTIC AST CORE ---");
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
    assert(res.symbols.length > 0, `Parsed TypeScript file: ${path.basename(fPath)}`);
    parser.ingestToHypergraph(res, hg);
    astRoots.push(res.rootNode);
  }

  assert(parser.parseFile("service.py", "def refund(order_id):\n    pass").language === "python", "Python Lexer parsed service.py");
  assert(parser.parseFile("service.go", "package main\nfunc Refund() {}").language === "go", "Go Lexer parsed service.go");
  assert(parser.parseFile("service.rs", "pub fn refund() {}").language === "rust", "Rust Lexer parsed service.rs");
  assert(parser.parseFile("Service.java", "public class Service {}").language === "java", "Java Lexer parsed Service.java");

  // --------------------------------------------------------------------------
  // TEST SECTION 3: PHASE 03 DISTRIBUTED TOPOLOGY & WIRE SCHEMAS INGESTION
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 03: DISTRIBUTED TOPOLOGY & WIRE SCHEMAS INGESTION ---");
  const wireIngestor = new WireSchemaIngestor();
  const openApiSpec = JSON.stringify({
    openapi: "3.0.0",
    paths: { "/api/v1/refund": { post: { operationId: "executeRefund" } } },
  });
  const restEndpoints = wireIngestor.parseOpenAPI(openApiSpec);
  const grpcMethods = wireIngestor.parseProtobuf(`syntax = "proto3"; service PaymentService { rpc ProcessRefund (Req) returns (Res); }`);
  const graphQLOps = wireIngestor.parseGraphQL(`type Mutation { requestRefund(orderId: String!): Boolean! }`);
  const eventTopics = wireIngestor.parseAsyncAPI(`topic: banking.refunds.requested`);
  const dbTables = wireIngestor.parseDDL(`CREATE TABLE orders (id VARCHAR(64) PRIMARY KEY); CREATE TABLE refunds (id VARCHAR(64), order_id VARCHAR(64), FOREIGN KEY (order_id) REFERENCES orders(id));`);

  wireIngestor.ingestToHypergraph({ restEndpoints, grpcMethods, graphQLOps, eventTopics, dbTables, ingestionTimeMs: 1 }, hg);
  assert(hg.getNodesByLayer(HypergraphLayer.V_Wire).length > 0, "Hypergraph V_Wire stratum populated");

  // --------------------------------------------------------------------------
  // TEST SECTION 4: PHASE 04 CONTROL-FLOW (CFG), DATA-FLOW (DFG) & TAINT ENGINE
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 04: BEHAVIORAL CONTROL-FLOW & DATA-FLOW TAINT ENGINE ---");
  const cfgEngine = new CFGDfgTaintEngine();
  const cfgResult = cfgEngine.analyzeProgram(astRoots, "src/demo_repo/services/RefundOrchestrator.ts");
  assert(cfgResult.cfgs.length > 0, `Generated ${cfgResult.cfgs.length} Control-Flow Graphs (CFGs)`);
  assert(cfgResult.vulnerabilities.length > 0, `Taint Engine detected ${cfgResult.vulnerabilities.length} security vulnerabilities`);
  cfgEngine.ingestToHypergraph(cfgResult, hg);

  // --------------------------------------------------------------------------
  // TEST SECTION 5: PHASE 05 COLORED PETRI NET WITH TIME (CPN-TI) CONCURRENCY SYNTHESIZER
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 05: COLORED PETRI NET WITH TIME (CPN-TI) CONCURRENCY SYNTHESIZER ---");
  const petriEngine = new CPNConcurrencyEngine();
  const petriResult = petriEngine.analyzeConcurrency();
  assert(petriResult.placeCount >= 5, `Synthesized Bipartite Petri Net with ${petriResult.placeCount} Places`);
  assert(petriResult.hazards.length > 0, `Concurrency Hazard Detector surfaced ${petriResult.hazards.length} hazards`);
  petriEngine.ingestToHypergraph(petriResult, hg);

  // --------------------------------------------------------------------------
  // TEST SECTION 6: PHASE 06 4D SPATIOTEMPORAL GIT CHRONO-DAG & BLAME ENTROPY ENGINE
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 06: 4D SPATIOTEMPORAL GIT CHRONO-DAG & BLAME ENTROPY ENGINE ---");
  const chronoEngine = new ChronoGitDAGEngine();
  const chronoResult = chronoEngine.analyzeChronoDAG(workspaceRoot);
  assert(chronoResult.commits.length >= 4, `Chrono-DAG parsed ${chronoResult.commits.length} commit DAG nodes`);
  assert(chronoResult.techDebtMarkers.length > 0, `Tech Debt Hunter discovered ${chronoResult.techDebtMarkers.length} abandoned hacks`);
  chronoEngine.ingestToHypergraph(chronoResult, hg);

  // --------------------------------------------------------------------------
  // TEST SECTION 7: PHASE 07 TELEOLOGICAL INTENT & FORMAL LTL INVARIANT COMPILER
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 07: TELEOLOGICAL INTENT & FORMAL LTL INVARIANT COMPILER ---");
  const ltlCompiler = new TeleologicalIntentCompiler();
  const ltlResult = ltlCompiler.compileIntentDirectory(workspaceRoot);
  assert(ltlResult.compiledAutomata.length > 0, `Compiled ${ltlResult.compiledAutomata.length} Generalized Büchi Automata (GBA)`);
  ltlCompiler.ingestToHypergraph(ltlResult, hg);

  // --------------------------------------------------------------------------
  // TEST SECTION 8: PHASE 08 ZERO-OVERHEAD EMPIRICAL RUNTIME SENSORS (eBPF & OPENTELEMETRY)
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 08: ZERO-OVERHEAD EMPIRICAL RUNTIME SENSORS (eBPF & OPENTELEMETRY) ---");
  const ebpfEngine = new EmpiricalEBPFSensorsEngine();
  const empiricalResult = ebpfEngine.runEmpiricalAnalysis(workspaceRoot);
  assert(empiricalResult.breachWitnesses.length > 0, `Empirical Invariant Witness Validator detected ${empiricalResult.breachWitnesses.length} live breaches`);
  ebpfEngine.ingestToHypergraph(empiricalResult, hg);

  // --------------------------------------------------------------------------
  // TEST SECTION 9: PHASE 09 7-LAYER EPISTEMIC HYPERGRAPH SUBSTRATE SYNTHESIZER
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 09: THE 7-LAYER EPISTEMIC HYPERGRAPH SUBSTRATE ---");
  
  // Test 9.1: Spatial 3D Octree Viewport Query (<2ms HUD filter)
  const visibleNodes = hg.queryViewportFrustum(-1000, 1000, -1000, 1000, -500, 500);
  assert(visibleNodes.length >= 20, `Spatial 3D Octree query returned ${visibleNodes.length} nodes in camera viewport`);

  // Test 9.2: Cross-Stratum Projection Functor
  const intentNode = hg.getNodesByLayer(HypergraphLayer.V_Intent)[0];
  assert(intentNode !== undefined, "Intent Stratum node retrieved for functor projection");
  if (intentNode) {
    const crossPath = hg.projectCrossStratumPath(intentNode.id);
    assert(crossPath.length > 0, `Cross-Stratum Projection Functor generated path of ${crossPath.length} nodes from Intent -> Reality`);
  }

  // Test 9.3: Mutation Journal Transaction Control & Copy-On-Write Delta Checkpointer
  hg.beginTransaction("tx_test_001");
  hg.createNode("n_delta_test", HypergraphLayer.V_Delta, "Twin_Fix_Node", "MutatedNode", EpistemicStatus.HYPOTHESIZED);
  hg.commitTransaction();
  const journal = hg.getMutationJournal();
  assert(journal.length > 0, `Mutation Journal recorded ${journal.length} Copy-On-Write delta transactions`);

  // --------------------------------------------------------------------------
  // TEST SECTION 10: PHASE 10 THE POLYGRAPH: 5-WAY BI-SIMULATION CONTRADICTION MATRIX
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 10: THE POLYGRAPH: 5-WAY BI-SIMULATION CONTRADICTION MATRIX ---");
  const polygraph = new PolygraphContradictionEngine();
  const polygraphResult = polygraph.runPolygraphAnalysis(hg);

  assert(polygraphResult.bisimilarPairsCount > 0, `Weak Bisimulation Game Engine evaluated ${polygraphResult.bisimilarPairsCount + polygraphResult.contradictionsCount} stratum pairs`);
  assert(polygraphResult.contradictionsCount > 0, `Polygraph lie detector proved ${polygraphResult.contradictionsCount} fundamental architectural contradictions!`);
  assert(polygraphResult.overallDivergenceMetric > 0, `Behavioral Divergence Metric calculated: d_bisim = ${polygraphResult.overallDivergenceMetric}`);

  const topProof = polygraphResult.proofBundles[0];
  assert(topProof !== undefined, "Top Contradiction Proof Bundle synthesized");
  if (topProof) {
    assert(topProof.severity === "CRITICAL", `Contradiction Severity classified: ${topProof.severity}`);
    assert(topProof.victimCount === 412, `Victim count verified: ${topProof.victimCount} real simulated victims`);
    assert(topProof.financialRiskUSD > 100000, `Financial risk quantified: $${topProof.financialRiskUSD.toLocaleString()}`);
    assert(topProof.codeCitation !== undefined, `Cryptographic Code Citation attached: ${topProof.codeCitation?.filePath}#L${topProof.codeCitation?.lineNo}`);
    assert(topProof.docCitation !== undefined, `Document Intent Citation attached: ${topProof.docCitation?.docPath}`);
    assert(topProof.traceCitation !== undefined, `Kernel eBPF Trace Citation attached: ${topProof.traceCitation?.traceId}`);
  }

  // Ingest Contradiction Proofs into Hypergraph & verify truth status demotion to CONTRADICTED (-1.0)
  polygraph.ingestToHypergraph(polygraphResult, hg);
  const contradictedNodes = hg.getAllNodes().filter(n => n.epistemic.status === EpistemicStatus.CONTRADICTED);
  assert(contradictedNodes.length > 0, `Hypergraph Truth Lattice demoted ${contradictedNodes.length} nodes to CONTRADICTED status (certainty = -1.0)`);

  console.log("\n==========================================================================");
  console.log(" 🎉 ALL PHASES 01 THROUGH 10 OPERATIONAL CONTRACTS VERIFIED 100% SUCCESSFUL!");
  console.log("==========================================================================\n");
}

runPhases1To10Verification().catch((err) => {
  console.error("FATAL ERROR IN VERIFICATION:", err);
  process.exit(1);
});
