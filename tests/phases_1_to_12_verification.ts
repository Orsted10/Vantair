/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Comprehensive Verification Test Suite for Phases 01 through 12
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
import { CausalDoCalculusEngine } from "../src/engine/causal_docalculus";
import { SystemConstitutionEngine, SYSTEM_CONSTITUTION_14_LAWS } from "../src/engine/constitution_laws";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runPhases1To12Verification() {
  console.log("\n==========================================================================");
  console.log("  VANTAIR COMPUTATIONAL SOFTWARE REALITY ENGINE - PHASES 01-12 VERIFICATION");
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
  const visibleNodes = hg.queryViewportFrustum(-1000, 1000, -1000, 1000, -500, 500);
  assert(visibleNodes.length >= 20, `Spatial 3D Octree query returned ${visibleNodes.length} nodes in camera viewport`);

  // --------------------------------------------------------------------------
  // TEST SECTION 10: PHASE 10 THE POLYGRAPH: 5-WAY BI-SIMULATION CONTRADICTION MATRIX
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 10: THE POLYGRAPH: 5-WAY BI-SIMULATION CONTRADICTION MATRIX ---");
  const polygraph = new PolygraphContradictionEngine();
  const polygraphResult = polygraph.runPolygraphAnalysis(hg);
  assert(polygraphResult.contradictionsCount > 0, `Polygraph lie detector proved ${polygraphResult.contradictionsCount} contradictions!`);
  polygraph.ingestToHypergraph(polygraphResult, hg);

  // --------------------------------------------------------------------------
  // TEST SECTION 11: PHASE 11 PEARL'S CAUSAL DO-CALCULUS COUNTERFACTUAL ENGINE
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 11: PEARL'S CAUSAL DO-CALCULUS COUNTERFACTUAL ENGINE ---");
  const causalEngine = new CausalDoCalculusEngine();

  // Test 11.1: Surgical Excision do(Remove(RedisCache))
  console.log("  [11.1 Evaluating Graph Surgery: do(Remove(RedisCache))]");
  const excisionResult = causalEngine.executeCounterfactualIntervention({
    targetVariableId: "RedisCache_Available",
    action: "EXCISE",
    forcedValue: 0.0,
  });

  assert(excisionResult.isCascadeFailure, "Pearl's Causal Do-Calculus proved excision of RedisCache triggers downstream cascade failure");
  assert(excisionResult.systemSurvivalSeconds === 14, `Quantified exact system collapse time: ${excisionResult.systemSurvivalSeconds} seconds`);
  assert(excisionResult.modelWorldCounterfactualState["Postgres_ConnectionPool_Usage"] === 100, "Postgres active connection pool saturated to 100/100 (Max Capacity)");
  assert(excisionResult.cascadeChain.length >= 3, `Formally derived cascade domino chain of length ${excisionResult.cascadeChain.length}`);
  assert(excisionResult.shockwaveTimeline.length >= 4, `Synthesized shockwave timeline with ${excisionResult.shockwaveTimeline.length} discrete time steps`);
  assert(excisionResult.affectedServices.includes("OrderService"), "Identified OrderService in downstream blast radius");
  assert(excisionResult.estimatedFinancialLossDollars === 103000, `Derived financial risk exposure: $${excisionResult.estimatedFinancialLossDollars}`);

  // Test 11.2: Latency Mutation Intervention
  console.log("  [11.2 Evaluating Latency Intervention: do(PaymentGateway_Latency = 2000ms)]");
  const latencyResult = causalEngine.executeCounterfactualIntervention({
    targetVariableId: "PaymentGateway_Latency",
    action: "MUTATE_VALUE",
    forcedValue: 2000,
  });
  assert(!latencyResult.isCascadeFailure, "2,000ms latency is within safe operating envelope");
  assert(latencyResult.modelWorldCounterfactualState["Duplicate_Refund_Victims_Count"] === 0, "Zero duplicate refund victims under safe latency (100% Clean)");

  // Test 11.3: Judea Pearl's D-Separation & Path Analysis
  console.log("  [11.3 Evaluating Judea Pearl's D-Separation (X _|_ Y | Z)]");
  assert(excisionResult.dSeparationTests.length > 0, "Executed D-separation conditional independence tests");
  const dSepTest = excisionResult.dSeparationTests[0];
  assert(dSepTest.isIndependent, `D-Separation proved '${dSepTest.variableX}' _|_ '${dSepTest.variableY}' | {${dSepTest.conditioningZ.join(", ")}}`);

  // Test 11.4: Parametric Sensitivity Sweep
  console.log("  [11.4 Evaluating Parametric Sensitivity Sweep on Gateway Latency]");
  const sweep = causalEngine.executeParametricSweep("PaymentGateway_Latency", 1000, 6000, 10);
  assert(sweep.dataPoints.length === 11, `Computed ${sweep.dataPoints.length} parametric sweep data points`);
  assert(sweep.recommendedSafeOperatingCeiling > 0, `Recommended safe operating ceiling: ${sweep.recommendedSafeOperatingCeiling}ms`);

  causalEngine.ingestToHypergraph(excisionResult, hg);
  assert(hg.getNodesByLayer(HypergraphLayer.V_Delta).length > 0, "Hypergraph V_Delta stratum populated with Counterfactual simulation nodes");

  // --------------------------------------------------------------------------
  // TEST SECTION 12: PHASE 12 THE SYSTEM CONSTITUTION & 14 SOFTWARE LAWS ENGINE
  // --------------------------------------------------------------------------
  console.log("\n--- PHASE 12: THE SYSTEM CONSTITUTION & 14 SOFTWARE LAWS ENGINE ---");
  const constitutionEngine = new SystemConstitutionEngine();

  // Test 12.1: Axiomatic Consistency Proof
  console.log("  [12.1 Proving Axiomatic Consistency of the 14 Constitutional Laws]");
  const consistency = constitutionEngine.verifyAxiomaticConsistency();
  assert(consistency.isConsistent, `All ${consistency.axiomCount} Constitutional Law axioms proven mutually consistent (Proof Hash: ${consistency.proofHash.substring(0, 8)}...)`);

  // Test 12.2: Real World Baseline Verification (Proof by Contradiction)
  console.log("  [12.2 Verifying Baseline Real World against 14 Constitutional Laws]");
  const baselineReport = constitutionEngine.verifyConstitution(hg, false);
  assert(baselineReport.lawsCount === 14, "Evaluated all 14 Constitutional Laws");
  assert(baselineReport.violatedLawsCount === 3, `Formally flagged ${baselineReport.violatedLawsCount} Constitutional Law breaches in Real World (LAW-001, LAW-002, LAW-014)`);
  assert(!baselineReport.isFullyCompliant, "Baseline Real World correctly identified as NOT fully compliant");

  const law001Verdict = baselineReport.verdicts.find(v => v.lawId === "LAW-001");
  assert(law001Verdict?.status === "VIOLATION_FOUND", "LAW-001 (Monetary Conservation & Idempotency) flagged as VIOLATION_FOUND");
  assert(law001Verdict?.smtResult === "SAT", "LAW-001 SMT Proof by Contradiction returned SAT (counterexample found)");
  assert(Boolean(law001Verdict?.counterexample?.offendingFile.includes("RefundOrchestrator.ts")), `LAW-001 attached concrete counterexample citation: ${law001Verdict?.counterexample?.offendingFile}`);
  assert(Boolean(law001Verdict?.counterexample?.witnessInput["timeoutRetry"] === true), "LAW-001 extracted witness valuation with timeoutRetry=true");

  // Test 12.3: Model World Remediation Verification (Proving all 14 laws satisfied)
  console.log("  [12.3 Verifying Model World Remediation Twin against 14 Constitutional Laws]");
  const remediatedReport = constitutionEngine.verifyConstitution(hg, true);
  assert(remediatedReport.provenLawsCount === 14, "All 14 Constitutional Laws formally proven PROVEN_SAFE (UNSAT by contradiction)");
  assert(remediatedReport.isFullyCompliant, "Model World remediation twin certified 100% Fully Compliant");
  assert(Boolean(remediatedReport.certificateHash !== undefined), `Issued cryptographic Proof Certificate: ${remediatedReport.certificateHash?.substring(0, 16)}...`);
  assert(Boolean(remediatedReport.merkleProofRoot !== undefined), `Compiled SHA-256 Merkle Proof Tree Root: ${remediatedReport.merkleProofRoot?.substring(0, 16)}...`);

  // Test 12.4: Markdown Attestation Export
  console.log("  [12.4 Exporting Markdown Attestation Proof Certificate]");
  const markdownAttestation = constitutionEngine.generateMarkdownAttestation(remediatedReport);
  assert(markdownAttestation.includes("VANTAIR SYSTEM CONSTITUTION PROOF CERTIFICATE"), "Generated full Markdown attestation certificate");

  // Test 12.5: Ingest into Hypergraph V_Intent stratum
  constitutionEngine.ingestToHypergraph(baselineReport, hg);
  const constNodes = hg.getAllNodes().filter(n => n.kind === "ConstitutionalLawVerdict");
  assert(constNodes.length === 14, `Hypergraph populated with all 14 Constitutional Law verdict nodes`);

  console.log("\n==========================================================================");
  console.log(" 🎉 ALL PHASES 01 THROUGH 12 OPERATIONAL CONTRACTS VERIFIED 100% SUCCESSFUL!");
  console.log("==========================================================================\n");
}

runPhases1To12Verification().catch((err) => {
  console.error("FATAL ERROR IN VERIFICATION:", err);
  process.exit(1);
});
