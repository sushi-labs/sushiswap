import { MeshInstance } from '@graphql-mesh/runtime';
import { YamlConfig } from '@graphql-mesh/types';
import { ServerAdapter } from '@whatwg-node/server';
import { Router } from 'itty-router';
export declare type MeshHTTPHandler<TServerContext> = ServerAdapter<TServerContext, Router<Request>>;
export declare function createMeshHTTPHandler<TServerContext>({ baseDir, getBuiltMesh, rawServeConfig, playgroundTitle, }: {
    baseDir: string;
    getBuiltMesh: () => Promise<MeshInstance>;
    rawServeConfig?: YamlConfig.Config['serve'];
    playgroundTitle?: string;
}): MeshHTTPHandler<TServerContext>;
