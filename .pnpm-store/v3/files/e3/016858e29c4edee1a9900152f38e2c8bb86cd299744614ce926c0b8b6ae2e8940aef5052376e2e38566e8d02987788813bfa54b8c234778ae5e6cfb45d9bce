"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMultipartMixedResponse = void 0;
const node_1 = require("meros/node");
const browser_1 = require("meros/browser");
const utils_1 = require("@graphql-tools/utils");
const merge_1 = require("dset/merge");
function isIncomingMessage(body) {
    return body != null && typeof body === 'object' && 'pipe' in body;
}
async function handleMultipartMixedResponse(response) {
    const body = await response.body;
    const contentType = response.headers.get('content-type') || '';
    let asyncIterator;
    if (isIncomingMessage(body)) {
        // Meros/node expects headers as an object map with the content-type prop
        body.headers = {
            'content-type': contentType,
        };
        // And it expects `IncomingMessage` and `node-fetch` returns `body` as `Promise<PassThrough>`
        asyncIterator = (await (0, node_1.meros)(body));
    }
    else {
        // Nothing is needed for regular `Response`.
        asyncIterator = (await (0, browser_1.meros)(response));
    }
    const executionResult = {};
    return (0, utils_1.mapAsyncIterator)(asyncIterator, (part) => {
        if (part.json) {
            const chunk = part.body;
            if (chunk.path) {
                if (chunk.data) {
                    const path = ['data'];
                    (0, merge_1.dset)(executionResult, path.concat(chunk.path), chunk.data);
                }
                if (chunk.errors) {
                    executionResult.errors = (executionResult.errors || []).concat(chunk.errors);
                }
            }
            else {
                if (chunk.data) {
                    executionResult.data = chunk.data;
                }
                if (chunk.errors) {
                    executionResult.errors = chunk.errors;
                }
            }
            return executionResult;
        }
    });
}
exports.handleMultipartMixedResponse = handleMultipartMixedResponse;
