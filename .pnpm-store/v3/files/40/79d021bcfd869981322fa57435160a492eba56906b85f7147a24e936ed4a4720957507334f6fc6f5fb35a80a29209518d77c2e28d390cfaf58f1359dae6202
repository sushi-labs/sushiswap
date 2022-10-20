import { DepGraph } from 'dependency-graph';
import { DocumentNode, GraphQLError, ASTNode, FragmentDefinitionNode, Source } from 'graphql';
export declare function validateQueryDepth({ source, doc, maxDepth, fragmentGraph, }: {
    source: Source;
    doc: DocumentNode;
    maxDepth: number;
    fragmentGraph: DepGraph<FragmentDefinitionNode>;
}): GraphQLError | void;
export declare function calculateDepth({ node, currentDepth, maxDepth, getFragment, }: {
    node: ASTNode;
    currentDepth: number;
    maxDepth?: number;
    getFragment: (fragmentName: string) => FragmentDefinitionNode;
}): number | never;
