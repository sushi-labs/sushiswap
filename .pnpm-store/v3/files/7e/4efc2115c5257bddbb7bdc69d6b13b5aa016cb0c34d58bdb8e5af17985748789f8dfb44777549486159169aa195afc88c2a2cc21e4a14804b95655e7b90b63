import { MeshHandlerOptions, MeshHandler, MeshSource, YamlConfig, GetMeshSourcePayload } from '@graphql-mesh/types';
import { GraphQLSchema } from 'graphql';
export default class GraphQLHandler implements MeshHandler {
    private name;
    private config;
    private baseDir;
    private nonExecutableSchema;
    private importFn;
    private fetchFn;
    private logger;
    private urlLoader;
    constructor({ name, config, baseDir, store, importFn, logger }: MeshHandlerOptions<YamlConfig.Handler['graphql']>);
    private interpolationStringSet;
    private getArgsAndContextVariables;
    private wrapExecutorToPassSourceName;
    getExecutorForHTTPSourceConfig(httpSourceConfig: YamlConfig.GraphQLHandlerHTTPConfiguration): Promise<MeshSource['executor']>;
    getNonExecutableSchemaForHTTPSource(httpSourceConfig: YamlConfig.GraphQLHandlerHTTPConfiguration): Promise<GraphQLSchema>;
    getCodeFirstSource({ schema: schemaConfig, }: YamlConfig.GraphQLHandlerCodeFirstConfiguration): Promise<MeshSource>;
    getRaceExecutor(executors: MeshSource['executor'][]): MeshSource['executor'];
    getFallbackExecutor(executors: MeshSource['executor'][]): MeshSource['executor'];
    getMeshSource({ fetchFn }: GetMeshSourcePayload): Promise<MeshSource>;
}
