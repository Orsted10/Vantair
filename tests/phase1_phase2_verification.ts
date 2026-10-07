/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Comprehensive Verification & Validation Test Suite for Phase 01 & Phase 02
 */

import * as path from "path";
import { GenesisWorkspaceEngine, IPCConduit, ResourceGovernor, AirGapColdCache } from "../src/engine/genesis_workspace";
import { HypergraphSubstrate, HypergraphLayer } from "../src/engine/hypergraph_substrate";
import { EpistemicStatus, createEpistemicValue, epistemicJoin } from "../src/types/epistemic";
import { UniversalASTParser, GlobalSymbolTable } from "../src/engine/ast_universal_parser";
import { UniversalNodeType } from "../src/types/ast_metamodel";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runPhase1AndPhase2Verification() {
  console.log("\n==========================================================================");
  console.log("  VANTAIR COMPUTATIONAL SOFTWARE REALITY ENGINE - PHASE 01 & 02 VERIFICATION");
  console.log("==========================================================================\n");

  const workspaceRoot = path.resolve(__dirname, "..");

  // --------------------------------------------------------------------------
  // TEST SECTION 1: PHASE 01 GENESIS WORKSPACE BOOTSTRAP
  // --------------------------------------------------------------------------
  console.log("--- PHASE 01: SYSTEM GENESIS & MONOREPO TOPOLOGY ---");
  const genesis = new GenesisWorkspaceEngine(50000);

  // Subscribe to IPC event conduit
  let genesisReadyReceived = false;
  genesis.conduit.subscribe("GENESIS_STAGE_10_READY", (evt) => {
    genesisReadyReceived = true;
  });

  const bootstrapResult = genesis.bootstrap(workspaceRoot);
  assert(bootstrapResult.success, "Genesis Workspace bootstrap executed successfully");
  assert(bootstrapResult.durationMs < 1000, `Bootstrap completed in ${bootstrapResult.durationMs}ms (Sub-second threshold)`);
  assert(genesisReadyReceived, "IPC Conduit received GENESIS_STAGE_10_READY event signal");

  // Verify IPC Ring Buffer Event Ingestion under load
  console.log("\n  [IPC Process Conduit & Ring Buffer Stress Test]");
  for (let i = 0; i < 5000; i++) {
    genesis.conduit.emit("TEST_TELEMETRY_BURST", { sequence: i });
  }
  const qStats = genesis.conduit.getQueueStats();
  assert(qStats.size > 0 && qStats.size <= qStats.capacity, `IPC Ring Buffer size (${qStats.size}) bounded under capacity (${qStats.capacity})`);
  assert(qStats.dropped === 0, "Zero dropped messages under 5,000 event burst throughput");

  // Verify Resource Governor Memory Allocation Ceiling
  console.log("\n  [Zero-Dollar Resource Governor Monitoring]");
  const memMetrics = genesis.governor.checkMemoryMetrics();
  assert(memMetrics.heapUsedMB < 512, `Heap memory (${memMetrics.heapUsedMB}MB) strictly below 512MB ceiling`);
  assert(memMetrics.status === "NORMAL" || memMetrics.status === "WARNING", `Governor status: ${memMetrics.status}`);

  // Verify Air-Gap Cold Cache Cryptographic Checksum Validator
  console.log("\n  [Air-Gap Cold Cache SHA-256 Checksum Verification]");
  const testPayload = JSON.stringify({ manifest: "Vantair Reality Engine Core", timestamp: Date.now() });
  const hash = genesis.coldCache.store("test_manifest", testPayload);
  const retrieval = genesis.coldCache.retrieve("test_manifest");
  assert(retrieval.valid, "Cold cache retrieval validated via SHA-256 cryptographic hash match");
  assert(retrieval.hash === hash, `SHA-256 Hash verified: ${hash.substring(0, 16)}...`);

  // Verify 7-Layer Epistemic Hypergraph PetGraph Substrate
  console.log("\n  [7-Layer Epistemic Hypergraph Substrate Verification]");
  const hg = genesis.hypergraph;
  
  // Create nodes in all 7 strata
  const nodeSyn = hg.createNode("n_syn_1", HypergraphLayer.V_Syntactic, "RefundOrchestrator.ts", "SourceFile", EpistemicStatus.OBSERVED);
  const nodeWire = hg.createNode("n_wire_1", HypergraphLayer.V_Wire, "PaymentGateway_gRPC", "NetworkEndpoint", EpistemicStatus.OBSERVED);
  const nodeBeh = hg.createNode("n_beh_1", HypergraphLayer.V_Behavior, "RefundStateNet", "PetriState", EpistemicStatus.DERIVED);
  const nodeTemp = hg.createNode("n_temp_1", HypergraphLayer.V_Temporal, "GitCommit_4a2f", "ChronoCommit", EpistemicStatus.OBSERVED);
  const nodeIntent = hg.createNode("n_intent_1", HypergraphLayer.V_Intent, "ADR-042-refunds", "LTL_Contract", EpistemicStatus.INFERRED);
  const nodeEmp = hg.createNode("n_emp_1", HypergraphLayer.V_Empirical, "eBPF_Trace_412", "TraceSpan", EpistemicStatus.OBSERVED);
  const nodeDelta = hg.createNode("n_delta_1", HypergraphLayer.V_Delta, "Twin_Refund_Fix", "MutatedNode", EpistemicStatus.HYPOTHESIZED);

  assert(hg.getNodeCount() === 7, "All 7 Epistemic Strata layers successfully populated into Hypergraph");

  // Create Directed Hyperedge
  const edge = hg.addEdge("edge_violates_1", nodeEmp.id, nodeIntent.id, "CONTRADICTS", EpistemicStatus.CONTRADICTED, true, "G (refund <= paid)");
  assert(edge.epistemic.status === EpistemicStatus.CONTRADICTED, "Contradiction hyperedge created with CONTRADICTED truth status");

  // Epistemic Truth Lattice Join Test
  console.log("\n  [Epistemic Modal 6-Valued Truth Lattice Join Tests]");
  const eObserved = createEpistemicValue(EpistemicStatus.OBSERVED, "AST_Syntax");
  const eInferred = createEpistemicValue(EpistemicStatus.INFERRED, "ADR_Doc");
  const eJoined = epistemicJoin(eObserved, eInferred);
  assert(eJoined.status === EpistemicStatus.OBSERVED, "Lattice Join(OBSERVED, INFERRED) = OBSERVED");

  const eContradicted = createEpistemicValue(EpistemicStatus.CONTRADICTED, "eBPF_Mismatch");
  const eJoinedContradict = epistemicJoin(eObserved, eContradicted);
  assert(eJoinedContradict.status === EpistemicStatus.CONTRADICTED, "Lattice Join(OBSERVED, CONTRADICTED) = CONTRADICTED");

  // Hypergraph Copy-on-Write Clone Test
  const hgClone = hg.clone();
  assert(hgClone.getNodeCount() === 7, "Copy-On-Write Hypergraph clone generated for Dual-World simulation");

  // --------------------------------------------------------------------------
  // TEST SECTION 2: PHASE 02 UNIVERSAL AST PARSER & POLYGLOT CORE
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 02: UNIVERSAL POLYGLOT PARSER & SYNTACTIC AST CORE ---");
  const parser = new UniversalASTParser();

  // Test 2.1: Parse TypeScript Demo Repository Files
  console.log("\n  [Polyglot Lexer & Normalizer: TypeScript Parsing]");
  const demoFiles = [
    path.join(workspaceRoot, "src/demo_repo/services/OrderService.ts"),
    path.join(workspaceRoot, "src/demo_repo/services/RefundOrchestrator.ts"),
    path.join(workspaceRoot, "src/demo_repo/services/PaymentGateway.ts"),
    path.join(workspaceRoot, "src/demo_repo/services/RedisCache.ts"),
    path.join(workspaceRoot, "src/demo_repo/services/PostgresDB.ts"),
  ];

  for (const fPath of demoFiles) {
    const res = parser.parseFile(fPath);
    assert(res.language === "typescript", `Parsed TypeScript file: ${path.basename(fPath)}`);
    assert(res.rootNode.type === UniversalNodeType.Program, `AST Root Node is Program type for ${path.basename(fPath)}`);
    assert(res.symbols.length > 0, `Discovered ${res.symbols.length} top-level symbols in ${path.basename(fPath)}`);
    
    // Ingest into 7-Layer Hypergraph
    parser.ingestToHypergraph(res, hg);
  }

  // Test 2.2: Polyglot Multi-Language Ingestion (Python, Go, Rust, Java)
  console.log("\n  [Polyglot Multi-Language Lexer: Python, Go, Rust, Java]");
  
  const pyCode = `
class FraudDetector:
    def evaluate_risk(self, user_id, amount):
        if amount > 10000:
            return "HIGH_RISK"
        return "LOW_RISK"
  `;
  const pyRes = parser.parseFile("services/FraudDetector.py", pyCode);
  assert(pyRes.language === "python", "Python AST Lexer parsed FraudDetector.py");
  assert(pyRes.symbols.some(s => s.name === "FraudDetector"), "Discovered Python class FraudDetector");
  assert(pyRes.symbols.some(s => s.name === "evaluate_risk"), "Discovered Python function evaluate_risk");

  const goCode = `
package payment

type PaymentHandler struct {}

func (h *PaymentHandler) ProcessTransaction(txnId string) bool {
    return true
}
  `;
  const goRes = parser.parseFile("services/payment_handler.go", goCode);
  assert(goRes.language === "go", "Go AST Lexer parsed payment_handler.go");
  assert(goRes.symbols.some(s => s.name === "PaymentHandler"), "Discovered Go struct PaymentHandler");

  const rustCode = `
pub struct LedgerEngine {
    pub balance: i64,
}

pub fn commit_transaction(txn_id: &str) -> bool {
    true
}
  `;
  const rustRes = parser.parseFile("services/ledger.rs", rustCode);
  assert(rustRes.language === "rust", "Rust AST Lexer parsed ledger.rs");
  assert(rustRes.symbols.some(s => s.name === "commit_transaction"), "Discovered Rust pub fn commit_transaction");

  const javaCode = `
public class AuditService {
    public void logAudit(String event) {
        System.out.println(event);
    }
}
  `;
  const javaRes = parser.parseFile("services/AuditService.java", javaCode);
  assert(javaRes.language === "java", "Java AST Lexer parsed AuditService.java");
  assert(javaRes.symbols.some(s => s.name === "AuditService"), "Discovered Java public class AuditService");

  // Test 2.3: Global Symbol Table Indexing
  console.log("\n  [Global Symbol Table URI Indexer]");
  const symTable = parser.getSymbolTable();
  const allSymbols = symTable.getAllSymbols();
  assert(allSymbols.length >= 10, `Global Symbol Table contains ${allSymbols.length} indexed symbols across polyglot files`);

  const refundSym = symTable.getAllSymbols().find(s => s.name === "RefundOrchestrator");
  assert(refundSym !== undefined, "RefundOrchestrator symbol URI indexed cleanly");
  if (refundSym) {
    assert(refundSym.uri.includes("RefundOrchestrator"), `Symbol URI verified: ${refundSym.uri}`);
  }

  // Test 2.4: Hypergraph Ingestion & V_Syntactic Stratum Count
  console.log("\n  [Hypergraph Syntactic Stratum (V_Syntactic) Ingestion]");
  const synNodes = hg.getNodesByLayer(HypergraphLayer.V_Syntactic);
  assert(synNodes.length > 10, `Hypergraph V_Syntactic stratum populated with ${synNodes.length} nodes from parsed ASTs`);

  console.log("\n==========================================================================");
  console.log(" 🎉 ALL PHASE 01 & PHASE 02 OPERATIONAL CONTRACTS VERIFIED 100% SUCCESSFUL!");
  console.log("==========================================================================\n");
}

runPhase1AndPhase2Verification().catch((err) => {
  console.error("FATAL ERROR IN VERIFICATION:", err);
  process.exit(1);
});
