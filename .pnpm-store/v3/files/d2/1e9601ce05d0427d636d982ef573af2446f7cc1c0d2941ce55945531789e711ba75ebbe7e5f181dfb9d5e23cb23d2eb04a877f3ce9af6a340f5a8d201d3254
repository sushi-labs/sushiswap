"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGETRequest = exports.isGETRequest = void 0;
const utils_js_1 = require("./utils.js");
function isGETRequest(request) {
    return request.method === 'GET';
}
exports.isGETRequest = isGETRequest;
function parseGETRequest(request) {
    const [, searchParamsStr] = request.url.split('?');
    return (0, utils_js_1.parseURLSearchParams)(searchParamsStr);
}
exports.parseGETRequest = parseGETRequest;
