import { GraphQLSchema, SelectionSetNode } from 'graphql';
import { IResolvers } from '@graphql-tools/utils';
import { Subschema, SubschemaConfig, StitchingInfo } from '@graphql-tools/delegate';
import { MergeTypeCandidate, MergeTypeFilter } from './types.js';
export declare function createStitchingInfo<TContext extends Record<string, any> = Record<string, any>>(subschemaMap: Map<GraphQLSchema | SubschemaConfig<any, any, any, TContext>, Subschema<any, any, any, TContext>>, typeCandidates: Record<string, Array<MergeTypeCandidate<TContext>>>, mergeTypes?: boolean | Array<string> | MergeTypeFilter<TContext>): StitchingInfo<TContext>;
export declare function completeStitchingInfo<TContext = Record<string, any>>(stitchingInfo: StitchingInfo<TContext>, resolvers: IResolvers, schema: GraphQLSchema): StitchingInfo<TContext>;
export declare function addStitchingInfo<TContext = Record<string, any>>(stitchedSchema: GraphQLSchema, stitchingInfo: StitchingInfo<TContext>): void;
export declare function selectionSetContainsTopLevelField(selectionSet: SelectionSetNode, fieldName: string): boolean;
