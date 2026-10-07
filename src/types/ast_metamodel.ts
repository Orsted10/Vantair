/**
 * VANTAIR: THE COMPUTATIONAL SOFTWARE REALITY ENGINE
 * Universal Polyglot AST Metamodel (42 Universal Node Types)
 */

export enum UniversalNodeType {
  // Structure & Modules (1-2)
  Program = "Program",
  Module = "Module",

  // Declarations (3-12)
  FunctionDeclaration = "FunctionDeclaration",
  ClassDeclaration = "ClassDeclaration",
  InterfaceDeclaration = "InterfaceDeclaration",
  VariableDeclaration = "VariableDeclaration",
  TypeAliasDeclaration = "TypeAliasDeclaration",
  ImportDeclaration = "ImportDeclaration",
  ExportDeclaration = "ExportDeclaration",
  ParameterDeclaration = "ParameterDeclaration",
  PropertyDeclaration = "PropertyDeclaration",
  MethodDeclaration = "MethodDeclaration",

  // Statements (13-25)
  BlockStatement = "BlockStatement",
  ExpressionStatement = "ExpressionStatement",
  ReturnStatement = "ReturnStatement",
  IfStatement = "IfStatement",
  ForStatement = "ForStatement",
  WhileStatement = "WhileStatement",
  TryStatement = "TryStatement",
  CatchClause = "CatchClause",
  ThrowStatement = "ThrowStatement",
  BreakStatement = "BreakStatement",
  ContinueStatement = "ContinueStatement",
  SwitchStatement = "SwitchStatement",
  CaseClause = "CaseClause",

  // Expressions & Identifiers (26-38)
  Identifier = "Identifier",
  MemberExpression = "MemberExpression",
  CallExpression = "CallExpression",
  NewExpression = "NewExpression",
  AssignmentExpression = "AssignmentExpression",
  BinaryExpression = "BinaryExpression",
  UnaryExpression = "UnaryExpression",
  LambdaExpression = "LambdaExpression",
  ArrayLiteral = "ArrayLiteral",
  ObjectLiteral = "ObjectLiteral",
  Literal = "Literal",
  AwaitExpression = "AwaitExpression",
  YieldExpression = "YieldExpression",

  // Types (39-42)
  PrimitiveType = "PrimitiveType",
  TypeReference = "TypeReference",
  UnionType = "UnionType",
  IntersectionType = "IntersectionType",
}

export interface SourceSpan {
  startByte: number;
  endByte: number;
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
  filePath: string;
}

export interface UniversalASTNode {
  id: string; // Unique Node ID: e.g. "ast_node_104"
  type: UniversalNodeType;
  name?: string;
  span: SourceSpan;
  children: UniversalASTNode[];
  metadata: Record<string, unknown>;
  parentId?: string;
  symbolUri?: string; // e.g. "lang://ts/services/OrderService.ts#createOrder"
}

export interface SymbolDefinition {
  uri: string;
  name: string;
  kind: "function" | "class" | "interface" | "variable" | "method" | "type" | "import" | "export";
  filePath: string;
  span: SourceSpan;
  exported: boolean;
  typeSignature?: string;
  parentSymbolUri?: string;
  references: SourceSpan[];
}

export interface LexicalScope {
  id: string;
  parentId?: string;
  span: SourceSpan;
  symbols: Map<string, SymbolDefinition>;
  childScopes: LexicalScope[];
}

export interface LanguageParseResult {
  language: "typescript" | "javascript" | "python" | "go" | "rust" | "java";
  filePath: string;
  rootNode: UniversalASTNode;
  symbols: SymbolDefinition[];
  scopes: LexicalScope;
  parseTimeMs: number;
  lineCount: number;
}
