import { PromiseOrValue } from '@envelop/core';
import { YogaLogger } from '../logger.js';
import { Plugin } from './types.js';
export declare function shouldRenderGraphiQL({ headers, method }: Request): boolean;
export declare type GraphiQLOptions = {
    /**
     * An optional GraphQL string to use when no query is provided and no stored
     * query exists from a previous session.  If undefined is provided, GraphiQL
     * will use its own default query.
     */
    defaultQuery?: string;
    /**
     * Whether to open the variable editor by default. Defaults to `true`.
     */
    defaultVariableEditorOpen?: boolean;
    /**
     * The endpoint requests should be sent. Defaults to `"/graphql"`.
     */
    endpoint?: string;
    /**
     * The initial headers to render inside the header editor. Defaults to `"{}"`.
     */
    headers?: string;
    /**
     * More info there: https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
     */
    credentials?: RequestCredentials;
    /**
     * Whether the header editor is enabled. Defaults to `true`.
     */
    headerEditorEnabled?: boolean;
    /**
     * The title to display at the top of the page. Defaults to `"YogaGraphiQL"`.
     */
    title?: string;
    /**
     * Protocol for subscriptions
     */
    subscriptionsProtocol?: 'SSE' | 'WS' | 'LEGACY_WS';
    /**
     * Extra headers you always want to pass with users' headers input
     */
    additionalHeaders?: Record<string, string>;
};
export declare const renderGraphiQL: (opts?: GraphiQLOptions) => string;
export declare type GraphiQLOptionsFactory<TServerContext> = (request: Request, ...args: {} extends TServerContext ? [serverContext?: TServerContext | undefined] : [serverContext: TServerContext]) => PromiseOrValue<GraphiQLOptions | boolean>;
export declare type GraphiQLOptionsOrFactory<TServerContext> = GraphiQLOptions | GraphiQLOptionsFactory<TServerContext> | boolean;
export interface GraphiQLPluginConfig<TServerContext> {
    endpoint?: string;
    options?: GraphiQLOptionsOrFactory<TServerContext>;
    render?(options?: GraphiQLOptions): PromiseOrValue<BodyInit>;
    logger?: YogaLogger;
}
export declare function useGraphiQL<TServerContext>(config?: GraphiQLPluginConfig<TServerContext>): Plugin<{}, TServerContext>;
