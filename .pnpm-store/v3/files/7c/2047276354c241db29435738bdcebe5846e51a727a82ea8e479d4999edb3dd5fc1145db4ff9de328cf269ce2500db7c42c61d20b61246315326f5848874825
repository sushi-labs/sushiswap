"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCheckMethodForGraphQL = void 0;
const utils_1 = require("@graphql-tools/utils");
function useCheckMethodForGraphQL() {
    return {
        onRequest({ request }) {
            if (request.method !== 'GET' && request.method !== 'POST') {
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
