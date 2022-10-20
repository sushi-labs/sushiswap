import { createGraphQLError } from '@graphql-tools/utils';
export function useCheckMethodForGraphQL() {
    return {
        onRequest({ request }) {
            if (request.method !== 'GET' && request.method !== 'POST') {
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
