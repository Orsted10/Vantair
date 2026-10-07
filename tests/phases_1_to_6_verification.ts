/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Comprehensive Verification Test Suite for Phases 01, 02, 03, 04, 05 & 06
 */

import * as path from "path";
import { GenesisWorkspaceEngine } from "../src/engine/genesis_workspace";
import { HypergraphSubstrate, HypergraphLayer } from "../src/engine/hypergraph_substrate";
import { EpistemicStatus, createEpistemicValue, epistemicJoin } from "../src/types/epistemic";
import { UniversalASTParser } from "../src/engine/ast_universal_parser";
import { UniversalNodeType } from "../src/types/ast_metamodel";
import { WireSchemaIngestor } from "../src/engine/wire_schemas_ingest";
import { CFGDfgTaintEngine } from "../src/engine/cfg_dfg_taint";
import { CPNConcurrencyEngine } from "../src/engine/petri_concurrency";
import { ChronoGitDAGEngine } from "../src/engine/chrono_git_dag";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runPhases1To6Verification() {
  console.log("\n==========================================================================");
  console.log("  VANTAIR COMPUTATIONAL SOFTWARE REALITY ENGINE - PHASES 01-06 VERIFICATION");
  console.log("==========================================================================\n");

  const workspaceRoot = path.resolve(__dirname, "..");

  // --------------------------------------------------------------------------
  // TEST SECTION 1: PHASE 01 GENESIS WORKSPACE BOOTSTRAP
  // --------------------------------------------------------------------------
  console.log("--- PHASE 01: SYSTEM GENESIS & MONOREPO TOPOLOGY ---");
  const genesis = new GenesisWorkspaceEngine(100000);

  let genesisReadyReceived = false;
  genesis.conduit.subscribe("GENESIS_STAGE_10_READY", () => {
    genesisReadyReceived = true;
  });

  const bootstrapResult = genesis.bootstrap(workspaceRoot);
  assert(bootstrapResult.success, "Genesis Workspace bootstrap executed successfully");
  assert(bootstrapResult.durationMs < 1000, `Bootstrap completed in ${bootstrapResult.durationMs}ms`);
  assert(genesisReadyReceived, "IPC Conduit received GENESIS_STAGE_10_READY event signal");

  for (let i = 0; i < 5000; i++) {
    genesis.conduit.emit("TEST_BURST", { seq: i });
  }
  const qStats = genesis.conduit.getQueueStats();
  assert(qStats.size > 0 && qStats.size <= qStats.capacity, `IPC Ring Buffer size (${qStats.size}) bounded`);
  assert(qStats.dropped === 0, "Zero dropped messages under 5,000 burst throughput");

  const mem = genesis.governor.checkMemoryMetrics();
  assert(mem.heapUsedMB < 512, `Heap memory (${mem.heapUsedMB}MB) strictly below 512MB ceiling`);

  const payload = JSON.stringify({ name: "VANTAIR", version: "1.0.0" });
  const hash = genesis.coldCache.store("manifest", payload);
  const ret = genesis.coldCache.retrieve("manifest");
  assert(ret.valid && ret.hash === hash, "Cold cache retrieval validated via SHA-256 checksum");

  const hg = genesis.hypergraph;
  const n1 = hg.createNode("n1", HypergraphLayer.V_Syntactic, "RefundOrchestrator.ts", "File", EpistemicStatus.OBSERVED);
  const n2 = hg.createNode("n2", HypergraphLayer.V_Wire, "POST /api/v1/refund", "Endpoint", EpistemicStatus.OBSERVED);
  hg.addEdge("e1", n1.id, n2.id, "TRANSMITS", EpistemicStatus.OBSERVED);
  assert(hg.getNodeCount() >= 2, "Hypergraph populated with V_Syntactic & V_Wire nodes");

  const e1 = createEpistemicValue(EpistemicStatus.OBSERVED, "AST");
  const e2 = createEpistemicValue(EpistemicStatus.INFERRED, "ADR");
  assert(epistemicJoin(e1, e2).status === EpistemicStatus.OBSERVED, "Lattice Join(OBSERVED, INFERRED) = OBSERVED");

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
    assert(res.language === "typescript", `Parsed TypeScript file: ${path.basename(fPath)}`);
    assert(res.symbols.length > 0, `Extracted ${res.symbols.length} symbols from ${path.basename(fPath)}`);
    parser.ingestToHypergraph(res, hg);
    astRoots.push(res.rootNode);
  }

  assert(parser.parseFile("service.py", "def refund(order_id):\n    pass").language === "python", "Python Lexer parsed service.py");
  assert(parser.parseFile("service.go", "package main\nfunc Refund() {}").language === "go", "Go Lexer parsed service.go");
  assert(parser.parseFile("service.rs", "pub fn refund() {}").language === "rust", "Rust Lexer parsed service.rs");
  assert(parser.parseFile("Service.java", "public class Service {}").language === "java", "Java Lexer parsed Service.java");

  const symbols = parser.getSymbolTable().getAllSymbols();
  assert(symbols.length >= 10, `Global Symbol Table contains ${symbols.length} symbols across polyglot files`);

  // --------------------------------------------------------------------------
  // TEST SECTION 3: PHASE 03 DISTRIBUTED TOPOLOGY & WIRE SCHEMAS INGESTION
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 03: DISTRIBUTED TOPOLOGY & WIRE SCHEMAS INGESTION ---");
  const wireIngestor = new WireSchemaIngestor();

  const openApiSpec = JSON.stringify({
    openapi: "3.0.0",
    paths: {
      "/api/v1/refund": { post: { operationId: "executeRefund" } },
    },
  });
  const restEndpoints = wireIngestor.parseOpenAPI(openApiSpec);
  assert(restEndpoints.length === 1, "OpenAPI Parser extracted POST /api/v1/refund endpoint");

  const protoSpec = `syntax = "proto3"; service PaymentService { rpc ProcessRefund (Req) returns (Res); }`;
  assert(wireIngestor.parseProtobuf(protoSpec).length === 1, "Protobuf Lexer extracted gRPC RPC ProcessRefund");

  const graphqlSpec = `type Mutation { requestRefund(orderId: String!): Boolean! }`;
  assert(wireIngestor.parseGraphQL(graphqlSpec).length === 1, "GraphQL Analyzer extracted Mutation requestRefund");

  const asyncApiSpec = `topic: banking.refunds.requested`;
  assert(wireIngestor.parseAsyncAPI(asyncApiSpec).length === 1, "AsyncAPI Ingestor extracted Kafka topic banking.refunds.requested");

  const ddlSpec = `CREATE TABLE orders (id VARCHAR(64) PRIMARY KEY); CREATE TABLE refunds (id VARCHAR(64), order_id VARCHAR(64), FOREIGN KEY (order_id) REFERENCES orders(id));`;
  assert(wireIngestor.parseDDL(ddlSpec).length === 2, "DDL Schema Normalizer parsed 2 PostgreSQL relational tables");

  const wireResult = wireIngestor.ingestDirectory(workspaceRoot);
  wireIngestor.ingestToHypergraph(wireResult, hg);
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
  assert(hg.getNodesByLayer(HypergraphLayer.V_Behavior).length > 0, "Hypergraph V_Behavior stratum populated");

  // --------------------------------------------------------------------------
  // TEST SECTION 5: PHASE 05 COLORED PETRI NET WITH TIME (CPN-TI) CONCURRENCY SYNTHESIZER
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 05: COLORED PETRI NET WITH TIME (CPN-TI) CONCURRENCY SYNTHESIZER ---");
  const petriEngine = new CPNConcurrencyEngine();
  const petriResult = petriEngine.analyzeConcurrency();
  
  assert(petriResult.placeCount >= 5, `Synthesized Bipartite Petri Net with ${petriResult.placeCount} Places`);
  assert(petriResult.transitionCount >= 4, `Synthesized Bipartite Petri Net with ${petriResult.transitionCount} Transitions`);
  assert(petriResult.reachableMarkingsCount > 1, `Reachability explorer generated ${petriResult.reachableMarkingsCount} markings`);
  assert(petriResult.hazards.length > 0, `Concurrency Hazard Detector surfaced ${petriResult.hazards.length} hazards`);
  assert(petriResult.hazards.some(h => h.type === "DEADLOCK"), "Deadlock hazard detected: Redis lock held during gateway timeout");
  assert(petriResult.hazards.some(h => h.type === "RACE_CONDITION"), "Race condition hazard detected: Gateway retry without idempotency key");
  assert(petriResult.conservedResourceInvariant, "P-Invariant verified: PostgreSQL Connection Pool resource bounds conserved");

  petriEngine.ingestToHypergraph(petriResult, hg);
  assert(hg.getAllNodes().some(n => n.kind === "PetriPlace"), "Hypergraph populated with Petri Net Place nodes");
  assert(hg.getAllNodes().some(n => n.kind === "ConcurrencyHazard"), "Hypergraph populated with Concurrency Hazard nodes");

  // --------------------------------------------------------------------------
  // TEST SECTION 6: PHASE 06 4D SPATIOTEMPORAL GIT CHRONO-DAG & BLAME ENTROPY ENGINE
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 06: 4D SPATIOTEMPORAL GIT CHRONO-DAG & BLAME ENTROPY ENGINE ---");
  const chronoEngine = new ChronoGitDAGEngine();
  const chronoResult = chronoEngine.analyzeChronoDAG(workspaceRoot);

  assert(chronoResult.commits.length >= 4, `Chrono-DAG parsed ${chronoResult.commits.length} commit DAG nodes`);
  assert(chronoResult.blameEntropies.length > 0, `Computed Shannon Blame Entropy for ${chronoResult.blameEntropies.length} files`);
  
  const hotspot = chronoResult.topEntropyHotspot;
  assert(hotspot !== null && hotspot.entropy > 0.60, `Identified top entropy hotspot: ${hotspot?.filePath} (Entropy H = ${hotspot?.entropy})`);
  assert(hotspot?.riskLevel === "CRITICAL" || hotspot?.riskLevel === "HIGH", `Hotspot risk level classified: ${hotspot?.riskLevel}`);

  assert(chronoResult.techDebtMarkers.length > 0, `Tech Debt Hunter discovered ${chronoResult.techDebtMarkers.length} abandoned hacks`);
  const daveHack = chronoResult.techDebtMarkers.find(m => m.author === "Dave Miller");
  assert(daveHack !== undefined, "Found Dave Miller's 3 AM Black Friday emergency fix commit");
  if (daveHack) {
    assert(daveHack.commentText.includes("HOTFIX"), `Tech debt comment verified: "${daveHack.commentText}"`);
    assert(daveHack.ageDays > 30, `Tech debt age verified: ${daveHack.ageDays} days old`);
  }

  chronoEngine.ingestToHypergraph(chronoResult, hg);
  const tempNodes = hg.getNodesByLayer(HypergraphLayer.V_Temporal);
  assert(tempNodes.length > 0, `Hypergraph V_Temporal stratum populated with ${tempNodes.length} commit & debt nodes`);

  console.log("\n==========================================================================");
  console.log(" 🎉 ALL PHASES 01, 02, 03, 04, 05 & 06 OPERATIONAL CONTRACTS VERIFIED 100% SUCCESSFUL!");
  console.log("==========================================================================\n");
}

runPhases1To6Verification().catch((err) => {
  console.error("FATAL ERROR IN VERIFICATION:", err);
  process.exit(1);
});
