import { PromiseOrValue } from '@envelop/core';
import { Plugin } from './types.js';
export declare type CORSOptions = {
    origin?: string[] | string;
    methods?: string[];
    allowedHeaders?: string[];
    exposedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
} | false;
export declare type CORSPluginOptions<TServerContext> = CORSOptionsFactory<TServerContext> | CORSOptions | boolean;
export declare type CORSOptionsFactory<TServerContext> = (request: Request, ...args: {} extends TServerContext ? [serverContext?: TServerContext | undefined] : [serverContext: TServerContext]) => PromiseOrValue<CORSOptions>;
export declare function getCORSHeadersByRequestAndOptions(request: Request, corsOptions: CORSOptions): Record<string, string>;
export declare function useCORS<TServerContext>(options?: CORSPluginOptions<TServerContext>): Plugin<{}, TServerContext>;
