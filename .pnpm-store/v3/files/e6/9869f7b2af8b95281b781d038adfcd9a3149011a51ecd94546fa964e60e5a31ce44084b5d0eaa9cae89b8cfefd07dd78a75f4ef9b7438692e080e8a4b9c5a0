"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePOSTFormUrlEncodedRequest = exports.isPOSTFormUrlEncodedRequest = void 0;
const utils_js_1 = require("./utils.js");
function isPOSTFormUrlEncodedRequest(request) {
    return (request.method === 'POST' &&
        (0, utils_js_1.isContentTypeMatch)(request, 'application/x-www-form-urlencoded'));
}
exports.isPOSTFormUrlEncodedRequest = isPOSTFormUrlEncodedRequest;
async function parsePOSTFormUrlEncodedRequest(request) {
    const requestBody = await request.text();
    return (0, utils_js_1.parseURLSearchParams)(requestBody);
}
exports.parsePOSTFormUrlEncodedRequest = parsePOSTFormUrlEncodedRequest;
