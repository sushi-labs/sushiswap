"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlClientCLI = void 0;
const cli_1 = require("@graphql-mesh/cli");
function graphqlClientCLI() {
    return (0, cli_1.graphqlMesh)({
        commandName: 'graphclient',
        initialLoggerPrefix: 'GraphClient',
        configName: 'graphclient',
        artifactsDir: '.graphclient',
        serveMessage: 'Serving Composed Graph',
        playgroundTitle: 'The GraphiQL',
        builtMeshFactoryName: 'getBuiltGraphClient',
        builtMeshSDKFactoryName: 'getBuiltGraphSDK',
        devServerCommand: 'serve-dev',
        prodServerCommand: 'serve-prod',
        buildArtifactsCommand: 'build',
        sourceServerCommand: 'serve-source',
        validateCommand: 'validate',
        additionalPackagePrefixes: ['@graphprotocol/client-'],
    });
}
exports.graphqlClientCLI = graphqlClientCLI;
