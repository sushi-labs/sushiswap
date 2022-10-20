"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePOSTJsonRequest = exports.isPOSTJsonRequest = void 0;
const utils_js_1 = require("./utils.js");
function isPOSTJsonRequest(request) {
    return (request.method === 'POST' &&
        ((0, utils_js_1.isContentTypeMatch)(request, 'application/json') ||
            (0, utils_js_1.isContentTypeMatch)(request, 'application/graphql+json')));
}
exports.isPOSTJsonRequest = isPOSTJsonRequest;
async function parsePOSTJsonRequest(request) {
    const requestBody = await request.json();
    return {
        operationName: requestBody.operationName,
        query: requestBody.query,
        variables: requestBody.variables,
        extensions: requestBody.extensions,
    };
}
exports.parsePOSTJsonRequest = parsePOSTJsonRequest;
