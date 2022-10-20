"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlLoader = exports.SubscriptionProtocol = void 0;
const tslib_1 = require("tslib");
/* eslint-disable no-case-declarations */
/// <reference lib="dom" />
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const wrap_1 = require("@graphql-tools/wrap");
const graphql_ws_1 = require("graphql-ws");
const isomorphic_ws_1 = tslib_1.__importDefault(require("isomorphic-ws"));
const extract_files_1 = require("extract-files");
const value_or_promise_1 = require("value-or-promise");
const defaultAsyncFetch_js_1 = require("./defaultAsyncFetch.js");
const defaultSyncFetch_js_1 = require("./defaultSyncFetch.js");
const handleMultipartMixedResponse_js_1 = require("./handleMultipartMixedResponse.js");
const handleEventStreamResponse_js_1 = require("./event-stream/handleEventStreamResponse.js");
const addCancelToResponseStream_js_1 = require("./event-stream/addCancelToResponseStream.js");
const fetch_1 = require("@whatwg-node/fetch");
const utils_js_1 = require("./utils.js");
const asyncImport = (moduleName) => Promise.resolve().then(() => tslib_1.__importStar(require(moduleName)));
const syncImport = (moduleName) => require(moduleName);
var SubscriptionProtocol;
(function (SubscriptionProtocol) {
    SubscriptionProtocol["WS"] = "WS";
    /**
     * Use legacy web socket protocol `graphql-ws` instead of the more current standard `graphql-transport-ws`
     */
    SubscriptionProtocol["LEGACY_WS"] = "LEGACY_WS";
    /**
     * Use SSE for subscription instead of WebSocket
     */
    SubscriptionProtocol["SSE"] = "SSE";
    /**
     * Use `graphql-sse` for subscriptions
     */
    SubscriptionProtocol["GRAPHQL_SSE"] = "GRAPHQL_SSE";
})(SubscriptionProtocol = exports.SubscriptionProtocol || (exports.SubscriptionProtocol = {}));
function isCompatibleUri(uri) {
    try {
        // eslint-disable-next-line no-new
        new URL(uri);
        return true;
    }
    catch (_a) {
        return false;
    }
}
/**
 * This loader loads a schema from a URL. The loaded schema is a fully-executable,
 * remote schema since it's created using [@graphql-tools/wrap](/docs/remote-schemas).
 *
 * ```
 * const schema = await loadSchema('http://localhost:3000/graphql', {
 *   loaders: [
 *     new UrlLoader(),
 *   ]
 * });
 * ```
 */
class UrlLoader {
    createFormDataFromVariables({ query, variables, operationName, extensions, }) {
        const vars = Object.assign({}, variables);
        const { clone, files } = (0, extract_files_1.extractFiles)(vars, 'variables', ((v) => (0, extract_files_1.isExtractableFile)(v) ||
            (v === null || v === void 0 ? void 0 : v.promise) ||
            (0, utils_1.isAsyncIterable)(v) ||
            (v === null || v === void 0 ? void 0 : v.then) ||
            typeof (v === null || v === void 0 ? void 0 : v.arrayBuffer) === 'function'));
        if (files.size === 0) {
            return JSON.stringify({
                query,
                variables,
                operationName,
                extensions,
            });
        }
        const map = {};
        const uploads = [];
        let currIndex = 0;
        for (const [file, curr] of files) {
            map[currIndex] = curr;
            uploads[currIndex] = file;
            currIndex++;
        }
        const form = new fetch_1.FormData();
        form.append('operations', JSON.stringify({
            query,
            variables: clone,
            operationName,
            extensions,
        }));
        form.append('map', JSON.stringify(map));
        function handleUpload(upload, i) {
            const indexStr = i.toString();
            if (upload != null) {
                const filename = upload.filename || upload.name || upload.path || `blob-${indexStr}`;
                if ((0, utils_js_1.isPromiseLike)(upload)) {
                    return upload.then((resolvedUpload) => handleUpload(resolvedUpload, i));
                    // If Blob
                }
                else if ((0, utils_js_1.isBlob)(upload)) {
                    form.append(indexStr, upload, filename);
                }
                else if ((0, utils_js_1.isGraphQLUpload)(upload)) {
                    const stream = upload.createReadStream();
                    const chunks = [];
                    return Promise.resolve().then(async () => {
                        for await (const chunk of stream) {
                            if (chunk) {
                                chunks.push(...chunk);
                            }
                        }
                        const blobPart = new Uint8Array(chunks);
                        form.append(indexStr, new fetch_1.File([blobPart], filename, { type: upload.mimetype }), filename);
                    });
                }
                else {
                    form.append(indexStr, new fetch_1.File([upload], filename), filename);
                }
            }
        }
        return value_or_promise_1.ValueOrPromise.all(uploads.map((upload, i) => new value_or_promise_1.ValueOrPromise(() => handleUpload(upload, i))))
            .then(() => form)
            .resolve();
    }
    prepareGETUrl({ baseUrl, query, variables, operationName, extensions, }) {
        const HTTP_URL = switchProtocols(baseUrl, {
            wss: 'https',
            ws: 'http',
        });
        const dummyHostname = 'https://dummyhostname.com';
        const validUrl = HTTP_URL.startsWith('http')
            ? HTTP_URL
            : HTTP_URL.startsWith('/')
                ? `${dummyHostname}${HTTP_URL}`
                : `${dummyHostname}/${HTTP_URL}`;
        const urlObj = new URL(validUrl);
        urlObj.searchParams.set('query', (0, graphql_1.stripIgnoredCharacters)(query));
        if (variables && Object.keys(variables).length > 0) {
            urlObj.searchParams.set('variables', JSON.stringify(variables));
        }
        if (operationName) {
            urlObj.searchParams.set('operationName', operationName);
        }
        if (extensions) {
            urlObj.searchParams.set('extensions', JSON.stringify(extensions));
        }
        const finalUrl = urlObj.toString().replace(dummyHostname, '');
        return finalUrl;
    }
    buildHTTPExecutor(initialEndpoint, fetch, options) {
        const defaultMethod = this.getDefaultMethodFromOptions(options === null || options === void 0 ? void 0 : options.method, 'POST');
        const HTTP_URL = switchProtocols(initialEndpoint, {
            wss: 'https',
            ws: 'http',
        });
        const executor = (request) => {
            var _a, _b;
            const controller = (0, addCancelToResponseStream_js_1.cancelNeeded)() ? new fetch_1.AbortController() : undefined;
            let method = defaultMethod;
            const operationAst = (0, utils_1.getOperationASTFromRequest)(request);
            const operationType = operationAst.operation;
            if ((options === null || options === void 0 ? void 0 : options.useGETForQueries) && operationType === 'query') {
                method = 'GET';
            }
            let accept = 'application/graphql-response+json, application/json, multipart/mixed';
            if (operationType === 'subscription' || (0, utils_js_1.isLiveQueryOperationDefinitionNode)(operationAst)) {
                method = 'GET';
                accept = 'text/event-stream';
            }
            const endpoint = ((_a = request.extensions) === null || _a === void 0 ? void 0 : _a.endpoint) || HTTP_URL;
            const headers = Object.assign({
                accept,
            }, options === null || options === void 0 ? void 0 : options.headers, ((_b = request.extensions) === null || _b === void 0 ? void 0 : _b.headers) || {});
            const query = (0, graphql_1.print)(request.document);
            const requestBody = {
                query,
                variables: request.variables,
                operationName: request.operationName,
                extensions: request.extensions,
            };
            let timeoutId;
            if (options === null || options === void 0 ? void 0 : options.timeout) {
                timeoutId = setTimeout(() => {
                    if (!(controller === null || controller === void 0 ? void 0 : controller.signal.aborted)) {
                        controller === null || controller === void 0 ? void 0 : controller.abort();
                    }
                }, options.timeout);
            }
            return new value_or_promise_1.ValueOrPromise(() => {
                switch (method) {
                    case 'GET':
                        const finalUrl = this.prepareGETUrl({
                            baseUrl: endpoint,
                            ...requestBody,
                        });
                        return fetch(finalUrl, {
                            method: 'GET',
                            ...((options === null || options === void 0 ? void 0 : options.credentials) != null ? { credentials: options.credentials } : {}),
                            headers,
                            signal: controller === null || controller === void 0 ? void 0 : controller.signal,
                        }, request.context, request.info);
                    case 'POST':
                        return new value_or_promise_1.ValueOrPromise(() => this.createFormDataFromVariables(requestBody))
                            .then(body => fetch(endpoint, {
                            method: 'POST',
                            ...((options === null || options === void 0 ? void 0 : options.credentials) != null ? { credentials: options.credentials } : {}),
                            body,
                            headers: {
                                ...headers,
                                ...(typeof body === 'string' ? { 'content-type': 'application/json' } : {}),
                            },
                            signal: controller === null || controller === void 0 ? void 0 : controller.signal,
                        }, request.context, request.info))
                            .resolve();
                }
            })
                .then((fetchResult) => {
                if (timeoutId != null) {
                    clearTimeout(timeoutId);
                }
                // Retry should respect HTTP Errors
                if ((options === null || options === void 0 ? void 0 : options.retry) != null && !fetchResult.status.toString().startsWith('2')) {
                    throw new Error(fetchResult.statusText || `HTTP Error: ${fetchResult.status}`);
                }
                const contentType = fetchResult.headers.get('content-type');
                if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('text/event-stream')) {
                    return (0, handleEventStreamResponse_js_1.handleEventStreamResponse)(fetchResult, controller);
                }
                else if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('multipart/mixed')) {
                    return (0, handleMultipartMixedResponse_js_1.handleMultipartMixedResponse)(fetchResult, controller);
                }
                return fetchResult.text();
            })
                .then(result => {
                if (typeof result === 'string') {
                    if (result) {
                        return JSON.parse(result);
                    }
                }
                else {
                    return result;
                }
            })
                .catch((e) => {
                if (typeof e === 'string') {
                    return {
                        errors: [
                            (0, utils_1.createGraphQLError)(e, {
                                extensions: {
                                    requestBody,
                                },
                            }),
                        ],
                    };
                }
                else if (e.name === 'GraphQLError') {
                    return {
                        errors: [e],
                    };
                }
                else if (e.name === 'TypeError' && e.message === 'fetch failed') {
                    return {
                        errors: [
                            (0, utils_1.createGraphQLError)(`fetch failed to ${endpoint}`, {
                                extensions: {
                                    requestBody,
                                },
                                originalError: e,
                            }),
                        ],
                    };
                }
                else if (e.message) {
                    return {
                        errors: [
                            (0, utils_1.createGraphQLError)(e.message, {
                                extensions: {
                                    requestBody,
                                },
                                originalError: e,
                            }),
                        ],
                    };
                }
                else {
                    return {
                        errors: [
                            (0, utils_1.createGraphQLError)('Unknown error', {
                                extensions: {
                                    requestBody,
                                },
                                originalError: e,
                            }),
                        ],
                    };
                }
            })
                .resolve();
        };
        if ((options === null || options === void 0 ? void 0 : options.retry) != null) {
            return function retryExecutor(request) {
                let result;
                let attempt = 0;
                function retryAttempt() {
                    attempt++;
                    if (attempt > options.retry) {
                        if (result != null) {
                            return result;
                        }
                        return {
                            errors: [(0, utils_1.createGraphQLError)('No response returned from fetch')],
                        };
                    }
                    return new value_or_promise_1.ValueOrPromise(() => executor(request))
                        .then(res => {
                        var _a;
                        result = res;
                        if ((_a = result === null || result === void 0 ? void 0 : result.errors) === null || _a === void 0 ? void 0 : _a.length) {
                            return retryAttempt();
                        }
                        return result;
                    })
                        .resolve();
                }
                return retryAttempt();
            };
        }
        return executor;
    }
    buildWSExecutor(subscriptionsEndpoint, webSocketImpl, connectionParams) {
        const WS_URL = switchProtocols(subscriptionsEndpoint, {
            https: 'wss',
            http: 'ws',
        });
        const subscriptionClient = (0, graphql_ws_1.createClient)({
            url: WS_URL,
            webSocketImpl,
            connectionParams,
            lazy: true,
        });
        return ({ document, variables, operationName, extensions }) => {
            const query = (0, graphql_1.print)(document);
            return (0, utils_1.observableToAsyncIterable)({
                subscribe: observer => {
                    const unsubscribe = subscriptionClient.subscribe({
                        query,
                        variables: variables,
                        operationName,
                        extensions,
                    }, observer);
                    return {
                        unsubscribe,
                    };
                },
            });
        };
    }
    buildWSLegacyExecutor(subscriptionsEndpoint, WebSocketImpl, options) {
        const WS_URL = switchProtocols(subscriptionsEndpoint, {
            https: 'wss',
            http: 'ws',
        });
        const observerById = new Map();
        let websocket = null;
        const ensureWebsocket = () => {
            websocket = new WebSocketImpl(WS_URL, 'graphql-ws', {
                followRedirects: true,
                headers: options === null || options === void 0 ? void 0 : options.headers,
                rejectUnauthorized: false,
                skipUTF8Validation: true,
            });
            websocket.onopen = () => {
                let payload = {};
                switch (typeof (options === null || options === void 0 ? void 0 : options.connectionParams)) {
                    case 'function':
                        payload = options === null || options === void 0 ? void 0 : options.connectionParams();
                        break;
                    case 'object':
                        payload = options === null || options === void 0 ? void 0 : options.connectionParams;
                        break;
                }
                websocket.send(JSON.stringify({
                    type: utils_js_1.LEGACY_WS.CONNECTION_INIT,
                    payload,
                }));
            };
        };
        const cleanupWebsocket = () => {
            if (websocket != null && observerById.size === 0) {
                websocket.send(JSON.stringify({
                    type: utils_js_1.LEGACY_WS.CONNECTION_TERMINATE,
                }));
                websocket.terminate();
                websocket = null;
            }
        };
        return function legacyExecutor(request) {
            const id = Date.now().toString();
            return (0, utils_1.observableToAsyncIterable)({
                subscribe(observer) {
                    ensureWebsocket();
                    if (websocket == null) {
                        throw new Error(`WebSocket connection is not found!`);
                    }
                    websocket.onmessage = event => {
                        const data = JSON.parse(event.data.toString('utf-8'));
                        switch (data.type) {
                            case utils_js_1.LEGACY_WS.CONNECTION_ACK: {
                                if (websocket == null) {
                                    throw new Error(`WebSocket connection is not found!`);
                                }
                                websocket.send(JSON.stringify({
                                    type: utils_js_1.LEGACY_WS.START,
                                    id,
                                    payload: {
                                        query: (0, graphql_1.print)(request.document),
                                        variables: request.variables,
                                        operationName: request.operationName,
                                    },
                                }));
                                break;
                            }
                            case utils_js_1.LEGACY_WS.CONNECTION_ERROR: {
                                observer.error(data.payload);
                                break;
                            }
                            case utils_js_1.LEGACY_WS.CONNECTION_KEEP_ALIVE: {
                                break;
                            }
                            case utils_js_1.LEGACY_WS.DATA: {
                                observer.next(data.payload);
                                break;
                            }
                            case utils_js_1.LEGACY_WS.COMPLETE: {
                                if (websocket == null) {
                                    throw new Error(`WebSocket connection is not found!`);
                                }
                                websocket.send(JSON.stringify({
                                    type: utils_js_1.LEGACY_WS.CONNECTION_TERMINATE,
                                }));
                                observer.complete();
                                cleanupWebsocket();
                                break;
                            }
                        }
                    };
                    return {
                        unsubscribe: () => {
                            websocket === null || websocket === void 0 ? void 0 : websocket.send(JSON.stringify({
                                type: utils_js_1.LEGACY_WS.STOP,
                                id,
                            }));
                            cleanupWebsocket();
                        },
                    };
                },
            });
        };
    }
    getFetch(customFetch, importFn) {
        if (customFetch) {
            if (typeof customFetch === 'string') {
                const [moduleName, fetchFnName] = customFetch.split('#');
                return new value_or_promise_1.ValueOrPromise(() => importFn(moduleName))
                    .then(module => (fetchFnName ? module[fetchFnName] : module))
                    .resolve();
            }
            else if (typeof customFetch === 'function') {
                return customFetch;
            }
        }
        if (importFn === asyncImport) {
            return defaultAsyncFetch_js_1.defaultAsyncFetch;
        }
        else {
            return defaultSyncFetch_js_1.defaultSyncFetch;
        }
    }
    getDefaultMethodFromOptions(method, defaultMethod) {
        if (method) {
            defaultMethod = method;
        }
        return defaultMethod;
    }
    getWebSocketImpl(importFn, options) {
        if (typeof (options === null || options === void 0 ? void 0 : options.webSocketImpl) === 'string') {
            const [moduleName, webSocketImplName] = options.webSocketImpl.split('#');
            return new value_or_promise_1.ValueOrPromise(() => importFn(moduleName))
                .then(importedModule => (webSocketImplName ? importedModule[webSocketImplName] : importedModule))
                .resolve();
        }
        else {
            const websocketImpl = (options === null || options === void 0 ? void 0 : options.webSocketImpl) || isomorphic_ws_1.default;
            return websocketImpl;
        }
    }
    buildSubscriptionExecutor(subscriptionsEndpoint, fetch, importFn, options) {
        if ((options === null || options === void 0 ? void 0 : options.subscriptionsProtocol) === SubscriptionProtocol.SSE) {
            return this.buildHTTPExecutor(subscriptionsEndpoint, fetch, options);
        }
        else if ((options === null || options === void 0 ? void 0 : options.subscriptionsProtocol) === SubscriptionProtocol.GRAPHQL_SSE) {
            if (!(options === null || options === void 0 ? void 0 : options.subscriptionsEndpoint)) {
                // when no custom subscriptions endpoint is specified,
                // graphql-sse is recommended to be used on `/graphql/stream`
                subscriptionsEndpoint += '/stream';
            }
            return this.buildHTTPExecutor(subscriptionsEndpoint, fetch, options);
        }
        else {
            const webSocketImpl$ = new value_or_promise_1.ValueOrPromise(() => this.getWebSocketImpl(importFn, options));
            const executor$ = webSocketImpl$.then(webSocketImpl => {
                if ((options === null || options === void 0 ? void 0 : options.subscriptionsProtocol) === SubscriptionProtocol.LEGACY_WS) {
                    return this.buildWSLegacyExecutor(subscriptionsEndpoint, webSocketImpl, options);
                }
                else {
                    return this.buildWSExecutor(subscriptionsEndpoint, webSocketImpl, options === null || options === void 0 ? void 0 : options.connectionParams);
                }
            });
            return request => executor$.then(executor => executor(request)).resolve();
        }
    }
    getExecutor(endpoint, importFn, options) {
        const fetch$ = new value_or_promise_1.ValueOrPromise(() => this.getFetch(options === null || options === void 0 ? void 0 : options.customFetch, importFn));
        const httpExecutor$ = fetch$.then(fetch => {
            return this.buildHTTPExecutor(endpoint, fetch, options);
        });
        if ((options === null || options === void 0 ? void 0 : options.subscriptionsEndpoint) != null || (options === null || options === void 0 ? void 0 : options.subscriptionsProtocol) !== SubscriptionProtocol.SSE) {
            const subscriptionExecutor$ = fetch$.then(fetch => {
                const subscriptionsEndpoint = (options === null || options === void 0 ? void 0 : options.subscriptionsEndpoint) || endpoint;
                return this.buildSubscriptionExecutor(subscriptionsEndpoint, fetch, importFn, options);
            });
            // eslint-disable-next-line no-inner-declarations
            function getExecutorByRequest(request) {
                const operationAst = (0, utils_1.getOperationASTFromRequest)(request);
                if (operationAst.operation === 'subscription' || (0, utils_js_1.isLiveQueryOperationDefinitionNode)(operationAst)) {
                    return subscriptionExecutor$;
                }
                else {
                    return httpExecutor$;
                }
            }
            return request => getExecutorByRequest(request)
                .then(executor => executor(request))
                .resolve();
        }
        else {
            return request => httpExecutor$.then(executor => executor(request)).resolve();
        }
    }
    getExecutorAsync(endpoint, options) {
        return this.getExecutor(endpoint, asyncImport, options);
    }
    getExecutorSync(endpoint, options) {
        return this.getExecutor(endpoint, syncImport, options);
    }
    handleSDL(pointer, fetch, options) {
        const defaultMethod = this.getDefaultMethodFromOptions(options === null || options === void 0 ? void 0 : options.method, 'GET');
        return new value_or_promise_1.ValueOrPromise(() => fetch(pointer, {
            method: defaultMethod,
            headers: options.headers,
        }))
            .then(response => response.text())
            .then(schemaString => (0, utils_1.parseGraphQLSDL)(pointer, schemaString, options))
            .resolve();
    }
    async load(pointer, options) {
        if (!isCompatibleUri(pointer)) {
            return [];
        }
        let source = {
            location: pointer,
        };
        let executor;
        if ((options === null || options === void 0 ? void 0 : options.handleAsSDL) || pointer.endsWith('.graphql') || pointer.endsWith('.graphqls')) {
            const fetch = await this.getFetch(options === null || options === void 0 ? void 0 : options.customFetch, asyncImport);
            source = await this.handleSDL(pointer, fetch, options);
            if (!source.schema && !source.document && !source.rawSDL) {
                throw new Error(`Invalid SDL response`);
            }
            source.schema =
                source.schema ||
                    (source.document
                        ? (0, graphql_1.buildASTSchema)(source.document, options)
                        : source.rawSDL
                            ? (0, graphql_1.buildSchema)(source.rawSDL, options)
                            : undefined);
        }
        else {
            executor = this.getExecutorAsync(pointer, options);
            source.schema = await (0, wrap_1.introspectSchema)(executor, {}, options);
        }
        if (!source.schema) {
            throw new Error(`Invalid introspected schema`);
        }
        if (options === null || options === void 0 ? void 0 : options.endpoint) {
            executor = this.getExecutorAsync(options.endpoint, options);
        }
        if (executor) {
            source.schema = (0, wrap_1.wrapSchema)({
                schema: source.schema,
                executor,
                batch: options === null || options === void 0 ? void 0 : options.batch,
            });
        }
        return [source];
    }
    loadSync(pointer, options) {
        if (!isCompatibleUri(pointer)) {
            return [];
        }
        let source = {
            location: pointer,
        };
        let executor;
        if ((options === null || options === void 0 ? void 0 : options.handleAsSDL) || pointer.endsWith('.graphql') || pointer.endsWith('.graphqls')) {
            const fetch = this.getFetch(options === null || options === void 0 ? void 0 : options.customFetch, syncImport);
            source = this.handleSDL(pointer, fetch, options);
            if (!source.schema && !source.document && !source.rawSDL) {
                throw new Error(`Invalid SDL response`);
            }
            source.schema =
                source.schema ||
                    (source.document
                        ? (0, graphql_1.buildASTSchema)(source.document, options)
                        : source.rawSDL
                            ? (0, graphql_1.buildSchema)(source.rawSDL, options)
                            : undefined);
        }
        else {
            executor = this.getExecutorSync(pointer, options);
            source.schema = (0, wrap_1.introspectSchema)(executor, {}, options);
        }
        if (!source.schema) {
            throw new Error(`Invalid introspected schema`);
        }
        if (options === null || options === void 0 ? void 0 : options.endpoint) {
            executor = this.getExecutorSync(options.endpoint, options);
        }
        if (executor) {
            source.schema = (0, wrap_1.wrapSchema)({
                schema: source.schema,
                executor,
            });
        }
        return [source];
    }
}
exports.UrlLoader = UrlLoader;
function switchProtocols(pointer, protocolMap) {
    return Object.entries(protocolMap).reduce((prev, [source, target]) => prev.replace(`${source}://`, `${target}://`).replace(`${source}:\\`, `${target}:\\`), pointer);
}
