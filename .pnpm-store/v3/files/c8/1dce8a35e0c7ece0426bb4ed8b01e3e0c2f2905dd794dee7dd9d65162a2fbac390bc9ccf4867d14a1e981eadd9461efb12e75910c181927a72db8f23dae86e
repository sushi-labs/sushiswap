import { Repeater } from '@repeaterjs/repeater';
import { CustomEvent, EventTarget } from '@whatwg-node/events';
/**
 * Utility for publishing and subscribing to events.
 */
export const createPubSub = (config) => {
    const target = config?.eventTarget ??
        new EventTarget();
    return {
        publish(routingKey, ...args) {
            const payload = args[1] ?? args[0];
            const topic = args[1] === undefined
                ? routingKey
                : `${routingKey}:${args[0]}`;
            const event = new CustomEvent(topic, {
                detail: payload,
            });
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
                    next(event.detail);
                }
            });
        },
    };
};
