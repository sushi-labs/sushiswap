import { graphqlMesh } from '@graphql-mesh/cli';
export function graphqlClientCLI() {
    return graphqlMesh({
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
