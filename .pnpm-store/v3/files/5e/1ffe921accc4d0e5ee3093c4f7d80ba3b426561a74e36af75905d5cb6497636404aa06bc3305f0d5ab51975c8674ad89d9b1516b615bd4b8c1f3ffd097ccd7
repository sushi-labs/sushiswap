"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = exports.YogaServer = exports.getDefaultSchema = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const core_1 = require("@envelop/core");
const validation_cache_1 = require("@envelop/validation-cache");
const parser_cache_1 = require("@envelop/parser-cache");
const schema_1 = require("@graphql-tools/schema");
const crossUndiciFetch = tslib_1.__importStar(require("cross-undici-fetch"));
const processRequest_js_1 = require("./processRequest.js");
const logger_js_1 = require("./logger.js");
const useCORS_js_1 = require("./plugins/useCORS.js");
const useHealthCheck_js_1 = require("./plugins/useHealthCheck.js");
const useGraphiQL_js_1 = require("./plugins/useGraphiQL.js");
const useRequestParser_js_1 = require("./plugins/useRequestParser.js");
const GET_js_1 = require("./plugins/requestParser/GET.js");
const POSTJson_js_1 = require("./plugins/requestParser/POSTJson.js");
const POSTMultipart_js_1 = require("./plugins/requestParser/POSTMultipart.js");
const POSTGraphQLString_js_1 = require("./plugins/requestParser/POSTGraphQLString.js");
const useResultProcessor_js_1 = require("./plugins/useResultProcessor.js");
const regular_js_1 = require("./plugins/resultProcessor/regular.js");
const push_js_1 = require("./plugins/resultProcessor/push.js");
const multipart_js_1 = require("./plugins/resultProcessor/multipart.js");
const POSTFormUrlEncoded_js_1 = require("./plugins/requestParser/POSTFormUrlEncoded.js");
const GraphQLYogaError_js_1 = require("./GraphQLYogaError.js");
const encodeString_js_1 = require("./encodeString.js");
const useCheckMethodForGraphQL_js_1 = require("./plugins/requestValidation/useCheckMethodForGraphQL.js");
const useCheckGraphQLQueryParam_js_1 = require("./plugins/requestValidation/useCheckGraphQLQueryParam.js");
const useHTTPValidationError_js_1 = require("./plugins/requestValidation/useHTTPValidationError.js");
const usePreventMutationViaGET_js_1 = require("./plugins/requestValidation/usePreventMutationViaGET.js");
function getDefaultSchema() {
    return (0, schema_1.makeExecutableSchema)({
        typeDefs: /* GraphQL */ `
      """
      Greetings from GraphQL Yoga!
      """
      type Query {
        greetings: String
      }
      type Subscription {
        """
        Current Time
        """
        time: String
      }
    `,
        resolvers: {
            Query: {
                greetings: () => 'This is the `greetings` field of the root `Query` type',
            },
            Subscription: {
                time: {
                    async *subscribe() {
                        while (true) {
                            yield { time: new Date().toISOString() };
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                        }
                    },
                },
            },
        },
    });
}
exports.getDefaultSchema = getDefaultSchema;
/**
 * Base class that can be extended to create a GraphQL server with any HTTP server framework.
 * @internal
 */
class YogaServer {
    constructor(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        this.handleRequest = async (request, ...args) => {
            const response = await this.getResponse(request, ...args);
            for (const onResponseHook of this.onResponseHooks) {
                await onResponseHook({
                    request,
                    response,
                    serverContext: args[0],
                });
            }
            return response;
        };
        this.fetch = (input, init) => {
            let request;
            if (typeof input === 'string') {
                request = new this.fetchAPI.Request(input, init);
            }
            else {
                request = input;
            }
            return this.handleRequest(request, init);
        };
        // FetchEvent is not available in all envs
        this.fetchEventListener = (event) => event.respondWith(this.handleRequest(event.request, event));
        this.id = (_a = options === null || options === void 0 ? void 0 : options.id) !== null && _a !== void 0 ? _a : 'yoga';
        this.fetchAPI = {
            Request: (_c = (_b = options === null || options === void 0 ? void 0 : options.fetchAPI) === null || _b === void 0 ? void 0 : _b.Request) !== null && _c !== void 0 ? _c : crossUndiciFetch.Request,
            Response: (_e = (_d = options === null || options === void 0 ? void 0 : options.fetchAPI) === null || _d === void 0 ? void 0 : _d.Response) !== null && _e !== void 0 ? _e : crossUndiciFetch.Response,
            fetch: (_g = (_f = options === null || options === void 0 ? void 0 : options.fetchAPI) === null || _f === void 0 ? void 0 : _f.fetch) !== null && _g !== void 0 ? _g : crossUndiciFetch.fetch,
            ReadableStream: (_j = (_h = options === null || options === void 0 ? void 0 : options.fetchAPI) === null || _h === void 0 ? void 0 : _h.ReadableStream) !== null && _j !== void 0 ? _j : crossUndiciFetch.ReadableStream,
        };
        const schema = (options === null || options === void 0 ? void 0 : options.schema)
            ? (0, graphql_1.isSchema)(options.schema)
                ? options.schema
                : (0, schema_1.makeExecutableSchema)({
                    typeDefs: options.schema.typeDefs,
                    resolvers: options.schema.resolvers,
                })
            : getDefaultSchema();
        const logger = (options === null || options === void 0 ? void 0 : options.logging) != null ? options.logging : true;
        this.logger =
            typeof logger === 'boolean'
                ? logger === true
                    ? logger_js_1.defaultYogaLogger
                    : {
                        debug: () => { },
                        error: () => { },
                        warn: () => { },
                        info: () => { },
                    }
                : logger;
        const maskedErrors = (_k = options === null || options === void 0 ? void 0 : options.maskedErrors) !== null && _k !== void 0 ? _k : true;
        const server = this;
        this.endpoint = options === null || options === void 0 ? void 0 : options.endpoint;
        this.plugins = [
            // Use the schema provided by the user
            (0, core_1.enableIf)(schema != null, (0, core_1.useSchema)(schema)),
            // Performance things
            (0, core_1.enableIf)((options === null || options === void 0 ? void 0 : options.parserCache) !== false, () => (0, parser_cache_1.useParserCache)(typeof (options === null || options === void 0 ? void 0 : options.parserCache) === 'object'
                ? options === null || options === void 0 ? void 0 : options.parserCache
                : undefined)),
            (0, core_1.enableIf)((options === null || options === void 0 ? void 0 : options.validationCache) !== false, () => (0, validation_cache_1.useValidationCache)({
                cache: typeof (options === null || options === void 0 ? void 0 : options.validationCache) === 'object'
                    ? options === null || options === void 0 ? void 0 : options.validationCache
                    : undefined,
            })),
            // Log events - useful for debugging purposes
            (0, core_1.enableIf)(logger !== false, (0, core_1.useLogger)({
                skipIntrospection: true,
                logFn: (eventName, events) => {
                    switch (eventName) {
                        case 'execute-start':
                        case 'subscribe-start':
                            this.logger.debug((0, logger_js_1.titleBold)('Execution start'));
                            const { query, operationName, variables, extensions, } = events.args.contextValue;
                            this.logger.debug((0, logger_js_1.titleBold)('Received GraphQL operation:'));
                            this.logger.debug({
                                query,
                                operationName,
                                variables,
                                extensions,
                            });
                            break;
                        case 'execute-end':
                        case 'subscribe-end':
                            this.logger.debug((0, logger_js_1.titleBold)('Execution end'));
                            this.logger.debug({
                                result: events.result,
                            });
                            break;
                    }
                },
            })),
            (0, core_1.enableIf)((options === null || options === void 0 ? void 0 : options.context) != null, (0, core_1.useExtendContext)(async (initialContext) => {
                if (options === null || options === void 0 ? void 0 : options.context) {
                    if (typeof options.context === 'function') {
                        return options.context(initialContext);
                    }
                    return options.context;
                }
            })),
            // Middlewares before processing the incoming HTTP request
            (0, useHealthCheck_js_1.useHealthCheck)({
                id: this.id,
                logger: this.logger,
            }),
            (0, core_1.enableIf)((options === null || options === void 0 ? void 0 : options.graphiql) !== false, () => (0, useGraphiQL_js_1.useGraphiQL)({
                get endpoint() {
                    return server.endpoint;
                },
                options: options === null || options === void 0 ? void 0 : options.graphiql,
                render: options === null || options === void 0 ? void 0 : options.renderGraphiQL,
                logger: this.logger,
            })),
            (0, core_1.enableIf)((options === null || options === void 0 ? void 0 : options.cors) !== false, () => (0, useCORS_js_1.useCORS)(options === null || options === void 0 ? void 0 : options.cors)),
            // Middlewares before the GraphQL execution
            (0, useCheckMethodForGraphQL_js_1.useCheckMethodForGraphQL)(),
            (0, useRequestParser_js_1.useRequestParser)({
                match: GET_js_1.isGETRequest,
                parse: GET_js_1.parseGETRequest,
            }),
            (0, useRequestParser_js_1.useRequestParser)({
                match: POSTJson_js_1.isPOSTJsonRequest,
                parse: POSTJson_js_1.parsePOSTJsonRequest,
            }),
            (0, core_1.enableIf)((options === null || options === void 0 ? void 0 : options.multipart) !== false, () => (0, useRequestParser_js_1.useRequestParser)({
                match: POSTMultipart_js_1.isPOSTMultipartRequest,
                parse: POSTMultipart_js_1.parsePOSTMultipartRequest,
            })),
            (0, useRequestParser_js_1.useRequestParser)({
                match: POSTGraphQLString_js_1.isPOSTGraphQLStringRequest,
                parse: POSTGraphQLString_js_1.parsePOSTGraphQLStringRequest,
            }),
            (0, useRequestParser_js_1.useRequestParser)({
                match: POSTFormUrlEncoded_js_1.isPOSTFormUrlEncodedRequest,
                parse: POSTFormUrlEncoded_js_1.parsePOSTFormUrlEncodedRequest,
            }),
            // Middlewares after the GraphQL execution
            (0, useResultProcessor_js_1.useResultProcessor)({
                match: regular_js_1.isRegularResult,
                processResult: regular_js_1.processRegularResult,
            }),
            (0, useResultProcessor_js_1.useResultProcessor)({
                match: push_js_1.isPushResult,
                processResult: push_js_1.processPushResult,
            }),
            (0, useResultProcessor_js_1.useResultProcessor)({
                match: multipart_js_1.isMultipartResult,
                processResult: multipart_js_1.processMultipartResult,
            }),
            ...((_l = options === null || options === void 0 ? void 0 : options.plugins) !== null && _l !== void 0 ? _l : []),
            // So the user can manipulate the query parameter
            (0, useCheckGraphQLQueryParam_js_1.useCheckGraphQLQueryParam)(),
            // We handle validation errors at the end
            (0, useHTTPValidationError_js_1.useHTTPValidationError)(),
            // We make sure that the user doesn't send a mutation with GET
            (0, usePreventMutationViaGET_js_1.usePreventMutationViaGET)(),
            (0, core_1.enableIf)(!!maskedErrors, (0, core_1.useMaskedErrors)(typeof maskedErrors === 'object' ? maskedErrors : undefined)),
        ];
        this.getEnveloped = (0, core_1.envelop)({
            plugins: this.plugins,
        });
        this.onRequestHooks = [];
        this.onRequestParseHooks = [];
        this.onResultProcessHooks = [];
        this.onResponseHooks = [];
        for (const plugin of this.plugins) {
            if (plugin) {
                if (plugin.onRequestParse) {
                    this.onRequestParseHooks.push(plugin.onRequestParse);
                }
                if (plugin.onRequest) {
                    this.onRequestHooks.push(plugin.onRequest);
                }
                if (plugin.onResultProcess) {
                    this.onResultProcessHooks.push(plugin.onResultProcess);
                }
                if (plugin.onResponse) {
                    this.onResponseHooks.push(plugin.onResponse);
                }
            }
        }
    }
    async getResponse(request, ...args) {
        var _a, _b;
        const serverContext = args[0];
        try {
            for (const onRequestHook of this.onRequestHooks) {
                let response;
                await onRequestHook({
                    request,
                    serverContext,
                    fetchAPI: this.fetchAPI,
                    endResponse(newResponse) {
                        response = newResponse;
                    },
                });
                if (response) {
                    return response;
                }
            }
            let requestParser;
            const onRequestParseDoneList = [];
            for (const onRequestParse of this.onRequestParseHooks) {
                const onRequestParseResult = await onRequestParse({
                    request,
                    requestParser,
                    setRequestParser(parser) {
                        requestParser = parser;
                    },
                });
                if ((onRequestParseResult === null || onRequestParseResult === void 0 ? void 0 : onRequestParseResult.onRequestParseDone) != null) {
                    onRequestParseDoneList.push(onRequestParseResult.onRequestParseDone);
                }
            }
            this.logger.debug(`Parsing request to extract GraphQL parameters`);
            if (!requestParser) {
                return new this.fetchAPI.Response('Request is not valid', {
                    status: 400,
                    statusText: 'Bad Request',
                });
            }
            let params = await requestParser(request);
            for (const onRequestParseDone of onRequestParseDoneList) {
                await onRequestParseDone({
                    params,
                    setParams(newParams) {
                        params = newParams;
                    },
                });
            }
            const initialContext = {
                request,
                ...params,
                ...serverContext,
            };
            const enveloped = this.getEnveloped(initialContext);
            this.logger.debug(`Processing GraphQL Parameters`);
            const result = await (0, processRequest_js_1.processRequest)({
                request,
                params,
                enveloped,
                fetchAPI: this.fetchAPI,
                onResultProcessHooks: this.onResultProcessHooks,
            });
            return result;
        }
        catch (error) {
            const finalResponseInit = {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const errors = (0, GraphQLYogaError_js_1.handleError)(error);
            for (const error of errors) {
                if ((_a = error.extensions) === null || _a === void 0 ? void 0 : _a.http) {
                    if (error.extensions.http.status &&
                        ((_b = error.extensions) === null || _b === void 0 ? void 0 : _b.http.status) > finalResponseInit.status) {
                        finalResponseInit.status = error.extensions.http.status;
                    }
                    if (error.extensions.http.headers) {
                        Object.assign(finalResponseInit.headers, error.extensions.http.headers);
                    }
                    // Remove http extensions from the final response
                    error.extensions.http = undefined;
                }
            }
            const payload = {
                data: null,
                errors,
            };
            const decodedString = (0, encodeString_js_1.encodeString)(JSON.stringify(payload));
            finalResponseInit.headers['Content-Length'] =
                decodedString.byteLength.toString();
            return new this.fetchAPI.Response(decodedString, finalResponseInit);
        }
    }
    /**
     * Testing utility to mock http request for GraphQL endpoint
     *
     *
     * Example - Test a simple query
     * ```ts
     * const { response, executionResult } = await yoga.inject({
     *  document: "query { ping }",
     * })
     * expect(response.status).toBe(200)
     * expect(executionResult.data.ping).toBe('pong')
     * ```
     **/
    async inject({ document, variables, operationName, headers, serverContext, }) {
        const request = new this.fetchAPI.Request('http://localhost/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify({
                query: document &&
                    (typeof document === 'string' ? document : (0, graphql_1.print)(document)),
                variables,
                operationName,
            }),
        });
        const response = await this.handleRequest(request, serverContext);
        let executionResult = null;
        if (response.headers.get('content-type') === 'application/json') {
            executionResult = await response.json();
        }
        return {
            response,
            executionResult,
        };
    }
    start() {
        self.addEventListener('fetch', this.fetchEventListener);
    }
    stop() {
        self.removeEventListener('fetch', this.fetchEventListener);
    }
}
exports.YogaServer = YogaServer;
function createServer(options) {
    const server = new YogaServer(options);
    // TODO: Will be removed once we get rid of classes
    const fnHandler = (input, ctx) => {
        // Is input a container object over Request?
        if (input.request) {
            // In this input is also the context
            return server.handleRequest(input.request, input);
        }
        // Or is it Request itself?
        // Then ctx is present and it is the context
        return server.handleRequest(input, ctx);
    };
    return new Proxy(server, {
        // It should have all the attributes of the handler function and the server instance
        has: (_, prop) => {
            return prop in fnHandler || prop in server;
        },
        get: (_, prop) => {
            if (server[prop]) {
                if (server[prop].bind) {
                    return server[prop].bind(server);
                }
                return server[prop];
            }
            if (fnHandler[prop]) {
                if (fnHandler[prop].bind) {
                    return fnHandler[prop].bind(fnHandler);
                }
                return fnHandler[prop];
            }
        },
        apply(_, __, [input, ctx]) {
            return fnHandler(input, ctx);
        },
    });
}
exports.createServer = createServer;
