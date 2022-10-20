export declare const defaultSyncFetch: SyncFetchFn;
export declare type SyncFetchFn = (input: RequestInfo, init?: RequestInit) => SyncResponse;
export declare type SyncResponse = Omit<Response, 'json' | 'text'> & {
    json: () => any;
    text: () => string;
};
