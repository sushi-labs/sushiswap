"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEventStreamResponse = void 0;
const utils_1 = require("@graphql-tools/utils");
const handleAsyncIterable_js_1 = require("./handleAsyncIterable.js");
const handleReadableStream_js_1 = require("./handleReadableStream.js");
async function handleEventStreamResponse(response) {
    // node-fetch returns body as a promise so we need to resolve it
    const body = response.body;
    if (body) {
        if ((0, utils_1.isAsyncIterable)(body)) {
            return (0, handleAsyncIterable_js_1.handleAsyncIterable)(body);
        }
        return (0, handleReadableStream_js_1.handleReadableStream)(body);
    }
    throw new Error('Response body is expected to be a readable stream but got; ' + (0, utils_1.inspect)(body));
}
exports.handleEventStreamResponse = handleEventStreamResponse;
