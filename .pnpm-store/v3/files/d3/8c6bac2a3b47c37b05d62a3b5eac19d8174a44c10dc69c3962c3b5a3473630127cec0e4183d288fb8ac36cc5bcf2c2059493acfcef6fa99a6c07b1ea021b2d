import { GraphQLSchema } from 'graphql';
import { ExecutionRequest, ExecutionResult } from '@graphql-tools/utils';
import { Transform, DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
import { LeafValueTransformer } from '../types.js';
export interface MapLeafValuesTransformationContext {
    transformedRequest: ExecutionRequest;
}
export default class MapLeafValues<TContext = Record<string, any>> implements Transform<MapLeafValuesTransformationContext, TContext> {
    private readonly inputValueTransformer;
    private readonly outputValueTransformer;
    private readonly resultVisitorMap;
    private originalWrappingSchema;
    private typeInfo;
    constructor(inputValueTransformer: LeafValueTransformer, outputValueTransformer: LeafValueTransformer);
    private _getTypeInfo;
    private _getOriginalWrappingSchema;
    transformSchema(originalWrappingSchema: GraphQLSchema, _subschemaConfig: SubschemaConfig<any, any, any, TContext>): GraphQLSchema;
    transformRequest(originalRequest: ExecutionRequest, _delegationContext: DelegationContext<TContext>, transformationContext: MapLeafValuesTransformationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult, _delegationContext: DelegationContext<TContext>, transformationContext: MapLeafValuesTransformationContext): ExecutionResult;
    private transformOperations;
    private transformFieldNode;
}
