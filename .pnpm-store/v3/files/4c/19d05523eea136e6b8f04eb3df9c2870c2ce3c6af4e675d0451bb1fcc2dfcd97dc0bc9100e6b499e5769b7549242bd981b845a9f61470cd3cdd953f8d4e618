import { Plugin } from '@envelop/types';
import { envelopIsIntrospectionSymbol } from '../utils.js';
declare type LoggerPluginOptions = {
    logFn: typeof console.log;
    skipIntrospection?: boolean;
};
declare type InternalPluginContext = {
    [envelopIsIntrospectionSymbol]?: true;
};
export declare const useLogger: (rawOptions?: LoggerPluginOptions) => Plugin<InternalPluginContext>;
export {};
