import { RefundOrchestrator } from "./RefundOrchestrator";
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
      throw new Error(`Order ${orderId} not found`);
    }

    const success = await this.refundOrchestrator.executeRefund(order.id, order.userId, refundAmount);
    if (success) {
      await this.db.updateOrderStatus(orderId, "REFUNDED");
    }

    return success;
  }
}
