import { Rule } from './types';
export declare type UsageHandler = (input: Array<{
    type: string;
    field?: string;
    argument?: string;
}>) => Promise<boolean[]>;
export interface ConsiderUsageConfig {
    /**
     * Checks if it's safe to introduce a breaking change on a field
     *
     * Because the function is async and resolves to a boolean value
     * you can add pretty much anything here, many different conditions or
     * even any source of data.
     *
     * In the CLI we use a GraphQL endpoint with a query
     * that checks the usage and returns stats like:
     * min/max count and min/max precentage
     * So we know when to allow for a breaking change.
     *
     * Because it returns a boolean,
     * we can't attach any data or even customize a message of an api change.
     * This is the first iteration, we're going to improve it soon.
     *
     * true - NON_BREAKING
     * false - BREAKING
     */
    checkUsage?: UsageHandler;
}
export declare const considerUsage: Rule<ConsiderUsageConfig>;
