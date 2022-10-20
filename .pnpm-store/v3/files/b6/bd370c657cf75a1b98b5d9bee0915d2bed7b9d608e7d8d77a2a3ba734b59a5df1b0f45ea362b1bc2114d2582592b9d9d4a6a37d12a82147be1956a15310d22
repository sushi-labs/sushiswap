import type { DelegationContext, SubschemaConfig, Transform } from '@graphql-tools/delegate';
import type { ExecutionRequest } from '@graphql-tools/utils';
import { ExecutionResult, GraphQLSchema } from 'graphql';
interface BlockTrackingTransformConfig {
    if?: boolean;
    validateSchema?: boolean;
    ignoreOperationNames?: string[];
    ignoreFieldNames?: string[];
    metaTypeName?: string;
    blockFieldName?: string;
    blockNumberFieldName?: string;
    metaRootFieldName?: string;
    blockArgumentName?: string;
    minBlockArgumentName?: string;
}
export default class BlockTrackingTransform implements Transform {
    config: Required<BlockTrackingTransformConfig>;
    constructor({ config }?: {
        config?: BlockTrackingTransformConfig;
    });
    transformSchema(schema: GraphQLSchema, subschemaConfig: SubschemaConfig<any, any, any, any>): GraphQLSchema;
    transformRequest(executionRequest: ExecutionRequest, delegationContext: DelegationContext): ExecutionRequest;
    transformResult(originalResult: ExecutionResult<any>, delegationContext: DelegationContext): ExecutionResult;
}
export {};
