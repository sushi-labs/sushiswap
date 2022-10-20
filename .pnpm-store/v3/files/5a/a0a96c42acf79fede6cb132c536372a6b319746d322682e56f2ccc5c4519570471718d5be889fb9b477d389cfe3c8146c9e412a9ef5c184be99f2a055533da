import { findAndParseConfig } from './config';
import { generateTsArtifacts } from './commands/ts-artifacts';
import { serveMesh } from './commands/serve/serve';
export { generateTsArtifacts, serveMesh, findAndParseConfig };
export interface GraphQLMeshCLIParams {
    commandName: string;
    initialLoggerPrefix: string;
    configName: string;
    artifactsDir: string;
    serveMessage: string;
    playgroundTitle: string;
    builtMeshFactoryName: string;
    builtMeshSDKFactoryName: string;
    devServerCommand: string;
    prodServerCommand: string;
    buildArtifactsCommand: string;
    sourceServerCommand: string;
    validateCommand: string;
    additionalPackagePrefixes: string[];
}
export declare const DEFAULT_CLI_PARAMS: GraphQLMeshCLIParams;
export declare function graphqlMesh(cliParams?: GraphQLMeshCLIParams, args?: string[], cwdPath?: string): Promise<{
    [x: string]: unknown;
    source: string;
    _: (string | number)[];
    $0: string;
} | {
    [x: string]: unknown;
    source: string;
    _: (string | number)[];
    $0: string;
}>;
