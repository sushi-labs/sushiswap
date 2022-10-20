import { Octokit } from "@octokit/core";
import Bottleneck from "bottleneck";
declare module "@octokit/core/dist-types/types.d" {
    interface OctokitOptions {
        throttle?: ThrottlingOptions;
    }
}
declare type LimitHandler = (retryAfter?: number, options?: object, octokit?: Octokit) => void;
export declare type AbuseLimitHandler = {
    /**
     * @deprecated "[@octokit/plugin-throttling] `onAbuseLimit()` is deprecated and will be removed in a future release of `@octokit/plugin-throttling`, please use the `onSecondaryRateLimit` handler instead"
     */
    onAbuseLimit: LimitHandler;
    onSecondaryRateLimit?: never;
};
export declare type SecondaryLimitHandler = {
    /**
     * @deprecated "[@octokit/plugin-throttling] `onAbuseLimit()` is deprecated and will be removed in a future release of `@octokit/plugin-throttling`, please use the `onSecondaryRateLimit` handler instead"
     */
    onAbuseLimit?: never;
    onSecondaryRateLimit: LimitHandler;
};
export declare type ThrottlingOptionsBase = {
    enabled?: boolean;
    Bottleneck?: typeof Bottleneck;
    id?: string;
    timeout?: number;
    connection?: Bottleneck.RedisConnection | Bottleneck.IORedisConnection;
    minimumSecondaryRateRetryAfter?: number;
    retryAfterBaseValue?: number;
    write?: Bottleneck.Group;
    search?: Bottleneck.Group;
    notifications?: Bottleneck.Group;
    onRateLimit: LimitHandler;
};
export declare type ThrottlingOptions = ThrottlingOptionsBase & (AbuseLimitHandler | SecondaryLimitHandler);
export declare type Groups = {
    global?: Bottleneck.Group;
    write?: Bottleneck.Group;
    search?: Bottleneck.Group;
    notifications?: Bottleneck.Group;
};
export {};
