import { Plugin } from './types.js';
import { PromiseOrValue } from '@envelop/core';
import { GraphQLParams } from '../types.js';
interface RequestParserPluginOptions {
    match?(request: Request): boolean;
    parse(request: Request): PromiseOrValue<GraphQLParams>;
}
export declare function useRequestParser(options: RequestParserPluginOptions): Plugin;
export {};
