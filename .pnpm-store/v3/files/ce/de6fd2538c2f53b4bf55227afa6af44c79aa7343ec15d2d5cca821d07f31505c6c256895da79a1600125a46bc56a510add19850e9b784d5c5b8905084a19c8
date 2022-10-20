import { createGraphQLError } from '@graphql-tools/utils';
export function useHealthCheck({ id = Date.now().toString(), logger = console, healthCheckEndpoint = '/health', readinessCheckEndpoint = '/readiness', } = {}) {
    return {
        async onRequest({ request, endResponse, fetchAPI, url }) {
            const { pathname: requestPath } = url;
            if (requestPath === healthCheckEndpoint) {
                logger.debug(`Responding Health Check`);
                const response = new fetchAPI.Response(JSON.stringify({
                    message: 'alive',
                }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'x-yoga-id': id,
                    },
                });
                endResponse(response);
            }
            else if (requestPath === readinessCheckEndpoint) {
                logger.debug(`Responding Readiness Check`);
                const readinessResponse = await fetchAPI.fetch(request.url.replace(readinessCheckEndpoint, healthCheckEndpoint));
                const { message } = await readinessResponse.json();
                if (readinessResponse.status === 200 &&
                    readinessResponse.headers.get('x-yoga-id') === id &&
                    message === 'alive') {
                    const response = new fetchAPI.Response(JSON.stringify({
                        message: 'ready',
                    }), {
                        status: 200,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    endResponse(response);
                }
                else {
                    throw createGraphQLError(`Readiness check failed with status ${readinessResponse.status}`);
                }
            }
        },
    };
}
