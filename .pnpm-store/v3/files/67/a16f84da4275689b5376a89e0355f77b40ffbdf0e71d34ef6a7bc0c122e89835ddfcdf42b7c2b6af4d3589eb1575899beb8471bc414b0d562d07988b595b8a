"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCheckGraphQLQueryParams = exports.isValidGraphQLParams = exports.checkGraphQLQueryParams = exports.assertInvalidParams = void 0;
const utils_1 = require("@graphql-tools/utils");
const EXPECTED_PARAMS = ['query', 'variables', 'operationName', 'extensions'];
function assertInvalidParams(params) {
    for (const paramKey in params) {
        if (!EXPECTED_PARAMS.includes(paramKey)) {
            throw (0, utils_1.createGraphQLError)(`Unexpected parameter "${paramKey}" in the request body.`, {
                extensions: {
                    http: {
                        status: 400,
                    },
                },
            });
        }
    }
}
exports.assertInvalidParams = assertInvalidParams;
function checkGraphQLQueryParams(params) {
    if (!isObject(params)) {
        throw (0, utils_1.createGraphQLError)(`Expected params to be an object but given ${extendedTypeof(params)}.`, {
            extensions: {
                http: {
                    status: 400,
                    headers: {
                        Allow: 'GET, POST',
                    },
                },
            },
        });
    }
    assertInvalidParams(params);
    if (params.query == null) {
        throw (0, utils_1.createGraphQLError)('Must provide query string.', {
            extensions: {
                http: {
                    status: 400,
                    headers: {
                        Allow: 'GET, POST',
                    },
                },
            },
        });
    }
    const queryType = extendedTypeof(params.query);
    if (queryType !== 'string') {
        throw (0, utils_1.createGraphQLError)(`Expected "query" param to be a string, but given ${queryType}.`, {
            extensions: {
                http: {
                    status: 400,
                    headers: {
                        Allow: 'GET, POST',
                    },
                },
            },
        });
    }
    const variablesParamType = extendedTypeof(params.variables);
    if (!['object', 'null', 'undefined'].includes(variablesParamType)) {
        throw (0, utils_1.createGraphQLError)(`Expected "variables" param to be empty or an object, but given ${variablesParamType}.`, {
            extensions: {
                http: {
                    status: 400,
                    headers: {
                        Allow: 'GET, POST',
                    },
                },
            },
        });
    }
    const extensionsParamType = extendedTypeof(params.extensions);
    if (!['object', 'null', 'undefined'].includes(extensionsParamType)) {
        throw (0, utils_1.createGraphQLError)(`Expected "extensions" param to be empty or an object, but given ${extensionsParamType}.`, {
            extensions: {
                http: {
                    status: 400,
                    headers: {
                        Allow: 'GET, POST',
                    },
                },
            },
        });
    }
    return params;
}
exports.checkGraphQLQueryParams = checkGraphQLQueryParams;
function isValidGraphQLParams(params) {
    try {
        checkGraphQLQueryParams(params);
        return true;
    }
    catch {
        return false;
    }
}
exports.isValidGraphQLParams = isValidGraphQLParams;
function useCheckGraphQLQueryParams() {
    return {
        onParams({ params }) {
            checkGraphQLQueryParams(params);
        },
    };
}
exports.useCheckGraphQLQueryParams = useCheckGraphQLQueryParams;
function extendedTypeof(val) {
    if (val === null) {
        return 'null';
    }
    if (Array.isArray(val)) {
        return 'array';
    }
    return typeof val;
}
function isObject(val) {
    return extendedTypeof(val) === 'object';
}
