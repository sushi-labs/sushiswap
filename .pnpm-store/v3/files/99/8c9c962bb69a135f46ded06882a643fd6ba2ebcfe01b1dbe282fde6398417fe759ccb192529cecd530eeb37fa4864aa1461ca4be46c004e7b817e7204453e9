import { parseRequest } from "./parse-request";
import { sendResponse } from "./send-response";
import { onUnhandledRequestDefault } from "../on-unhandled-request-default";
import { handleRequest } from "../handle-request";
function onUnhandledRequestDefaultNode(request, response) {
    const octokitRequest = parseRequest(request);
    const octokitResponse = onUnhandledRequestDefault(octokitRequest);
    sendResponse(octokitResponse, response);
}
export function createNodeMiddleware(app, { pathPrefix, onUnhandledRequest = onUnhandledRequestDefaultNode, } = {}) {
    return async function (request, response, next) {
        const octokitRequest = parseRequest(request);
        const octokitResponse = await handleRequest(app, { pathPrefix }, octokitRequest);
        if (octokitResponse) {
            sendResponse(octokitResponse, response);
        }
        else if (typeof next === "function") {
            next();
        }
        else {
            onUnhandledRequest(request, response);
        }
    };
}
