"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePOSTGraphQLStringRequest = exports.isPOSTGraphQLStringRequest = void 0;
const utils_js_1 = require("./utils.js");
function isPOSTGraphQLStringRequest(request) {
    return (request.method === 'POST' &&
        (0, utils_js_1.isContentTypeMatch)(request, 'application/graphql'));
}
exports.isPOSTGraphQLStringRequest = isPOSTGraphQLStringRequest;
async function parsePOSTGraphQLStringRequest(request) {
    const requestBody = await request.text();
    return {
        query: requestBody,
    };
}
exports.parsePOSTGraphQLStringRequest = parsePOSTGraphQLStringRequest;
