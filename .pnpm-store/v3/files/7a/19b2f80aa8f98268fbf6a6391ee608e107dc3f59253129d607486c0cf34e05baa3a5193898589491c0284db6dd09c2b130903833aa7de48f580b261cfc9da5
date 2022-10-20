import { ArbitraryObject } from '@envelop/types';
import { EnvelopOrchestrator } from './orchestrator.js';
declare const tracingSymbol: unique symbol;
export declare function traceOrchestrator<TInitialContext extends ArbitraryObject, TPluginsContext extends ArbitraryObject>(orchestrator: EnvelopOrchestrator<TInitialContext, TPluginsContext>): EnvelopOrchestrator<TInitialContext & {
    [tracingSymbol]?: {};
}, TPluginsContext>;
export {};
