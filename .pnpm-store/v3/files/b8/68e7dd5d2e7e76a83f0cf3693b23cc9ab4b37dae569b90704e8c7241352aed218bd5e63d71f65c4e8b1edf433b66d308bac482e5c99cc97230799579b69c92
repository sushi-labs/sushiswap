import { GraphQLSchema, ExecutionResult } from 'graphql';
import { ExecutionRequest } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
import { EnumValueTransformer, LeafValueTransformer } from '../types.js';
import { MapLeafValuesTransformationContext } from './MapLeafValues.js';
interface TransformEnumValuesTransformationContext extends MapLeafValuesTransformationContext {
}
export default class TransformEnumValues<TContext = Record<string, any>> implements Transform<TransformEnumValuesTransformationContext, TContext> {
    private readonly enumValueTransformer;
    private readonly transformer;
    private transformedSchema;
    private mapping;
    private reverseMapping;
    constructor(enumValueTransformer: EnumValueTransformer, inputValueTransformer?: LeafValueTransformer, outputValueTransformer?: LeafValueTransformer);
    transformSchema(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, TContext>, transformedSchema?: GraphQLSchema): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, delegationContext: DelegationContext<TContext>, transformationContext: TransformEnumValuesTransformationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult, delegationContext: DelegationContext<TContext>, transformationContext: TransformEnumValuesTransformationContext): import("@graphql-tools/utils").ExecutionResult<Record<string, any>>;
    private transformEnumValue;
}
export {};
