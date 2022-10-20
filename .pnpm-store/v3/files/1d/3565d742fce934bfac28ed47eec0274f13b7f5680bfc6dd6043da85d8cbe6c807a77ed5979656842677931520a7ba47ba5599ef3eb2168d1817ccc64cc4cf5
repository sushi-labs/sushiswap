import { Readable } from 'stream';
import { isAsyncIterable } from '@graphql-tools/utils';
function getRequestAddressInfo(nodeRequest, defaultAddressInfo) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const hostname = nodeRequest.hostname ||
        ((_e = (_d = (_c = (_b = (_a = nodeRequest.socket) === null || _a === void 0 ? void 0 : _a.localAddress) === null || _b === void 0 ? void 0 : _b.split('ffff')) === null || _c === void 0 ? void 0 : _c.join('')) === null || _d === void 0 ? void 0 : _d.split(':')) === null || _e === void 0 ? void 0 : _e.join('')) ||
        ((_g = (_f = nodeRequest.headers) === null || _f === void 0 ? void 0 : _f.host) === null || _g === void 0 ? void 0 : _g.split(':')[0]) ||
        defaultAddressInfo.hostname ||
        'localhost';
    const port = ((_h = nodeRequest.socket) === null || _h === void 0 ? void 0 : _h.localPort) || defaultAddressInfo.port || 80;
    return {
        protocol: (nodeRequest.protocol ||
            defaultAddressInfo.protocol ||
            'http'),
        hostname,
        endpoint: nodeRequest.url || defaultAddressInfo.endpoint,
        port,
    };
}
function buildFullUrl(addressInfo) {
    return `${addressInfo.protocol}://${addressInfo.hostname}:${addressInfo.port}${addressInfo.endpoint}`;
}
function configureSocket(rawRequest) {
    var _a, _b, _c, _d, _e, _f;
    (_b = (_a = rawRequest === null || rawRequest === void 0 ? void 0 : rawRequest.socket) === null || _a === void 0 ? void 0 : _a.setTimeout) === null || _b === void 0 ? void 0 : _b.call(_a, 0);
    (_d = (_c = rawRequest === null || rawRequest === void 0 ? void 0 : rawRequest.socket) === null || _c === void 0 ? void 0 : _c.setNoDelay) === null || _d === void 0 ? void 0 : _d.call(_c, true);
    (_f = (_e = rawRequest === null || rawRequest === void 0 ? void 0 : rawRequest.socket) === null || _e === void 0 ? void 0 : _e.setKeepAlive) === null || _f === void 0 ? void 0 : _f.call(_e, true);
}
export function getNodeRequest(nodeRequest, defaultAddressInfo, RequestCtor) {
    var _a;
    const rawRequest = nodeRequest.raw || nodeRequest.req || nodeRequest;
    configureSocket(rawRequest);
    const addressInfo = getRequestAddressInfo(rawRequest, defaultAddressInfo);
    const fullUrl = buildFullUrl(addressInfo);
    if (nodeRequest.query) {
        const urlObj = new URL(fullUrl);
        for (const queryName in nodeRequest.query) {
            const queryValue = nodeRequest.query[queryName];
            urlObj.searchParams.set(queryName, queryValue);
        }
    }
    const baseRequestInit = {
        method: nodeRequest.method,
        headers: nodeRequest.headers,
    };
    if (nodeRequest.method !== 'POST') {
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
        if (typeof maybeParsedBody === 'string' ||
            maybeParsedBody[Symbol.toStringTag] === 'Uint8Array' ||
            maybeParsedBody[Symbol.toStringTag] === 'Blob' ||
            maybeParsedBody[Symbol.toStringTag] === 'FormData' ||
            maybeParsedBody[Symbol.toStringTag] === 'URLSearchParams' ||
            isAsyncIterable(maybeParsedBody)) {
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
function isReadable(responseBody) {
    return !!responseBody.pipe;
}
export function sendNodeResponse({ headers, status, statusText, body }, serverResponse) {
    headers.forEach((value, name) => {
        serverResponse.setHeader(name, value);
    });
    serverResponse.statusCode = status;
    serverResponse.statusMessage = statusText;
    return new Promise((resolve) => {
        if (body == null) {
            serverResponse.end(resolve);
            return;
        }
        if (body[Symbol.toStringTag] === 'Uint8Array') {
            serverResponse.end(body, resolve);
            return;
        }
        const nodeStream = isReadable(body) ? body : Readable.from(body);
        nodeStream.once('end', resolve);
        serverResponse.once('close', () => {
            nodeStream.destroy();
        });
        nodeStream.pipe(serverResponse);
    });
}
