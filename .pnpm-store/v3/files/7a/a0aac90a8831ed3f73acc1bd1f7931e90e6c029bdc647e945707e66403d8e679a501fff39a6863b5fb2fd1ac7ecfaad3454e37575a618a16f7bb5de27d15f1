"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHandler = void 0;
const body_streams_1 = require("./body-streams");
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const http_status_1 = __importDefault(require("http-status"));
const time_span_1 = __importDefault(require("time-span"));
/**
 * Creates an HHTP handler that can be used to create a Node.js HTTP server.
 * Whenever a request is handled it will transform it into a `dispatchFetch`
 * call for the given `EdgeRuntime`. Then it will transform the response
 * into an HTTP response.
 */
function createHandler(options) {
    const awaiting = new Set();
    return {
        handler: async (req, res) => {
            var _a, _b;
            const start = (0, time_span_1.default)();
            const body = req.method !== 'GET' && req.method !== 'HEAD'
                ? (0, body_streams_1.getClonableBodyStream)(req, options.runtime.context.TransformStream)
                : undefined;
            const response = await options.runtime.dispatchFetch(String(getURL(req)), {
                headers: toRequestInitHeaders(req),
                method: req.method,
                body: body === null || body === void 0 ? void 0 : body.cloneBodyStream(),
            });
            const waitUntil = response.waitUntil();
            awaiting.add(waitUntil);
            waitUntil.finally(() => awaiting.delete(waitUntil));
            res.statusCode = response.status;
            res.statusMessage = response.statusText;
            for (const [key, value] of Object.entries(toNodeHeaders(response.headers))) {
                if (key !== 'content-encoding' && value !== undefined) {
                    res.setHeader(key, value);
                }
            }
            if (response.body) {
                for await (const chunk of response.body) {
                    res.write(chunk);
                }
            }
            const subject = `${req.socket.remoteAddress} ${req.method} ${req.url}`;
            const time = `${(_a = (0, pretty_ms_1.default)(start())
                .match(/[a-zA-Z]+|[0-9]+/g)) === null || _a === void 0 ? void 0 : _a.join(' ')}`;
            const code = `${res.statusCode} ${http_status_1.default[res.statusCode]}`;
            (_b = options.logger) === null || _b === void 0 ? void 0 : _b.debug(`${subject} → ${code} in ${time}`);
            res.end();
        },
        waitUntil: () => Promise.all(Array.from(awaiting)),
    };
}
exports.createHandler = createHandler;
/**
 * Builds a full URL from the provided incoming message. Note this function
 * is not safe as one can set has a host anything based on headers. It is
 * useful to build the fetch request full URL.
 */
function getURL(req) {
    var _a;
    const proto = ((_a = req.socket) === null || _a === void 0 ? void 0 : _a.encrypted) ? 'https' : 'http';
    return new URL(String(req.url), `${proto}://${String(req.headers.host)}`);
}
/**
 * Takes headers from IncomingMessage and transforms them into the signature
 * accepted by fetch. It simply folds headers into a single value when they
 * hold an array. For others it just copies the value.
 */
function toRequestInitHeaders(req) {
    return Object.keys(req.headers).map((key) => {
        const value = req.headers[key];
        return [key, Array.isArray(value) ? value.join(', ') : value !== null && value !== void 0 ? value : ''];
    });
}
/**
 * Transforms WHATWG Headers into a Node Headers shape. Copies all items but
 * does a special case for Set-Cookie using the hidden method getAll which
 * allows to get all cookies instead of a folded value.
 */
function toNodeHeaders(headers) {
    const result = {};
    if (headers) {
        for (const [key, value] of headers.entries()) {
            result[key] =
                key.toLowerCase() === 'set-cookie'
                    ? // @ts-ignore getAll is hidden in Headers but exists.
                        headers.getAll('set-cookie')
                    : value;
        }
    }
    return result;
}
//# sourceMappingURL=create-handler.js.map