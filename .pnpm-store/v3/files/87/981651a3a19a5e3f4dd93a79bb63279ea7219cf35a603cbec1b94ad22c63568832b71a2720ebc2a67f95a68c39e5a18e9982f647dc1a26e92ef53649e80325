import { UrlLoader } from '@graphql-tools/url-loader';
import { buildSchema, buildASTSchema, buildClientSchema, GraphQLSchema, Kind } from 'graphql';
import { introspectSchema } from '@graphql-tools/wrap';
import { readFileOrUrl, loadFromModuleExportExpression } from '@graphql-mesh/utils';
import { isDocumentNode, parseSelectionSet, memoize1, getOperationASTFromRequest, isAsyncIterable } from '@graphql-tools/utils';
import { PredefinedProxyOptions } from '@graphql-mesh/store';
import lodashGet from 'lodash.get';
import { parseInterpolationStrings, getInterpolatedStringFactory, getInterpolatedHeadersFactory } from '@graphql-mesh/string-interpolation';
import { process, util } from '@graphql-mesh/cross-helpers';

const getResolverData = memoize1(function getResolverData(params) {
    return {
        root: params.rootValue,
        args: params.variables,
        context: params.context,
        env: process.env,
    };
});
class GraphQLHandler {
    constructor({ name, config, baseDir, store, importFn, logger }) {
        this.urlLoader = new UrlLoader();
        this.interpolationStringSet = new Set();
        this.name = name;
        this.config = config;
        this.baseDir = baseDir;
        this.nonExecutableSchema = store.proxy('introspectionSchema', PredefinedProxyOptions.GraphQLSchemaWithDiffing);
        this.importFn = importFn;
        this.logger = logger;
    }
    getArgsAndContextVariables() {
        return parseInterpolationStrings(this.interpolationStringSet);
    }
    wrapExecutorToPassSourceName(executor) {
        const sourceName = this.name;
        return function executorWithSourceName(executionRequest) {
            executionRequest.info = executionRequest.info || {};
            executionRequest.info.sourceName = sourceName;
            return executor(executionRequest);
        };
    }
    async getExecutorForHTTPSourceConfig(httpSourceConfig) {
        const { endpoint, operationHeaders = {} } = httpSourceConfig;
        this.interpolationStringSet.add(endpoint);
        Object.keys(operationHeaders).forEach(headerName => {
            this.interpolationStringSet.add(headerName.toString());
        });
        const endpointFactory = getInterpolatedStringFactory(endpoint);
        const operationHeadersFactory = getInterpolatedHeadersFactory(operationHeaders);
        const executor = this.urlLoader.getExecutorAsync(endpoint, {
            ...httpSourceConfig,
            subscriptionsProtocol: httpSourceConfig.subscriptionsProtocol,
            customFetch: this.fetchFn,
        });
        return function meshExecutor(params) {
            const resolverData = getResolverData(params);
            return executor({
                ...params,
                extensions: {
                    ...params.extensions,
                    headers: operationHeadersFactory(resolverData),
                    endpoint: endpointFactory(resolverData),
                },
            });
        };
    }
    async getNonExecutableSchemaForHTTPSource(httpSourceConfig) {
        this.interpolationStringSet.add(httpSourceConfig.endpoint);
        Object.keys(httpSourceConfig.schemaHeaders || {}).forEach(headerName => {
            this.interpolationStringSet.add(headerName.toString());
        });
        const schemaHeadersFactory = getInterpolatedHeadersFactory(httpSourceConfig.schemaHeaders || {});
        if (httpSourceConfig.introspection) {
            const headers = schemaHeadersFactory({
                env: process.env,
            });
            const sdlOrIntrospection = await readFileOrUrl(httpSourceConfig.introspection, {
                cwd: this.baseDir,
                allowUnknownExtensions: true,
                importFn: this.importFn,
                fetch: this.fetchFn,
                logger: this.logger,
                headers,
            });
            if (typeof sdlOrIntrospection === 'string') {
                return buildSchema(sdlOrIntrospection);
            }
            else if (isDocumentNode(sdlOrIntrospection)) {
                return buildASTSchema(sdlOrIntrospection);
            }
            else if (sdlOrIntrospection.__schema) {
                return buildClientSchema(sdlOrIntrospection);
            }
            throw new Error(`Invalid introspection data: ${util.inspect(sdlOrIntrospection)}`);
        }
        return this.nonExecutableSchema.getWithSet(() => {
            const endpointFactory = getInterpolatedStringFactory(httpSourceConfig.endpoint);
            const executor = this.urlLoader.getExecutorAsync(httpSourceConfig.endpoint, {
                ...httpSourceConfig,
                customFetch: this.fetchFn,
                subscriptionsProtocol: httpSourceConfig.subscriptionsProtocol,
            });
            return introspectSchema(function meshIntrospectionExecutor(params) {
                const resolverData = getResolverData(params);
                return executor({
                    ...params,
                    extensions: {
                        ...params.extensions,
                        headers: schemaHeadersFactory(resolverData),
                        endpoint: endpointFactory(resolverData),
                    },
                });
            });
        });
    }
    async getCodeFirstSource({ schema: schemaConfig, }) {
        if (schemaConfig.endsWith('.graphql')) {
            const rawSDL = await readFileOrUrl(schemaConfig, {
                cwd: this.baseDir,
                allowUnknownExtensions: true,
                importFn: this.importFn,
                fetch: this.fetchFn,
                logger: this.logger,
            });
            const schema = buildSchema(rawSDL);
            const { contextVariables } = this.getArgsAndContextVariables();
            return {
                schema,
                contextVariables,
            };
        }
        else {
            // Loaders logic should be here somehow
            const schemaOrStringOrDocumentNode = await loadFromModuleExportExpression(schemaConfig, { cwd: this.baseDir, defaultExportName: 'schema', importFn: this.importFn });
            let schema;
            if (schemaOrStringOrDocumentNode instanceof GraphQLSchema) {
                schema = schemaOrStringOrDocumentNode;
            }
            else if (typeof schemaOrStringOrDocumentNode === 'string') {
                schema = buildSchema(schemaOrStringOrDocumentNode);
            }
            else if (typeof schemaOrStringOrDocumentNode === 'object' &&
                (schemaOrStringOrDocumentNode === null || schemaOrStringOrDocumentNode === void 0 ? void 0 : schemaOrStringOrDocumentNode.kind) === Kind.DOCUMENT) {
                schema = buildASTSchema(schemaOrStringOrDocumentNode);
            }
            else {
                throw new Error(`Provided file '${schemaConfig} exports an unknown type: ${util.inspect(schemaOrStringOrDocumentNode)}': expected GraphQLSchema, SDL or DocumentNode.`);
            }
            const { contextVariables } = this.getArgsAndContextVariables();
            return {
                schema,
                contextVariables,
            };
        }
    }
    getRaceExecutor(executors) {
        return function raceExecutor(params) {
            return Promise.race(executors.map(executor => executor(params)));
        };
    }
    getFallbackExecutor(executors) {
        return async function fallbackExecutor(params) {
            var _a;
            let error;
            let response;
            for (const executor of executors) {
                try {
                    const executorResponse = await executor(params);
                    if ('errors' in executorResponse && ((_a = executorResponse.errors) === null || _a === void 0 ? void 0 : _a.length)) {
                        response = executorResponse;
                        continue;
                    }
                    else {
                        return executorResponse;
                    }
                }
                catch (e) {
                    error = e;
                }
            }
            if (response != null) {
                return response;
            }
            throw error;
        };
    }
    async getMeshSource({ fetchFn }) {
        this.fetchFn = fetchFn;
        if ('sources' in this.config) {
            if (this.config.strategy === 'race') {
                const schemaPromises = [];
                const executorPromises = [];
                let batch = true;
                for (const httpSourceConfig of this.config.sources) {
                    if (httpSourceConfig.batch === false) {
                        batch = false;
                    }
                    schemaPromises.push(this.getNonExecutableSchemaForHTTPSource(httpSourceConfig));
                    executorPromises.push(this.getExecutorForHTTPSourceConfig(httpSourceConfig));
                }
                const [schema, ...executors] = await Promise.all([Promise.race(schemaPromises), ...executorPromises]);
                const executor = this.getRaceExecutor(executors);
                const { contextVariables } = this.getArgsAndContextVariables();
                return {
                    schema,
                    executor,
                    batch,
                    contextVariables,
                };
            }
            else if (this.config.strategy === 'highestValue') {
                if (this.config.strategyConfig == null) {
                    throw new Error(`You must configure 'highestValue' strategy`);
                }
                let schema;
                const executorPromises = [];
                let error;
                for (const httpSourceConfig of this.config.sources) {
                    executorPromises.push(this.getExecutorForHTTPSourceConfig(httpSourceConfig));
                    if (schema == null) {
                        try {
                            schema = await this.getNonExecutableSchemaForHTTPSource(httpSourceConfig);
                        }
                        catch (e) {
                            error = e;
                        }
                    }
                }
                if (schema == null) {
                    throw error;
                }
                const executors = await Promise.all(executorPromises);
                const parsedSelectionSet = parseSelectionSet(this.config.strategyConfig.selectionSet);
                const valuePath = this.config.strategyConfig.value;
                const highestValueExecutor = async function highestValueExecutor(executionRequest) {
                    const operationAST = getOperationASTFromRequest(executionRequest);
                    operationAST.selectionSet.selections.push(...parsedSelectionSet.selections);
                    const results = await Promise.all(executors.map(executor => executor(executionRequest)));
                    let highestValue = -Infinity;
                    let resultWithHighestResult = results[0];
                    for (const result of results) {
                        if (isAsyncIterable(result)) {
                            console.warn('Incremental delivery is not supported currently');
                            return result;
                        }
                        else if (result.data != null) {
                            const currentValue = lodashGet(result.data, valuePath);
                            if (currentValue > highestValue) {
                                resultWithHighestResult = result;
                                highestValue = currentValue;
                            }
                        }
                    }
                    return resultWithHighestResult;
                };
                const { contextVariables } = this.getArgsAndContextVariables();
                return {
                    schema,
                    executor: this.wrapExecutorToPassSourceName(highestValueExecutor),
                    // Batching doesn't make sense with fallback strategy
                    batch: false,
                    contextVariables,
                };
            }
            else {
                let schema;
                const executorPromises = [];
                let error;
                for (const httpSourceConfig of this.config.sources) {
                    executorPromises.push(this.getExecutorForHTTPSourceConfig(httpSourceConfig));
                    if (schema == null) {
                        try {
                            schema = await this.getNonExecutableSchemaForHTTPSource(httpSourceConfig);
                        }
                        catch (e) {
                            error = e;
                        }
                    }
                }
                if (schema == null) {
                    throw error;
                }
                const executors = await Promise.all(executorPromises);
                const executor = this.getFallbackExecutor(executors);
                const { contextVariables } = this.getArgsAndContextVariables();
                return {
                    schema,
                    executor,
                    // Batching doesn't make sense with fallback strategy
                    batch: false,
                    contextVariables,
                };
            }
        }
        else if ('endpoint' in this.config) {
            const [schemaResult, executorResult] = await Promise.allSettled([
                this.getNonExecutableSchemaForHTTPSource(this.config),
                this.getExecutorForHTTPSourceConfig(this.config),
            ]);
            if (schemaResult.status === 'rejected') {
                throw new Error(`Failed to fetch introspection from ${this.config.endpoint}: ${util.inspect(schemaResult.reason)}`);
            }
            if (executorResult.status === 'rejected') {
                throw new Error(`Failed to create executor for ${this.config.endpoint}: ${util.inspect(executorResult.reason)}`);
            }
            const { contextVariables } = this.getArgsAndContextVariables();
            return {
                schema: schemaResult.value,
                executor: this.wrapExecutorToPassSourceName(executorResult.value),
                batch: this.config.batch != null ? this.config.batch : true,
                contextVariables,
            };
        }
        else if ('schema' in this.config) {
            return this.getCodeFirstSource(this.config);
        }
        throw new Error(`Unexpected config: ${util.inspect(this.config)}`);
    }
}

export default GraphQLHandler;
