import { GraphQLSchema } from 'graphql';
import { DelegationContext, SubschemaConfig, Transform } from '@graphql-tools/delegate';
import { ExecutionResult, ExecutionRequest } from '@graphql-tools/utils';
export declare function applySchemaTransforms(originalWrappingSchema: GraphQLSchema, subschemaConfig: SubschemaConfig, transformedSchema: GraphQLSchema, transforms?: Transform[]): GraphQLSchema;
export declare function applyRequestTransforms(originalRequest: ExecutionRequest, delegationContext: DelegationContext, transformationContext: Record<string, any>, transforms: Transform[]): ExecutionRequest<Record<string, any>, any, any, Record<string, any>>;
export declare function applyResultTransforms(originalResult: ExecutionResult, delegationContext: DelegationContext, transformationContext: Record<string, any>, transforms: Transform[]): ExecutionResult<Record<string, any>>;
