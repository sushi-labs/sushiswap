import { GraphQLError } from 'graphql';
import { ResultProcessorInput } from './plugins/types';
import { YogaMaskedErrorOpts } from './types';
declare module 'graphql' {
    interface GraphQLHTTPErrorExtensions {
        status?: number;
        headers?: Record<string, string>;
    }
    interface GraphQLErrorExtensions {
        http?: GraphQLHTTPErrorExtensions;
    }
}
export declare function handleError(error: unknown, maskedErrorsOpts: YogaMaskedErrorOpts | null, errors?: GraphQLError[]): GraphQLError[];
export declare function getResponseInitByRespectingErrors(result: ResultProcessorInput, headers?: Record<string, string>): {
    status: number;
    headers: Record<string, string>;
};
