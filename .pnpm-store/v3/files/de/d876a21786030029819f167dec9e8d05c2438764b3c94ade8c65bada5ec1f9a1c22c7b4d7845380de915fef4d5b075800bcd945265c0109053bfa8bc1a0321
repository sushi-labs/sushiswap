import { Repeater } from '@repeaterjs/repeater';
import { resolveGlobalConfig } from '@graphql-yoga/typed-event-target';
/**
 * Utility for publishing and subscribing to events.
 */
export const createPubSub = (config) => {
    var _a;
    const { Event, EventTarget } = resolveGlobalConfig(config === null || config === void 0 ? void 0 : config.event);
    const target = (_a = config === null || config === void 0 ? void 0 : config.eventTarget) !== null && _a !== void 0 ? _a : new EventTarget();
    return {
        publish(routingKey, ...args) {
            var _a;
            const payload = (_a = args[1]) !== null && _a !== void 0 ? _a : args[0];
            const topic = args[1] === undefined
                ? routingKey
                : `${routingKey}:${args[0]}`;
            const event = new Event(topic);
            event.data = payload;
            target.dispatchEvent(event);
        },
        subscribe(...[routingKey, id]) {
            const topic = id === undefined ? routingKey : `${routingKey}:${id}`;
            return new Repeater(function subscriptionRepeater(next, stop) {
                stop.then(function subscriptionRepeaterStopHandler() {
                    target.removeEventListener(topic, pubsubEventListener);
                });
                target.addEventListener(topic, pubsubEventListener);
                function pubsubEventListener(event) {
                    next(event.data);
                }
            });
        },
    };
};
