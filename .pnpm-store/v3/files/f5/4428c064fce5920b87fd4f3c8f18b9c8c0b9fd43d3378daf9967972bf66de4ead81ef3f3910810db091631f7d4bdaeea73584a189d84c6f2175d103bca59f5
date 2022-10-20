'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const fetch = require('@whatwg-node/fetch');

function isAsyncIterable(body) {
    return body != null && typeof body === 'object' && typeof body[Symbol.asyncIterator] === 'function';
}
function getPort(nodeRequest) {
    var _a, _b, _c, _d, _e;
    if ((_a = nodeRequest.socket) === null || _a === void 0 ? void 0 : _a.localPort) {
        return (_b = nodeRequest.socket) === null || _b === void 0 ? void 0 : _b.localPort;
    }
    const portInHeader = (_e = (_d = (_c = nodeRequest.headers) === null || _c === void 0 ? void 0 : _c.host) === null || _d === void 0 ? void 0 : _d.split(':')) === null || _e === void 0 ? void 0 : _e[1];
    if (portInHeader) {
        return portInHeader;
    }
    return 80;
}
function getHostnameWithPort(nodeRequest) {
    var _a, _b, _c;
    if ((_a = nodeRequest.headers) === null || _a === void 0 ? void 0 : _a.host) {
        return (_b = nodeRequest.headers) === null || _b === void 0 ? void 0 : _b.host;
    }
    const port = getPort(nodeRequest);
    if (nodeRequest.hostname) {
        return nodeRequest.hostname + ':' + port;
    }
    const localIp = (_c = nodeRequest.socket) === null || _c === void 0 ? void 0 : _c.localAddress;
    if (localIp && !(localIp === null || localIp === void 0 ? void 0 : localIp.includes('::')) && !(localIp === null || localIp === void 0 ? void 0 : localIp.includes('ffff'))) {
        return `${localIp}:${port}`;
    }
    return 'localhost';
}
function buildFullUrl(nodeRequest) {
    const hostnameWithPort = getHostnameWithPort(nodeRequest);
    const protocol = nodeRequest.protocol || 'http';
    const endpoint = nodeRequest.originalUrl || nodeRequest.url || '/graphql';
    return `${protocol}://${hostnameWithPort}${endpoint}`;
}
function configureSocket(rawRequest) {
    var _a, _b, _c, _d, _e, _f;
    (_b = (_a = rawRequest === null || rawRequest === void 0 ? void 0 : rawRequest.socket) === null || _a === void 0 ? void 0 : _a.setTimeout) === null || _b === void 0 ? void 0 : _b.call(_a, 0);
    (_d = (_c = rawRequest === null || rawRequest === void 0 ? void 0 : rawRequest.socket) === null || _c === void 0 ? void 0 : _c.setNoDelay) === null || _d === void 0 ? void 0 : _d.call(_c, true);
    (_f = (_e = rawRequest === null || rawRequest === void 0 ? void 0 : rawRequest.socket) === null || _e === void 0 ? void 0 : _e.setKeepAlive) === null || _f === void 0 ? void 0 : _f.call(_e, true);
}
function isRequestBody(body) {
    const stringTag = body[Symbol.toStringTag];
    if (typeof body === 'string' ||
        stringTag === 'Uint8Array' ||
        stringTag === 'Blob' ||
        stringTag === 'FormData' ||
        stringTag === 'URLSearchParams' ||
        isAsyncIterable(body)) {
        return true;
    }
    return false;
}
function normalizeNodeRequest(nodeRequest, RequestCtor) {
    var _a;
    const rawRequest = nodeRequest.raw || nodeRequest.req || nodeRequest;
    configureSocket(rawRequest);
    let fullUrl = buildFullUrl(rawRequest);
    if (nodeRequest.query) {
        const urlObj = new URL(fullUrl);
        for (const queryName in nodeRequest.query) {
            const queryValue = nodeRequest.query[queryName];
            urlObj.searchParams.set(queryName, queryValue);
        }
        fullUrl = urlObj.toString();
    }
    const baseRequestInit = {
        method: nodeRequest.method,
        headers: nodeRequest.headers,
    };
    if (nodeRequest.method === 'GET' || nodeRequest.method === 'HEAD') {
        return new RequestCtor(fullUrl, baseRequestInit);
    }
    /**
     * Some Node server frameworks like Serverless Express sends a dummy object with body but as a Buffer not string
     * so we do those checks to see is there something we can use directly as BodyInit
     * because the presence of body means the request stream is already consumed and,
     * rawRequest cannot be used as BodyInit/ReadableStream by Fetch API in this case.
     */
    const maybeParsedBody = nodeRequest.body;
    if (maybeParsedBody != null && Object.keys(maybeParsedBody).length > 0) {
        if (isRequestBody(maybeParsedBody)) {
            return new RequestCtor(fullUrl, {
                ...baseRequestInit,
                body: maybeParsedBody,
            });
        }
        const request = new RequestCtor(fullUrl, {
            ...baseRequestInit,
        });
        if (!((_a = request.headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.includes('json'))) {
            request.headers.set('content-type', 'application/json');
        }
        return new Proxy(request, {
            get: (target, prop, receiver) => {
                switch (prop) {
                    case 'json':
                        return async () => maybeParsedBody;
                    case 'text':
                        return async () => JSON.stringify(maybeParsedBody);
                    default:
                        return Reflect.get(target, prop, receiver);
                }
            },
        });
    }
    return new RequestCtor(fullUrl, {
        headers: nodeRequest.headers,
        method: nodeRequest.method,
        body: rawRequest,
    });
}
function isReadable(stream) {
    return stream.read != null;
}
function isNodeRequest(request) {
    return isReadable(request);
}
function isServerResponse(stream) {
    // Check all used functions are defined
    return (stream != null && stream.setHeader != null && stream.end != null && stream.once != null && stream.write != null);
}
function isFetchEvent(event) {
    return event != null && event.request != null && event.respondWith != null;
}
async function sendNodeResponse({ headers, status, statusText, body }, serverResponse) {
    headers.forEach((value, name) => {
        serverResponse.setHeader(name, value);
    });
    serverResponse.statusCode = status;
    serverResponse.statusMessage = statusText;
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        if (body == null) {
            serverResponse.end(resolve);
        }
        else if (body[Symbol.toStringTag] === 'Uint8Array') {
            serverResponse.end(body, resolve);
        }
        else if (isReadable(body)) {
            serverResponse.once('close', () => {
                body.destroy();
                resolve();
            });
            body.pipe(serverResponse);
        }
        else if (isAsyncIterable(body)) {
            for await (const chunk of body) {
                if (!serverResponse.write(chunk)) {
                    break;
                }
            }
            serverResponse.end(resolve);
        }
    });
}
function isRequestInit(val) {
    return (val != null &&
        typeof val === 'object' &&
        ('body' in val ||
            'cache' in val ||
            'credentials' in val ||
            'headers' in val ||
            'integrity' in val ||
            'keepalive' in val ||
            'method' in val ||
            'mode' in val ||
            'redirect' in val ||
            'referrer' in val ||
            'referrerPolicy' in val ||
            'signal' in val ||
            'window' in val));
}

/// <reference lib="webworker" />
async function handleWaitUntils(waitUntilPromises) {
    const waitUntils = await Promise.allSettled(waitUntilPromises);
    waitUntils.forEach(waitUntil => {
        if (waitUntil.status === 'rejected') {
            console.error(waitUntil.reason);
        }
    });
}
function createServerAdapter(serverAdapterBaseObject, 
/**
 * WHATWG Fetch spec compliant `Request` constructor.
 */
RequestCtor = fetch.Request) {
    const handleRequest = typeof serverAdapterBaseObject === 'function' ? serverAdapterBaseObject : serverAdapterBaseObject.handle;
    function handleNodeRequest(nodeRequest, ...ctx) {
        const serverContext = ctx.length > 1 ? Object.assign({}, ...ctx) : ctx[0];
        const request = normalizeNodeRequest(nodeRequest, RequestCtor);
        return handleRequest(request, serverContext);
    }
    async function requestListener(nodeRequest, serverResponse, ...ctx) {
        const waitUntilPromises = [];
        const defaultServerContext = {
            req: nodeRequest,
            res: serverResponse,
            waitUntil(p) {
                waitUntilPromises.push(p);
            },
        };
        const response = await handleNodeRequest(nodeRequest, defaultServerContext, ...ctx);
        if (response) {
            await sendNodeResponse(response, serverResponse);
        }
        else {
            await new Promise(resolve => {
                serverResponse.statusCode = 404;
                serverResponse.end(resolve);
            });
        }
        if (waitUntilPromises.length > 0) {
            await handleWaitUntils(waitUntilPromises);
        }
    }
    function handleEvent(event, ...ctx) {
        if (!event.respondWith || !event.request) {
            throw new TypeError(`Expected FetchEvent, got ${event}`);
        }
        const serverContext = ctx.length > 0 ? Object.assign({}, event, ...ctx) : event;
        const response$ = handleRequest(event.request, serverContext);
        event.respondWith(response$);
    }
    function handleRequestWithWaitUntil(request, ...ctx) {
        var _a;
        const serverContext = ctx.length > 1 ? Object.assign({}, ...ctx) : ctx[0] || {};
        if ('process' in globalThis && ((_a = process.versions) === null || _a === void 0 ? void 0 : _a['bun']) != null) {
            // This is required for bun
            request.text();
        }
        if (!('waitUntil' in serverContext)) {
            const waitUntilPromises = [];
            const response$ = handleRequest(request, {
                ...serverContext,
                waitUntil(p) {
                    waitUntilPromises.push(p);
                },
            });
            if (waitUntilPromises.length > 0) {
                return handleWaitUntils(waitUntilPromises).then(() => response$);
            }
            return response$;
        }
        return handleRequest(request, serverContext);
    }
    const fetchFn = (input, ...maybeCtx) => {
        if (typeof input === 'string' || input instanceof URL) {
            const [initOrCtx, ...restOfCtx] = maybeCtx;
            if (isRequestInit(initOrCtx)) {
                return handleRequestWithWaitUntil(new RequestCtor(input, initOrCtx), ...restOfCtx);
            }
            return handleRequestWithWaitUntil(new RequestCtor(input), ...maybeCtx);
        }
        return handleRequestWithWaitUntil(input, ...maybeCtx);
    };
    const genericRequestHandler = (input, ...maybeCtx) => {
        // If it is a Node request
        const [initOrCtxOrRes, ...restOfCtx] = maybeCtx;
        if (isNodeRequest(input)) {
            if (!isServerResponse(initOrCtxOrRes)) {
                throw new TypeError(`Expected ServerResponse, got ${initOrCtxOrRes}`);
            }
            return requestListener(input, initOrCtxOrRes, ...restOfCtx);
        }
        if (isServerResponse(initOrCtxOrRes)) {
            throw new TypeError('Got Node response without Node request');
        }
        // Is input a container object over Request?
        if (typeof input === 'object' && 'request' in input) {
            // Is it FetchEvent?
            if (isFetchEvent(input)) {
                return handleEvent(input, ...maybeCtx);
            }
            // In this input is also the context
            return handleRequestWithWaitUntil(input.request, input, ...maybeCtx);
        }
        // Or is it Request itself?
        // Then ctx is present and it is the context
        return fetchFn(input, ...maybeCtx);
    };
    const adapterObj = {
        handleRequest,
        fetch: fetchFn,
        handleNodeRequest,
        requestListener,
        handleEvent,
        handle: genericRequestHandler,
    };
    return new Proxy(genericRequestHandler, {
        // It should have all the attributes of the handler function and the server instance
        has: (_, prop) => {
            return (prop in adapterObj ||
                prop in genericRequestHandler ||
                (serverAdapterBaseObject && prop in serverAdapterBaseObject));
        },
        get: (_, prop) => {
            const adapterProp = adapterObj[prop];
            if (adapterProp) {
                if (adapterProp.bind) {
                    return adapterProp.bind(adapterObj);
                }
                return adapterProp;
            }
            const handleProp = genericRequestHandler[prop];
            if (handleProp) {
                if (handleProp.bind) {
                    return handleProp.bind(genericRequestHandler);
                }
                return handleProp;
            }
            if (serverAdapterBaseObject) {
                const serverAdapterBaseObjectProp = serverAdapterBaseObject[prop];
                if (serverAdapterBaseObjectProp) {
                    if (serverAdapterBaseObjectProp.bind) {
                        return serverAdapterBaseObjectProp.bind(serverAdapterBaseObject);
                    }
                    return serverAdapterBaseObjectProp;
                }
            }
        },
        apply(_, __, args) {
            return genericRequestHandler(...args);
        },
    }); // 😡
}

exports.createServerAdapter = createServerAdapter;
