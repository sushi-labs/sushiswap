import { ArbitraryObject, EnvelopContextFnWrapper, GetEnvelopedFn, Plugin, DefaultContext, Maybe } from '@envelop/types';
import { GraphQLSchema } from 'graphql';
export declare type EnvelopOrchestrator<InitialContext extends ArbitraryObject = ArbitraryObject, PluginsContext extends ArbitraryObject = ArbitraryObject> = {
    init: (initialContext?: Maybe<InitialContext>) => void;
    parse: EnvelopContextFnWrapper<ReturnType<GetEnvelopedFn<PluginsContext>>['parse'], InitialContext>;
    validate: EnvelopContextFnWrapper<ReturnType<GetEnvelopedFn<PluginsContext>>['validate'], InitialContext>;
    execute: ReturnType<GetEnvelopedFn<PluginsContext>>['execute'];
    subscribe: ReturnType<GetEnvelopedFn<PluginsContext>>['subscribe'];
    contextFactory: EnvelopContextFnWrapper<ReturnType<GetEnvelopedFn<PluginsContext>>['contextFactory'], PluginsContext>;
    getCurrentSchema: () => Maybe<GraphQLSchema>;
};
export declare function createEnvelopOrchestrator<PluginsContext extends DefaultContext>(plugins: Plugin[]): EnvelopOrchestrator<any, PluginsContext>;
