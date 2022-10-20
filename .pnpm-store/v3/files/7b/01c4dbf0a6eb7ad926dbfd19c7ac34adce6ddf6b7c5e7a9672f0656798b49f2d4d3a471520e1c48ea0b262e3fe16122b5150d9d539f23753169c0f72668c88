"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMultipartResult = void 0;
const core_1 = require("@envelop/core");
const error_js_1 = require("../../error.js");
const stringify_js_1 = require("./stringify.js");
function processMultipartResult(result, fetchAPI) {
    const headersInit = {
        Connection: 'keep-alive',
        'Content-Type': 'multipart/mixed; boundary="-"',
        'Transfer-Encoding': 'chunked',
    };
    const responseInit = (0, error_js_1.getResponseInitByRespectingErrors)(result, headersInit);
    let iterator;
    const textEncoder = new fetchAPI.TextEncoder();
    const readableStream = new fetchAPI.ReadableStream({
        start(controller) {
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
            controller.enqueue(textEncoder.encode(`---`));
        },
        async pull(controller) {
            const { done, value } = await iterator.next();
            if (value != null) {
                controller.enqueue(textEncoder.encode('\r\n'));
                controller.enqueue(textEncoder.encode('Content-Type: application/json; charset=utf-8'));
                controller.enqueue(textEncoder.encode('\r\n'));
                const chunk = (0, stringify_js_1.jsonStringifyResult)(value);
                const encodedChunk = textEncoder.encode(chunk);
                controller.enqueue(textEncoder.encode('Content-Length: ' + encodedChunk.byteLength));
                controller.enqueue(textEncoder.encode('\r\n'));
                controller.enqueue(textEncoder.encode('\r\n'));
                controller.enqueue(encodedChunk);
                controller.enqueue(textEncoder.encode('\r\n'));
                controller.enqueue(textEncoder.encode('---'));
            }
            if (done) {
                controller.enqueue(textEncoder.encode('\r\n-----\r\n'));
                controller.close();
            }
        },
        async cancel(e) {
            await iterator.return?.(e);
        },
    });
    return new fetchAPI.Response(readableStream, responseInit);
}
exports.processMultipartResult = processMultipartResult;
