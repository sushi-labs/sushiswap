"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMultipartResult = exports.isMultipartResult = void 0;
const core_1 = require("@envelop/core");
const encodeString_js_1 = require("../../encodeString.js");
function isMultipartResult(request, result) {
    var _a;
    return ((0, core_1.isAsyncIterable)(result) &&
        !!((_a = request.headers.get('accept')) === null || _a === void 0 ? void 0 : _a.includes('multipart/mixed')));
}
exports.isMultipartResult = isMultipartResult;
function processMultipartResult(executionPatchResultIterable, fetchAPI) {
    const headersInit = {
        Connection: 'keep-alive',
        'Content-Type': 'multipart/mixed; boundary="-"',
        'Transfer-Encoding': 'chunked',
    };
    const responseInit = {
        headers: headersInit,
        status: 200,
    };
    let iterator;
    const readableStream = new fetchAPI.ReadableStream({
        start(controller) {
            iterator = executionPatchResultIterable[Symbol.asyncIterator]();
            controller.enqueue((0, encodeString_js_1.encodeString)(`---`));
        },
        async pull(controller) {
            const { done, value } = await iterator.next();
            if (value != null) {
                controller.enqueue((0, encodeString_js_1.encodeString)('\r\n'));
                controller.enqueue((0, encodeString_js_1.encodeString)('Content-Type: application/json; charset=utf-8'));
                controller.enqueue((0, encodeString_js_1.encodeString)('\r\n'));
                const chunk = JSON.stringify(value);
                const encodedChunk = (0, encodeString_js_1.encodeString)(chunk);
                controller.enqueue((0, encodeString_js_1.encodeString)('Content-Length: ' + encodedChunk.byteLength));
                controller.enqueue((0, encodeString_js_1.encodeString)('\r\n'));
                controller.enqueue((0, encodeString_js_1.encodeString)('\r\n'));
                controller.enqueue(encodedChunk);
                controller.enqueue((0, encodeString_js_1.encodeString)('\r\n'));
                controller.enqueue((0, encodeString_js_1.encodeString)('---'));
            }
            if (done) {
                controller.enqueue((0, encodeString_js_1.encodeString)('\r\n-----\r\n'));
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
exports.processMultipartResult = processMultipartResult;
