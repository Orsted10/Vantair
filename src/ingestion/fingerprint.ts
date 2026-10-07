/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Real Forensic Repository Fingerprinting Engine
 */

import { IngestedRepositorySnapshot } from "./provider";
import { SystemFingerprint } from "../core/types/project";

export class RepositoryFingerprintEngine {
  private languageExtMap: Record<string, string> = {
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".js": "JavaScript",
    ".jsx": "JavaScript",
    ".py": "Python",
    ".go": "Go",
    ".rs": "Rust",
    ".java": "Java",
    ".c": "C",
    ".cpp": "C++",
    ".h": "C/C++ Header",
    ".cs": "C#",
    ".php": "PHP",
    ".rb": "Ruby",
    ".kt": "Kotlin",
    ".swift": "Swift",
    ".sql": "SQL",
    ".sh": "Shell",
    ".bash": "Shell",
    ".html": "HTML",
    ".css": "CSS",
    ".scss": "SCSS",
    ".json": "JSON",
    ".yaml": "YAML",
    ".yml": "YAML",
    ".proto": "Protobuf",
    ".graphql": "GraphQL",
    ".gql": "GraphQL",
  };

  public generateFingerprint(snapshot: IngestedRepositorySnapshot): SystemFingerprint {
    const langStats: Record<string, { lines: number; files: number }> = {};
    let totalCodeLines = 0;

    const frameworks = new Set<string>();
    const packageManagers = new Set<string>();
    const buildSystems = new Set<string>();
    const databases = new Set<string>();
    const queues = new Set<string>();
    const apiProtocols = new Set<string>();
    const testFrameworks = new Set<string>();
    const infrastructure = new Set<string>();

    let isMonorepo = false;
    let detectedServices = 0;

    const lockfiles = new Set([
      "package-lock.json",
      "pnpm-lock.yaml",
      "yarn.lock",
      "poetry.lock",
      "cargo.lock",
      "skills-lock.json",
    ]);

    for (const f of snapshot.files) {
      const lowerPath = f.relativePath.toLowerCase();
      const fileName = lowerPath.split("/").pop() || "";
      const isLockfile = lockfiles.has(fileName);
      const ext = f.extension.toLowerCase();
      const lang = this.languageExtMap[ext] || (f.isBinary ? "Binary" : "Other");

      if (!f.isBinary && f.lineCount > 0 && !isLockfile) {
        if (!langStats[lang]) {
          langStats[lang] = { lines: 0, files: 0 };
        }
        langStats[lang].lines += f.lineCount;
        langStats[lang].files += 1;
        totalCodeLines += f.lineCount;
      }

      // Package Manager & Monorepo detection
      if (lowerPath === "package-lock.json") packageManagers.add("npm");
      if (lowerPath === "pnpm-lock.yaml") packageManagers.add("pnpm");
      if (lowerPath === "yarn.lock") packageManagers.add("yarn");
      if (lowerPath === "poetry.lock") packageManagers.add("poetry");
      if (lowerPath === "cargo.lock") packageManagers.add("cargo");
      if (lowerPath === "pom.xml") buildSystems.add("Maven");
      if (lowerPath.includes("build.gradle")) buildSystems.add("Gradle");
      if (lowerPath.includes("turbo.json") || lowerPath.includes("pnpm-workspace.yaml") || lowerPath.includes("lerna.json")) {
        isMonorepo = true;
      }

      // Infrastructure
      if (lowerPath.includes("dockerfile")) infrastructure.add("Docker");
      if (lowerPath.includes("docker-compose")) infrastructure.add("Docker Compose");
      if (lowerPath.includes(".github/workflows")) infrastructure.add("GitHub Actions");
      if (lowerPath.includes("k8s") || lowerPath.includes("kubernetes")) infrastructure.add("Kubernetes");

      // Content-based keyword heuristics in config/package files
      if (lowerPath.endsWith("package.json") || lowerPath.endsWith("requirements.txt") || lowerPath.endsWith("cargo.toml")) {
        const c = f.content.toLowerCase();
        if (c.includes("next")) frameworks.add("Next.js");
        if (c.includes("react")) frameworks.add("React");
        if (c.includes("express")) frameworks.add("Express");
        if (c.includes("fastapi")) frameworks.add("FastAPI");
        if (c.includes("django")) frameworks.add("Django");
        if (c.includes("flask")) frameworks.add("Flask");
        if (c.includes("spring")) frameworks.add("Spring Boot");

        if (c.includes("pg") || c.includes("postgres") || c.includes("psycopg2")) databases.add("PostgreSQL");
        if (c.includes("redis") || c.includes("ioredis")) databases.add("Redis");
        if (c.includes("mysql")) databases.add("MySQL");
        if (c.includes("prisma")) databases.add("Prisma ORM");
        if (c.includes("mongoose") || c.includes("mongodb")) databases.add("MongoDB");

        if (c.includes("kafkajs") || c.includes("confluent-kafka")) queues.add("Kafka");
        if (c.includes("amqplib") || c.includes("rabbitmq")) queues.add("RabbitMQ");
        if (c.includes("bullmq") || c.includes("bull")) queues.add("BullMQ");

        if (c.includes("jest")) testFrameworks.add("Jest");
        if (c.includes("vitest")) testFrameworks.add("Vitest");
        if (c.includes("pytest")) testFrameworks.add("PyTest");
      }

      // API protocol detection
      if (ext === ".proto") apiProtocols.add("gRPC / Protobuf");
      if (ext === ".graphql" || ext === ".gql") apiProtocols.add("GraphQL");
      if (lowerPath.includes("openapi") || lowerPath.includes("swagger")) apiProtocols.add("OpenAPI REST");

      // Service detection
      if (lowerPath.includes("service") || lowerPath.includes("controller") || lowerPath.includes("api/")) {
        detectedServices++;
      }
    }

    // Compute percentage by lines of code
    const primaryLanguages = Object.entries(langStats)
      .map(([language, data]) => ({
        language,
        fileCount: data.files,
        lineCount: data.lines,
        percentage: totalCodeLines > 0 ? Math.round((data.lines / totalCodeLines) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.lineCount - a.lineCount);

    return {
      primaryLanguages,
      frameworks: Array.from(frameworks),
      packageManagers: Array.from(packageManagers),
      buildSystems: Array.from(buildSystems),
      databases: Array.from(databases),
      queues: Array.from(queues),
      apiProtocols: Array.from(apiProtocols),
      testFrameworks: Array.from(testFrameworks),
      infrastructure: Array.from(infrastructure),
      isMonorepo,
      totalFiles: snapshot.totalFilesCount,
      totalLinesOfCode: snapshot.totalLinesOfCode,
      detectedServicesCount: Math.max(1, Math.min(detectedServices, 50)),
    };
  }
}
