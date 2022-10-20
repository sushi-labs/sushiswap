import { GraphQLInputType, GraphQLResolveInfo } from 'graphql';
export declare type ResolverData<TParent = any, TArgs = any, TContext = any, TResult = any> = {
    root?: TParent;
    args?: TArgs;
    context?: TContext;
    info?: GraphQLResolveInfo;
    result?: TResult;
    env: Record<string, string>;
};
export declare type ResolverDataBasedFactory<T> = (data: ResolverData) => T;
export declare function getInterpolationKeys(...interpolationStrings: string[]): any[];
export declare function parseInterpolationStrings(interpolationStrings: Iterable<string>, argTypeMap?: Record<string, string | GraphQLInputType>): {
    args: Record<string, {
        type: string | GraphQLInputType;
    }>;
    contextVariables: Record<string, string>;
};
export declare function getInterpolatedStringFactory(nonInterpolatedString: string): ResolverDataBasedFactory<string>;
export declare function getInterpolatedHeadersFactory(nonInterpolatedHeaders?: Record<string, string>): ResolverDataBasedFactory<Record<string, string>>;
