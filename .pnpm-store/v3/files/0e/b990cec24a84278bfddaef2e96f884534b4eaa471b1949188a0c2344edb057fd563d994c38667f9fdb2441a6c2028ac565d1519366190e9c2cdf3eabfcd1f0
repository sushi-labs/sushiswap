import { GraphQLSchema, GraphQLError, Source, GraphQLNamedType } from 'graphql';
export interface Location {
    start: number;
    end: number;
}
export interface ArgumentCoverage {
    hits: number;
    locations: {
        [name: string]: Array<Location>;
    };
}
export interface TypeChildCoverage {
    hits: number;
    locations: {
        [name: string]: Array<Location>;
    };
    children: {
        [name: string]: ArgumentCoverage;
    };
}
export interface TypeCoverage {
    hits: number;
    type: GraphQLNamedType;
    children: {
        [name: string]: TypeChildCoverage;
    };
}
export interface SchemaCoverage {
    sources: Source[];
    types: {
        [typename: string]: TypeCoverage;
    };
}
export interface InvalidDocument {
    source: Source;
    errors: ReadonlyArray<GraphQLError>;
}
export declare function coverage(schema: GraphQLSchema, sources: Source[]): SchemaCoverage;
