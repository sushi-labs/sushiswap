import { Plugin, DefaultContext } from '@envelop/types';
import { GraphQLError } from 'graphql';
export declare type ErrorHandler = (errors: readonly GraphQLError[], context: Readonly<DefaultContext>) => void;
export declare const useErrorHandler: <ContextType extends Record<string, any>>(errorHandler: ErrorHandler) => Plugin<ContextType>;
