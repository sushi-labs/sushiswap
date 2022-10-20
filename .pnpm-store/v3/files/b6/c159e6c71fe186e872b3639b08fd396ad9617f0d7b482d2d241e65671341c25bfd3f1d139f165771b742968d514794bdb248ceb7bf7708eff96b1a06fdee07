"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePOSTMultipartRequest = exports.isPOSTMultipartRequest = void 0;
const utils_1 = require("@graphql-tools/utils");
const dset_1 = require("dset");
const utils_js_1 = require("./utils.js");
function isPOSTMultipartRequest(request) {
    return (request.method === 'POST' &&
        (0, utils_js_1.isContentTypeMatch)(request, 'multipart/form-data'));
}
exports.isPOSTMultipartRequest = isPOSTMultipartRequest;
async function parsePOSTMultipartRequest(request) {
    var _a, _b;
    let requestBody;
    try {
        requestBody = await request.formData();
    }
    catch (e) {
        // Trick for cross-undici-fetch errors on Node.js
        // TODO: This needs a better solution
        if (e instanceof Error &&
            e.message.startsWith('File size limit exceeded: ')) {
            throw (0, utils_1.createGraphQLError)(e.message, {
                extensions: {
                    http: {
                        status: 413,
                    },
                },
            });
        }
        throw e;
    }
    const operationsStr = ((_a = requestBody.get('operations')) === null || _a === void 0 ? void 0 : _a.toString()) || '{}';
    const operations = JSON.parse(operationsStr);
    const mapStr = ((_b = requestBody.get('map')) === null || _b === void 0 ? void 0 : _b.toString()) || '{}';
    const map = JSON.parse(mapStr);
    for (const fileIndex in map) {
        const file = requestBody.get(fileIndex);
        const keys = map[fileIndex];
        for (const key of keys) {
            (0, dset_1.dset)(operations, key, file);
        }
    }
    return {
        operationName: operations.operationName,
        query: operations.query,
        variables: operations.variables,
        extensions: operations.extensions,
    };
}
exports.parsePOSTMultipartRequest = parsePOSTMultipartRequest;
