export interface PaymentGatewayResponse {
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
        transactionId: `txn_dup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        latencyMs: simulatedLatency,
      };
    }

    return {
      success: true,
      transactionId: `txn_clean_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      latencyMs: simulatedLatency,
    };
  }
}
