import { HookName, AllHooks, MeshPubSub } from '@graphql-mesh/types';
declare type Listener<THookName extends HookName = HookName> = (data: AllHooks[THookName]) => void;
export declare class PubSub implements MeshPubSub {
    private subIdListenerMap;
    private listenerEventMap;
    private eventNameListenersMap;
    getEventNames(): Iterable<string>;
    publish<THook extends HookName>(triggerName: THook, detail: AllHooks[THook]): void;
    subscribe<THook extends HookName>(triggerName: THook, onMessage: Listener<THook>): number;
    unsubscribe(subId: number): void;
    asyncIterator<THook extends HookName>(triggerName: THook): AsyncIterable<AllHooks[THook]>;
}
export {};
