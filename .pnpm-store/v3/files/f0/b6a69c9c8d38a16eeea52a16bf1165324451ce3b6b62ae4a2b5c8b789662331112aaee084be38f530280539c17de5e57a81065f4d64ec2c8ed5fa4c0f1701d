"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPushResult = void 0;
const core_1 = require("@envelop/core");
const error_js_1 = require("../../error.js");
const stringify_js_1 = require("./stringify.js");
function processPushResult(result, fetchAPI) {
    const headersInit = {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    };
    const responseInit = (0, error_js_1.getResponseInitByRespectingErrors)(result, headersInit);
    let iterator;
    const textEncoder = new fetchAPI.TextEncoder();
    const readableStream = new fetchAPI.ReadableStream({
        start() {
            if ((0, core_1.isAsyncIterable)(result)) {
                iterator = result[Symbol.asyncIterator]();
            }
            else {
                let finished = false;
                iterator = {
                    next: () => {
                        if (finished) {
                            return Promise.resolve({ done: true, value: null });
                        }
                        finished = true;
                        return Promise.resolve({ done: false, value: result });
                    },
                };
            }
        },
        async pull(controller) {
            const { done, value } = await iterator.next();
            if (value != null) {
                const chunk = (0, stringify_js_1.jsonStringifyResult)(value);
                controller.enqueue(textEncoder.encode(`data: ${chunk}\n\n`));
            }
            if (done) {
                controller.close();
            }
        },
        async cancel(e) {
            await iterator.return?.(e);
        },
    });
    return new fetchAPI.Response(readableStream, responseInit);
}
exports.processPushResult = processPushResult;
