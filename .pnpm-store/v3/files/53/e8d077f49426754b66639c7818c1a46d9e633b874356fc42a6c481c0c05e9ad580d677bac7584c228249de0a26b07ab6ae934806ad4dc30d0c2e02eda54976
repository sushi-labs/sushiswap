"use strict";
/* eslint-disable no-labels */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAsyncIterable = void 0;
let decodeUint8Array;
if (globalThis.Buffer) {
    decodeUint8Array = uint8Array => globalThis.Buffer.from(uint8Array).toString('utf-8');
}
else {
    const textDecoder = new TextDecoder();
    decodeUint8Array = uint8Array => textDecoder.decode(uint8Array, { stream: true });
}
async function* handleAsyncIterable(asyncIterable) {
    outer: for await (const chunk of asyncIterable) {
        const chunkStr = typeof chunk === 'string' ? chunk : decodeUint8Array(chunk);
        for (const part of chunkStr.split('\n\n')) {
            if (part) {
                const eventStr = part.split('event: ')[1];
                const dataStr = part.split('data: ')[1];
                if (eventStr === 'complete') {
                    break outer;
                }
                if (dataStr) {
                    const data = JSON.parse(dataStr);
                    yield data.payload || data;
                }
            }
        }
    }
}
exports.handleAsyncIterable = handleAsyncIterable;
