import type { DocumentNode, ExecutionArgs, ExecutionResult, GraphQLError, GraphQLResolveInfo, GraphQLSchema, ParseOptions, Source, SubscriptionArgs, ValidationRule } from 'graphql';
import { Maybe, PromiseOrValue, AsyncIterableIteratorOrValue } from './utils.js';
import { DefaultContext } from './context-types.js';
import { ExecuteFunction, ParseFunction, ValidateFunction, ValidateFunctionParameter, SubscribeFunction } from './graphql.js';
import { Plugin } from './plugin.js';
export declare type DefaultArgs = Record<string, unknown>;
export declare type SetSchemaFn = (newSchema: GraphQLSchema) => void;
/**
 * The payload forwarded to the onSchemaChange hook.
 */
export declare type OnSchemaChangeEventPayload = {
    schema: GraphQLSchema;
    replaceSchema: SetSchemaFn;
};
/**
 * Invoked each time the schema is changed via a setSchema call.
 */
export declare type OnSchemaChangeHook = (options: OnSchemaChangeEventPayload) => void;
export declare type OnContextErrorHandlerPayload = {
    /**
     * The context object at the "last working" state
     */
    context: Readonly<Record<string, unknown>>;
    /** The error or thing that got rejected or thrown */
    error: unknown;
    /** Overwrite the error or thing that got rejected or thrown. */
    setError: (err: unknown) => void;
};
export declare type OnContextErrorHandler = (options: OnContextErrorHandlerPayload) => PromiseOrValue<void>;
export declare type RegisterContextErrorHandler = (handler: OnContextErrorHandler) => void;
/**
 * Payload forwarded to the onPluginInit hook.
 */
export declare type OnPluginInitEventPayload = {
    /**
     * Register a new plugin.
     */
    addPlugin: (newPlugin: Plugin<any>) => void;
    /**
     * A list of all currently active plugins.
     */
    plugins: Plugin<any>[];
    /**
     * Set the GraphQL schema.
     */
    setSchema: SetSchemaFn;
    /**
     * Register an error handler used for context creation.
     */
    registerContextErrorHandler: RegisterContextErrorHandler;
};
/**
 * Invoked when a plugin is initialized.
 */
export declare type OnPluginInitHook = (options: OnPluginInitEventPayload) => void;
/** onPluginInit */
export declare type OnEnvelopedHookEventPayload<ContextType> = {
    /**
     * Set the schema that should be used for execution.
     */
    setSchema: SetSchemaFn;
    /**
     * The context object.
     */
    context: Readonly<Maybe<ContextType>>;
    /**
     * Extend the context object with a partial.
     */
    extendContext: (contextExtension: Partial<ContextType>) => void;
};
export declare type OnEnvelopedHook<ContextType> = (options: OnEnvelopedHookEventPayload<ContextType>) => void;
export declare type OnParseEventPayload<ContextType> = {
    /**
     * The current context object.
     */
    context: Readonly<ContextType>;
    /**
     * Extend the context object with a partial.
     */
    extendContext: (contextExtension: Partial<ContextType>) => void;
    /**
     * The parameters that are passed to the parse call.
     */
    params: {
        source: string | Source;
        options?: ParseOptions;
    };
    /**
     * The current parse function
     */
    parseFn: ParseFunction;
    /**
     * Replace the current parse function
     */
    setParseFn: (newFn: ParseFunction) => void;
    /**
     * Set/overwrite the parsed document.
     * If a parsed document is set the call to the parseFn will be skipped.
     */
    setParsedDocument: (doc: DocumentNode) => void;
};
export declare type AfterParseEventPayload<ContextType> = {
    /**
     * The current context object.
     */
    context: Readonly<ContextType>;
    /**
     * Extend the context object with a partial.
     */
    extendContext: (contextExtension: Partial<ContextType>) => void;
    /**
     * The result of the parse phase.
     */
    result: DocumentNode | Error | null;
    /**
     * Replace the parse result with a new result.
     */
    replaceParseResult: (newResult: DocumentNode | Error) => void;
};
/**
 * Hook that is invoked after the parse function has been invoked.
 */
export declare type AfterParseHook<ContextType> = (options: AfterParseEventPayload<ContextType>) => void;
/**
 * Hook that is invoked before the parse function is invoked.
 */
export declare type OnParseHook<ContextType> = (options: OnParseEventPayload<ContextType>) => void | AfterParseHook<ContextType>;
/**
 * Payload forwarded to the onValidate hook.
 */
export declare type OnValidateEventPayload<ContextType> = {
    /**
     * The current context object.
     */
    context: Readonly<ContextType>;
    /**
     * Extend the context object with a partial.
     */
    extendContext: (contextExtension: Partial<ContextType>) => void;
    /**
     * The parameters with which the validate function will be invoked.
     */
    params: ValidateFunctionParameter;
    /**
     * Register a validation rule that will be used for the validate invocation.
     */
    addValidationRule: (rule: ValidationRule) => void;
    /**
     * The current validate function that will be invoked.
     */
    validateFn: ValidateFunction;
    /**
     * Overwrite the current validate function.
     */
    setValidationFn: (newValidate: ValidateFunction) => void;
    /**
     * Set a validation error result and skip the validate invocation.
     */
    setResult: (errors: readonly GraphQLError[]) => void;
};
/**
 * Payload forwarded to the afterValidate hook.
 */
export declare type AfterValidateEventPayload<ContextType> = {
    /**
     * The current context object.
     */
    context: Readonly<ContextType>;
    /**
     * Extend the context object with a partial.
     */
    extendContext: (contextExtension: Partial<ContextType>) => void;
    /**
     * Whether the validation raised any errors or not.
     */
    valid: boolean;
    /**
     * An array of errors that were raised during the validation phase.
     * The array is empty if no errors were raised.
     */
    result: readonly GraphQLError[];
    /**
     * Replace the current error result with a new one.
     */
    setResult: (errors: GraphQLError[]) => void;
};
/**
 * AfterValidateHook is invoked after the validate function has been invoked.
 */
export declare type AfterValidateHook<ContextType> = (options: AfterValidateEventPayload<ContextType>) => void;
/**
 * The OnValidateHook is invoked before the validate function has been invoked.
 */
export declare type OnValidateHook<ContextType> = (options: OnValidateEventPayload<ContextType>) => void | AfterValidateHook<ContextType>;
/**
 * The payload forwarded to the onContextBuilding hook.
 */
export declare type OnContextBuildingEventPayload<ContextType> = {
    /**
     * The current context object.
     */
    context: Readonly<ContextType>;
    /**
     * Extend the context object with a partial.
     */
    extendContext: (contextExtension: Partial<ContextType>) => void;
    /**
     * Prevent calls on any further context building hooks.
     */
    breakContextBuilding: () => void;
};
/**
 * The payload forwarded to the afterContextBuilding hook.
 */
export declare type AfterContextBuildingEventPayload<ContextType> = {
    /**
     * The current context object.
     */
    context: ContextType;
    /**
     * Extend the context object with a partial.
     */
    extendContext: (contextExtension: Partial<ContextType>) => void;
};
/**
 * Invoked after the context has been builded.
 */
export declare type AfterContextBuildingHook<ContextType> = (options: AfterContextBuildingEventPayload<ContextType>) => PromiseOrValue<void>;
/**
 * Invoked before the context has been builded.
 * Return a AfterContextBuildingHook, which is invoked after the context building has been finished.
 */
export declare type OnContextBuildingHook<ContextType> = (options: OnContextBuildingEventPayload<ContextType>) => PromiseOrValue<void | AfterContextBuildingHook<ContextType>>;
export declare type ResolverFn<ParentType = unknown, ArgsType = DefaultArgs, ContextType = unknown, ResultType = unknown> = (root: ParentType, args: ArgsType, context: ContextType, info: GraphQLResolveInfo) => PromiseOrValue<ResultType>;
export declare type OnBeforeResolverCalledEventPayload<ParentType = unknown, ArgsType = DefaultArgs, ContextType = unknown, ResultType = unknown> = {
    root: ParentType;
    args: ArgsType;
    context: ContextType;
    info: GraphQLResolveInfo;
    resolverFn: ResolverFn<ParentType, ArgsType, ContextType, ResultType>;
    replaceResolverFn: (newResolver: ResolverFn<ParentType, ArgsType, ContextType, ResultType>) => void;
};
export declare type AfterResolverEventPayload = {
    result: unknown | Error;
    setResult: (newResult: unknown) => void;
};
export declare type AfterResolverHook = (options: AfterResolverEventPayload) => void;
export declare type OnResolverCalledHook<ParentType = unknown, ArgsType = DefaultArgs, ContextType = DefaultContext, ResultType = unknown> = (options: OnBeforeResolverCalledEventPayload<ParentType, ArgsType, ContextType, ResultType>) => PromiseOrValue<void | AfterResolverHook>;
/**
 * Execution arguments with inferred context value type.
 */
export declare type TypedExecutionArgs<ContextType> = Omit<ExecutionArgs, 'contextValue'> & {
    contextValue: ContextType;
};
/**
 * Payload that is passed to the onExecute hook.
 */
export declare type OnExecuteEventPayload<ContextType> = {
    /**
     * Current execute function that will be used for execution.
     */
    executeFn: ExecuteFunction;
    /**
     * Arguments the execute function will be invoked with.
     */
    args: TypedExecutionArgs<ContextType>;
    /**
     * Replace the current execute function with a new one.
     */
    setExecuteFn: (newExecute: ExecuteFunction) => void;
    /**
     * Set a execution result and skip calling the execute function.
     */
    setResultAndStopExecution: (newResult: ExecutionResult) => void;
    /**
     * Extend the context object with a partial.
     */
    extendContext: (contextExtension: Partial<ContextType>) => void;
};
/**
 * Payload that is passed to the onExecuteDone hook.
 */
export declare type OnExecuteDoneHookResultOnNextHookPayload<ContextType> = {
    /**
     * The execution arguments.
     */
    args: TypedExecutionArgs<ContextType>;
    /**
     * The execution result.
     */
    result: ExecutionResult;
    /**
     * Replace the execution result with a new execution result.
     */
    setResult: (newResult: ExecutionResult) => void;
};
/**
 * Hook that is invoked for each value a AsyncIterable returned from execute publishes.
 */
export declare type OnExecuteDoneHookResultOnNextHook<ContextType> = (payload: OnExecuteDoneHookResultOnNextHookPayload<ContextType>) => void | Promise<void>;
/**
 * Hook that is invoked after a AsyncIterable returned from execute completes.
 */
export declare type OnExecuteDoneHookResultOnEndHook = () => void;
/**
 * Hook for hooking into AsyncIterables returned from execute.
 */
export declare type OnExecuteDoneHookResult<ContextType> = {
    /**
     * Hook that is invoked for each value a AsyncIterable returned from execute publishes.
     */
    onNext?: OnExecuteDoneHookResultOnNextHook<ContextType>;
    /**
     * Hook that is invoked after a AsyncIterable returned from execute completes.
     */
    onEnd?: OnExecuteDoneHookResultOnEndHook;
};
/**
 * Payload with which the onExecuteDone hook is invoked.
 */
export declare type OnExecuteDoneEventPayload<ContextType> = {
    /**
     * The execution arguments.
     */
    args: TypedExecutionArgs<ContextType>;
    /**
     * The execution result returned from the execute function.
     * Can return an AsyncIterable if a graphql.js that has defer/stream implemented is used.
     */
    result: AsyncIterableIteratorOrValue<ExecutionResult>;
    /**
     * Replace the execution result with a new execution result.
     */
    setResult: (newResult: AsyncIterableIteratorOrValue<ExecutionResult>) => void;
};
/**
 * Hook that is invoked after the execute function has been invoked.
 * Allows returning a OnExecuteDoneHookResult for hooking into stream values if execute returned an AsyncIterable.
 */
export declare type OnExecuteDoneHook<ContextType> = (options: OnExecuteDoneEventPayload<ContextType>) => PromiseOrValue<void | OnExecuteDoneHookResult<ContextType>>;
/**
 * Result returned from the onExecute hook result for hooking into subsequent phases.
 */
export declare type OnExecuteHookResult<ContextType> = {
    /**
     * Invoked with the execution result returned from execute.
     */
    onExecuteDone?: OnExecuteDoneHook<ContextType>;
};
/**
 * onExecute hook that is invoked before the execute function is invoked.
 */
export declare type OnExecuteHook<ContextType> = (options: OnExecuteEventPayload<ContextType>) => PromiseOrValue<void | OnExecuteHookResult<ContextType>>;
/**
 * Subscription arguments with inferred context value type.
 */
export declare type TypedSubscriptionArgs<ContextType> = Omit<SubscriptionArgs, 'contextValue'> & {
    contextValue: ContextType;
};
/**
 * Payload with which the onSubscribe hook is invoked.
 */
export declare type OnSubscribeEventPayload<ContextType> = {
    /**
     * Current subscribe function that will be used for setting up the subscription.
     */
    subscribeFn: SubscribeFunction;
    /**
     * Current arguments with which the subscribe function will be invoked.
     */
    args: TypedSubscriptionArgs<ContextType>;
    /**
     * Replace the current subscribe function with a new one that will be used for setting up the subscription.
     */
    setSubscribeFn: (newSubscribe: SubscribeFunction) => void;
    /**
     * Extend the context object with a partial.
     */
    extendContext: (contextExtension: Partial<ContextType>) => void;
    /**
     * Set a subscribe result and skip calling the subscribe function.
     */
    setResultAndStopExecution: (newResult: AsyncIterableIteratorOrValue<ExecutionResult>) => void;
};
/**
 * Payload with which the onSubscribeResult hook is invoked.
 */
export declare type OnSubscribeResultEventPayload<ContextType> = {
    /**
     * The execution arguments.
     */
    args: TypedExecutionArgs<ContextType>;
    /**
     * The current execution result.
     */
    result: AsyncIterableIteratorOrValue<ExecutionResult>;
    /**
     * Replace the current execution result with a new execution result.
     */
    setResult: (newResult: AsyncIterableIteratorOrValue<ExecutionResult>) => void;
};
export declare type OnSubscribeResultResultOnNextHookPayload<ContextType> = {
    /**
     * The execution arguments.
     */
    args: TypedExecutionArgs<ContextType>;
    /**
     * The current execution result.
     */
    result: ExecutionResult;
    /**
     * Replace the current execution result with a new execution result.
     */
    setResult: (newResult: ExecutionResult) => void;
};
/**
 * Hook invoked for each value published by the AsyncIterable returned from subscribe.
 */
export declare type OnSubscribeResultResultOnNextHook<ContextType> = (payload: OnSubscribeResultResultOnNextHookPayload<ContextType>) => void | Promise<void>;
/**
 * Hook invoked after the AsyncIterable returned from subscribe completes.
 */
export declare type OnSubscribeResultResultOnEndHook = () => void;
export declare type OnSubscribeResultResult<ContextType> = {
    /**
     * Invoked for each value published by the AsyncIterable returned from subscribe.
     */
    onNext?: OnSubscribeResultResultOnNextHook<ContextType>;
    /**
     * Invoked after the AsyncIterable returned from subscribe completes.
     */
    onEnd?: OnSubscribeResultResultOnEndHook;
};
/**
 * Hook that is invoked with the result of the subscribe call.
 * Return a OnSubscribeResultResult for hooking into the AsyncIterable returned from subscribe.
 */
export declare type SubscribeResultHook<ContextType> = (options: OnSubscribeResultEventPayload<ContextType>) => void | OnSubscribeResultResult<ContextType>;
export declare type SubscribeErrorHookPayload = {
    error: unknown;
    setError: (err: unknown) => void;
};
export declare type SubscribeErrorHook = (payload: SubscribeErrorHookPayload) => void;
export declare type OnSubscribeHookResult<ContextType> = {
    /**
     * Invoked with the result returned from subscribe.
     */
    onSubscribeResult?: SubscribeResultHook<ContextType>;
    /**
     * Invoked if the source stream returned from subscribe throws an error.
     */
    onSubscribeError?: SubscribeErrorHook;
};
/**
 * onSubscribe hook that is invoked before the subscribe function is called.
 * Return a OnSubscribeHookResult for hooking into phase after the subscribe function has been called.
 */
export declare type OnSubscribeHook<ContextType> = (options: OnSubscribeEventPayload<ContextType>) => PromiseOrValue<void | OnSubscribeHookResult<ContextType>>;
