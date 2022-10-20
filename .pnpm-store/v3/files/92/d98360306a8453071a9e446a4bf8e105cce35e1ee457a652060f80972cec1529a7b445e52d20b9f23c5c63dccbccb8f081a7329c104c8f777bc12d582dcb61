"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPushResult = exports.isPushResult = void 0;
const core_1 = require("@envelop/core");
const encodeString_js_1 = require("../../encodeString.js");
function isPushResult(request, result) {
    var _a;
    return ((0, core_1.isAsyncIterable)(result) &&
        !!((_a = request.headers.get('accept')) === null || _a === void 0 ? void 0 : _a.includes('text/event-stream')));
}
exports.isPushResult = isPushResult;
function processPushResult(result, fetchAPI) {
    const headersInit = {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
        'Content-Encoding': 'none',
    };
    const responseInit = {
        headers: headersInit,
        status: 200,
    };
    let iterator;
    const readableStream = new fetchAPI.ReadableStream({
        start() {
            iterator = result[Symbol.asyncIterator]();
        },
        async pull(controller) {
            const { done, value } = await iterator.next();
            if (value != null) {
                const chunk = JSON.stringify(value);
                controller.enqueue((0, encodeString_js_1.encodeString)(`data: ${chunk}\n\n`));
            }
            if (done) {
                controller.close();
            }
        },
        async cancel(e) {
            var _a;
            await ((_a = iterator.return) === null || _a === void 0 ? void 0 : _a.call(iterator, e));
        },
    });
    return new fetchAPI.Response(readableStream, responseInit);
}
exports.processPushResult = processPushResult;
