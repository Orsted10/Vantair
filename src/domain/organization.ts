/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Phase 38: Multi-Tenant Scoping & Enterprise RBAC Domain Model
 */

export type UserRole = "OWNER" | "ADMIN" | "ENGINEER" | "SECURITY_AUDITOR" | "VIEWER";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "COMMUNITY" | "ENTERPRISE" | "AIR_GAPPED";
  createdAt: string;
  securityPolicies: {
    enforceMfa: boolean;
    allowedIpRanges?: string[];
    maxConcurrentAnalysisJobs: number;
    maxRepositorySizeBytes: number;
  };
}

export interface Workspace {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
}

export interface TenantScopedProject {
  id: string;
  organizationId: string;
  workspaceId: string;
  name: string;
  slug: string;
  defaultBranch: string;
  connectedRepositories: string[];
  activeSnapshotId?: string;
  createdAt: string;
}

export interface SecurityAuditEvent {
  id: string;
  organizationId: string;
  projectId?: string;
  actorUserId: string;
  action:
    | "USER_LOGIN"
    | "REPOSITORY_CONNECTED"
    | "ANALYSIS_STARTED"
    | "INTERVENTION_SIMULATED"
    | "PATCH_PROPOSED"
    | "BRANCH_CREATED"
    | "VERIFICATION_EXPORTED"
    | "POLICY_MODIFIED";
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
}
