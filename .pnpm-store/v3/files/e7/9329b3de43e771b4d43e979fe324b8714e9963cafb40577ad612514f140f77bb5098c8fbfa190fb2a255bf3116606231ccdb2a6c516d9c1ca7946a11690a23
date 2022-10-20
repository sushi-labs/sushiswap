/// <reference types="node" />
import 'json-bigint-patch';
import { Server } from 'http';
import { MeshInstance, ServeMeshOptions } from '@graphql-mesh/runtime';
import { GraphQLMeshCLIParams } from '../..';
import type { Logger } from '@graphql-mesh/types';
export declare function serveMesh({ baseDir, argsPort, getBuiltMesh, logger, rawServeConfig, playgroundTitle }: ServeMeshOptions, cliParams: GraphQLMeshCLIParams): Promise<{
    mesh: MeshInstance;
    httpServer: Server;
    logger: Logger;
}>;
