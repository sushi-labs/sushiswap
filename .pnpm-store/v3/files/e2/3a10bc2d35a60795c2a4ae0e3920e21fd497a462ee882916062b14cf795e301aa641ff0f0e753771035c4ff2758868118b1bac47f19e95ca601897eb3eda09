import { isSchema, print } from 'graphql';
import { envelop, useMaskedErrors, useExtendContext, enableIf, useLogger, useSchema, } from '@envelop/core';
import { useValidationCache } from '@envelop/validation-cache';
import { useParserCache } from '@envelop/parser-cache';
import { makeExecutableSchema } from '@graphql-tools/schema';
import * as crossUndiciFetch from 'cross-undici-fetch';
import { processRequest as processGraphQLParams } from './processRequest.js';
import { defaultYogaLogger, titleBold } from './logger.js';
import { useCORS } from './plugins/useCORS.js';
import { useHealthCheck } from './plugins/useHealthCheck.js';
import { useGraphiQL, } from './plugins/useGraphiQL.js';
import { useRequestParser } from './plugins/useRequestParser.js';
import { isGETRequest, parseGETRequest } from './plugins/requestParser/GET.js';
import { isPOSTJsonRequest, parsePOSTJsonRequest, } from './plugins/requestParser/POSTJson.js';
import { isPOSTMultipartRequest, parsePOSTMultipartRequest, } from './plugins/requestParser/POSTMultipart.js';
import { isPOSTGraphQLStringRequest, parsePOSTGraphQLStringRequest, } from './plugins/requestParser/POSTGraphQLString.js';
import { useResultProcessor } from './plugins/useResultProcessor.js';
import { isRegularResult, processRegularResult, } from './plugins/resultProcessor/regular.js';
import { isPushResult, processPushResult, } from './plugins/resultProcessor/push.js';
import { isMultipartResult, processMultipartResult, } from './plugins/resultProcessor/multipart.js';
import { isPOSTFormUrlEncodedRequest, parsePOSTFormUrlEncodedRequest, } from './plugins/requestParser/POSTFormUrlEncoded.js';
import { handleError } from './GraphQLYogaError.js';
import { encodeString } from './encodeString.js';
import { useCheckMethodForGraphQL } from './plugins/requestValidation/useCheckMethodForGraphQL.js';
import { useCheckGraphQLQueryParam } from './plugins/requestValidation/useCheckGraphQLQueryParam.js';
import { useHTTPValidationError } from './plugins/requestValidation/useHTTPValidationError.js';
import { usePreventMutationViaGET } from './plugins/requestValidation/usePreventMutationViaGET.js';
export function getDefaultSchema() {
    return makeExecutableSchema({
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
/**
 * Base class that can be extended to create a GraphQL server with any HTTP server framework.
 * @internal
 */
export class YogaServer {
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
            ? isSchema(options.schema)
                ? options.schema
                : makeExecutableSchema({
                    typeDefs: options.schema.typeDefs,
                    resolvers: options.schema.resolvers,
                })
            : getDefaultSchema();
        const logger = (options === null || options === void 0 ? void 0 : options.logging) != null ? options.logging : true;
        this.logger =
            typeof logger === 'boolean'
                ? logger === true
                    ? defaultYogaLogger
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
            enableIf(schema != null, useSchema(schema)),
            // Performance things
            enableIf((options === null || options === void 0 ? void 0 : options.parserCache) !== false, () => useParserCache(typeof (options === null || options === void 0 ? void 0 : options.parserCache) === 'object'
                ? options === null || options === void 0 ? void 0 : options.parserCache
                : undefined)),
            enableIf((options === null || options === void 0 ? void 0 : options.validationCache) !== false, () => useValidationCache({
                cache: typeof (options === null || options === void 0 ? void 0 : options.validationCache) === 'object'
                    ? options === null || options === void 0 ? void 0 : options.validationCache
                    : undefined,
            })),
            // Log events - useful for debugging purposes
            enableIf(logger !== false, useLogger({
                skipIntrospection: true,
                logFn: (eventName, events) => {
                    switch (eventName) {
                        case 'execute-start':
                        case 'subscribe-start':
                            this.logger.debug(titleBold('Execution start'));
                            const { query, operationName, variables, extensions, } = events.args.contextValue;
                            this.logger.debug(titleBold('Received GraphQL operation:'));
                            this.logger.debug({
                                query,
                                operationName,
                                variables,
                                extensions,
                            });
                            break;
                        case 'execute-end':
                        case 'subscribe-end':
                            this.logger.debug(titleBold('Execution end'));
                            this.logger.debug({
                                result: events.result,
                            });
                            break;
                    }
                },
            })),
            enableIf((options === null || options === void 0 ? void 0 : options.context) != null, useExtendContext(async (initialContext) => {
                if (options === null || options === void 0 ? void 0 : options.context) {
                    if (typeof options.context === 'function') {
                        return options.context(initialContext);
                    }
                    return options.context;
                }
            })),
            // Middlewares before processing the incoming HTTP request
            useHealthCheck({
                id: this.id,
                logger: this.logger,
            }),
            enableIf((options === null || options === void 0 ? void 0 : options.graphiql) !== false, () => useGraphiQL({
                get endpoint() {
                    return server.endpoint;
                },
                options: options === null || options === void 0 ? void 0 : options.graphiql,
                render: options === null || options === void 0 ? void 0 : options.renderGraphiQL,
                logger: this.logger,
            })),
            enableIf((options === null || options === void 0 ? void 0 : options.cors) !== false, () => useCORS(options === null || options === void 0 ? void 0 : options.cors)),
            // Middlewares before the GraphQL execution
            useCheckMethodForGraphQL(),
            useRequestParser({
                match: isGETRequest,
                parse: parseGETRequest,
            }),
            useRequestParser({
                match: isPOSTJsonRequest,
                parse: parsePOSTJsonRequest,
            }),
            enableIf((options === null || options === void 0 ? void 0 : options.multipart) !== false, () => useRequestParser({
                match: isPOSTMultipartRequest,
                parse: parsePOSTMultipartRequest,
            })),
            useRequestParser({
                match: isPOSTGraphQLStringRequest,
                parse: parsePOSTGraphQLStringRequest,
            }),
            useRequestParser({
                match: isPOSTFormUrlEncodedRequest,
                parse: parsePOSTFormUrlEncodedRequest,
            }),
            // Middlewares after the GraphQL execution
            useResultProcessor({
                match: isRegularResult,
                processResult: processRegularResult,
            }),
            useResultProcessor({
                match: isPushResult,
                processResult: processPushResult,
            }),
            useResultProcessor({
                match: isMultipartResult,
                processResult: processMultipartResult,
            }),
            ...((_l = options === null || options === void 0 ? void 0 : options.plugins) !== null && _l !== void 0 ? _l : []),
            // So the user can manipulate the query parameter
            useCheckGraphQLQueryParam(),
            // We handle validation errors at the end
            useHTTPValidationError(),
            // We make sure that the user doesn't send a mutation with GET
            usePreventMutationViaGET(),
            enableIf(!!maskedErrors, useMaskedErrors(typeof maskedErrors === 'object' ? maskedErrors : undefined)),
        ];
        this.getEnveloped = envelop({
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
            const result = await processGraphQLParams({
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
            const errors = handleError(error);
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
            const decodedString = encodeString(JSON.stringify(payload));
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
                    (typeof document === 'string' ? document : print(document)),
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
export function createServer(options) {
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
