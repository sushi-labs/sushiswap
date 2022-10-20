import { GraphQLSchema, GraphQLNamedType, EnumTypeDefinitionNode, ObjectTypeDefinitionNode } from 'graphql';
import { TsVisitor } from './visitor.js';
import { TypeScriptPluginConfig } from './config.js';
export declare class TsIntrospectionVisitor extends TsVisitor {
    private typesToInclude;
    constructor(schema: GraphQLSchema, pluginConfig: TypeScriptPluginConfig, typesToInclude: GraphQLNamedType[]);
    DirectiveDefinition(): any;
    ObjectTypeDefinition(node: ObjectTypeDefinitionNode, key: string | number, parent: any): string;
    EnumTypeDefinition(node: EnumTypeDefinitionNode): string;
}
