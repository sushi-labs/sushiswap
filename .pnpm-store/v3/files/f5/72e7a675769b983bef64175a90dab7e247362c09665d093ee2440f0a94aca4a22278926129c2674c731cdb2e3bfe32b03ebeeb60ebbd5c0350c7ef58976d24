"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePreventMutationViaGET = exports.assertMutationViaGet = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
function assertMutationViaGet(method, document, operationName) {
    const operation = document
        ? (0, graphql_1.getOperationAST)(document, operationName) ?? undefined
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
    if (operation.operation === 'mutation' && method === 'GET') {
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
}
exports.assertMutationViaGet = assertMutationViaGet;
function usePreventMutationViaGET() {
    return {
        onParse() {
            // We should improve this by getting Yoga stuff from the hook params directly instead of the context
            return ({ result, context: { request, params: { operationName }, }, }) => {
                // Run only if this is a Yoga request
                // the `request` might be missing when using graphql-ws for example
                // in which case throwing an error would abruptly close the socket
                if (!request) {
                    return;
                }
                if (result instanceof Error) {
                    if (result instanceof graphql_1.GraphQLError) {
                        result.extensions.http = {
                            status: 400,
                        };
                    }
                    throw result;
                }
                assertMutationViaGet(request.method, result, operationName);
            };
        },
    };
}
exports.usePreventMutationViaGET = usePreventMutationViaGET;
