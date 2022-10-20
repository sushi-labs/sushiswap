"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCheckGraphQLQueryParam = void 0;
const utils_1 = require("@graphql-tools/utils");
function useCheckGraphQLQueryParam() {
    return {
        onRequestParse() {
            return {
                onRequestParseDone({ params }) {
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
                    const queryParamType = typeof params.query;
                    if (queryParamType !== 'string') {
                        throw (0, utils_1.createGraphQLError)(`Expected "query" to be "string" but given "${queryParamType}".`, {
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
                },
            };
        },
    };
}
exports.useCheckGraphQLQueryParam = useCheckGraphQLQueryParam;
