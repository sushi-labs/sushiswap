import { execute, parse, specifiedRules, subscribe, validate, } from 'graphql';
import { prepareTracedSchema, resolversHooksSymbol } from './traced-schema.js';
import { errorAsyncIterator, finalAsyncIterator, makeExecute, makeSubscribe, mapAsyncIterator, isAsyncIterable, } from './utils.js';
export function createEnvelopOrchestrator(plugins) {
    let schema = null;
    let initDone = false;
    const onResolversHandlers = [];
    for (const plugin of plugins) {
        if (plugin.onResolverCalled) {
            onResolversHandlers.push(plugin.onResolverCalled);
        }
    }
    // Define the initial method for replacing the GraphQL schema, this is needed in order
    // to allow setting the schema from the onPluginInit callback. We also need to make sure
    // here not to call the same plugin that initiated the schema switch.
    const replaceSchema = (newSchema, ignorePluginIndex = -1) => {
        if (onResolversHandlers.length) {
            prepareTracedSchema(newSchema);
        }
        schema = newSchema;
        if (initDone) {
            for (const [i, plugin] of plugins.entries()) {
                if (i !== ignorePluginIndex) {
                    plugin.onSchemaChange &&
                        plugin.onSchemaChange({
                            schema,
                            replaceSchema: schemaToSet => {
                                replaceSchema(schemaToSet, i);
                            },
                        });
                }
            }
        }
    };
    const contextErrorHandlers = [];
    // Iterate all plugins and trigger onPluginInit
    for (const [i, plugin] of plugins.entries()) {
        plugin.onPluginInit &&
            plugin.onPluginInit({
                plugins,
                addPlugin: newPlugin => {
                    plugins.push(newPlugin);
                },
                setSchema: modifiedSchema => replaceSchema(modifiedSchema, i),
                registerContextErrorHandler: handler => contextErrorHandlers.push(handler),
            });
    }
    // A set of before callbacks defined here in order to allow it to be used later
    const beforeCallbacks = {
        init: [],
        parse: [],
        validate: [],
        subscribe: [],
        execute: [],
        context: [],
    };
    for (const { onContextBuilding, onExecute, onParse, onSubscribe, onValidate, onEnveloped } of plugins) {
        onEnveloped && beforeCallbacks.init.push(onEnveloped);
        onContextBuilding && beforeCallbacks.context.push(onContextBuilding);
        onExecute && beforeCallbacks.execute.push(onExecute);
        onParse && beforeCallbacks.parse.push(onParse);
        onSubscribe && beforeCallbacks.subscribe.push(onSubscribe);
        onValidate && beforeCallbacks.validate.push(onValidate);
    }
    const init = initialContext => {
        for (const [i, onEnveloped] of beforeCallbacks.init.entries()) {
            onEnveloped({
                context: initialContext,
                extendContext: extension => {
                    if (!initialContext) {
                        return;
                    }
                    Object.assign(initialContext, extension);
                },
                setSchema: modifiedSchema => replaceSchema(modifiedSchema, i),
            });
        }
    };
    const customParse = beforeCallbacks.parse.length
        ? initialContext => (source, parseOptions) => {
            let result = null;
            let parseFn = parse;
            const context = initialContext;
            const afterCalls = [];
            for (const onParse of beforeCallbacks.parse) {
                const afterFn = onParse({
                    context,
                    extendContext: extension => {
                        Object.assign(context, extension);
                    },
                    params: { source, options: parseOptions },
                    parseFn,
                    setParseFn: newFn => {
                        parseFn = newFn;
                    },
                    setParsedDocument: newDoc => {
                        result = newDoc;
                    },
                });
                afterFn && afterCalls.push(afterFn);
            }
            if (result === null) {
                try {
                    result = parseFn(source, parseOptions);
                }
                catch (e) {
                    result = e;
                }
            }
            for (const afterCb of afterCalls) {
                afterCb({
                    context,
                    extendContext: extension => {
                        Object.assign(context, extension);
                    },
                    replaceParseResult: newResult => {
                        result = newResult;
                    },
                    result,
                });
            }
            if (result === null) {
                throw new Error(`Failed to parse document.`);
            }
            if (result instanceof Error) {
                throw result;
            }
            return result;
        }
        : () => parse;
    const customValidate = beforeCallbacks.validate.length
        ? initialContext => (schema, documentAST, rules, typeInfo, validationOptions) => {
            let actualRules = rules ? [...rules] : undefined;
            let validateFn = validate;
            let result = null;
            const context = initialContext;
            const afterCalls = [];
            for (const onValidate of beforeCallbacks.validate) {
                const afterFn = onValidate({
                    context,
                    extendContext: extension => {
                        Object.assign(context, extension);
                    },
                    params: {
                        schema,
                        documentAST,
                        rules: actualRules,
                        typeInfo,
                        options: validationOptions,
                    },
                    validateFn,
                    addValidationRule: rule => {
                        if (!actualRules) {
                            actualRules = [...specifiedRules];
                        }
                        actualRules.push(rule);
                    },
                    setValidationFn: newFn => {
                        validateFn = newFn;
                    },
                    setResult: newResults => {
                        result = newResults;
                    },
                });
                afterFn && afterCalls.push(afterFn);
            }
            if (!result) {
                result = validateFn(schema, documentAST, actualRules, typeInfo, validationOptions);
            }
            const valid = result.length === 0;
            for (const afterCb of afterCalls) {
                afterCb({
                    valid,
                    result,
                    context,
                    extendContext: extension => {
                        Object.assign(context, extension);
                    },
                    setResult: newResult => {
                        result = newResult;
                    },
                });
            }
            return result;
        }
        : () => validate;
    const customContextFactory = beforeCallbacks.context
        .length
        ? initialContext => async (orchestratorCtx) => {
            const afterCalls = [];
            // In order to have access to the "last working" context object we keep this outside of the try block:
            let context = orchestratorCtx ? { ...initialContext, ...orchestratorCtx } : initialContext;
            try {
                let isBreakingContextBuilding = false;
                for (const onContext of beforeCallbacks.context) {
                    const afterHookResult = await onContext({
                        context,
                        extendContext: extension => {
                            context = { ...context, ...extension };
                        },
                        breakContextBuilding: () => {
                            isBreakingContextBuilding = true;
                        },
                    });
                    if (typeof afterHookResult === 'function') {
                        afterCalls.push(afterHookResult);
                    }
                    if (isBreakingContextBuilding === true) {
                        break;
                    }
                }
                for (const afterCb of afterCalls) {
                    afterCb({
                        context,
                        extendContext: extension => {
                            context = { ...context, ...extension };
                        },
                    });
                }
                return context;
            }
            catch (err) {
                let error = err;
                for (const errorCb of contextErrorHandlers) {
                    errorCb({
                        context,
                        error,
                        setError: err => {
                            error = err;
                        },
                    });
                }
                throw error;
            }
        }
        : initialContext => orchestratorCtx => orchestratorCtx ? { ...initialContext, ...orchestratorCtx } : initialContext;
    const useCustomSubscribe = beforeCallbacks.subscribe.length || onResolversHandlers.length;
    const customSubscribe = useCustomSubscribe
        ? makeSubscribe(async (args) => {
            let subscribeFn = subscribe;
            const afterCalls = [];
            const subscribeErrorHandlers = [];
            let context = args.contextValue || {};
            let result;
            for (const onSubscribe of beforeCallbacks.subscribe) {
                const after = await onSubscribe({
                    subscribeFn,
                    setSubscribeFn: newSubscribeFn => {
                        subscribeFn = newSubscribeFn;
                    },
                    extendContext: extension => {
                        context = { ...context, ...extension };
                    },
                    args: args,
                    setResultAndStopExecution: stopResult => {
                        result = stopResult;
                    },
                });
                if (after) {
                    if (after.onSubscribeResult) {
                        afterCalls.push(after.onSubscribeResult);
                    }
                    if (after.onSubscribeError) {
                        subscribeErrorHandlers.push(after.onSubscribeError);
                    }
                }
                if (result !== undefined) {
                    break;
                }
            }
            if (onResolversHandlers.length) {
                context[resolversHooksSymbol] = onResolversHandlers;
            }
            if (result === undefined) {
                result = await subscribeFn({
                    ...args,
                    contextValue: context,
                    // Casted for GraphQL.js 15 compatibility
                    // Can be removed once we drop support for GraphQL.js 15
                });
            }
            const onNextHandler = [];
            const onEndHandler = [];
            for (const afterCb of afterCalls) {
                const hookResult = afterCb({
                    args: args,
                    result,
                    setResult: newResult => {
                        result = newResult;
                    },
                });
                if (hookResult) {
                    if (hookResult.onNext) {
                        onNextHandler.push(hookResult.onNext);
                    }
                    if (hookResult.onEnd) {
                        onEndHandler.push(hookResult.onEnd);
                    }
                }
            }
            if (onNextHandler.length && isAsyncIterable(result)) {
                result = mapAsyncIterator(result, async (result) => {
                    for (const onNext of onNextHandler) {
                        await onNext({
                            args: args,
                            result,
                            setResult: newResult => (result = newResult),
                        });
                    }
                    return result;
                });
            }
            if (onEndHandler.length && isAsyncIterable(result)) {
                result = finalAsyncIterator(result, () => {
                    for (const onEnd of onEndHandler) {
                        onEnd();
                    }
                });
            }
            if (subscribeErrorHandlers.length && isAsyncIterable(result)) {
                result = errorAsyncIterator(result, err => {
                    let error = err;
                    for (const handler of subscribeErrorHandlers) {
                        handler({
                            error,
                            setError: err => {
                                error = err;
                            },
                        });
                    }
                    throw error;
                });
            }
            return result;
        })
        : makeSubscribe(subscribe);
    const useCustomExecute = beforeCallbacks.execute.length || onResolversHandlers.length;
    const customExecute = useCustomExecute
        ? makeExecute(async (args) => {
            let executeFn = execute;
            let result;
            const afterCalls = [];
            let context = args.contextValue || {};
            for (const onExecute of beforeCallbacks.execute) {
                const after = await onExecute({
                    executeFn,
                    setExecuteFn: newExecuteFn => {
                        executeFn = newExecuteFn;
                    },
                    setResultAndStopExecution: stopResult => {
                        result = stopResult;
                    },
                    extendContext: extension => {
                        if (typeof extension === 'object') {
                            context = {
                                ...context,
                                ...extension,
                            };
                        }
                        else {
                            throw new Error(`Invalid context extension provided! Expected "object", got: "${JSON.stringify(extension)}" (${typeof extension})`);
                        }
                    },
                    args: args,
                });
                if (after === null || after === void 0 ? void 0 : after.onExecuteDone) {
                    afterCalls.push(after.onExecuteDone);
                }
                if (result !== undefined) {
                    break;
                }
            }
            if (onResolversHandlers.length) {
                context[resolversHooksSymbol] = onResolversHandlers;
            }
            if (result === undefined) {
                result = (await executeFn({
                    ...args,
                    contextValue: context,
                }));
            }
            const onNextHandler = [];
            const onEndHandler = [];
            for (const afterCb of afterCalls) {
                const hookResult = await afterCb({
                    args: args,
                    result,
                    setResult: newResult => {
                        result = newResult;
                    },
                });
                if (hookResult) {
                    if (hookResult.onNext) {
                        onNextHandler.push(hookResult.onNext);
                    }
                    if (hookResult.onEnd) {
                        onEndHandler.push(hookResult.onEnd);
                    }
                }
            }
            if (onNextHandler.length && isAsyncIterable(result)) {
                result = mapAsyncIterator(result, async (result) => {
                    for (const onNext of onNextHandler) {
                        await onNext({
                            args: args,
                            result,
                            setResult: newResult => {
                                result = newResult;
                            },
                        });
                    }
                    return result;
                });
            }
            if (onEndHandler.length && isAsyncIterable(result)) {
                result = finalAsyncIterator(result, () => {
                    for (const onEnd of onEndHandler) {
                        onEnd();
                    }
                });
            }
            return result;
        })
        : makeExecute(execute);
    initDone = true;
    // This is done in order to trigger the first schema available, to allow plugins that needs the schema
    // eagerly to have it.
    if (schema) {
        for (const [i, plugin] of plugins.entries()) {
            plugin.onSchemaChange &&
                plugin.onSchemaChange({
                    schema,
                    replaceSchema: modifiedSchema => replaceSchema(modifiedSchema, i),
                });
        }
    }
    return {
        getCurrentSchema() {
            return schema;
        },
        init,
        parse: customParse,
        validate: customValidate,
        execute: customExecute,
        subscribe: customSubscribe,
        contextFactory: customContextFactory,
    };
}
