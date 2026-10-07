/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Phase 27: Source ↔ Runtime Correlation Engine
 *
 * Correlates static source code symbols with dynamic runtime traces, spans,
 * metrics, and logs.
 *
 * Epistemic Invariant:
 *   When correlation cannot be proven via traceId, spanId, or stack trace symbol,
 *   emit CORRELATION_UNAVAILABLE. Never hallucinate or guess a connection.
 */

import { SourceLocation } from "../../reality/ledger/evidence_ledger";

export interface RuntimeSpan {
  traceId: string;
  spanId: string;
  name: string;
  service: string;
  durationMs: number;
  attributes: Record<string, any>;
  statusCode?: number;
  error?: string;
}

export interface CorrelationResult {
  spanId: string;
  correlated: boolean;
  status: "CORRELATED" | "CORRELATION_UNAVAILABLE" | "AMBIGUOUS_MATCH";
  sourceLocation?: SourceLocation;
  symbolName?: string;
  confidence: number;
  explanation: string;
}

export class SourceRuntimeCorrelationEngine {
  /**
   * Attempts to correlate an OpenTelemetry span with a static symbol in source code.
   */
  public correlateSpanToSource(
    span: RuntimeSpan,
    knownSymbols: Array<{ name: string; file: string; line: number }>
  ): CorrelationResult {
    // Strategy 1: Explicit source attribute in OpenTelemetry span (e.g. code.filepath, code.lineno)
    if (span.attributes["code.filepath"] && span.attributes["code.lineno"]) {
      return {
        spanId: span.spanId,
        correlated: true,
        status: "CORRELATED",
        sourceLocation: {
          file: span.attributes["code.filepath"],
          startLine: Number(span.attributes["code.lineno"]),
          endLine: Number(span.attributes["code.lineno"])
        },
        symbolName: span.attributes["code.function"] || span.name,
        confidence: 0.99,
        explanation: "Correlated via exact OpenTelemetry code.filepath and code.lineno telemetry attributes."
      };
    }

    // Strategy 2: Exact symbol name match in known symbol registry
    const exactMatches = knownSymbols.filter(
      s => s.name.toLowerCase() === span.name.toLowerCase() ||
           span.name.toLowerCase().endsWith(`.${s.name.toLowerCase()}`)
    );

    if (exactMatches.length === 1) {
      const match = exactMatches[0];
      return {
        spanId: span.spanId,
        correlated: true,
        status: "CORRELATED",
        sourceLocation: {
          file: match.file,
          startLine: match.line,
          endLine: match.line
        },
        symbolName: match.name,
        confidence: 0.85,
        explanation: `Correlated uniquely by symbol signature '${match.name}' to '${match.file}:${match.line}'.`
      };
    }

    if (exactMatches.length > 1) {
      return {
        spanId: span.spanId,
        correlated: false,
        status: "AMBIGUOUS_MATCH",
        confidence: 0.4,
        explanation: `Span name '${span.name}' matched multiple static symbols (${exactMatches.length}). Correlation cannot be uniquely established without stack trace.`
      };
    }

    // Fallback: Never hallucinate
    return {
      spanId: span.spanId,
      correlated: false,
      status: "CORRELATION_UNAVAILABLE",
      confidence: 0.0,
      explanation: `No deterministic mapping exists between span '${span.name}' and static AST symbols. Telemetry lacks code location metadata.`
    };
  }
}
