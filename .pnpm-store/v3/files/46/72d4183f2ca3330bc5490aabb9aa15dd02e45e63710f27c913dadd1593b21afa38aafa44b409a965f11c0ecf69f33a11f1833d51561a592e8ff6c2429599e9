import { Plugin } from './types.cjs';
import { PromiseOrValue } from '@envelop/core';
import { GraphQLParams } from '../types.cjs';
interface RequestParserPluginOptions {
    match?(request: Request): boolean;
    parse(request: Request): PromiseOrValue<GraphQLParams> | PromiseOrValue<GraphQLParams[]>;
}
export declare function useRequestParser(options: RequestParserPluginOptions): Plugin;
export {};
