"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPubSub = void 0;
const repeater_1 = require("@repeaterjs/repeater");
const events_1 = require("@whatwg-node/events");
/**
 * Utility for publishing and subscribing to events.
 */
const createPubSub = (config) => {
    const target = config?.eventTarget ??
        new events_1.EventTarget();
    return {
        publish(routingKey, ...args) {
            const payload = args[1] ?? args[0];
            const topic = args[1] === undefined
                ? routingKey
                : `${routingKey}:${args[0]}`;
            const event = new events_1.CustomEvent(topic, {
                detail: payload,
            });
            target.dispatchEvent(event);
        },
        subscribe(...[routingKey, id]) {
            const topic = id === undefined ? routingKey : `${routingKey}:${id}`;
            return new repeater_1.Repeater(function subscriptionRepeater(next, stop) {
                stop.then(function subscriptionRepeaterStopHandler() {
                    target.removeEventListener(topic, pubsubEventListener);
                });
                target.addEventListener(topic, pubsubEventListener);
                function pubsubEventListener(event) {
                    next(event.detail);
                }
            });
        },
    };
};
exports.createPubSub = createPubSub;
