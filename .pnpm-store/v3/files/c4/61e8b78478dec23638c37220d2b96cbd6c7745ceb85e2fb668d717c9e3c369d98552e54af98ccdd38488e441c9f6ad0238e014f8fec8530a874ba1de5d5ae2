import { KeyValueCache, MeshPubSub, GraphQLOperation, MeshHandler, MeshTransform, YamlConfig, Logger, MeshMerger, MeshFetch } from '@graphql-mesh/types';
import { DocumentNode, ExecutionResult } from 'graphql';
import { IResolvers, Source } from '@graphql-tools/utils';
import { MESH_CONTEXT_SYMBOL } from './constants';
import { MeshInstance } from './get-mesh';
import { envelop } from '@envelop/core';
export declare type GetMeshOptions = {
    sources: MeshResolvedSource[];
    transforms?: MeshTransform[];
    additionalTypeDefs?: DocumentNode[];
    additionalResolvers?: IResolvers | IResolvers[];
    cache: KeyValueCache;
    pubsub?: MeshPubSub;
    merger: MeshMerger;
    logger?: Logger;
    additionalEnvelopPlugins?: Parameters<typeof envelop>[0]['plugins'];
    documents?: Source[];
    includeHttpDetailsInExtensions?: boolean;
    fetchFn?: MeshFetch;
};
export declare type MeshResolvedSource = {
    name: string;
    handler: MeshHandler;
    transforms?: MeshTransform[];
};
export declare type ExecuteMeshFn<TData = any, TVariables = any, TContext = any, TRootValue = any> = (document: GraphQLOperation<TData, TVariables>, variables: TVariables, context?: TContext, rootValue?: TRootValue, operationName?: string) => Promise<ExecutionResult<TData>>;
export declare type SubscribeMeshFn<TVariables = any, TContext = any, TRootValue = any, TData = any> = (document: GraphQLOperation<TData, TVariables>, variables?: TVariables, context?: TContext, rootValue?: TRootValue, operationName?: string) => Promise<ExecutionResult<TData> | AsyncIterable<ExecutionResult<TData>>>;
export declare type MeshContext = {
    [MESH_CONTEXT_SYMBOL]: true;
} & {
    pubsub: MeshPubSub;
    cache: KeyValueCache;
    logger: Logger;
};
export interface ServeMeshOptions {
    baseDir: string;
    getBuiltMesh: () => Promise<MeshInstance>;
    logger: Logger;
    rawServeConfig: YamlConfig.Config['serve'];
    argsPort?: number;
    playgroundTitle?: string;
}
export declare type MeshExecutor = <TData, TVariables, TContext, TRootValue>(documentOrSDL: GraphQLOperation<TData, TVariables>, variables?: TVariables, context?: TContext, rootValue?: TRootValue, operationName?: string) => Promise<TData | AsyncIterable<TData>>;
