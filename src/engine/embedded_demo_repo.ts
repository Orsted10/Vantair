/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Embedded Seeded Banking Microservices Repository
 *
 * Provides a 100% resilient, in-memory virtual repository fallback
 * for serverless environments (e.g., Vercel, AWS Lambda) where
 * disk access to unbundled source directories may be restricted or read-only.
 */

export interface EmbeddedFile {
  relativePath: string;
  content: string;
  isBinary: boolean;
  extension: string;
}

export const EMBEDDED_DEMO_FILES: EmbeddedFile[] = [
  {
    relativePath: "services/OrderService.ts",
    extension: ".ts",
    isBinary: false,
    content: `import { RefundOrchestrator } from "./RefundOrchestrator";
import { PostgresDB } from "./PostgresDB";

export interface Order {
  id: string;
  userId: string;
  amount: number;
  status: "PAID" | "REFUNDED" | "PARTIALLY_REFUNDED";
}

export class OrderService {
  private refundOrchestrator: RefundOrchestrator;
  private db: PostgresDB;

  constructor() {
    this.refundOrchestrator = new RefundOrchestrator();
    this.db = new PostgresDB();
  }

  public async processOrderRefund(orderId: string, refundAmount: number): Promise<boolean> {
    const order = await this.db.queryOrder(orderId);
    if (!order) {
      throw new Error(\`Order \${orderId} not found\`);
    }

    const success = await this.refundOrchestrator.executeRefund(order.id, order.userId, refundAmount);
    if (success) {
      await this.db.updateOrderStatus(orderId, "REFUNDED");
    }

    return success;
  }
}
`,
  },
  {
    relativePath: "services/PaymentGateway.ts",
    extension: ".ts",
    isBinary: false,
    content: `export interface PaymentGatewayResponse {
  success: boolean;
  transactionId: string;
  latencyMs: number;
}

export class PaymentGateway {
  private timeoutMs: number = 4500; // 4.5 second timeout bug trigger

  public async requestGatewayRefund(
    orderId: string,
    amount: number,
    idempotencyKey?: string
  ): Promise<PaymentGatewayResponse> {
    // Simulate network delay and high latency spikes
    const simulatedLatency = Math.floor(Math.random() * 2000) + 3000; // 3000 - 5000ms

    if (simulatedLatency > this.timeoutMs && !idempotencyKey) {
      // Flawed retry logic triggers double capture when idempotency key is missing
      return {
        success: true,
        transactionId: \`txn_dup_\${Date.now()}_\${Math.random().toString(36).substring(2, 6)}\`,
        latencyMs: simulatedLatency,
      };
    }

    return {
      success: true,
      transactionId: \`txn_clean_\${Date.now()}_\${Math.random().toString(36).substring(2, 6)}\`,
      latencyMs: simulatedLatency,
    };
  }
}
`,
  },
  {
    relativePath: "services/PostgresDB.ts",
    extension: ".ts",
    isBinary: false,
    content: `export class PostgresDB {
  private maxConnections: number = 100;
  private activeConnections: number = 12;

  public async queryOrder(orderId: string): Promise<{ id: string; userId: string; amount: number; status: "PAID" | "REFUNDED" | "PARTIALLY_REFUNDED" } | null> {
    this.activeConnections++;
    try {
      if (this.activeConnections > this.maxConnections) {
        throw new Error("PostgreSQL Connection Pool Exhausted (503 Service Unavailable)");
      }
      return {
        id: orderId,
        userId: \`usr_\${orderId.substring(0, 4)}\`,
        amount: 250.00,
        status: "PAID",
      };
    } finally {
      this.activeConnections--;
    }
  }

  public async updateOrderStatus(orderId: string, status: "PAID" | "REFUNDED" | "PARTIALLY_REFUNDED"): Promise<void> {
    this.activeConnections++;
    try {
      // Simulate DB write IOPS
    } finally {
      this.activeConnections--;
    }
  }
}
`,
  },
  {
    relativePath: "services/RedisCache.ts",
    extension: ".ts",
    isBinary: false,
    content: `export class RedisCache {
  private cacheMap: Map<string, string> = new Map();

  public async get(key: string): Promise<string | null> {
    return this.cacheMap.get(key) || null;
  }

  public async set(key: string, value: string, ttlMs: number = 3600000): Promise<void> {
    this.cacheMap.set(key, value);
  }

  public async acquireLock(lockKey: string, ttlMs: number): Promise<boolean> {
    if (this.cacheMap.has(lockKey)) {
      return false; // Lock already held
    }
    this.cacheMap.set(lockKey, "LOCKED");
    return true;
  }

  public async releaseLock(lockKey: string): Promise<void> {
    this.cacheMap.delete(lockKey);
  }
}
`,
  },
  {
    relativePath: "services/RefundOrchestrator.ts",
    extension: ".ts",
    isBinary: false,
    content: `import { PaymentGateway } from "./PaymentGateway";
import { RedisCache } from "./RedisCache";

export class RefundOrchestrator {
  private gateway: PaymentGateway;
  private cache: RedisCache;

  constructor() {
    this.gateway = new PaymentGateway();
    this.cache = new RedisCache();
  }

  /**
   * BUG LOCATION: Retries gateway call upon timeout WITHOUT passing idempotency key!
   * Violates ADR-042 LTL Invariants Safety Law 01 & 02.
   */
  public async executeRefund(orderId: string, userId: string, amount: number): Promise<boolean> {
    const lockAcquired = await this.cache.acquireLock(\`lock:refund:\${orderId}\`, 5000);
    if (!lockAcquired) {
      throw new Error("Concurrent refund lock failure");
    }

    try {
      // First Attempt - Missing Idempotency Key!
      let response = await this.gateway.requestGatewayRefund(orderId, amount);

      // Flawed Retry Logic: On high latency, retries WITHOUT idempotency key!
      if (!response.success || response.latencyMs > 4000) {
        // RETRY TRAP: Omitted idempotencyKey parameter!
        response = await this.gateway.requestGatewayRefund(orderId, amount);
      }

      return response.success;
    } finally {
      await this.cache.releaseLock(\`lock:refund:\${orderId}\`);
    }
  }
}
`,
  },
  {
    relativePath: "docs/ADR-042-refunds.md",
    extension: ".md",
    isBinary: false,
    content: `# ADR-042: Refund Orchestration & Idempotency Invariants

## Status
ACCEPTED

## Context
When processing customer refund requests across asynchronous payment gateways, network timeouts can occur. 
To preserve customer trust and financial accuracy, refund processing must adhere to strict invariant safety laws.

## System Invariants
1. **LTL Invariant (Safety Law 01):** \`G (refund_amount <= total_order_paid)\`
   - Under no operational trajectory may the cumulative refunded balance for any order ID exceed the original charged amount.
2. **LTL Invariant (Safety Law 02):** \`G (refund_attempt_timeout -> Next(idempotent_retry))\`
   - Every retry attempt following a gateway timeout MUST supply an invariant-backed Idempotency Key (\`idempotency_key = hash(order_id + user_id)\`).
3. **Double-Refund Prevention Guarantee:**
   - Retries without idempotency keys are strictly forbidden across all production microservices.
`,
  },
  {
    relativePath: "telemetry/traces_sample.json",
    extension: ".json",
    isBinary: false,
    content: `[
  {
    "traceId": "tr_412_001",
    "spanId": "sp_01",
    "service": "RefundOrchestrator",
    "operation": "executeRefund",
    "orderId": "ord_9901",
    "userId": "usr_7712",
    "amount": 250.00,
    "status": "DUPLICATE_CAPTURE_DETECTED",
    "gatewayLatencyMs": 4620,
    "idempotencyKeyPresent": false,
    "retryCount": 1,
    "timestamp": 1772870400000
  },
  {
    "traceId": "tr_412_002",
    "spanId": "sp_02",
    "service": "RefundOrchestrator",
    "operation": "executeRefund",
    "orderId": "ord_9902",
    "userId": "usr_8834",
    "amount": 180.50,
    "status": "DUPLICATE_CAPTURE_DETECTED",
    "gatewayLatencyMs": 4810,
    "idempotencyKeyPresent": false,
    "retryCount": 1,
    "timestamp": 1772870405000
  },
  {
    "traceId": "tr_412_003",
    "spanId": "sp_03",
    "service": "RefundOrchestrator",
    "operation": "executeRefund",
    "orderId": "ord_9903",
    "userId": "usr_1042",
    "amount": 500.00,
    "status": "DUPLICATE_CAPTURE_DETECTED",
    "gatewayLatencyMs": 4550,
    "idempotencyKeyPresent": false,
    "retryCount": 1,
    "timestamp": 1772870410000
  }
]
`,
  },
];
