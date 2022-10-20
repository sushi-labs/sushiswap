import { Plugin as EnvelopPlugin, PromiseOrValue } from '@envelop/core';
import { ExecutionResult } from 'graphql';
import { ExecutionPatchResult, FetchAPI, GraphQLParams } from '../types.js';
export declare type Plugin<PluginContext extends Record<string, any> = {}, TServerContext = {}, TUserContext = {}> = EnvelopPlugin<PluginContext> & {
    /**
     * Use this hook with your own risk. It is still experimental and may change in the future.
     * @internal
     */
    onRequest?: OnRequestHook<TServerContext>;
    /**
     * Use this hook with your own risk. It is still experimental and may change in the future.
     * @internal
     */
    onRequestParse?: OnRequestParseHook;
    /**
     * Use this hook with your own risk. It is still experimental and may change in the future.
     * @internal
     */
    onResultProcess?: OnResultProcess;
    /**
     * Use this hook with your own risk. It is still experimental and may change in the future.
     * @internal
     */
    onResponse?: OnResponseHook<TServerContext>;
};
export declare type OnRequestHook<TServerContext> = (payload: OnRequestEventPayload<TServerContext>) => PromiseOrValue<void>;
export interface OnRequestEventPayload<TServerContext> {
    request: Request;
    serverContext: TServerContext | undefined;
    fetchAPI: FetchAPI;
    endResponse(response: Response): void;
}
export declare type OnRequestParseHook = (payload: OnRequestParseEventPayload) => PromiseOrValue<void | OnRequestParseHookResult>;
export declare type RequestParser = (request: Request) => PromiseOrValue<GraphQLParams>;
export interface OnRequestParseEventPayload {
    request: Request;
    requestParser: RequestParser | undefined;
    setRequestParser: (parser: RequestParser) => void;
}
export declare type OnRequestParseHookResult = {
    onRequestParseDone?: OnRequestParseDoneHook;
};
export declare type OnRequestParseDoneHook = (payload: OnRequestParseDoneEventPayload) => PromiseOrValue<void>;
export interface OnRequestParseDoneEventPayload {
    params: GraphQLParams;
    setParams: (params: GraphQLParams) => void;
}
export declare type OnResultProcess = (payload: OnResultProcessEventPayload) => PromiseOrValue<void>;
export declare type ResultProcessorInput = PromiseOrValue<ExecutionResult | AsyncIterable<ExecutionResult | ExecutionPatchResult>>;
export declare type ResultProcessor = (result: ResultProcessorInput, fetchAPI: FetchAPI) => PromiseOrValue<Response>;
export interface OnResultProcessEventPayload {
    request: Request;
    result: ResultProcessorInput;
    resultProcessor?: ResultProcessor;
    setResultProcessor(resultProcessor: ResultProcessor): void;
}
export declare type OnResponseHook<TServerContext> = (payload: OnResponseEventPayload<TServerContext>) => PromiseOrValue<void>;
export interface OnResponseEventPayload<TServerContext> {
    request: Request;
    serverContext: TServerContext | undefined;
    response: Response;
}
