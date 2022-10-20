import { errorRequest } from "./error-request";
import { wrapRequest } from "./wrap-request";
export const VERSION = "0.0.0-development";
export function retry(octokit, octokitOptions) {
    const state = Object.assign({
        enabled: true,
        retryAfterBaseValue: 1000,
        doNotRetry: [400, 401, 403, 404, 422],
        retries: 3,
    }, octokitOptions.retry);
    if (state.enabled) {
        octokit.hook.error("request", errorRequest.bind(null, octokit, state));
        octokit.hook.wrap("request", wrapRequest.bind(null, state));
    }
    return {
        retry: {
            retryRequest: (error, retries, retryAfter) => {
                error.request.request = Object.assign({}, error.request.request, {
                    retries: retries,
                    retryAfter: retryAfter,
                });
                return error;
            },
        },
    };
}
retry.VERSION = VERSION;
