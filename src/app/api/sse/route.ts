import { NextRequest } from "next/server";
import { SSEEventBusController } from "../../../engine/sse_groq_loop";

// Global singleton SSE event bus across server requests
const globalEventBus = new SSEEventBusController();

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    start(controller) {
      // Send initial connection packet
      const initMessage = {
        eventId: `sse_init_${Date.now()}`,
        sequenceId: 0,
        timestamp: Date.now(),
        eventType: "HEARTBEAT" as const,
        payload: { message: "VANTAIR SSE Stream Connected (Real-Time Synaptic Bus)" },
      };
      controller.enqueue(encoder.encode(globalEventBus.formatSSEPayload(initMessage)));

      // Subscribe to global event bus
      const unsubscribe = globalEventBus.subscribe((msg) => {
        try {
          controller.enqueue(encoder.encode(globalEventBus.formatSSEPayload(msg)));
        } catch (err) {
          // Stream closed
        }
      });

      // Keep-alive heartbeat interval (every 15 seconds)
      const heartbeatTimer = setInterval(() => {
        try {
          const hbMsg = {
            eventId: `hb_${Date.now()}`,
            sequenceId: -1,
            timestamp: Date.now(),
            eventType: "HEARTBEAT" as const,
            payload: { activeSubscribers: globalEventBus.subscriberCount },
          };
          controller.enqueue(encoder.encode(globalEventBus.formatSSEPayload(hbMsg)));
        } catch (err) {
          clearInterval(heartbeatTimer);
        }
      }, 15000);

      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeatTimer);
        unsubscribe();
      });
    },
  });

  return new Response(customReadable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
