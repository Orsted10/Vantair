/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Ingestion Provider Architecture
 */

export interface DiscoveredFile {
  relativePath: string;
  absolutePath: string;
  extension: string;
  sizeBytes: number;
  lineCount: number;
  content: string;
  isBinary: boolean;
}

export interface IngestedRepositorySnapshot {
  repoName: string;
  branch: string;
  commitSha: string;
  rootPath: string;
  files: DiscoveredFile[];
  totalFilesCount: number;
  totalLinesOfCode: number;
  ingestedAt: number;
}

export interface IRepositoryProvider {
  ingest(target: string, options?: Record<string, unknown>): Promise<IngestedRepositorySnapshot>;
}
