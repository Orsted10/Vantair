/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Phase 42: Machine-Readable Build Report Generator
 *
 * Automatically generates VANTAIR_SYSTEM_BUILD_REPORT.md directly from
 * verified CapabilityAssessment metadata.
 *
 * Epistemic Invariant:
 *   Build reports must NEVER be hand-written with exaggerated "100% verified" claims.
 *   Every metric, limitation, and claim level is compiled from the truth registry.
 */

import * as fs from "fs";
import * as path from "path";
import { VANTAIR_CAPABILITY_REGISTRY, getSystemMaturitySummary } from "../src/reality/capability/maturity";

export function generateSystemBuildReport(): string {
  const summary = getSystemMaturitySummary();
  const allAssessments = Object.values(VANTAIR_CAPABILITY_REGISTRY);

  let md = `# VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
## Machine-Generated System Build & Epistemic Maturity Report

\`\`\`
========================================================================================================================
  __      __     _   _ _______       _____ _____  
  \\ \\    / /\\   | \\ | |__   __|/\\   |_   _|  __ \\ 
   \\ \\  / /  \\  |  \\| |  | |  /  \\    | | | |__) |
    \\ \\/ / /\\ \\ | . \` |  | | / /\\ \\   | | |  _  / 
     \\  / ____ \\| |\\  |  | |/ ____ \\ _| |_| | \\ \\ 
      \\/_/    \\_\\_| \\_|  |_/_/    \\_\\_____|_|  \\_\\
  THE COMPUTATIONAL SOFTWARE REALITY ENGINE (EPITEMIC TRUTH BASELINE)
========================================================================================================================
\`\`\`

---

## 1. Executive Summary & Epistemic Grounding

**VANTAIR** maintains a continuously versioned, evidence-backed model of what it can demonstrate about software—and explicitly represents everything it cannot demonstrate.

### Core Truth Principles:
1. **Zero Unsupported Proofs:** VANTAIR does not claim arbitrary program equivalence or un-intervened causal certainty.
2. **Epistemic Honesty:** Replaced binary "100% Verified" claims with a 6-tier Capability Maturity Model (\`UNSUPPORTED\` to \`FORMALLY_VERIFIED\`).
3. **Multi-Dimensional Certainty:** Replaced scalar certainty $\\kappa$ with an orthogonal vector (source reliability, coverage, recency, independence, reproducibility).
4. **Isolated Sandboxing:** Repository contents are treated as hostile data; all executions are strictly partitioned.

### Current Subsystem Maturity Breakdown (20 Core Phases):
- **Total Subsystems Evaluated:** ${summary.totalSubsystems}
- **Formally Verified (Discrete Properties):** ${summary.formallyVerifiedCount}
- **Runtime Validated (Empirical Traces):** ${summary.runtimeValidatedCount}
- **Repository Validated (Arbitrary Repositories):** ${summary.repositoryValidatedCount}
- **Fixture Validated (Controlled Reference Labs):** ${summary.fixtureValidatedCount}
- **Experimental (Candidate Formulations):** ${summary.experimentalCount}
- **Unsupported:** ${summary.unsupportedCount}

---

## 2. Capability Maturity & Validation Matrix

| Phase / Subsystem | Capability Name | Claim Level | Languages | Environment | Known Limitations & Boundaries |
| :--- | :--- | :---: | :--- | :--- | :--- |
`;

  for (const a of allAssessments) {
    const langs = a.languageCoverage.slice(0, 3).join(", ") + (a.languageCoverage.length > 3 ? "..." : "");
    const envs = a.environmentCoverage.slice(0, 2).join(", ");
    const lim = a.limitations[0] || "None declared.";

    md += `| **${a.capabilityId}** | ${a.name} | \`${a.claimLevel}\` | ${langs} | ${envs} | ${lim} |\n`;
  }

  md += `
---

## 3. Subsystem Detailed Capability Profiles

`;

  for (const a of allAssessments) {
    md += `### ${a.name} (\`${a.capabilityId}\`)
- **Primary Subsystem:** \`${a.subsystem}\`
- **Claim Level:** \`${a.claimLevel}\`
- **Language Coverage:** ${a.languageCoverage.join(", ")}
- **Environment Coverage:** ${a.environmentCoverage.join(", ")}
- **Evidence IDs:** ${a.evidenceIds.map(e => `\`${e}\``).join(", ")}
- **Validation Methods:**
  - Tested: ${a.tested ? "Yes" : "No"}
  - Tested with Reference Fixtures: ${a.testedWithFixtures ? "Yes" : "No"}
  - Tested with Arbitrary Repositories: ${a.testedWithRealRepositories ? "Yes" : "No"}
  - Validated with Runtime Telemetry: ${a.runtimeValidated ? "Yes" : "No"}
- **Declared Limitations:**
${a.limitations.map(l => `  - ${l}`).join("\n")}
`;

    if (a.measuredProperties) {
      md += `- **Measured Workload Benchmark:**
  - Measured RSS: \`${a.measuredProperties.memoryRssMb} MB\`
  - Peak Memory: \`${a.measuredProperties.peakMemoryMb} MB\`
  - Sample LOC: \`${a.measuredProperties.sampleLoc}\`
  - Environment: \`${a.measuredProperties.measuredEnvironment}\`
  - Reference Hash: \`${a.measuredProperties.sampleRepoHash}\`
`;
    }

    md += `\n`;
  }

  md += `
---

## 4. Architectural Invariants

1. **Reality Snapshot Protocol:** Every analysis operates against an immutable, content-addressed snapshot (\`src/reality/snapshot/\`).
2. **Ground-Truth Evidence Ledger:** Every claim is indexed in the Evidence Ledger (\`src/reality/ledger/\`) with explicit provenance.
3. **Canonical Reality IR:** Downstream engines consume the unified intermediate representation (\`src/reality/ir/\`).
4. **Three-Way Contract Reality:** Explicitly compares \`DECLARED\` vs \`IMPLEMENTED\` vs \`OBSERVED\` contracts to surface undocumented behavior.
5. **Unknown Frontier:** Quantifies unobserved states and formulates the single cheapest experiment to reduce uncertainty.
6. **Change Proof Bundles:** All patches are validated through extensible gates before export.

---
*Report automatically generated by VANTAIR Build Report Generator. Zero manual overrides permitted.*
`;

  return md;
}

// Write to root VANTAIR_SYSTEM_BUILD_REPORT.md when executed directly
if (require.main === module) {
  const report = generateSystemBuildReport();
  const targetPath = path.resolve(__dirname, "../VANTAIR_SYSTEM_BUILD_REPORT.md");
  fs.writeFileSync(targetPath, report, "utf-8");
  console.log(`[VANTAIR] Truthful System Build Report generated successfully at: ${targetPath}`);
}
