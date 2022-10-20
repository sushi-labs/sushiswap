import { GraphQLSchema, DocumentNode } from 'graphql';
import { ExecuteMeshFn, GetMeshOptions, MeshExecutor, SubscribeMeshFn } from './types';
import { MeshPubSub, KeyValueCache, RawSourceOutput, Logger, MeshFetch, MeshPlugin } from '@graphql-mesh/types';
import { envelop, PluginOrDisabledPlugin } from '@envelop/core';
declare type SdkRequester = (document: DocumentNode, variables?: any, operationContext?: any) => any;
export interface MeshInstance {
    execute: ExecuteMeshFn;
    subscribe: SubscribeMeshFn;
    schema: GraphQLSchema;
    createExecutor(globalContext: any): MeshExecutor;
    rawSources: RawSourceOutput[];
    destroy(): void;
    pubsub: MeshPubSub;
    cache: KeyValueCache;
    logger: Logger;
    plugins: PluginOrDisabledPlugin[];
    getEnveloped: ReturnType<typeof envelop>;
    sdkRequesterFactory(globalContext: any): SdkRequester;
}
export declare function wrapFetchWithPlugins(plugins: MeshPlugin<any>[]): MeshFetch;
export declare function getMesh(options: GetMeshOptions): Promise<MeshInstance>;
export {};
