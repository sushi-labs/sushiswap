import { getMissingHeaders } from "./get-missing-headers";
import { getPayload } from "./get-payload";
export async function middleware(webhooks, options, request, response, next) {
    let pathname;
    try {
        pathname = new URL(request.url, "http://localhost").pathname;
    }
    catch (error) {
        response.writeHead(422, {
            "content-type": "application/json",
        });
        response.end(JSON.stringify({
            error: `Request URL could not be parsed: ${request.url}`,
        }));
        return;
    }
    const isUnknownRoute = request.method !== "POST" || pathname !== options.path;
    const isExpressMiddleware = typeof next === "function";
    if (isUnknownRoute) {
        if (isExpressMiddleware) {
            return next();
        }
        else {
            return options.onUnhandledRequest(request, response);
        }
    }
    const missingHeaders = getMissingHeaders(request).join(", ");
    if (missingHeaders) {
        response.writeHead(400, {
            "content-type": "application/json",
        });
        response.end(JSON.stringify({
            error: `Required headers missing: ${missingHeaders}`,
        }));
        return;
    }
    const eventName = request.headers["x-github-event"];
    const signatureSHA256 = request.headers["x-hub-signature-256"];
    const id = request.headers["x-github-delivery"];
    options.log.debug(`${eventName} event received (id: ${id})`);
    // GitHub will abort the request if it does not receive a response within 10s
    // See https://github.com/octokit/webhooks.js/issues/185
    let didTimeout = false;
    const timeout = setTimeout(() => {
        didTimeout = true;
        response.statusCode = 202;
        response.end("still processing\n");
    }, 9000).unref();
    try {
        const payload = await getPayload(request);
        await webhooks.verifyAndReceive({
            id: id,
            name: eventName,
            payload: payload,
            signature: signatureSHA256,
        });
        clearTimeout(timeout);
        if (didTimeout)
            return;
        response.end("ok\n");
    }
    catch (error) {
        clearTimeout(timeout);
        if (didTimeout)
            return;
        const err = Array.from(error)[0];
        const errorMessage = err.message
            ? `${err.name}: ${err.message}`
            : "Error: An Unspecified error occurred";
        response.statusCode = typeof err.status !== "undefined" ? err.status : 500;
        options.log.error(error);
        response.end(JSON.stringify({
            error: errorMessage,
        }));
    }
}
