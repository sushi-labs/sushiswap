import { BatchRequestDocument, BatchRequestsOptions, RawRequestOptions, RequestDocument, RequestOptions, BatchRequestsExtendedOptions, RawRequestExtendedOptions, RequestExtendedOptions, Variables } from './types';
import * as Dom from './types.dom';
export declare function parseRequestArgs<V = Variables>(documentOrOptions: RequestDocument | RequestOptions<V>, variables?: V, requestHeaders?: Dom.RequestInit['headers']): RequestOptions<V>;
export declare function parseRawRequestArgs<V = Variables>(queryOrOptions: string | RawRequestOptions<V>, variables?: V, requestHeaders?: Dom.RequestInit['headers']): RawRequestOptions<V>;
export declare function parseBatchRequestArgs<V = Variables>(documentsOrOptions: BatchRequestDocument<V>[] | BatchRequestsOptions<V>, requestHeaders?: Dom.RequestInit['headers']): BatchRequestsOptions<V>;
export declare function parseRequestExtendedArgs<V = Variables>(urlOrOptions: string | RequestExtendedOptions<V>, document?: RequestDocument, variables?: V, requestHeaders?: Dom.RequestInit['headers']): RequestExtendedOptions<V>;
export declare function parseRawRequestExtendedArgs<V = Variables>(urlOrOptions: string | RawRequestExtendedOptions<V>, query?: string, variables?: V, requestHeaders?: Dom.RequestInit['headers']): RawRequestExtendedOptions<V>;
export declare function parseBatchRequestsExtendedArgs<V = Variables>(urlOrOptions: string | BatchRequestsExtendedOptions<V>, documents?: BatchRequestDocument<V>[], requestHeaders?: Dom.RequestInit['headers']): BatchRequestsExtendedOptions<V>;
