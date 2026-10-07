# ADR-042: Refund Orchestration & Idempotency Invariants

## Status
ACCEPTED

## Context
When processing customer refund requests across asynchronous payment gateways, network timeouts can occur. 
To preserve customer trust and financial accuracy, refund processing must adhere to strict invariant safety laws.

## System Invariants
1. **LTL Invariant (Safety Law 01):** `G (refund_amount <= total_order_paid)`
   - Under no operational trajectory may the cumulative refunded balance for any order ID exceed the original charged amount.
2. **LTL Invariant (Safety Law 02):** `G (refund_attempt_timeout -> Next(idempotent_retry))`
   - Every retry attempt following a gateway timeout MUST supply an invariant-backed Idempotency Key (`idempotency_key = hash(order_id + user_id)`).
3. **Double-Refund Prevention Guarantee:**
   - Retries without idempotency keys are strictly forbidden across all production microservices.
