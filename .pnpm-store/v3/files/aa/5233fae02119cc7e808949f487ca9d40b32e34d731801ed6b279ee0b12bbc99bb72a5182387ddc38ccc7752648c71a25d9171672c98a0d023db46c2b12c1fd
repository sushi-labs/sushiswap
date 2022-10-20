import SafeEventEmitter from "@metamask/safe-event-emitter";
import { Web3Provider } from "./Web3Provider";
export interface SubscriptionResult {
    result?: unknown;
}
export interface SubscriptionNotification {
    method: string;
    params: {
        subscription: string;
        result: unknown;
    };
}
export declare class SubscriptionManager {
    private readonly subscriptionMiddleware;
    readonly events: SafeEventEmitter;
    constructor(provider: Web3Provider);
    handleRequest(request: {
        method: string;
        params: any[];
    }): Promise<SubscriptionResult>;
    destroy(): void;
}
