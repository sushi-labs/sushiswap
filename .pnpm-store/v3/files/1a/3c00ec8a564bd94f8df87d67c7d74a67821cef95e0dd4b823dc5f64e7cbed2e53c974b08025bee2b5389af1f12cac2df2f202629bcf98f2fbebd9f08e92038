import { GraphQLResolveInfo } from 'graphql';
export declare const defaultSyncFetch: SyncFetchFn;
export declare type SyncFetchFn = (url: string, init?: RequestInit, context?: any, info?: GraphQLResolveInfo) => SyncResponse;
export declare type SyncResponse = Omit<Response, 'json' | 'text'> & {
    json: () => any;
    text: () => string;
};
