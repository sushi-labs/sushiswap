import { parseRequest } from "./parse-request";
import { sendResponse } from "./send-response";
import { handleRequest } from "../handle-request";
import { onUnhandledRequestDefault } from "../on-unhandled-request-default";
async function onUnhandledRequestDefaultWebWorker(request) {
    const octokitRequest = parseRequest(request);
    const octokitResponse = onUnhandledRequestDefault(octokitRequest);
    return sendResponse(octokitResponse);
}
export function createWebWorkerHandler(app, { pathPrefix, onUnhandledRequest = onUnhandledRequestDefaultWebWorker, } = {}) {
    return async function (request) {
        const octokitRequest = parseRequest(request);
        const octokitResponse = await handleRequest(app, { pathPrefix }, octokitRequest);
        return octokitResponse
            ? sendResponse(octokitResponse)
            : await onUnhandledRequest(request);
    };
}
/** @deprecated */
export function createCloudflareHandler(...args) {
    args[0].octokit.log.warn("[@octokit/oauth-app] `createCloudflareHandler` is deprecated, use `createWebWorkerHandler` instead");
    return createWebWorkerHandler(...args);
}
