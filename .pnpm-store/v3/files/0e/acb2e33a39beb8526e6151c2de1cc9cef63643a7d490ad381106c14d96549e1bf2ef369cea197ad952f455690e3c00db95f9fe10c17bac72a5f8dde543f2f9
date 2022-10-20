"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClonableBodyStream = void 0;
const stream_1 = require("stream");
/**
 * An interface that encapsulates body stream cloning
 * of an incoming request.
 */
function getClonableBodyStream(incomingMessage, KTransformStream) {
    let bufferedBodyStream = null;
    return {
        /**
         * Replaces the original request body if necessary.
         * This is done because once we read the body from the original request,
         * we can't read it again.
         */
        finalize() {
            if (bufferedBodyStream) {
                replaceRequestBody(incomingMessage, bodyStreamToNodeStream(bufferedBodyStream));
            }
        },
        /**
         * Clones the body stream
         * to pass into a middleware
         */
        cloneBodyStream() {
            const originalStream = bufferedBodyStream !== null && bufferedBodyStream !== void 0 ? bufferedBodyStream : requestToBodyStream(incomingMessage, KTransformStream);
            const [stream1, stream2] = originalStream.tee();
            bufferedBodyStream = stream1;
            return stream2;
        },
    };
}
exports.getClonableBodyStream = getClonableBodyStream;
/**
 * Creates a ReadableStream from a Node.js HTTP request
 */
function requestToBodyStream(request, KTransformStream) {
    const transform = new KTransformStream({
        start(controller) {
            request.on('data', (chunk) => controller.enqueue(chunk));
            request.on('end', () => controller.terminate());
            request.on('error', (err) => controller.error(err));
        },
    });
    return transform.readable;
}
function bodyStreamToNodeStream(bodyStream) {
    const reader = bodyStream.getReader();
    return stream_1.Readable.from((async function* () {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                return;
            }
            yield value;
        }
    })());
}
function replaceRequestBody(base, stream) {
    for (const key in stream) {
        let v = stream[key];
        if (typeof v === 'function') {
            v = v.bind(stream);
        }
        base[key] = v;
    }
    return base;
}
//# sourceMappingURL=body-streams.js.map