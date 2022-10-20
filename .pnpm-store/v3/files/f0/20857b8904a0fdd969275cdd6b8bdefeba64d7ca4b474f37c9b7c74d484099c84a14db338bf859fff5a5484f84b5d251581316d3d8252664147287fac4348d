var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
        if (__hasOwnProp.call(b, prop))
            __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
        for (var prop of __getOwnPropSymbols(b)) {
            if (__propIsEnum.call(b, prop))
                __defNormalProp(a, prop, b[prop]);
        }
    return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
// src/query/react/index.ts
import { coreModule, buildCreateApi } from "@reduxjs/toolkit/query";
// src/query/react/buildHooks.ts
import { createSelector } from "@reduxjs/toolkit";
import { useCallback, useEffect as useEffect3, useLayoutEffect, useMemo as useMemo2, useRef as useRef3, useState } from "react";
import { QueryStatus, skipToken } from "@reduxjs/toolkit/query";
import { shallowEqual as shallowEqual2 } from "react-redux";
// src/query/react/useSerializedStableValue.ts
import { useEffect, useRef, useMemo } from "react";
function useStableQueryArgs(queryArgs, serialize, endpointDefinition, endpointName) {
    const incoming = useMemo(() => ({
        queryArgs,
        serialized: typeof queryArgs == "object" ? serialize({ queryArgs, endpointDefinition, endpointName }) : queryArgs
    }), [queryArgs, serialize, endpointDefinition, endpointName]);
    const cache = useRef(incoming);
    useEffect(() => {
        if (cache.current.serialized !== incoming.serialized) {
            cache.current = incoming;
        }
    }, [incoming]);
    return cache.current.serialized === incoming.serialized ? cache.current.queryArgs : queryArgs;
}
// src/query/react/constants.ts
var UNINITIALIZED_VALUE = Symbol();
// src/query/react/useShallowStableValue.ts
import { useEffect as useEffect2, useRef as useRef2 } from "react";
import { shallowEqual } from "react-redux";
function useShallowStableValue(value) {
    const cache = useRef2(value);
    useEffect2(() => {
        if (!shallowEqual(cache.current, value)) {
            cache.current = value;
        }
    }, [value]);
    return shallowEqual(cache.current, value) ? cache.current : value;
}
// src/query/react/buildHooks.ts
var useIsomorphicLayoutEffect = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined" ? useLayoutEffect : useEffect3;
var defaultQueryStateSelector = (x) => x;
var defaultMutationStateSelector = (x) => x;
var noPendingQueryStateSelector = (selected) => {
    if (selected.isUninitialized) {
        return __spreadProps(__spreadValues({}, selected), {
            isUninitialized: false,
            isFetching: true,
            isLoading: selected.data !== void 0 ? false : true,
            status: QueryStatus.pending
        });
    }
    return selected;
};
function buildHooks({ api, moduleOptions: { batch, useDispatch, useSelector, useStore, unstable__sideEffectsInRender }, serializeQueryArgs, context }) {
    const usePossiblyImmediateEffect = unstable__sideEffectsInRender ? (cb) => cb() : useEffect3;
    return { buildQueryHooks, buildMutationHook, usePrefetch };
    function queryStatePreSelector(currentState, lastResult, queryArgs) {
        if ((lastResult == null ? void 0 : lastResult.endpointName) && currentState.isUninitialized) {
            const { endpointName } = lastResult;
            const endpointDefinition = context.endpointDefinitions[endpointName];
            if (serializeQueryArgs({
                queryArgs: lastResult.originalArgs,
                endpointDefinition,
                endpointName
            }) === serializeQueryArgs({
                queryArgs,
                endpointDefinition,
                endpointName
            }))
                lastResult = void 0;
        }
        let data = currentState.isSuccess ? currentState.data : lastResult == null ? void 0 : lastResult.data;
        if (data === void 0)
            data = currentState.data;
        const hasData = data !== void 0;
        const isFetching = currentState.isLoading;
        const isLoading = !hasData && isFetching;
        const isSuccess = currentState.isSuccess || isFetching && hasData;
        return __spreadProps(__spreadValues({}, currentState), {
            data,
            currentData: currentState.data,
            isFetching,
            isLoading,
            isSuccess
        });
    }
    function usePrefetch(endpointName, defaultOptions) {
        const dispatch = useDispatch();
        const stableDefaultOptions = useShallowStableValue(defaultOptions);
        return useCallback((arg, options) => dispatch(api.util.prefetch(endpointName, arg, __spreadValues(__spreadValues({}, stableDefaultOptions), options))), [endpointName, dispatch, stableDefaultOptions]);
    }
    function buildQueryHooks(name) {
        const useQuerySubscription = (arg, { refetchOnReconnect, refetchOnFocus, refetchOnMountOrArgChange, skip = false, pollingInterval = 0 } = {}) => {
            const { initiate } = api.endpoints[name];
            const dispatch = useDispatch();
            const stableArg = useStableQueryArgs(skip ? skipToken : arg, serializeQueryArgs, context.endpointDefinitions[name], name);
            const stableSubscriptionOptions = useShallowStableValue({
                refetchOnReconnect,
                refetchOnFocus,
                pollingInterval
            });
            const promiseRef = useRef3();
            let { queryCacheKey, requestId } = promiseRef.current || {};
            const subscriptionRemoved = useSelector((state) => {
                var _a;
                return !!queryCacheKey && !!requestId && !((_a = state[api.reducerPath].subscriptions[queryCacheKey]) == null ? void 0 : _a[requestId]);
            });
            usePossiblyImmediateEffect(() => {
                promiseRef.current = void 0;
            }, [subscriptionRemoved]);
            usePossiblyImmediateEffect(() => {
                var _a;
                const lastPromise = promiseRef.current;
                if (typeof process !== "undefined" && process.env.NODE_ENV === "removeMeOnCompilation") {
                    console.log(subscriptionRemoved);
                }
                if (stableArg === skipToken) {
                    lastPromise == null ? void 0 : lastPromise.unsubscribe();
                    promiseRef.current = void 0;
                    return;
                }
                const lastSubscriptionOptions = (_a = promiseRef.current) == null ? void 0 : _a.subscriptionOptions;
                if (!lastPromise || lastPromise.arg !== stableArg) {
                    lastPromise == null ? void 0 : lastPromise.unsubscribe();
                    const promise = dispatch(initiate(stableArg, {
                        subscriptionOptions: stableSubscriptionOptions,
                        forceRefetch: refetchOnMountOrArgChange
                    }));
                    promiseRef.current = promise;
                }
                else if (stableSubscriptionOptions !== lastSubscriptionOptions) {
                    lastPromise.updateSubscriptionOptions(stableSubscriptionOptions);
                }
            }, [
                dispatch,
                initiate,
                refetchOnMountOrArgChange,
                stableArg,
                stableSubscriptionOptions,
                subscriptionRemoved
            ]);
            useEffect3(() => {
                return () => {
                    var _a;
                    (_a = promiseRef.current) == null ? void 0 : _a.unsubscribe();
                    promiseRef.current = void 0;
                };
            }, []);
            return useMemo2(() => ({
                refetch: () => {
                    var _a;
                    return void ((_a = promiseRef.current) == null ? void 0 : _a.refetch());
                }
            }), []);
        };
        const useLazyQuerySubscription = ({ refetchOnReconnect, refetchOnFocus, pollingInterval = 0 } = {}) => {
            const { initiate } = api.endpoints[name];
            const dispatch = useDispatch();
            const [arg, setArg] = useState(UNINITIALIZED_VALUE);
            const promiseRef = useRef3();
            const stableSubscriptionOptions = useShallowStableValue({
                refetchOnReconnect,
                refetchOnFocus,
                pollingInterval
            });
            usePossiblyImmediateEffect(() => {
                var _a, _b;
                const lastSubscriptionOptions = (_a = promiseRef.current) == null ? void 0 : _a.subscriptionOptions;
                if (stableSubscriptionOptions !== lastSubscriptionOptions) {
                    (_b = promiseRef.current) == null ? void 0 : _b.updateSubscriptionOptions(stableSubscriptionOptions);
                }
            }, [stableSubscriptionOptions]);
            const subscriptionOptionsRef = useRef3(stableSubscriptionOptions);
            usePossiblyImmediateEffect(() => {
                subscriptionOptionsRef.current = stableSubscriptionOptions;
            }, [stableSubscriptionOptions]);
            const trigger = useCallback(function (arg2, preferCacheValue = false) {
                let promise;
                batch(() => {
                    var _a;
                    (_a = promiseRef.current) == null ? void 0 : _a.unsubscribe();
                    promiseRef.current = promise = dispatch(initiate(arg2, {
                        subscriptionOptions: subscriptionOptionsRef.current,
                        forceRefetch: !preferCacheValue
                    }));
                    setArg(arg2);
                });
                return promise;
            }, [dispatch, initiate]);
            useEffect3(() => {
                return () => {
                    var _a;
                    (_a = promiseRef == null ? void 0 : promiseRef.current) == null ? void 0 : _a.unsubscribe();
                };
            }, []);
            useEffect3(() => {
                if (arg !== UNINITIALIZED_VALUE && !promiseRef.current) {
                    trigger(arg, true);
                }
            }, [arg, trigger]);
            return useMemo2(() => [trigger, arg], [trigger, arg]);
        };
        const useQueryState = (arg, { skip = false, selectFromResult = defaultQueryStateSelector } = {}) => {
            const { select } = api.endpoints[name];
            const stableArg = useStableQueryArgs(skip ? skipToken : arg, serializeQueryArgs, context.endpointDefinitions[name], name);
            const lastValue = useRef3();
            const selectDefaultResult = useMemo2(() => createSelector([
                select(stableArg),
                (_, lastResult) => lastResult,
                (_) => stableArg
            ], queryStatePreSelector), [select, stableArg]);
            const querySelector = useMemo2(() => createSelector([selectDefaultResult], selectFromResult), [selectDefaultResult, selectFromResult]);
            const currentState = useSelector((state) => querySelector(state, lastValue.current), shallowEqual2);
            const store = useStore();
            const newLastValue = selectDefaultResult(store.getState(), lastValue.current);
            useIsomorphicLayoutEffect(() => {
                lastValue.current = newLastValue;
            }, [newLastValue]);
            return currentState;
        };
        return {
            useQueryState,
            useQuerySubscription,
            useLazyQuerySubscription,
            useLazyQuery(options) {
                const [trigger, arg] = useLazyQuerySubscription(options);
                const queryStateResults = useQueryState(arg, __spreadProps(__spreadValues({}, options), {
                    skip: arg === UNINITIALIZED_VALUE
                }));
                const info = useMemo2(() => ({ lastArg: arg }), [arg]);
                return useMemo2(() => [trigger, queryStateResults, info], [trigger, queryStateResults, info]);
            },
            useQuery(arg, options) {
                const querySubscriptionResults = useQuerySubscription(arg, options);
                const queryStateResults = useQueryState(arg, __spreadValues({
                    selectFromResult: arg === skipToken || (options == null ? void 0 : options.skip) ? void 0 : noPendingQueryStateSelector
                }, options));
                return useMemo2(() => __spreadValues(__spreadValues({}, queryStateResults), querySubscriptionResults), [queryStateResults, querySubscriptionResults]);
            }
        };
    }
    function buildMutationHook(name) {
        return ({ selectFromResult = defaultMutationStateSelector, fixedCacheKey } = {}) => {
            const { select, initiate } = api.endpoints[name];
            const dispatch = useDispatch();
            const [promise, setPromise] = useState();
            useEffect3(() => () => {
                if (!(promise == null ? void 0 : promise.arg.fixedCacheKey)) {
                    promise == null ? void 0 : promise.reset();
                }
            }, [promise]);
            const triggerMutation = useCallback(function (arg) {
                const promise2 = dispatch(initiate(arg, { fixedCacheKey }));
                setPromise(promise2);
                return promise2;
            }, [dispatch, initiate, fixedCacheKey]);
            const { requestId } = promise || {};
            const mutationSelector = useMemo2(() => createSelector([select({ fixedCacheKey, requestId: promise == null ? void 0 : promise.requestId })], selectFromResult), [select, promise, selectFromResult, fixedCacheKey]);
            const currentState = useSelector(mutationSelector, shallowEqual2);
            const originalArgs = fixedCacheKey == null ? promise == null ? void 0 : promise.arg.originalArgs : void 0;
            const reset = useCallback(() => {
                batch(() => {
                    if (promise) {
                        setPromise(void 0);
                    }
                    if (fixedCacheKey) {
                        dispatch(api.internalActions.removeMutationResult({
                            requestId,
                            fixedCacheKey
                        }));
                    }
                });
            }, [dispatch, fixedCacheKey, promise, requestId]);
            const finalState = useMemo2(() => __spreadProps(__spreadValues({}, currentState), { originalArgs, reset }), [currentState, originalArgs, reset]);
            return useMemo2(() => [triggerMutation, finalState], [triggerMutation, finalState]);
        };
    }
}
// src/query/endpointDefinitions.ts
var DefinitionType;
(function (DefinitionType2) {
    DefinitionType2["query"] = "query";
    DefinitionType2["mutation"] = "mutation";
})(DefinitionType || (DefinitionType = {}));
function isQueryDefinition(e) {
    return e.type === DefinitionType.query;
}
function isMutationDefinition(e) {
    return e.type === DefinitionType.mutation;
}
// src/query/utils/capitalize.ts
function capitalize(str) {
    return str.replace(str[0], str[0].toUpperCase());
}
// src/query/tsHelpers.ts
function safeAssign(target, ...args) {
    Object.assign(target, ...args);
}
// src/query/react/module.ts
import { useDispatch as rrUseDispatch, useSelector as rrUseSelector, useStore as rrUseStore, batch as rrBatch } from "react-redux";
var reactHooksModuleName = /* @__PURE__ */ Symbol();
var reactHooksModule = ({ batch = rrBatch, useDispatch = rrUseDispatch, useSelector = rrUseSelector, useStore = rrUseStore, unstable__sideEffectsInRender = false } = {}) => ({
    name: reactHooksModuleName,
    init(api, { serializeQueryArgs }, context) {
        const anyApi = api;
        const { buildQueryHooks, buildMutationHook, usePrefetch } = buildHooks({
            api,
            moduleOptions: {
                batch,
                useDispatch,
                useSelector,
                useStore,
                unstable__sideEffectsInRender
            },
            serializeQueryArgs,
            context
        });
        safeAssign(anyApi, { usePrefetch });
        safeAssign(context, { batch });
        return {
            injectEndpoint(endpointName, definition) {
                if (isQueryDefinition(definition)) {
                    const { useQuery, useLazyQuery, useLazyQuerySubscription, useQueryState, useQuerySubscription } = buildQueryHooks(endpointName);
                    safeAssign(anyApi.endpoints[endpointName], {
                        useQuery,
                        useLazyQuery,
                        useLazyQuerySubscription,
                        useQueryState,
                        useQuerySubscription
                    });
                    api[`use${capitalize(endpointName)}Query`] = useQuery;
                    api[`useLazy${capitalize(endpointName)}Query`] = useLazyQuery;
                }
                else if (isMutationDefinition(definition)) {
                    const useMutation = buildMutationHook(endpointName);
                    safeAssign(anyApi.endpoints[endpointName], {
                        useMutation
                    });
                    api[`use${capitalize(endpointName)}Mutation`] = useMutation;
                }
            }
        };
    }
});
// src/query/react/index.ts
export * from "@reduxjs/toolkit/query";
// src/query/react/ApiProvider.tsx
import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
function ApiProvider(props) {
    const [store] = React.useState(() => configureStore({
        reducer: {
            [props.api.reducerPath]: props.api.reducer
        },
        middleware: (gDM) => gDM().concat(props.api.middleware)
    }));
    setupListeners(store.dispatch, props.setupListeners);
    return /* @__PURE__ */ React.createElement(Provider, {
        store,
        context: props.context
    }, props.children);
}
// src/query/react/index.ts
var createApi = /* @__PURE__ */ buildCreateApi(coreModule(), reactHooksModule());
export { ApiProvider, createApi, reactHooksModule };
//# sourceMappingURL=rtk-query-react.modern.js.map