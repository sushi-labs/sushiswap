"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePOSTJsonRequest = exports.isPOSTJsonRequest = void 0;
const utils_1 = require("@graphql-tools/utils");
const utils_js_1 = require("./utils.js");
function isPOSTJsonRequest(request) {
    return (request.method === 'POST' &&
        ((0, utils_js_1.isContentTypeMatch)(request, 'application/json') ||
            (0, utils_js_1.isContentTypeMatch)(request, 'application/graphql+json')));
}
exports.isPOSTJsonRequest = isPOSTJsonRequest;
async function parsePOSTJsonRequest(request) {
    let requestBody;
    try {
        requestBody = await request.json();
    }
    catch (err) {
        const extensions = {
            http: {
                status: 400,
            },
        };
        if (err instanceof Error) {
            extensions.originalError = {
                name: err.name,
                message: err.message,
            };
        }
        throw (0, utils_1.createGraphQLError)('POST body sent invalid JSON.', {
            extensions,
        });
    }
    if (requestBody == null) {
        throw (0, utils_1.createGraphQLError)(`POST body is expected to be object but received ${requestBody}`, {
            extensions: {
                http: {
                    status: 400,
                },
            },
        });
    }
    const requestBodyTypeof = typeof requestBody;
    if (requestBodyTypeof !== 'object') {
        throw (0, utils_1.createGraphQLError)(`POST body is expected to be object but received ${requestBodyTypeof}`, {
            extensions: {
                http: {
                    status: 400,
                },
            },
        });
    }
    return requestBody;
}
exports.parsePOSTJsonRequest = parsePOSTJsonRequest;
