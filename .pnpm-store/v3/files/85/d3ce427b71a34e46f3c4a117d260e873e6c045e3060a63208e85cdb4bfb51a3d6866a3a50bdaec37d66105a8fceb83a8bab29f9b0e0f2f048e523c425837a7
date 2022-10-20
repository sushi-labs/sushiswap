import { GraphQLSchema } from 'graphql';
import { Change } from './changes/change';
import { Rule } from './rules/types';
import * as rules from './rules';
export * from './rules/types';
export declare const DiffRule: typeof rules;
export * from './onComplete/types';
export type { UsageHandler } from './rules/consider-usage';
export declare function diff(oldSchema: GraphQLSchema, newSchema: GraphQLSchema, rules?: Rule[], config?: rules.ConsiderUsageConfig): Promise<Change[]>;
