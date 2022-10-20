import { OperationDefinitionNode, FragmentDefinitionNode, Source } from 'graphql';
export interface Document {
    source: Source;
    fragments: {
        node: FragmentDefinitionNode;
        source: string;
    }[];
    operations: {
        node: OperationDefinitionNode;
        source: string;
    }[];
    hasFragments: boolean;
    hasOperations: boolean;
}
export declare function readDocument(source: Source): Document;
