import { GraphQLResolveInfo, GraphQLError, GraphQLSchema } from 'graphql';
import { ExternalObject, MergedTypeInfo, SubschemaConfig } from './types.cjs';
import { Subschema } from './Subschema.cjs';
export declare function isExternalObject(data: any): data is ExternalObject;
export declare function annotateExternalObject<TContext>(object: any, errors: Array<GraphQLError>, subschema: GraphQLSchema | SubschemaConfig<any, any, any, TContext> | undefined, subschemaMap: Record<string, GraphQLSchema | SubschemaConfig<any, any, any, Record<string, any>>>): ExternalObject;
export declare function getSubschema(object: ExternalObject, responseKey: string): GraphQLSchema | SubschemaConfig;
export declare function getUnpathedErrors(object: ExternalObject): Array<GraphQLError>;
export declare function mergeFields<TContext>(mergedTypeInfo: MergedTypeInfo, object: any, sourceSubschema: Subschema<any, any, any, TContext>, context: any, info: GraphQLResolveInfo): Promise<any>;
