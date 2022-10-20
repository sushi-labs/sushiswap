import { DocumentNode } from 'graphql/language/ast';
export declare type Variables = {
    [key: string]: any;
};
export interface GraphQLError {
    message: string;
    locations?: {
        line: number;
        column: number;
    }[];
    path?: string[];
    extensions?: any;
}
export interface GraphQLResponse<T = any> {
    data?: T;
    errors?: GraphQLError[];
    extensions?: any;
    status: number;
    [key: string]: any;
}
export interface GraphQLRequestContext<V = Variables> {
    query: string | string[];
    variables?: V;
}
export declare class ClientError extends Error {
    response: GraphQLResponse;
    request: GraphQLRequestContext;
    constructor(response: GraphQLResponse, request: GraphQLRequestContext);
    private static extractMessage;
}
export declare type RequestDocument = string | DocumentNode;
export declare type BatchRequestDocument<V = Variables> = {
    document: RequestDocument;
    variables?: V;
};
