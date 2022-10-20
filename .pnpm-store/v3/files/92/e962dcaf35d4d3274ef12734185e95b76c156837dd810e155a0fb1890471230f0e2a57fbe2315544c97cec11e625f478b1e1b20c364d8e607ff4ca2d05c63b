import { parseRequest } from "./api-gateway-v2-parse-request";
import { sendResponse } from "./api-gateway-v2-send-response";
import { handleRequest } from "../handle-request";
import { onUnhandledRequestDefault } from "../on-unhandled-request-default";
async function onUnhandledRequestDefaultAWSAPIGatewayV2(event) {
    const request = parseRequest(event);
    const response = onUnhandledRequestDefault(request);
    return sendResponse(response);
}
export function createAWSLambdaAPIGatewayV2Handler(app, { pathPrefix, onUnhandledRequest = onUnhandledRequestDefaultAWSAPIGatewayV2, } = {}) {
    return async function (event) {
        const request = parseRequest(event);
        const response = await handleRequest(app, { pathPrefix }, request);
        return response ? sendResponse(response) : onUnhandledRequest(event);
    };
}
