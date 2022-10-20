import { ClientSideBasePluginConfig, ClientSideBaseVisitor, LoadedFragment } from '@graphql-codegen/visitor-plugin-common';
import { GraphQLSchema, OperationDefinitionNode } from 'graphql';
import { RawGenericSdkPluginConfig } from './config.cjs';
export interface GenericSdkPluginConfig extends ClientSideBasePluginConfig {
    usingObservableFrom: string;
    rawRequest: boolean;
}
export declare class GenericSdkVisitor extends ClientSideBaseVisitor<RawGenericSdkPluginConfig, GenericSdkPluginConfig> {
    private _operationsToInclude;
    constructor(schema: GraphQLSchema, fragments: LoadedFragment[], rawConfig: RawGenericSdkPluginConfig);
    protected buildOperation(node: OperationDefinitionNode, documentVariableName: string, operationType: string, operationResultType: string, operationVariablesTypes: string): string;
    get sdkContent(): string;
}
