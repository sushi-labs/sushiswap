import { createNodeMiddleware as oauthNodeMiddleware } from "@octokit/oauth-app";
import { createNodeMiddleware as webhooksNodeMiddleware } from "@octokit/webhooks";
import { onUnhandledRequestDefault } from "./on-unhandled-request-default";
function noop() { }
export function createNodeMiddleware(app, options = {}) {
    const log = Object.assign({
        debug: noop,
        info: noop,
        warn: console.warn.bind(console),
        error: console.error.bind(console),
    }, options.log);
    const optionsWithDefaults = {
        onUnhandledRequest: onUnhandledRequestDefault,
        pathPrefix: "/api/github",
        ...options,
        log,
    };
    const webhooksMiddleware = webhooksNodeMiddleware(app.webhooks, {
        path: optionsWithDefaults.pathPrefix + "/webhooks",
        log,
        onUnhandledRequest: optionsWithDefaults.onUnhandledRequest,
    });
    const oauthMiddleware = oauthNodeMiddleware(app.oauth, {
        pathPrefix: optionsWithDefaults.pathPrefix + "/oauth",
        onUnhandledRequest: optionsWithDefaults.onUnhandledRequest,
    });
    return middleware.bind(null, optionsWithDefaults, {
        webhooksMiddleware,
        oauthMiddleware,
    });
}
export async function middleware(options, { webhooksMiddleware, oauthMiddleware }, request, response, next) {
    const { pathname } = new URL(request.url, "http://localhost");
    if (pathname === `${options.pathPrefix}/webhooks`) {
        return webhooksMiddleware(request, response, next);
    }
    if (pathname.startsWith(`${options.pathPrefix}/oauth/`)) {
        return oauthMiddleware(request, response, next);
    }
    const isExpressMiddleware = typeof next === "function";
    if (isExpressMiddleware) {
        // @ts-ignore `next` must be a function as we check two lines above
        return next();
    }
    return options.onUnhandledRequest(request, response);
}
