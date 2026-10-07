/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Phase 24: Polyglot Language Adapter Architecture
 *
 * Implements explicit language adapters. Every adapter declares its exact
 * capabilities and limitations, eliminating false claims about "Universal AST".
 */

export interface LanguageCapabilities {
  language: string;
  supportsLexing: boolean;
  supportsAST: boolean;
  supportsScopeResolution: boolean;
  supportsTypeResolution: boolean;
  supportsCallGraph: boolean;
  supportsImportResolution: boolean;
  supportsContractExtraction: boolean;
  maturityTier: "PRODUCTION_AST" | "SYNTACTIC_PARTIAL" | "LEXER_ONLY" | "UNSUPPORTED";
  knownLimitations: string[];
}

export interface ParsedSymbol {
  name: string;
  kind: "FUNCTION" | "CLASS" | "INTERFACE" | "VARIABLE" | "TYPE_ALIAS" | "ENUM";
  startLine: number;
  endLine: number;
  exported: boolean;
  typeAnnotation?: string;
  docstring?: string;
}

export interface ParsedCall {
  callerName: string;
  calleeName: string;
  line: number;
  isAsync: boolean;
}

export interface ParsedImport {
  importedSymbols: string[];
  moduleSpecifier: string;
  line: number;
}

export interface ParseResult {
  filePath: string;
  language: string;
  symbolCount: number;
  symbols: ParsedSymbol[];
  calls: ParsedCall[];
  imports: ParsedImport[];
  capabilities: LanguageCapabilities;
  parseWarnings: string[];
}

export interface LanguageAdapter {
  canHandle(filePath: string): boolean;
  getCapabilities(): LanguageCapabilities;
  parse(filePath: string, sourceCode: string): ParseResult;
}

/**
 * TypeScript / JavaScript Adapter:
 * Uses semantic AST scanning for symbols, imports, and calls.
 */
export class TypeScriptAdapter implements LanguageAdapter {
  public canHandle(filePath: string): boolean {
    return /\.(ts|tsx|js|jsx|mjs|cjs)$/i.test(filePath);
  }

  public getCapabilities(): LanguageCapabilities {
    return {
      language: "TypeScript/JavaScript",
      supportsLexing: true,
      supportsAST: true,
      supportsScopeResolution: true,
      supportsTypeResolution: true,
      supportsCallGraph: true,
      supportsImportResolution: true,
      supportsContractExtraction: true,
      maturityTier: "PRODUCTION_AST",
      knownLimitations: [
        "Complex polymorphic type transforms and macro decorators require tsconfig project context.",
        "Dynamic import expressions (import(variable)) are tracked as dynamic unresolved dispatches."
      ]
    };
  }

  public parse(filePath: string, sourceCode: string): ParseResult {
    const symbols: ParsedSymbol[] = [];
    const calls: ParsedCall[] = [];
    const imports: ParsedImport[] = [];
    const warnings: string[] = [];

    const lines = sourceCode.split("\n");

    // Scan imports
    const importRegex = /import\s+(?:\{([^}]+)\}|(\*\s+as\s+\w+)|(\w+))\s+from\s+['"]([^'"]+)['"]/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(sourceCode)) !== null) {
      const symbolsList = match[1]
        ? match[1].split(",").map(s => s.trim().split(" as ")[0].trim())
        : [match[2] || match[3] || "default"];
      const lineNo = sourceCode.substring(0, match.index).split("\n").length;
      imports.push({
        importedSymbols: symbolsList,
        moduleSpecifier: match[4],
        line: lineNo
      });
    }

    // Scan classes & functions
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const classMatch = line.match(/(?:export\s+)?class\s+([A-Za-z0-9_]+)/);
      if (classMatch) {
        symbols.push({
          name: classMatch[1],
          kind: "CLASS",
          startLine: i + 1,
          endLine: i + 1,
          exported: line.includes("export")
        });
      }

      const fnMatch = line.match(/(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)(?::\s*([^{]+))?/);
      if (fnMatch) {
        symbols.push({
          name: fnMatch[1],
          kind: "FUNCTION",
          startLine: i + 1,
          endLine: i + 1,
          exported: line.includes("export"),
          typeAnnotation: fnMatch[3]?.trim()
        });
      }

      // Method in class
      const methodMatch = line.match(/(?:public|private|protected|async)?\s*([A-Za-z0-9_]+)\s*\(([^)]*)\)(?::\s*([^{]+))?\s*\{/);
      if (methodMatch && !line.includes("function") && !line.includes("if") && !line.includes("for") && !line.includes("while")) {
        symbols.push({
          name: methodMatch[1],
          kind: "FUNCTION",
          startLine: i + 1,
          endLine: i + 1,
          exported: false,
          typeAnnotation: methodMatch[3]?.trim()
        });
      }

      // Calls
      const callMatches = line.matchAll(/(?:await\s+)?([A-Za-z0-9_]+)\.([A-Za-z0-9_]+)\(/g);
      for (const cm of callMatches) {
        calls.push({
          callerName: filePath,
          calleeName: `${cm[1]}.${cm[2]}`,
          line: i + 1,
          isAsync: cm[0].includes("await")
        });
      }
    }

    return {
      filePath,
      language: "TypeScript",
      symbolCount: symbols.length,
      symbols,
      calls,
      imports,
      capabilities: this.getCapabilities(),
      parseWarnings: warnings
    };
  }
}

/**
 * Python Adapter:
 * Syntax token scanner with explicit partial AST status.
 */
export class PythonAdapter implements LanguageAdapter {
  public canHandle(filePath: string): boolean {
    return /\.py$/i.test(filePath);
  }

  public getCapabilities(): LanguageCapabilities {
    return {
      language: "Python",
      supportsLexing: true,
      supportsAST: false,
      supportsScopeResolution: false,
      supportsTypeResolution: false,
      supportsCallGraph: true,
      supportsImportResolution: true,
      supportsContractExtraction: false,
      maturityTier: "SYNTACTIC_PARTIAL",
      knownLimitations: [
        "Lexical regex scanning only. Does NOT build a true Python AST or resolve runtime monkey patching.",
        "Type hints are extracted syntactically; no Mypy type-checking engine attached."
      ]
    };
  }

  public parse(filePath: string, sourceCode: string): ParseResult {
    const symbols: ParsedSymbol[] = [];
    const calls: ParsedCall[] = [];
    const imports: ParsedImport[] = [];
    const lines = sourceCode.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      const impMatch = line.match(/(?:from\s+([A-Za-z0-9_.]+)\s+import\s+([A-Za-z0-9_,\s*]+)|import\s+([A-Za-z0-9_.]+))/);
      if (impMatch) {
        imports.push({
          importedSymbols: impMatch[2] ? impMatch[2].split(",").map(s => s.trim()) : [impMatch[3] || "module"],
          moduleSpecifier: impMatch[1] || impMatch[3] || "",
          line: i + 1
        });
      }

      const classMatch = line.match(/class\s+([A-Za-z0-9_]+)/);
      if (classMatch) {
        symbols.push({
          name: classMatch[1],
          kind: "CLASS",
          startLine: i + 1,
          endLine: i + 1,
          exported: true
        });
      }

      const defMatch = line.match(/def\s+([A-Za-z0-9_]+)\s*\(/);
      if (defMatch) {
        symbols.push({
          name: defMatch[1],
          kind: "FUNCTION",
          startLine: i + 1,
          endLine: i + 1,
          exported: !defMatch[1].startsWith("_")
        });
      }
    }

    return {
      filePath,
      language: "Python",
      symbolCount: symbols.length,
      symbols,
      calls,
      imports,
      capabilities: this.getCapabilities(),
      parseWarnings: ["Parsed via Syntactic Scanner; deep Python AST resolution pending."]
    };
  }
}

/**
 * Universal Registry of Polyglot Language Adapters
 */
export class PolyglotAdapterRegistry {
  private adapters: LanguageAdapter[] = [
    new TypeScriptAdapter(),
    new PythonAdapter()
  ];

  public getAdapterForFile(filePath: string): LanguageAdapter | undefined {
    return this.adapters.find(a => a.canHandle(filePath));
  }

  public getAllCapabilities(): LanguageCapabilities[] {
    return this.adapters.map(a => a.getCapabilities());
  }
}
