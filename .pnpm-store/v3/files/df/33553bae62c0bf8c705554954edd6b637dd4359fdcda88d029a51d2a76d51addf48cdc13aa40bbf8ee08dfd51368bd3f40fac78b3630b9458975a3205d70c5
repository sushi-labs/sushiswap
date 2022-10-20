/* eslint-disable no-case-declarations */
/// <reference lib="dom" />
import { print, buildASTSchema, buildSchema } from 'graphql';
import { observableToAsyncIterable, isAsyncIterable, parseGraphQLSDL, getOperationASTFromRequest, } from '@graphql-tools/utils';
import { introspectSchema, wrapSchema } from '@graphql-tools/wrap';
import { createClient } from 'graphql-ws';
import WebSocket from 'isomorphic-ws';
import { extractFiles, isExtractableFile } from 'extract-files';
import { ValueOrPromise } from 'value-or-promise';
import { isLiveQueryOperationDefinitionNode } from '@n1ru4l/graphql-live-query';
import { defaultAsyncFetch } from './defaultAsyncFetch.js';
import { defaultSyncFetch } from './defaultSyncFetch.js';
import { handleMultipartMixedResponse } from './handleMultipartMixedResponse.js';
import { handleEventStreamResponse } from './event-stream/handleEventStreamResponse.js';
import { addCancelToResponseStream } from './addCancelToResponseStream.js';
import { AbortController, FormData, File } from '@whatwg-node/fetch';
import { isBlob, isGraphQLUpload, isPromiseLike, LEGACY_WS } from './utils.js';
const asyncImport = (moduleName) => import(moduleName);
const syncImport = (moduleName) => require(moduleName);
export var SubscriptionProtocol;
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
})(SubscriptionProtocol || (SubscriptionProtocol = {}));
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
export class UrlLoader {
    createFormDataFromVariables({ query, variables, operationName, extensions, }) {
        const vars = Object.assign({}, variables);
        const { clone, files } = extractFiles(vars, 'variables', ((v) => isExtractableFile(v) ||
            (v === null || v === void 0 ? void 0 : v.promise) ||
            isAsyncIterable(v) ||
            (v === null || v === void 0 ? void 0 : v.then) ||
            typeof (v === null || v === void 0 ? void 0 : v.arrayBuffer) === 'function'));
        const map = {};
        const uploads = [];
        let currIndex = 0;
        for (const [file, curr] of files) {
            map[currIndex] = curr;
            uploads[currIndex] = file;
            currIndex++;
        }
        const form = new FormData();
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
                if (isPromiseLike(upload)) {
                    return upload.then((resolvedUpload) => handleUpload(resolvedUpload, i));
                    // If Blob
                }
                else if (isBlob(upload)) {
                    return upload.arrayBuffer().then((arrayBuffer) => {
                        form.append(indexStr, new File([arrayBuffer], filename, { type: upload.type }), filename);
                    });
                }
                else if (isGraphQLUpload(upload)) {
                    const stream = upload.createReadStream();
                    const chunks = [];
                    return Promise.resolve().then(async () => {
                        for await (const chunk of stream) {
                            if (chunk) {
                                chunks.push(...chunk);
                            }
                        }
                        const blobPart = new Uint8Array(chunks);
                        form.append(indexStr, new File([blobPart], filename, { type: upload.mimetype }), filename);
                    });
                }
                else {
                    form.append(indexStr, new File([upload], filename), filename);
                }
            }
        }
        return ValueOrPromise.all(uploads.map((upload, i) => new ValueOrPromise(() => handleUpload(upload, i))))
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
        urlObj.searchParams.set('query', query);
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
            const controller = new AbortController();
            let method = defaultMethod;
            const operationAst = getOperationASTFromRequest(request);
            const operationType = operationAst.operation;
            if ((options === null || options === void 0 ? void 0 : options.useGETForQueries) && operationType === 'query') {
                method = 'GET';
            }
            let accept = 'application/json, multipart/mixed';
            if (operationType === 'subscription' || isLiveQueryOperationDefinitionNode(operationAst)) {
                method = 'GET';
                accept = 'text/event-stream';
            }
            const endpoint = ((_a = request.extensions) === null || _a === void 0 ? void 0 : _a.endpoint) || HTTP_URL;
            const headers = Object.assign({
                accept,
            }, options === null || options === void 0 ? void 0 : options.headers, ((_b = request.extensions) === null || _b === void 0 ? void 0 : _b.headers) || {});
            const query = print(request.document);
            const requestBody = {
                query,
                variables: request.variables,
                operationName: request.operationName,
                extensions: request.extensions,
            };
            let timeoutId;
            if (options === null || options === void 0 ? void 0 : options.timeout) {
                timeoutId = setTimeout(() => {
                    if (!controller.signal.aborted) {
                        controller.abort();
                    }
                }, options.timeout);
            }
            const credentials = (options === null || options === void 0 ? void 0 : options.credentials) !== 'disable' ? (options === null || options === void 0 ? void 0 : options.credentials) || 'same-origin' : null;
            return new ValueOrPromise(() => {
                switch (method) {
                    case 'GET':
                        const finalUrl = this.prepareGETUrl({
                            baseUrl: endpoint,
                            ...requestBody,
                        });
                        return fetch(finalUrl, {
                            method: 'GET',
                            ...(credentials != null ? { credentials } : {}),
                            headers,
                            signal: controller.signal,
                        });
                    case 'POST':
                        if (options === null || options === void 0 ? void 0 : options.multipart) {
                            return new ValueOrPromise(() => this.createFormDataFromVariables(requestBody))
                                .then(form => fetch(endpoint, {
                                method: 'POST',
                                ...(credentials != null ? { credentials } : {}),
                                body: form,
                                headers,
                                signal: controller.signal,
                            }))
                                .resolve();
                        }
                        else {
                            return fetch(endpoint, {
                                method: 'POST',
                                ...(credentials != null ? { credentials } : {}),
                                body: JSON.stringify(requestBody),
                                headers: {
                                    'content-type': 'application/json',
                                    ...headers,
                                },
                                signal: controller.signal,
                            });
                        }
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
                    return handleEventStreamResponse(fetchResult).then(resultStream => addCancelToResponseStream(resultStream, controller));
                }
                else if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('multipart/mixed')) {
                    return handleMultipartMixedResponse(fetchResult).then(resultStream => addCancelToResponseStream(resultStream, controller));
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
                .resolve();
        };
        if ((options === null || options === void 0 ? void 0 : options.retry) != null) {
            return function retryExecutor(request) {
                let result;
                let error;
                let attempt = 0;
                function retryAttempt() {
                    attempt++;
                    if (attempt > options.retry) {
                        if (result != null) {
                            return result;
                        }
                        if (error != null) {
                            throw error;
                        }
                        throw new Error('No result');
                    }
                    return new ValueOrPromise(() => executor(request))
                        .then(res => {
                        var _a;
                        result = res;
                        if ((_a = result === null || result === void 0 ? void 0 : result.errors) === null || _a === void 0 ? void 0 : _a.length) {
                            return retryAttempt();
                        }
                        return result;
                    })
                        .catch((e) => {
                        error = e;
                        return retryAttempt();
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
        const subscriptionClient = createClient({
            url: WS_URL,
            webSocketImpl,
            connectionParams,
            lazy: true,
        });
        return ({ document, variables, operationName, extensions }) => {
            const query = print(document);
            return observableToAsyncIterable({
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
                    type: LEGACY_WS.CONNECTION_INIT,
                    payload,
                }));
            };
        };
        const cleanupWebsocket = () => {
            if (websocket != null && observerById.size === 0) {
                websocket.send(JSON.stringify({
                    type: LEGACY_WS.CONNECTION_TERMINATE,
                }));
                websocket.terminate();
                websocket = null;
            }
        };
        return function legacyExecutor(request) {
            const id = Date.now().toString();
            return observableToAsyncIterable({
                subscribe(observer) {
                    ensureWebsocket();
                    if (websocket == null) {
                        throw new Error(`WebSocket connection is not found!`);
                    }
                    websocket.onmessage = event => {
                        const data = JSON.parse(event.data.toString('utf-8'));
                        switch (data.type) {
                            case LEGACY_WS.CONNECTION_ACK: {
                                if (websocket == null) {
                                    throw new Error(`WebSocket connection is not found!`);
                                }
                                websocket.send(JSON.stringify({
                                    type: LEGACY_WS.START,
                                    id,
                                    payload: {
                                        query: print(request.document),
                                        variables: request.variables,
                                        operationName: request.operationName,
                                    },
                                }));
                                break;
                            }
                            case LEGACY_WS.CONNECTION_ERROR: {
                                observer.error(data.payload);
                                break;
                            }
                            case LEGACY_WS.CONNECTION_KEEP_ALIVE: {
                                break;
                            }
                            case LEGACY_WS.DATA: {
                                observer.next(data.payload);
                                break;
                            }
                            case LEGACY_WS.COMPLETE: {
                                if (websocket == null) {
                                    throw new Error(`WebSocket connection is not found!`);
                                }
                                websocket.send(JSON.stringify({
                                    type: LEGACY_WS.CONNECTION_TERMINATE,
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
                                type: LEGACY_WS.STOP,
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
                return new ValueOrPromise(() => importFn(moduleName))
                    .then(module => (fetchFnName ? module[fetchFnName] : module))
                    .resolve();
            }
            else if (typeof customFetch === 'function') {
                return customFetch;
            }
        }
        if (importFn === asyncImport) {
            return defaultAsyncFetch;
        }
        else {
            return defaultSyncFetch;
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
            return new ValueOrPromise(() => importFn(moduleName))
                .then(importedModule => (webSocketImplName ? importedModule[webSocketImplName] : importedModule))
                .resolve();
        }
        else {
            const websocketImpl = (options === null || options === void 0 ? void 0 : options.webSocketImpl) || WebSocket;
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
            const webSocketImpl$ = new ValueOrPromise(() => this.getWebSocketImpl(importFn, options));
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
        const fetch$ = new ValueOrPromise(() => this.getFetch(options === null || options === void 0 ? void 0 : options.customFetch, importFn));
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
                const operationAst = getOperationASTFromRequest(request);
                if (operationAst.operation === 'subscription' ||
                    isLiveQueryOperationDefinitionNode(operationAst, request.variables)) {
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
        return new ValueOrPromise(() => fetch(pointer, {
            method: defaultMethod,
            headers: options.headers,
        }))
            .then(response => response.text())
            .then(schemaString => parseGraphQLSDL(pointer, schemaString, options))
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
                        ? buildASTSchema(source.document, options)
                        : source.rawSDL
                            ? buildSchema(source.rawSDL, options)
                            : undefined);
        }
        else {
            executor = this.getExecutorAsync(pointer, options);
            source.schema = await introspectSchema(executor, {}, options);
        }
        if (!source.schema) {
            throw new Error(`Invalid introspected schema`);
        }
        if (options === null || options === void 0 ? void 0 : options.endpoint) {
            executor = this.getExecutorAsync(options.endpoint, options);
        }
        if (executor) {
            source.schema = wrapSchema({
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
                        ? buildASTSchema(source.document, options)
                        : source.rawSDL
                            ? buildSchema(source.rawSDL, options)
                            : undefined);
        }
        else {
            executor = this.getExecutorSync(pointer, options);
            source.schema = introspectSchema(executor, {}, options);
        }
        if (!source.schema) {
            throw new Error(`Invalid introspected schema`);
        }
        if (options === null || options === void 0 ? void 0 : options.endpoint) {
            executor = this.getExecutorSync(options.endpoint, options);
        }
        if (executor) {
            source.schema = wrapSchema({
                schema: source.schema,
                executor,
            });
        }
        return [source];
    }
}
function switchProtocols(pointer, protocolMap) {
    return Object.entries(protocolMap).reduce((prev, [source, target]) => prev.replace(`${source}://`, `${target}://`).replace(`${source}:\\`, `${target}:\\`), pointer);
}
