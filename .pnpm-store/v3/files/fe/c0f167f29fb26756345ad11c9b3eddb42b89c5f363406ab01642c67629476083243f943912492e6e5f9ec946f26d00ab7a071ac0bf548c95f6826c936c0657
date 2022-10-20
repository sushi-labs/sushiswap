"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRegularResult = void 0;
const utils_1 = require("@graphql-tools/utils");
const error_js_1 = require("../../error.js");
const stringify_js_1 = require("./stringify.js");
function processRegularResult(executionResult, fetchAPI, acceptedHeader) {
    if ((0, utils_1.isAsyncIterable)(executionResult)) {
        return new fetchAPI.Response(null, {
            status: 406,
            statusText: 'Not Acceptable',
            headers: {
                accept: 'application/json; charset=utf-8, application/graphql-response+json; charset=utf-8',
            },
        });
    }
    const headersInit = {
        'Content-Type': acceptedHeader + '; charset=utf-8',
    };
    const responseInit = (0, error_js_1.getResponseInitByRespectingErrors)(executionResult, headersInit);
    if (responseInit.status >= 400 && acceptedHeader === 'application/json') {
        // regular responses accepting 'application/json' are recommended to always respond with 200
        // see more: https://graphql.github.io/graphql-over-http/draft/#sel-EANNLDFAADHCAx5H
        responseInit.status = 200;
    }
    const textEncoder = new fetchAPI.TextEncoder();
    const responseBody = (0, stringify_js_1.jsonStringifyResult)(executionResult);
    const decodedString = textEncoder.encode(responseBody);
    headersInit['Content-Length'] = decodedString.byteLength.toString();
    return new fetchAPI.Response(decodedString, responseInit);
}
exports.processRegularResult = processRegularResult;
