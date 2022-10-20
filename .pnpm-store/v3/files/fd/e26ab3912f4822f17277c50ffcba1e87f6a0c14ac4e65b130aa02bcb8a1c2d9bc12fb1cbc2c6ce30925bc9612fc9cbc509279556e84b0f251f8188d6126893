"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRegularResult = exports.isRegularResult = void 0;
const utils_1 = require("@graphql-tools/utils");
const encodeString_js_1 = require("../../encodeString.js");
function isRegularResult(request, result) {
    return !(0, utils_1.isAsyncIterable)(result);
}
exports.isRegularResult = isRegularResult;
function processRegularResult(executionResult, fetchAPI) {
    const responseBody = JSON.stringify(executionResult);
    const decodedString = (0, encodeString_js_1.encodeString)(responseBody);
    const headersInit = {
        'Content-Type': 'application/json',
        'Content-Length': decodedString.byteLength.toString(),
    };
    const responseInit = {
        headers: headersInit,
        status: 200,
    };
    return new fetchAPI.Response(decodedString, responseInit);
}
exports.processRegularResult = processRegularResult;
