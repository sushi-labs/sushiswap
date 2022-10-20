import { Plugin } from '@envelop/types';
import { DocumentNode, ExecutionArgs, GraphQLResolveInfo, Source, SubscriptionArgs } from 'graphql';
import { envelopIsIntrospectionSymbol } from '../utils.js';
export declare type ResultTiming = {
    ms: number;
    ns: number;
};
export declare type TimingPluginOptions = {
    skipIntrospection?: boolean;
    onContextBuildingMeasurement?: (timing: ResultTiming) => void;
    onExecutionMeasurement?: (args: ExecutionArgs, timing: ResultTiming) => void;
    onSubscriptionMeasurement?: (args: SubscriptionArgs, timing: ResultTiming) => void;
    onParsingMeasurement?: (source: Source | string, timing: ResultTiming) => void;
    onValidationMeasurement?: (document: DocumentNode, timing: ResultTiming) => void;
    onResolverMeasurement?: (info: GraphQLResolveInfo, timing: ResultTiming) => void;
};
declare type InternalPluginContext = {
    [envelopIsIntrospectionSymbol]?: true;
};
export declare const useTiming: (rawOptions?: TimingPluginOptions) => Plugin<InternalPluginContext>;
export {};
