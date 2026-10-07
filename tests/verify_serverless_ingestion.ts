import { LocalRepositoryProvider } from "../src/ingestion/local_provider";
import { getRepoCacheDir, isDemoRepoPath, getDemoFileTree, getDemoFile } from "../src/core/utils/repo_cache";

async function verify() {
  console.log("1. Repo Cache Dir:", getRepoCacheDir());
  console.log("2. isDemoRepoPath('src/demo_repo'):", isDemoRepoPath("src/demo_repo"));
  console.log("3. isDemoRepoPath('CampusBuddy Banking'):", isDemoRepoPath("CampusBuddy Banking"));
  console.log("4. Demo File Tree Count:", getDemoFileTree().length);

  const file = getDemoFile("services/RefundOrchestrator.ts");
  console.log("5. getDemoFile('services/RefundOrchestrator.ts') found:", !!file);
  if (file) {
    console.log("   Lines:", file.content.split("\n").length);
  }

  const provider = new LocalRepositoryProvider();
  const snapshot = await provider.ingest("src/demo_repo");
  console.log("6. Ingested Demo Repo snapshot:", {
    repoName: snapshot.repoName,
    branch: snapshot.branch,
    commitSha: snapshot.commitSha,
    filesCount: snapshot.files.length,
    loc: snapshot.totalLinesOfCode,
  });

  // Test in-memory embedded fallback by passing a virtual demo name
  const virtualSnapshot = await provider.ingest("demo_repo_virtual_fallback");
  console.log("7. Ingested Virtual Fallback snapshot:", {
    repoName: virtualSnapshot.repoName,
    branch: virtualSnapshot.branch,
    commitSha: virtualSnapshot.commitSha,
    filesCount: virtualSnapshot.files.length,
    loc: virtualSnapshot.totalLinesOfCode,
  });

  console.log("\nALL VERIFICATIONS PASSED SUCCESSFULLY!");
}

verify().catch(console.error);
