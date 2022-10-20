import { ASTVisitor, DirectiveNode, ExecutionArgs, ValidationContext } from 'graphql';
export declare type ExtendedValidationRule = (context: ValidationContext, executionArgs: ExecutionArgs) => ASTVisitor;
export declare function getDirectiveFromAstNode(astNode: {
    directives?: ReadonlyArray<DirectiveNode>;
}, names: string | string[]): null | DirectiveNode;
