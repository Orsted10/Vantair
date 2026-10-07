import { PaymentGateway } from "./PaymentGateway";
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
    const lockAcquired = await this.cache.acquireLock(`lock:refund:${orderId}`, 5000);
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
      await this.cache.releaseLock(`lock:refund:${orderId}`);
    }
  }
}
