"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCheckMethodForGraphQL = exports.isValidMethodForGraphQL = void 0;
const utils_1 = require("@graphql-tools/utils");
function isValidMethodForGraphQL(method) {
    return method === 'GET' || method === 'POST';
}
exports.isValidMethodForGraphQL = isValidMethodForGraphQL;
function useCheckMethodForGraphQL() {
    return {
        onRequest({ request }) {
            if (!isValidMethodForGraphQL(request.method)) {
                throw (0, utils_1.createGraphQLError)('GraphQL only supports GET and POST requests.', {
                    extensions: {
                        http: {
                            status: 405,
                            headers: {
                                Allow: 'GET, POST',
                            },
                        },
                    },
                });
            }
        },
    };
}
exports.useCheckMethodForGraphQL = useCheckMethodForGraphQL;
