"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLimitBatching = void 0;
const graphql_1 = require("graphql");
function useLimitBatching(limit) {
    return {
        onRequestParse() {
            return {
                onRequestParseDone({ requestParserResult }) {
                    if (Array.isArray(requestParserResult)) {
                        if (!limit) {
                            throw new graphql_1.GraphQLError(`Batching is not supported.`, {
                                extensions: {
                                    http: {
                                        status: 400,
                                    },
                                },
                            });
                        }
                        if (requestParserResult.length > limit) {
                            throw new graphql_1.GraphQLError(`Batching is limited to ${limit} operations per request.`, {
                                extensions: {
                                    http: {
                                        status: 413,
                                    },
                                },
                            });
                        }
                    }
                },
            };
        },
    };
}
exports.useLimitBatching = useLimitBatching;
