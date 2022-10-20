import { createGraphQLError } from '@graphql-tools/utils';
export function isValidMethodForGraphQL(method) {
    return method === 'GET' || method === 'POST';
}
export function useCheckMethodForGraphQL() {
    return {
        onRequest({ request }) {
            if (!isValidMethodForGraphQL(request.method)) {
                throw createGraphQLError('GraphQL only supports GET and POST requests.', {
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
