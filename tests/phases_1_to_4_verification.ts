/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Comprehensive Verification Test Suite for Phases 01, 02, 03 & 04
 */

import * as path from "path";
import { GenesisWorkspaceEngine } from "../src/engine/genesis_workspace";
import { HypergraphSubstrate, HypergraphLayer } from "../src/engine/hypergraph_substrate";
import { EpistemicStatus, createEpistemicValue, epistemicJoin } from "../src/types/epistemic";
import { UniversalASTParser } from "../src/engine/ast_universal_parser";
import { UniversalNodeType } from "../src/types/ast_metamodel";
import { WireSchemaIngestor } from "../src/engine/wire_schemas_ingest";
import { CFGDfgTaintEngine } from "../src/engine/cfg_dfg_taint";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runPhases1To4Verification() {
  console.log("\n==========================================================================");
  console.log("  VANTAIR COMPUTATIONAL SOFTWARE REALITY ENGINE - PHASES 01-04 VERIFICATION");
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

  // Stress test IPC process conduit
  for (let i = 0; i < 5000; i++) {
    genesis.conduit.emit("TEST_BURST", { seq: i });
  }
  const qStats = genesis.conduit.getQueueStats();
  assert(qStats.size > 0 && qStats.size <= qStats.capacity, `IPC Ring Buffer size (${qStats.size}) bounded`);
  assert(qStats.dropped === 0, "Zero dropped messages under 5,000 burst throughput");

  // Resource Governor Memory Ceiling
  const mem = genesis.governor.checkMemoryMetrics();
  assert(mem.heapUsedMB < 512, `Heap memory (${mem.heapUsedMB}MB) strictly below 512MB ceiling`);

  // Cold Cache Checksum Verification
  const payload = JSON.stringify({ name: "VANTAIR", version: "1.0.0" });
  const hash = genesis.coldCache.store("manifest", payload);
  const ret = genesis.coldCache.retrieve("manifest");
  assert(ret.valid && ret.hash === hash, "Cold cache retrieval validated via SHA-256 checksum");

  // 7-Layer Epistemic Hypergraph Substrate
  const hg = genesis.hypergraph;
  const n1 = hg.createNode("n1", HypergraphLayer.V_Syntactic, "RefundOrchestrator.ts", "File", EpistemicStatus.OBSERVED);
  const n2 = hg.createNode("n2", HypergraphLayer.V_Wire, "POST /api/v1/refund", "Endpoint", EpistemicStatus.OBSERVED);
  const edge = hg.addEdge("e1", n1.id, n2.id, "TRANSMITS", EpistemicStatus.OBSERVED);
  assert(hg.getNodeCount() >= 2, "Hypergraph populated with V_Syntactic & V_Wire nodes");

  // Truth Lattice Join
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

  // Polyglot Ingestion (Python, Go, Rust, Java)
  assert(parser.parseFile("service.py", "def refund(order_id):\n    pass").language === "python", "Python Lexer parsed service.py");
  assert(parser.parseFile("service.go", "package main\nfunc Refund() {}").language === "go", "Go Lexer parsed service.go");
  assert(parser.parseFile("service.rs", "pub fn refund() {}").language === "rust", "Rust Lexer parsed service.rs");
  assert(parser.parseFile("Service.java", "public class Service {}").language === "java", "Java Lexer parsed Service.java");

  // Symbol Table Index
  const symbols = parser.getSymbolTable().getAllSymbols();
  assert(symbols.length >= 10, `Global Symbol Table contains ${symbols.length} symbols across polyglot files`);

  // --------------------------------------------------------------------------
  // TEST SECTION 3: PHASE 03 DISTRIBUTED TOPOLOGY & WIRE SCHEMAS INGESTION
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 03: DISTRIBUTED TOPOLOGY & WIRE SCHEMAS INGESTION ---");
  const wireIngestor = new WireSchemaIngestor();

  // Test OpenAPI REST Endpoint Parsing
  const openApiSpec = JSON.stringify({
    openapi: "3.0.0",
    paths: {
      "/api/v1/refund": {
        post: { operationId: "executeRefund", summary: "Process refund payment" },
      },
    },
  });
  const restEndpoints = wireIngestor.parseOpenAPI(openApiSpec);
  assert(restEndpoints.length === 1, "OpenAPI Parser extracted POST /api/v1/refund endpoint");
  assert(restEndpoints[0].operationId === "executeRefund", "Operation ID mapped cleanly: executeRefund");

  // Test Protobuf gRPC Ingestion
  const protoSpec = `
syntax = "proto3";
package banking;
service PaymentService {
  rpc ProcessRefund (RefundRequest) returns (RefundResponse);
}
  `;
  const grpcMethods = wireIngestor.parseProtobuf(protoSpec);
  assert(grpcMethods.length === 1, "Protobuf Lexer extracted gRPC RPC ProcessRefund");

  // Test GraphQL SDL Ingestion
  const graphqlSpec = `
type Mutation {
  requestRefund(orderId: String!): Boolean!
}
  `;
  const gqlOps = wireIngestor.parseGraphQL(graphqlSpec);
  assert(gqlOps.length === 1, "GraphQL Analyzer extracted Mutation requestRefund");

  // Test Kafka Topic AsyncAPI Ingestion
  const asyncApiSpec = `
topic: banking.refunds.requested
  `;
  const topics = wireIngestor.parseAsyncAPI(asyncApiSpec);
  assert(topics.length === 1, "AsyncAPI Ingestor extracted Kafka topic banking.refunds.requested");

  // Test PostgreSQL DDL Ingestion
  const ddlSpec = `
CREATE TABLE orders (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  amount NUMERIC(10,2) NOT NULL
);

CREATE TABLE refunds (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
  `;
  const dbTables = wireIngestor.parseDDL(ddlSpec);
  assert(dbTables.length === 2, "DDL Schema Normalizer parsed 2 PostgreSQL relational tables");
  assert(dbTables[1].columns.some((c) => c.foreignKeyRef !== undefined), "Foreign key referential dependency edge recognized");

  // Ingest Wire Schemas into Hypergraph
  const wireResult = wireIngestor.ingestDirectory(workspaceRoot);
  wireIngestor.ingestToHypergraph(wireResult, hg);

  const wireNodes = hg.getNodesByLayer(HypergraphLayer.V_Wire);
  assert(wireNodes.length > 0, `Hypergraph V_Wire stratum populated with ${wireNodes.length} network boundary nodes`);

  // --------------------------------------------------------------------------
  // TEST SECTION 4: PHASE 04 CONTROL-FLOW (CFG), DATA-FLOW (DFG) & TAINT ENGINE
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 04: BEHAVIORAL CONTROL-FLOW & DATA-FLOW TAINT ENGINE ---");
  const cfgEngine = new CFGDfgTaintEngine();

  const cfgResult = cfgEngine.analyzeProgram(astRoots, "src/demo_repo/services/RefundOrchestrator.ts");
  assert(cfgResult.cfgs.length > 0, `Generated ${cfgResult.cfgs.length} Control-Flow Graphs (CFGs) with basic blocks`);

  const sampleCFG = cfgResult.cfgs[0];
  assert(sampleCFG.blocks.size > 1, `CFG for ${sampleCFG.functionName} partitioned into ${sampleCFG.blocks.size} Basic Blocks`);

  // Dominators & Dominance Frontiers
  const entryBB = sampleCFG.blocks.get(sampleCFG.entryBlockId);
  assert(entryBB !== undefined, "CFG Entry Basic Block identified");

  // Inter-Procedural Taint Tracker Verification
  assert(cfgResult.vulnerabilities.length > 0, `Taint Engine detected ${cfgResult.vulnerabilities.length} unsanitized security vulnerabilities`);
  const vuln = cfgResult.vulnerabilities[0];
  assert(vuln.sourceEndpoint === "HTTP_POST_Refund", `Taint Source recognized: ${vuln.sourceEndpoint}`);
  assert(vuln.sinkOperation.includes("requestGatewayRefund") || vuln.sinkOperation.includes("query"), `Sensitive Sink recognized: ${vuln.sinkOperation}`);

  // Ingest Behavioral CFG & Taint flows into Hypergraph
  cfgEngine.ingestToHypergraph(cfgResult, hg);
  const behNodes = hg.getNodesByLayer(HypergraphLayer.V_Behavior);
  assert(behNodes.length > 0, `Hypergraph V_Behavior stratum populated with ${behNodes.length} basic blocks & taint nodes`);

  console.log("\n==========================================================================");
  console.log(" 🎉 ALL PHASES 01, 02, 03 & 04 OPERATIONAL CONTRACTS VERIFIED 100% SUCCESSFUL!");
  console.log("==========================================================================\n");
}

runPhases1To4Verification().catch((err) => {
  console.error("FATAL ERROR IN VERIFICATION:", err);
  process.exit(1);
});
