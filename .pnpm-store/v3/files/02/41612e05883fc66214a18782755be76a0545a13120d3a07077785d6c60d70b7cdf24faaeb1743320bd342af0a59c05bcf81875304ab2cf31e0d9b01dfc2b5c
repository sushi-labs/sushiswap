// @ts-expect-error
import BottleneckLight from "bottleneck/light";
import { VERSION } from "./version";
import { wrapRequest } from "./wrap-request";
import triggersNotificationPaths from "./generated/triggers-notification-paths";
import { routeMatcher } from "./route-matcher";
// Workaround to allow tests to directly access the triggersNotification function.
const regex = routeMatcher(triggersNotificationPaths);
const triggersNotification = regex.test.bind(regex);
const groups = {};
// @ts-expect-error
const createGroups = function (Bottleneck, common) {
    groups.global = new Bottleneck.Group({
        id: "octokit-global",
        maxConcurrent: 10,
        ...common,
    });
    groups.search = new Bottleneck.Group({
        id: "octokit-search",
        maxConcurrent: 1,
        minTime: 2000,
        ...common,
    });
    groups.write = new Bottleneck.Group({
        id: "octokit-write",
        maxConcurrent: 1,
        minTime: 1000,
        ...common,
    });
    groups.notifications = new Bottleneck.Group({
        id: "octokit-notifications",
        maxConcurrent: 1,
        minTime: 3000,
        ...common,
    });
};
export function throttling(octokit, octokitOptions) {
    const { enabled = true, Bottleneck = BottleneckLight, id = "no-id", timeout = 1000 * 60 * 2, // Redis TTL: 2 minutes
    connection, } = octokitOptions.throttle || {};
    if (!enabled) {
        return {};
    }
    const common = { connection, timeout };
    if (groups.global == null) {
        createGroups(Bottleneck, common);
    }
    const state = Object.assign({
        clustering: connection != null,
        triggersNotification,
        minimumSecondaryRateRetryAfter: 5,
        retryAfterBaseValue: 1000,
        retryLimiter: new Bottleneck(),
        id,
        ...groups,
    }, octokitOptions.throttle);
    const isUsingDeprecatedOnAbuseLimitHandler = typeof state.onAbuseLimit === "function" && state.onAbuseLimit;
    if (typeof (isUsingDeprecatedOnAbuseLimitHandler
        ? state.onAbuseLimit
        : state.onSecondaryRateLimit) !== "function" ||
        typeof state.onRateLimit !== "function") {
        throw new Error(`octokit/plugin-throttling error:
        You must pass the onSecondaryRateLimit and onRateLimit error handlers.
        See https://github.com/octokit/rest.js#throttling

        const octokit = new Octokit({
          throttle: {
            onSecondaryRateLimit: (retryAfter, options) => {/* ... */},
            onRateLimit: (retryAfter, options) => {/* ... */}
          }
        })
    `);
    }
    const events = {};
    const emitter = new Bottleneck.Events(events);
    // @ts-expect-error
    events.on("secondary-limit", isUsingDeprecatedOnAbuseLimitHandler
        ? function (...args) {
            octokit.log.warn("[@octokit/plugin-throttling] `onAbuseLimit()` is deprecated and will be removed in a future release of `@octokit/plugin-throttling`, please use the `onSecondaryRateLimit` handler instead");
            return state.onAbuseLimit(...args);
        }
        : state.onSecondaryRateLimit);
    // @ts-expect-error
    events.on("rate-limit", state.onRateLimit);
    // @ts-expect-error
    events.on("error", (e) => octokit.log.warn("Error in throttling-plugin limit handler", e));
    // @ts-expect-error
    state.retryLimiter.on("failed", async function (error, info) {
        const options = info.args[info.args.length - 1];
        const { pathname } = new URL(options.url, "http://github.test");
        const shouldRetryGraphQL = pathname.startsWith("/graphql") && error.status !== 401;
        if (!(shouldRetryGraphQL || error.status === 403)) {
            return;
        }
        const retryCount = ~~options.request.retryCount;
        options.request.retryCount = retryCount;
        const { wantRetry, retryAfter = 0 } = await (async function () {
            if (/\bsecondary rate\b/i.test(error.message)) {
                // The user has hit the secondary rate limit. (REST and GraphQL)
                // https://docs.github.com/en/rest/overview/resources-in-the-rest-api#secondary-rate-limits
                // The Retry-After header can sometimes be blank when hitting a secondary rate limit,
                // but is always present after 2-3s, so make sure to set `retryAfter` to at least 5s by default.
                const retryAfter = Math.max(~~error.response.headers["retry-after"], state.minimumSecondaryRateRetryAfter);
                const wantRetry = await emitter.trigger("secondary-limit", retryAfter, options, octokit);
                return { wantRetry, retryAfter };
            }
            if (error.response.headers != null &&
                error.response.headers["x-ratelimit-remaining"] === "0") {
                // The user has used all their allowed calls for the current time period (REST and GraphQL)
                // https://docs.github.com/en/rest/reference/rate-limit (REST)
                // https://docs.github.com/en/graphql/overview/resource-limitations#rate-limit (GraphQL)
                const rateLimitReset = new Date(~~error.response.headers["x-ratelimit-reset"] * 1000).getTime();
                const retryAfter = Math.max(Math.ceil((rateLimitReset - Date.now()) / 1000), 0);
                const wantRetry = await emitter.trigger("rate-limit", retryAfter, options, octokit);
                return { wantRetry, retryAfter };
            }
            return {};
        })();
        if (wantRetry) {
            options.request.retryCount++;
            return retryAfter * state.retryAfterBaseValue;
        }
    });
    octokit.hook.wrap("request", wrapRequest.bind(null, state));
    return {};
}
throttling.VERSION = VERSION;
throttling.triggersNotification = triggersNotification;
