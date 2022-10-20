import { Plugin } from '@envelop/core';
import { ExecutionArgs, ExecutionResult } from 'graphql';
import { ExtendedValidationRule } from './common.cjs';
declare type OnValidationFailedCallback = (params: {
    args: ExecutionArgs;
    result: ExecutionResult;
    setResult: (result: ExecutionResult) => void;
}) => void;
export declare const useExtendedValidation: (options: {
    rules: Array<ExtendedValidationRule>;
    /**
     * Callback that is invoked if the extended validation yields any errors.
     */
    onValidationFailed?: OnValidationFailedCallback;
}) => Plugin;
export {};
