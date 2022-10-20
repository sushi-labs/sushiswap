import CachePolicy from 'http-cache-semantics';
export interface FetchacheCacheEntry {
    policy: CachePolicy.CachePolicyObject;
    body: string;
}
declare type FetchFn = WindowOrWorkerGlobalScope['fetch'];
export interface FetchacheOptions {
    fetch: FetchFn;
    Request: typeof Request;
    Response: typeof Response;
    cache: KeyValueCache<FetchacheCacheEntry>;
}
export declare function fetchFactory({ fetch, Request, Response, cache }: FetchacheOptions): FetchFn;
export interface KeyValueCacheSetOptions {
    /**
     * Specified in **seconds**, the time-to-live (TTL) value limits the lifespan
     * of the data being stored in the cache.
     */
    ttl?: number | null;
}
export interface KeyValueCache<V = any> {
    get(key: string): Promise<V | undefined>;
    set(key: string, value: V, options?: KeyValueCacheSetOptions): Promise<void>;
    delete(key: string): Promise<boolean | void>;
}
export {};
