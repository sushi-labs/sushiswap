import { Plugin, DefaultContext } from '@envelop/types';
import { GraphQLError } from 'graphql';
export declare type ErrorHandler = (errors: readonly GraphQLError[], context: Readonly<DefaultContext>) => void;
export declare const useErrorHandler: <ContextType>(errorHandler: ErrorHandler) => Plugin<ContextType>;
