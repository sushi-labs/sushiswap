"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionManager = void 0;
const PollingBlockTracker = require("eth-block-tracker");
const createSubscriptionManager = require("eth-json-rpc-filters/subscriptionManager");
const noop = () => { };
class SubscriptionManager {
    constructor(provider) {
        const blockTracker = new PollingBlockTracker({
            provider,
            pollingInterval: 15 * 1000,
            setSkipCacheFlag: true,
        });
        const { events, middleware } = createSubscriptionManager({
            blockTracker,
            provider,
        });
        this.events = events;
        this.subscriptionMiddleware = middleware;
    }
    async handleRequest(request) {
        const result = {};
        await this.subscriptionMiddleware(request, result, noop, noop);
        return result;
    }
    destroy() {
        this.subscriptionMiddleware.destroy();
    }
}
exports.SubscriptionManager = SubscriptionManager;
