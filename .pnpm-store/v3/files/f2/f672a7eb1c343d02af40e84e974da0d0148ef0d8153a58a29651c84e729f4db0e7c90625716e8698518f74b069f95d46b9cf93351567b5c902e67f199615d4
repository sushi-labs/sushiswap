import { Repeater } from '@repeaterjs/repeater';
import type { TypedEventTarget, EventAPI } from '@graphql-yoga/typed-event-target';
declare type PubSubPublishArgsByKey = {
    [key: string]: [] | [any] | [number | string, any];
};
export declare type PubSubEvent<TPubSubPublishArgsByKey extends PubSubPublishArgsByKey, TKey extends Extract<keyof TPubSubPublishArgsByKey, string>> = Event & {
    data?: TPubSubPublishArgsByKey[TKey][1] extends undefined ? TPubSubPublishArgsByKey[TKey][0] : TPubSubPublishArgsByKey[TKey][1];
};
export declare type PubSubEventTarget<TPubSubPublishArgsByKey extends PubSubPublishArgsByKey> = TypedEventTarget<PubSubEvent<TPubSubPublishArgsByKey, Extract<keyof TPubSubPublishArgsByKey, string>>>;
export declare type ChannelPubSubConfig<TPubSubPublishArgsByKey extends PubSubPublishArgsByKey> = {
    /**
     * The event target. If not specified an (in-memory) EventTarget will be created.
     * For multiple server replica or serverless environments a distributed EventTarget is recommended.
     *
     * An event dispatched on the event target MUST have a `data` property.
     */
    eventTarget?: PubSubEventTarget<TPubSubPublishArgsByKey>;
    /**
     * Event and EventTarget implementation.
     * Providing this is mandatory for a Node.js versions below 16.
     */
    event?: EventAPI;
};
export declare type PubSub<TPubSubPublishArgsByKey extends PubSubPublishArgsByKey> = {
    /**
     * Publish a value for a given topic.
     */
    publish<TKey extends Extract<keyof TPubSubPublishArgsByKey, string>>(routingKey: TKey, ...args: TPubSubPublishArgsByKey[TKey]): void;
    /**
     * Subscribe to a topic.
     */
    subscribe<TKey extends Extract<keyof TPubSubPublishArgsByKey, string>>(...[routingKey, id]: TPubSubPublishArgsByKey[TKey][1] extends undefined ? [TKey] : [TKey, TPubSubPublishArgsByKey[TKey][0]]): Repeater<TPubSubPublishArgsByKey[TKey][1] extends undefined ? TPubSubPublishArgsByKey[TKey][0] : TPubSubPublishArgsByKey[TKey][1]>;
};
/**
 * Utility for publishing and subscribing to events.
 */
export declare const createPubSub: <TPubSubPublishArgsByKey extends PubSubPublishArgsByKey>(config?: ChannelPubSubConfig<TPubSubPublishArgsByKey> | undefined) => PubSub<TPubSubPublishArgsByKey>;
export {};
