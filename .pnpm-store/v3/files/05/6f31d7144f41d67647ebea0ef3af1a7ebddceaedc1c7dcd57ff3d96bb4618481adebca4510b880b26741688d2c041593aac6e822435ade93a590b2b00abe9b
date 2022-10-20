import { isAsyncIterable } from '@envelop/core';
import { encodeString } from '../../encodeString.js';
export function isMultipartResult(request, result) {
    var _a;
    return (isAsyncIterable(result) &&
        !!((_a = request.headers.get('accept')) === null || _a === void 0 ? void 0 : _a.includes('multipart/mixed')));
}
export function processMultipartResult(executionPatchResultIterable, fetchAPI) {
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
            controller.enqueue(encodeString(`---`));
        },
        async pull(controller) {
            const { done, value } = await iterator.next();
            if (value != null) {
                controller.enqueue(encodeString('\r\n'));
                controller.enqueue(encodeString('Content-Type: application/json; charset=utf-8'));
                controller.enqueue(encodeString('\r\n'));
                const chunk = JSON.stringify(value);
                const encodedChunk = encodeString(chunk);
                controller.enqueue(encodeString('Content-Length: ' + encodedChunk.byteLength));
                controller.enqueue(encodeString('\r\n'));
                controller.enqueue(encodeString('\r\n'));
                controller.enqueue(encodedChunk);
                controller.enqueue(encodeString('\r\n'));
                controller.enqueue(encodeString('---'));
            }
            if (done) {
                controller.enqueue(encodeString('\r\n-----\r\n'));
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
