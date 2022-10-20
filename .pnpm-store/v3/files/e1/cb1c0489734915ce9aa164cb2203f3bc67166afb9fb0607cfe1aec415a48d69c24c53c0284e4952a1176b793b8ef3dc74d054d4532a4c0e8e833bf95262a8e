import { Plugin } from './plugin.js';
import { GraphQLSchema } from 'graphql';
import { ExecuteFunction, ParseFunction, SubscribeFunction, ValidateFunction } from './graphql.js';
import { ArbitraryObject, Spread, PromiseOrValue } from './utils.js';
export { ArbitraryObject } from './utils.js';
export declare type EnvelopContextFnWrapper<TFunction extends Function, ContextType = unknown> = (context: ContextType) => TFunction;
export declare type GetEnvelopedFn<PluginsContext> = {
    <InitialContext extends ArbitraryObject>(initialContext?: InitialContext): {
        execute: ExecuteFunction;
        validate: ValidateFunction;
        subscribe: SubscribeFunction;
        parse: ParseFunction;
        contextFactory: <ContextExtension>(contextExtension?: ContextExtension) => PromiseOrValue<Spread<[InitialContext, PluginsContext, ContextExtension]>>;
        schema: GraphQLSchema;
    };
    _plugins: Plugin[];
};
