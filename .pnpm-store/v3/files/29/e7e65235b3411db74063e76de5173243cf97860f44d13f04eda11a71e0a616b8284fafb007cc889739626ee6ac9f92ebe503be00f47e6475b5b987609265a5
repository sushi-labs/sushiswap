"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHealthCheck = void 0;
const utils_1 = require("@graphql-tools/utils");
function useHealthCheck(options) {
    const id = (options === null || options === void 0 ? void 0 : options.id) || Date.now().toString();
    const logger = (options === null || options === void 0 ? void 0 : options.logger) || console;
    return {
        async onRequest({ request, endResponse, fetchAPI }) {
            const requestPath = request.url.split('?')[0];
            if (requestPath.endsWith('/health')) {
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
            else if (requestPath.endsWith('/readiness')) {
                logger.debug(`Responding Readiness Check`);
                const readinessResponse = await fetchAPI.fetch(request.url.replace('/readiness', '/health'));
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
                    throw (0, utils_1.createGraphQLError)(`Readiness check failed with status ${readinessResponse.status}`);
                }
            }
        },
    };
}
exports.useHealthCheck = useHealthCheck;
