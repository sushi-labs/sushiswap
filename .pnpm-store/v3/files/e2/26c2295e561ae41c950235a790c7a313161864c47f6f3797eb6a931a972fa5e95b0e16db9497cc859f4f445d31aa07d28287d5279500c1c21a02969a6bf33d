import type { MeshTransform } from '@graphql-mesh/types';
import { DelegationContext, SubschemaConfig } from '@graphql-tools/delegate';
import type { ExecutionRequest } from '@graphql-tools/utils';
import { ExecutionResult, GraphQLSchema } from 'graphql';
interface AutoPaginationTransformConfig {
    if?: boolean;
    validateSchema?: boolean;
    limitOfRecords?: number;
    firstArgumentName?: string;
    skipArgumentName?: string;
    lastIdArgumentName?: string;
    skipArgumentLimit?: number;
}
export default class AutoPaginationTransform implements MeshTransform {
    config: Required<AutoPaginationTransformConfig>;
    constructor({ config }?: {
        config?: AutoPaginationTransformConfig;
    });
    transformSchema(schema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, any>): GraphQLSchema;
    transformRequest(executionRequest: ExecutionRequest, delegationContext: DelegationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult<any>): ExecutionResult;
}
export {};
