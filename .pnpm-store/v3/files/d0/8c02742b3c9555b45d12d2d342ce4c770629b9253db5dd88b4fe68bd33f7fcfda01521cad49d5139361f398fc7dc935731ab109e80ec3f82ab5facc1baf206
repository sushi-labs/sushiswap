// Type definitions for solidity-parser-antlr 0.2
// Project: https://github.com/federicobond/solidity-parser-antlr
// Definitions by: Leonid Logvinov <https://github.com/LogvinovLeon>
//                 Alex Browne <https://github.com/albrow>
//                 Xiao Liang <https://github.com/yxliang01>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.1
export interface LineColumn {
  line: number;
  column: number;
}
export interface Location {
  start: LineColumn;
  end: LineColumn;
}
// Note: This should be consistent with the definition of type ASTNode
export type ASTNodeTypeString =
  | 'SourceUnit'
  | 'PragmaDirective'
  | 'PragmaName'
  | 'PragmaValue'
  | 'ImportDirective'
  | 'ContractDefinition'
  | 'InheritanceSpecifier'
  | 'StateVariableDeclaration'
  | 'UsingForDeclaration'
  | 'StructDefinition'
  | 'ModifierDefinition'
  | 'ModifierInvocation'
  | 'FunctionDefinition'
  | 'EventDefinition'
  | 'EnumValue'
  | 'EnumDefinition'
  | 'VariableDeclaration'
  | 'UserDefinedTypeName'
  | 'Mapping'
  | 'ArrayTypeName'
  | 'FunctionTypeName'
  | 'StorageLocation'
  | 'StateMutability'
  | 'Block'
  | 'ExpressionStatement'
  | 'IfStatement'
  | 'WhileStatement'
  | 'ForStatement'
  | 'InlineAssemblyStatement'
  | 'DoWhileStatement'
  | 'ContinueStatement'
  | 'Break'
  | 'Continue'
  | 'BreakStatement'
  | 'ReturnStatement'
  | 'EmitStatement'
  | 'ThrowStatement'
  | 'VariableDeclarationStatement'
  | 'IdentifierList'
  | 'ElementaryTypeName'
  | 'FunctionCall'
  | 'AssemblyBlock'
  | 'AssemblyItem'
  | 'AssemblyCall'
  | 'AssemblyLocalDefinition'
  | 'AssemblyAssignment'
  | 'AssemblyStackAssignment'
  | 'LabelDefinition'
  | 'AssemblySwitch'
  | 'AssemblyCase'
  | 'AssemblyFunctionDefinition'
  | 'AssemblyFunctionReturns'
  | 'AssemblyFor'
  | 'AssemblyIf'
  | 'AssemblyLiteral'
  | 'SubAssembly'
  | 'TupleExpression'
  | 'TypeNameExpression'
  | 'BooleanLiteral'
  | 'NumberLiteral'
  | 'Identifier'
  | 'BinaryOperation'
  | 'UnaryOperation'
  | 'Conditional'
  | 'StringLiteral'
  | 'HexLiteral'
  | 'HexNumber'
  | 'DecimalNumber'
  | 'MemberAccess'
  | 'IndexAccess';
export interface BaseASTNode {
  type: ASTNodeTypeString;
  range?: [number, number];
  loc?: Location;
}
export interface SourceUnit extends BaseASTNode {
  type: 'SourceUnit';
  children: ASTNode[]; // TODO: Can be more precise
} // tslint:disable-line:no-empty-interface
export interface PragmaDirective extends BaseASTNode {
  type: 'PragmaDirective';
  name: string;
  value: string;
}
export interface ImportDirective extends BaseASTNode {
  type: 'ImportDirective';
  path: string;
  unitAlias: string,
  symbolAliases: Array<[string, string]>;
}
export interface ContractDefinition extends BaseASTNode {
  type: 'ContractDefinition';
  name: string;
  baseContracts: InheritanceSpecifier[];
  kind: string;
  subNodes: ASTNode[]; // TODO: Can be more precise
}
export interface InheritanceSpecifier extends BaseASTNode {
  type: 'InheritanceSpecifier';
  baseName: UserDefinedTypeName;
  arguments: Expression[];
}
export interface StateVariableDeclaration extends BaseASTNode {
  type: 'StateVariableDeclaration';
  variables: VariableDeclaration[];
  initialValue?: Expression;
}
export interface UsingForDeclaration extends BaseASTNode {
  type: 'UsingForDeclaration';
  typeName: TypeName;
  libraryName: string;
}
export interface StructDefinition extends BaseASTNode {
  type: 'StructDefinition';
  name: string;
  members: VariableDeclaration[];
}
export interface ModifierDefinition extends BaseASTNode {
  type: 'ModifierDefinition';
  name: string;
}
export interface ModifierInvocation extends BaseASTNode {
  type: 'ModifierInvocation';
  name: string;
  arguments: Expression[] | null;
}
export interface FunctionDefinition extends BaseASTNode {
  type: 'FunctionDefinition';
  name?: string;
  parameters: VariableDeclaration[];
  modifiers: ModifierInvocation[];
  stateMutability?: 'pure' | 'constant' | 'payable' | 'view'
  visibility: 'default' | 'external' | 'internal' | 'public' | 'private';
  isConstructor: boolean;
  returnParameters?: VariableDeclaration[];
  body?: Block;
}
export interface EventDefinition extends BaseASTNode {
  type: 'EventDefinition';
  name: string;
  parameters: VariableDeclaration[];
}
export interface EnumValue extends BaseASTNode {
  type: 'EnumValue';
  name: string;
}
export interface EnumDefinition extends BaseASTNode {
  type: 'EnumDefinition';
  name: string;
  members: EnumValue[];
}
export interface VariableDeclaration extends BaseASTNode {
  type: 'VariableDeclaration';
  isIndexed: boolean;
  isStateVar: boolean;
  typeName: TypeName;
  name: string;
  isDeclaredConst?: boolean;
  storageLocation?: string;
  expression?: Expression;
  visibility?: 'public' | 'private' | 'internal' | 'default';
}
export interface UserDefinedTypeName extends BaseASTNode {
  type: 'UserDefinedTypeName';
  namePath: string;
}
export interface ArrayTypeName extends BaseASTNode {
  type: 'ArrayTypeName';
  baseTypeName: TypeName;
  length?: Expression;
}
export interface Mapping extends BaseASTNode {
  type: 'Mapping';
  keyType: ElementaryTypeName;
  valueType: TypeName;
}
export interface FunctionTypeName extends BaseASTNode {
  type: 'FunctionTypeName';
  parameterTypes: TypeName[];
  returnTypes: TypeName[];
  visibility: string;
  stateMutability: string;
}
export interface Block extends BaseASTNode {
  type: 'Block';
  statements: Statement[]
}
export interface ExpressionStatement extends BaseASTNode {
  type: 'ExpressionStatement';
  expression: Expression;
}
export interface IfStatement extends BaseASTNode {
  type: 'IfStatement';
  condition: Expression;
  trueBody: Statement;
  falseBody?: Statement;
}
export interface WhileStatement extends BaseASTNode {
  type: 'WhileStatement';
}
export interface ForStatement extends BaseASTNode {
  type: 'ForStatement';
  initExpression?: SimpleStatement;
  conditionExpression?: Expression;
  loopExpression?: ExpressionStatement;
  body: Statement;
}
export interface InlineAssemblyStatement extends BaseASTNode {
  type: 'InlineAssemblyStatement';
  language: string;
  body: AssemblyBlock;
}
export interface DoWhileStatement extends BaseASTNode {
  type: 'DoWhileStatement';
  condition: Expression;
  body: Statement;
}
export interface ContinueStatement extends BaseASTNode {
  type: 'ContinueStatement';
}
export interface Break extends BaseASTNode {
  type: 'Break';
}
export interface Continue extends BaseASTNode {
  type: 'Continue';
}
export interface BreakStatement extends BaseASTNode {
  type: 'BreakStatement';
}
export interface ReturnStatement extends BaseASTNode {
  type: 'ReturnStatement';
  expression: Expression | null;
}
export interface EmitStatement extends BaseASTNode {
  type: 'EmitStatement';
  eventCall: FunctionCall;
}
export interface ThrowStatement extends BaseASTNode {
  type: 'ThrowStatement';
}
export interface VariableDeclarationStatement extends BaseASTNode {
  type: 'VariableDeclarationStatement';
  variables: ASTNode[];
  initialValue?: Expression;
}
export interface ElementaryTypeName extends BaseASTNode {
  type: 'ElementaryTypeName';
  name: string;
}
export interface FunctionCall extends BaseASTNode {
  type: 'FunctionCall';
  expression: Expression;
  arguments: Expression[];
  names: string[];
}
export interface AssemblyBlock extends BaseASTNode {
  type: 'AssemblyBlock';
  operations: AssemblyItem[]
}
export interface AssemblyCall extends BaseASTNode {
  type: 'AssemblyCall';
  functionName: string,
  arguments: AssemblyExpression[];
}
export interface AssemblyLocalDefinition extends BaseASTNode {
  type: 'AssemblyLocalDefinition';
}
export interface AssemblyAssignment extends BaseASTNode {
  type: 'AssemblyAssignment';
  expression: AssemblyExpression;
  names: Identifier[]
}
export interface AssemblyStackAssignment extends BaseASTNode {
  type: 'AssemblyStackAssignment';
}
export interface LabelDefinition extends BaseASTNode {
  type: 'LabelDefinition';
}
export interface AssemblySwitch extends BaseASTNode {
  type: 'AssemblySwitch';
}
export interface AssemblyCase extends BaseASTNode {
  type: 'AssemblyCase';
}
export interface AssemblyFunctionDefinition extends BaseASTNode {
  type: 'AssemblyFunctionDefinition';
}
export interface AssemblyFunctionReturns extends BaseASTNode {
  type: 'AssemblyFunctionReturns';
}
export interface AssemblyFor extends BaseASTNode {
  type: 'AssemblyFor';
}
export interface AssemblyIf extends BaseASTNode {
  type: 'AssemblyIf';
}
export interface AssemblyLiteral extends BaseASTNode {
  type: 'AssemblyLiteral';
}
export interface SubAssembly extends BaseASTNode {
  type: 'SubAssembly';
}
export interface TupleExpression extends BaseASTNode {
  type: 'TupleExpression';
  components: Expression[];
  isArray: boolean;
}
export interface TypeNameExpression extends BaseASTNode {
  type: 'TypeNameExpression';
  typeName: ElementaryTypeName | UserDefinedTypeName;
}
export interface NumberLiteral extends BaseASTNode {
  type: 'NumberLiteral';
  number: string;
  subdenomination:
    | null
    | 'wei'
    | 'szabo'
    | 'finney'
    | 'ether'
    | 'seconds'
    | 'minutes'
    | 'hours'
    | 'days'
    | 'weeks'
    | 'years';
}
export interface BooleanLiteral extends BaseASTNode {
  type: 'BooleanLiteral';
  value: boolean;
}
export interface HexLiteral extends BaseASTNode {
  type: 'HexLiteral';
  value: string;
}
export interface StringLiteral extends BaseASTNode {
  type: 'StringLiteral';
  value: string;
}
export interface Identifier extends BaseASTNode {
  type: 'Identifier';
  name: string;
}
export type BinOp =
  | '+'
  | '-'
  | '*'
  | '/'
  | '**'
  | '%'
  | '<<'
  | '>>'
  | '&&'
  | '||'
  | '&'
  | '|'
  | '^'
  | '<'
  | '>'
  | '<='
  | '>='
  | '=='
  | '!='
  | '='
  | '|='
  | '^='
  | '&='
  | '<<='
  | '>>='
  | '+='
  | '-='
  | '*='
  | '/='
  | '%=';
export type UnaryOp =
  | '-'
  | '+'
  | '++'
  | '~'
  | 'after'
  | 'delete'
  | '!';
export interface BinaryOperation extends BaseASTNode {
  type: 'BinaryOperation';
  left: Expression;
  right: Expression;
  operator: BinOp;
}
export interface UnaryOperation extends BaseASTNode {
  type: 'UnaryOperation';
  operator: UnaryOp;
  subExpression: Expression;
  isPrefix: boolean;
}
export interface Conditional extends BaseASTNode {
  type: 'Conditional';
  trueExpression: ASTNode;
  falseExpression: ASTNode;
}
export interface IndexAccess extends BaseASTNode {
  type: 'IndexAccess';
  base: Expression;
  index: Expression;
}
export interface MemberAccess extends BaseASTNode {
  type: 'MemberAccess';
  expression: Expression;
  memberName: string;
}
export interface HexNumber extends BaseASTNode {
  type: 'HexNumber';
  value: string;
}
export interface DecimalNumber extends BaseASTNode {
  type: 'DecimalNumber';
  value: string;
}
export type ASTNode =
  | SourceUnit
  | PragmaDirective
  | ImportDirective
  | ContractDefinition
  | InheritanceSpecifier
  | StateVariableDeclaration
  | UsingForDeclaration
  | StructDefinition
  | ModifierDefinition
  | ModifierInvocation
  | FunctionDefinition
  | EventDefinition
  | EnumValue
  | EnumDefinition
  | VariableDeclaration
  | TypeName
  | UserDefinedTypeName
  | Mapping
  | FunctionTypeName
  | Block
  | ExpressionStatement
  | IfStatement
  | WhileStatement
  | ForStatement
  | InlineAssemblyStatement
  | DoWhileStatement
  | ContinueStatement
  | BreakStatement
  | ReturnStatement
  | EmitStatement
  | ThrowStatement
  | VariableDeclarationStatement
  | ElementaryTypeName
  | AssemblyBlock
  | AssemblyCall
  | AssemblyLocalDefinition
  | AssemblyAssignment
  | AssemblyStackAssignment
  | LabelDefinition
  | AssemblySwitch
  | AssemblyCase
  | AssemblyFunctionDefinition
  | AssemblyFunctionReturns
  | AssemblyFor
  | AssemblyIf
  | AssemblyLiteral
  | SubAssembly
  | TupleExpression
  | TypeNameExpression
  | BinaryOperation
  | Conditional
  | IndexAccess
  | AssemblyItem
  | Expression;
export type AssemblyItem =
  | Identifier
  | AssemblyBlock
  | AssemblyExpression
  | AssemblyLocalDefinition
  | AssemblyAssignment
  | AssemblyStackAssignment
  | LabelDefinition
  | AssemblySwitch
  | AssemblyFunctionDefinition
  | AssemblyFor
  | AssemblyIf
  | Break
  | Continue
  | SubAssembly
  | NumberLiteral
  | StringLiteral
  | HexNumber
  | HexLiteral
  | DecimalNumber;
export type AssemblyExpression =
  | AssemblyCall
  | AssemblyLiteral
export type Expression =
  | IndexAccess
  | TupleExpression
  | BinaryOperation
  | Conditional
  | MemberAccess
  | FunctionCall
  | UnaryOperation
  | PrimaryExpression;
export type PrimaryExpression =
  | BooleanLiteral
  | NumberLiteral
  | Identifier
  | TupleExpression
  | TypeNameExpression;
export type SimpleStatement =
  | VariableDeclarationStatement
  | ExpressionStatement;
export type TypeName =
  | ElementaryTypeName
  | UserDefinedTypeName
  | Mapping
  | ArrayTypeName
  | FunctionTypeName;
export type Statement =
  | IfStatement
  | WhileStatement
  | ForStatement
  | Block
  | InlineAssemblyStatement
  | DoWhileStatement
  | ContinueStatement
  | BreakStatement
  | ReturnStatement
  | EmitStatement
  | ThrowStatement
  | SimpleStatement
  | VariableDeclarationStatement;
export interface Visitor {
  SourceUnit?: (node: SourceUnit) => any;
  PragmaDirective?: (node: PragmaDirective) => any;
  ImportDirective?: (node: ImportDirective) => any;
  ContractDefinition?: (node: ContractDefinition) => any;
  InheritanceSpecifier?: (node: InheritanceSpecifier) => any;
  StateVariableDeclaration?: (node: StateVariableDeclaration) => any;
  UsingForDeclaration?: (node: UsingForDeclaration) => any;
  StructDefinition?: (node: StructDefinition) => any;
  ModifierDefinition?: (node: ModifierDefinition) => any;
  ModifierInvocation?: (node: ModifierInvocation) => any;
  FunctionDefinition?: (node: FunctionDefinition) => any;
  EventDefinition?: (node: EventDefinition) => any;
  EnumValue?: (node: EnumValue) => any;
  EnumDefinition?: (node: EnumDefinition) => any;
  VariableDeclaration?: (node: VariableDeclaration) => any;
  UserDefinedTypeName?: (node: UserDefinedTypeName) => any;
  Mapping?: (node: Mapping) => any;
  ArrayTypeName?: (node: ArrayTypeName) => any;
  FunctionTypeName?: (node: FunctionTypeName) => any;
  Block?: (node: Block) => any;
  ExpressionStatement?: (node: ExpressionStatement) => any;
  IfStatement?: (node: IfStatement) => any;
  WhileStatement?: (node: WhileStatement) => any;
  ForStatement?: (node: ForStatement) => any;
  InlineAssemblyStatement?: (node: InlineAssemblyStatement) => any;
  DoWhileStatement?: (node: DoWhileStatement) => any;
  ContinueStatement?: (node: ContinueStatement) => any;
  BreakStatement?: (node: BreakStatement) => any;
  ReturnStatement?: (node: ReturnStatement) => any;
  EmitStatement?: (node: EmitStatement) => any;
  ThrowStatement?: (node: ThrowStatement) => any;
  VariableDeclarationStatement?: (node: VariableDeclarationStatement) => any;
  ElementaryTypeName?: (node: ElementaryTypeName) => any;
  AssemblyBlock?: (node: AssemblyBlock) => any;
  AssemblyCall?: (node: AssemblyCall) => any;
  AssemblyLocalDefinition?: (node: AssemblyLocalDefinition) => any;
  AssemblyAssignment?: (node: AssemblyAssignment) => any;
  AssemblyStackAssignment?: (node: AssemblyStackAssignment) => any;
  LabelDefinition?: (node: LabelDefinition) => any;
  AssemblySwitch?: (node: AssemblySwitch) => any;
  AssemblyCase?: (node: AssemblyCase) => any;
  AssemblyFunctionDefinition?: (node: AssemblyFunctionDefinition) => any;
  AssemblyFunctionReturns?: (node: AssemblyFunctionReturns) => any;
  AssemblyFor?: (node: AssemblyFor) => any;
  AssemblyIf?: (node: AssemblyIf) => any;
  AssemblyLiteral?: (node: AssemblyLiteral) => any;
  SubAssembly?: (node: SubAssembly) => any;
  TupleExpression?: (node: TupleExpression) => any;
  TypeNameExpression?: (node: TypeNameExpression) => any;
  NumberLiteral?: (node: NumberLiteral) => any;
  BooleanLiteral?: (node: BooleanLiteral) => any;
  Identifier?: (node: Identifier) => any;
  BinaryOperation?: (node: BinaryOperation) => any;
  Conditional?: (node: Conditional) => any;
  IndexAccess?: (node: IndexAccess) => any;
  MemberAccess?: (node: MemberAccess) => any;
  Break?: (node: Break) => any;
  HexNumber?: (node: HexNumber) => any;
  DecimalNumber?: (node: DecimalNumber) => any;
  Continue?: (node: Continue) => any;
  // Start of :exit handler for each type. Must be consistent with above
  'SourceUnit:exit'?: (node: SourceUnit) => any;
  'PragmaDirective:exit'?: (node: PragmaDirective) => any;
  'ImportDirective:exit'?: (node: ImportDirective) => any;
  'ContractDefinition:exit'?: (node: ContractDefinition) => any;
  'InheritanceSpecifier:exit'?: (node: InheritanceSpecifier) => any;
  'StateVariableDeclaration:exit'?: (node: StateVariableDeclaration) => any;
  'UsingForDeclaration:exit'?: (node: UsingForDeclaration) => any;
  'StructDefinition:exit'?: (node: StructDefinition) => any;
  'ModifierDefinition:exit'?: (node: ModifierDefinition) => any;
  'ModifierInvocation:exit'?: (node: ModifierInvocation) => any;
  'FunctionDefinition:exit'?: (node: FunctionDefinition) => any;
  'EventDefinition:exit'?: (node: EventDefinition) => any;
  'EnumValue:exit'?: (node: EnumValue) => any;
  'EnumDefinition:exit'?: (node: EnumDefinition) => any;
  'VariableDeclaration:exit'?: (node: VariableDeclaration) => any;
  'UserDefinedTypeName:exit'?: (node: UserDefinedTypeName) => any;
  'Mapping:exit'?: (node: Mapping) => any;
  'ArrayTypeName:exit'?: (node: ArrayTypeName) => any;
  'FunctionTypeName:exit'?: (node: FunctionTypeName) => any;
  'Block:exit'?: (node: Block) => any;
  'ExpressionStatement:exit'?: (node: ExpressionStatement) => any;
  'IfStatement:exit'?: (node: IfStatement) => any;
  'WhileStatement:exit'?: (node: WhileStatement) => any;
  'ForStatement:exit'?: (node: ForStatement) => any;
  'InlineAssemblyStatement:exit'?: (node: InlineAssemblyStatement) => any;
  'DoWhileStatement:exit'?: (node: DoWhileStatement) => any;
  'ContinueStatement:exit'?: (node: ContinueStatement) => any;
  'BreakStatement:exit'?: (node: BreakStatement) => any;
  'ReturnStatement:exit'?: (node: ReturnStatement) => any;
  'EmitStatement:exit'?: (node: EmitStatement) => any;
  'ThrowStatement:exit'?: (node: ThrowStatement) => any;
  'VariableDeclarationStatement:exit'?: (node: VariableDeclarationStatement) => any;
  'ElementaryTypeName:exit'?: (node: ElementaryTypeName) => any;
  'AssemblyBlock:exit'?: (node: AssemblyBlock) => any;
  'AssemblyCall:exit'?: (node: AssemblyCall) => any;
  'AssemblyLocalDefinition:exit'?: (node: AssemblyLocalDefinition) => any;
  'AssemblyAssignment:exit'?: (node: AssemblyAssignment) => any;
  'AssemblyStackAssignment:exit'?: (node: AssemblyStackAssignment) => any;
  'LabelDefinition:exit'?: (node: LabelDefinition) => any;
  'AssemblySwitch:exit'?: (node: AssemblySwitch) => any;
  'AssemblyCase:exit'?: (node: AssemblyCase) => any;
  'AssemblyFunctionDefinition:exit'?: (
    node: AssemblyFunctionDefinition
  ) => any;
  'AssemblyFunctionReturns:exit'?: (node: AssemblyFunctionReturns) => any;
  'AssemblyFor:exit'?: (node: AssemblyFor) => any;
  'AssemblyIf:exit'?: (node: AssemblyIf) => any;
  'AssemblyLiteral:exit'?: (node: AssemblyLiteral) => any;
  'SubAssembly:exit'?: (node: SubAssembly) => any;
  'TupleExpression:exit'?: (node: TupleExpression) => any;
  'TypeNameExpression:exit'?: (
    node: TypeNameExpression
  ) => any;
  'NumberLiteral:exit'?: (node: NumberLiteral) => any;
  'BooleanLiteral:exit'?: (node: BooleanLiteral) => any;
  'Identifier:exit'?: (node: Identifier) => any;
  'BinaryOperation:exit'?: (node: BinaryOperation) => any;
  'Conditional:exit'?: (node: Conditional) => any;
  'IndexAccess:exit'?: (node: IndexAccess) => any;
  'MemberAccess:exit'?: (node: MemberAccess) => any;
  'HexNumber:exit'?: (node: HexNumber) => any;
  'DecimalNumber:exit'?: (node: DecimalNumber) => any;
  'Break:exit'?: (node: Break) => any;
  'Continue:exit'?: (node: Continue) => any;
}
export interface ParserOpts {
  tolerant?: boolean;
  range?: boolean;
  loc?: boolean;
}
export function parse(sourceCode: string, parserOpts: ParserOpts): ASTNode;
export function visit(ast: ASTNode, visitor: Visitor): void;
