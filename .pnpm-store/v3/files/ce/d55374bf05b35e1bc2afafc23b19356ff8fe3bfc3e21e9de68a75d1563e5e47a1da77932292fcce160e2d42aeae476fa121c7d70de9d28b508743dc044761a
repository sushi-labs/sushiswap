"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePreventMutationViaGET = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
function usePreventMutationViaGET() {
    return {
        onParse() {
            // We should improve this by getting Yoga stuff from the hook params directly instead of the context
            return ({ result, context: { request, operationName } }) => {
                var _a;
                if (result instanceof Error) {
                    if (result instanceof graphql_1.GraphQLError) {
                        result.extensions.http = {
                            status: 400,
                        };
                    }
                    throw result;
                }
                const operation = result
                    ? (_a = (0, graphql_1.getOperationAST)(result, operationName)) !== null && _a !== void 0 ? _a : undefined
                    : undefined;
                if (!operation) {
                    throw (0, utils_1.createGraphQLError)('Could not determine what operation to execute.', {
                        extensions: {
                            http: {
                                status: 400,
                            },
                        },
                    });
                }
                if (operation.operation === 'mutation' && request.method === 'GET') {
                    throw (0, utils_1.createGraphQLError)('Can only perform a mutation operation from a POST request.', {
                        extensions: {
                            http: {
                                status: 405,
                                headers: {
                                    Allow: 'POST',
                                },
                            },
                        },
                    });
                }
            };
        },
    };
}
exports.usePreventMutationViaGET = usePreventMutationViaGET;
