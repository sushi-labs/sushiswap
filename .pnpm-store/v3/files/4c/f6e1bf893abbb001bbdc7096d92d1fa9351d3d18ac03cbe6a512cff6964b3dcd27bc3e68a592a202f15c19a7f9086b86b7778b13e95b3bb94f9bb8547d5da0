var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = function (obj, key, value) { return key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value }) : obj[key] = value; };
var __spreadValues = function (a, b) {
    for (var prop in b || (b = {}))
        if (__hasOwnProp.call(b, prop))
            __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
        for (var _i = 0, _c = __getOwnPropSymbols(b); _i < _c.length; _i++) {
            var prop = _c[_i];
            if (__propIsEnum.call(b, prop))
                __defNormalProp(a, prop, b[prop]);
        }
    return a;
};
var __spreadProps = function (a, b) { return __defProps(a, __getOwnPropDescs(b)); };
var __markAsModule = function (target) { return __defProp(target, "__esModule", { value: true }); };
var __export = function (target, all) {
    for (var name in all)
        __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = function (target, module2, desc) {
    if (module2 && typeof module2 === "object" || typeof module2 === "function") {
        var _loop_1 = function (key) {
            if (!__hasOwnProp.call(target, key) && key !== "default")
                __defProp(target, key, { get: function () { return module2[key]; }, enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
        };
        for (var _i = 0, _c = __getOwnPropNames(module2); _i < _c.length; _i++) {
            var key = _c[_i];
            _loop_1(key);
        }
    }
    return target;
};
var __toModule = function (module2) {
    return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: function () { return module2.default; }, enumerable: true } : { value: module2, enumerable: true })), module2);
};
// src/query/react/index.ts
__markAsModule(exports);
__export(exports, {
    ApiProvider: function () { return ApiProvider; },
    createApi: function () { return createApi; },
    reactHooksModule: function () { return reactHooksModule; }
});
var import_query3 = __toModule(require("@reduxjs/toolkit/query"));
// src/query/react/buildHooks.ts
var import_toolkit = __toModule(require("@reduxjs/toolkit"));
var import_react3 = __toModule(require("react"));
var import_query = __toModule(require("@reduxjs/toolkit/query"));
var import_react_redux2 = __toModule(require("react-redux"));
// src/query/react/useSerializedStableValue.ts
var import_react = __toModule(require("react"));
function useStableQueryArgs(queryArgs, serialize, endpointDefinition, endpointName) {
    var incoming = (0, import_react.useMemo)(function () { return ({
        queryArgs: queryArgs,
        serialized: typeof queryArgs == "object" ? serialize({ queryArgs: queryArgs, endpointDefinition: endpointDefinition, endpointName: endpointName }) : queryArgs
    }); }, [queryArgs, serialize, endpointDefinition, endpointName]);
    var cache = (0, import_react.useRef)(incoming);
    (0, import_react.useEffect)(function () {
        if (cache.current.serialized !== incoming.serialized) {
            cache.current = incoming;
        }
    }, [incoming]);
    return cache.current.serialized === incoming.serialized ? cache.current.queryArgs : queryArgs;
}
// src/query/react/constants.ts
var UNINITIALIZED_VALUE = Symbol();
// src/query/react/useShallowStableValue.ts
var import_react2 = __toModule(require("react"));
var import_react_redux = __toModule(require("react-redux"));
function useShallowStableValue(value) {
    var cache = (0, import_react2.useRef)(value);
    (0, import_react2.useEffect)(function () {
        if (!(0, import_react_redux.shallowEqual)(cache.current, value)) {
            cache.current = value;
        }
    }, [value]);
    return (0, import_react_redux.shallowEqual)(cache.current, value) ? cache.current : value;
}
// src/query/react/buildHooks.ts
var useIsomorphicLayoutEffect = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined" ? import_react3.useLayoutEffect : import_react3.useEffect;
var defaultQueryStateSelector = function (x) { return x; };
var defaultMutationStateSelector = function (x) { return x; };
var noPendingQueryStateSelector = function (selected) {
    if (selected.isUninitialized) {
        return __spreadProps(__spreadValues({}, selected), {
            isUninitialized: false,
            isFetching: true,
            isLoading: selected.data !== void 0 ? false : true,
            status: import_query.QueryStatus.pending
        });
    }
    return selected;
};
function buildHooks(_c) {
    var api = _c.api, _d = _c.moduleOptions, batch = _d.batch, useDispatch = _d.useDispatch, useSelector = _d.useSelector, useStore = _d.useStore, unstable__sideEffectsInRender = _d.unstable__sideEffectsInRender, serializeQueryArgs = _c.serializeQueryArgs, context = _c.context;
    var usePossiblyImmediateEffect = unstable__sideEffectsInRender ? function (cb) { return cb(); } : import_react3.useEffect;
    return { buildQueryHooks: buildQueryHooks, buildMutationHook: buildMutationHook, usePrefetch: usePrefetch };
    function queryStatePreSelector(currentState, lastResult, queryArgs) {
        if ((lastResult == null ? void 0 : lastResult.endpointName) && currentState.isUninitialized) {
            var endpointName = lastResult.endpointName;
            var endpointDefinition = context.endpointDefinitions[endpointName];
            if (serializeQueryArgs({
                queryArgs: lastResult.originalArgs,
                endpointDefinition: endpointDefinition,
                endpointName: endpointName
            }) === serializeQueryArgs({
                queryArgs: queryArgs,
                endpointDefinition: endpointDefinition,
                endpointName: endpointName
            }))
                lastResult = void 0;
        }
        var data = currentState.isSuccess ? currentState.data : lastResult == null ? void 0 : lastResult.data;
        if (data === void 0)
            data = currentState.data;
        var hasData = data !== void 0;
        var isFetching = currentState.isLoading;
        var isLoading = !hasData && isFetching;
        var isSuccess = currentState.isSuccess || isFetching && hasData;
        return __spreadProps(__spreadValues({}, currentState), {
            data: data,
            currentData: currentState.data,
            isFetching: isFetching,
            isLoading: isLoading,
            isSuccess: isSuccess
        });
    }
    function usePrefetch(endpointName, defaultOptions) {
        var dispatch = useDispatch();
        var stableDefaultOptions = useShallowStableValue(defaultOptions);
        return (0, import_react3.useCallback)(function (arg, options) { return dispatch(api.util.prefetch(endpointName, arg, __spreadValues(__spreadValues({}, stableDefaultOptions), options))); }, [endpointName, dispatch, stableDefaultOptions]);
    }
    function buildQueryHooks(name) {
        var useQuerySubscription = function (arg, _c) {
            var _d = _c === void 0 ? {} : _c, refetchOnReconnect = _d.refetchOnReconnect, refetchOnFocus = _d.refetchOnFocus, refetchOnMountOrArgChange = _d.refetchOnMountOrArgChange, _e = _d.skip, skip = _e === void 0 ? false : _e, _f = _d.pollingInterval, pollingInterval = _f === void 0 ? 0 : _f;
            var initiate = api.endpoints[name].initiate;
            var dispatch = useDispatch();
            var stableArg = useStableQueryArgs(skip ? import_query.skipToken : arg, serializeQueryArgs, context.endpointDefinitions[name], name);
            var stableSubscriptionOptions = useShallowStableValue({
                refetchOnReconnect: refetchOnReconnect,
                refetchOnFocus: refetchOnFocus,
                pollingInterval: pollingInterval
            });
            var promiseRef = (0, import_react3.useRef)();
            var _g = promiseRef.current || {}, queryCacheKey = _g.queryCacheKey, requestId = _g.requestId;
            var subscriptionRemoved = useSelector(function (state) {
                var _a;
                return !!queryCacheKey && !!requestId && !((_a = state[api.reducerPath].subscriptions[queryCacheKey]) == null ? void 0 : _a[requestId]);
            });
            usePossiblyImmediateEffect(function () {
                promiseRef.current = void 0;
            }, [subscriptionRemoved]);
            usePossiblyImmediateEffect(function () {
                var _a;
                var lastPromise = promiseRef.current;
                if (typeof process !== "undefined" && false) {
                    console.log(subscriptionRemoved);
                }
                if (stableArg === import_query.skipToken) {
                    lastPromise == null ? void 0 : lastPromise.unsubscribe();
                    promiseRef.current = void 0;
                    return;
                }
                var lastSubscriptionOptions = (_a = promiseRef.current) == null ? void 0 : _a.subscriptionOptions;
                if (!lastPromise || lastPromise.arg !== stableArg) {
                    lastPromise == null ? void 0 : lastPromise.unsubscribe();
                    var promise = dispatch(initiate(stableArg, {
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
            (0, import_react3.useEffect)(function () {
                return function () {
                    var _a;
                    (_a = promiseRef.current) == null ? void 0 : _a.unsubscribe();
                    promiseRef.current = void 0;
                };
            }, []);
            return (0, import_react3.useMemo)(function () { return ({
                refetch: function () {
                    var _a;
                    return void ((_a = promiseRef.current) == null ? void 0 : _a.refetch());
                }
            }); }, []);
        };
        var useLazyQuerySubscription = function (_c) {
            var _d = _c === void 0 ? {} : _c, refetchOnReconnect = _d.refetchOnReconnect, refetchOnFocus = _d.refetchOnFocus, _e = _d.pollingInterval, pollingInterval = _e === void 0 ? 0 : _e;
            var initiate = api.endpoints[name].initiate;
            var dispatch = useDispatch();
            var _f = (0, import_react3.useState)(UNINITIALIZED_VALUE), arg = _f[0], setArg = _f[1];
            var promiseRef = (0, import_react3.useRef)();
            var stableSubscriptionOptions = useShallowStableValue({
                refetchOnReconnect: refetchOnReconnect,
                refetchOnFocus: refetchOnFocus,
                pollingInterval: pollingInterval
            });
            usePossiblyImmediateEffect(function () {
                var _a, _b;
                var lastSubscriptionOptions = (_a = promiseRef.current) == null ? void 0 : _a.subscriptionOptions;
                if (stableSubscriptionOptions !== lastSubscriptionOptions) {
                    (_b = promiseRef.current) == null ? void 0 : _b.updateSubscriptionOptions(stableSubscriptionOptions);
                }
            }, [stableSubscriptionOptions]);
            var subscriptionOptionsRef = (0, import_react3.useRef)(stableSubscriptionOptions);
            usePossiblyImmediateEffect(function () {
                subscriptionOptionsRef.current = stableSubscriptionOptions;
            }, [stableSubscriptionOptions]);
            var trigger = (0, import_react3.useCallback)(function (arg2, preferCacheValue) {
                if (preferCacheValue === void 0) { preferCacheValue = false; }
                var promise;
                batch(function () {
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
            (0, import_react3.useEffect)(function () {
                return function () {
                    var _a;
                    (_a = promiseRef == null ? void 0 : promiseRef.current) == null ? void 0 : _a.unsubscribe();
                };
            }, []);
            (0, import_react3.useEffect)(function () {
                if (arg !== UNINITIALIZED_VALUE && !promiseRef.current) {
                    trigger(arg, true);
                }
            }, [arg, trigger]);
            return (0, import_react3.useMemo)(function () { return [trigger, arg]; }, [trigger, arg]);
        };
        var useQueryState = function (arg, _c) {
            var _d = _c === void 0 ? {} : _c, _e = _d.skip, skip = _e === void 0 ? false : _e, _f = _d.selectFromResult, selectFromResult = _f === void 0 ? defaultQueryStateSelector : _f;
            var select = api.endpoints[name].select;
            var stableArg = useStableQueryArgs(skip ? import_query.skipToken : arg, serializeQueryArgs, context.endpointDefinitions[name], name);
            var lastValue = (0, import_react3.useRef)();
            var selectDefaultResult = (0, import_react3.useMemo)(function () { return (0, import_toolkit.createSelector)([
                select(stableArg),
                function (_, lastResult) { return lastResult; },
                function (_) { return stableArg; }
            ], queryStatePreSelector); }, [select, stableArg]);
            var querySelector = (0, import_react3.useMemo)(function () { return (0, import_toolkit.createSelector)([selectDefaultResult], selectFromResult); }, [selectDefaultResult, selectFromResult]);
            var currentState = useSelector(function (state) { return querySelector(state, lastValue.current); }, import_react_redux2.shallowEqual);
            var store = useStore();
            var newLastValue = selectDefaultResult(store.getState(), lastValue.current);
            useIsomorphicLayoutEffect(function () {
                lastValue.current = newLastValue;
            }, [newLastValue]);
            return currentState;
        };
        return {
            useQueryState: useQueryState,
            useQuerySubscription: useQuerySubscription,
            useLazyQuerySubscription: useLazyQuerySubscription,
            useLazyQuery: function (options) {
                var _c = useLazyQuerySubscription(options), trigger = _c[0], arg = _c[1];
                var queryStateResults = useQueryState(arg, __spreadProps(__spreadValues({}, options), {
                    skip: arg === UNINITIALIZED_VALUE
                }));
                var info = (0, import_react3.useMemo)(function () { return ({ lastArg: arg }); }, [arg]);
                return (0, import_react3.useMemo)(function () { return [trigger, queryStateResults, info]; }, [trigger, queryStateResults, info]);
            },
            useQuery: function (arg, options) {
                var querySubscriptionResults = useQuerySubscription(arg, options);
                var queryStateResults = useQueryState(arg, __spreadValues({
                    selectFromResult: arg === import_query.skipToken || (options == null ? void 0 : options.skip) ? void 0 : noPendingQueryStateSelector
                }, options));
                return (0, import_react3.useMemo)(function () { return __spreadValues(__spreadValues({}, queryStateResults), querySubscriptionResults); }, [queryStateResults, querySubscriptionResults]);
            }
        };
    }
    function buildMutationHook(name) {
        return function (_c) {
            var _d = _c === void 0 ? {} : _c, _e = _d.selectFromResult, selectFromResult = _e === void 0 ? defaultMutationStateSelector : _e, fixedCacheKey = _d.fixedCacheKey;
            var _f = api.endpoints[name], select = _f.select, initiate = _f.initiate;
            var dispatch = useDispatch();
            var _g = (0, import_react3.useState)(), promise = _g[0], setPromise = _g[1];
            (0, import_react3.useEffect)(function () { return function () {
                if (!(promise == null ? void 0 : promise.arg.fixedCacheKey)) {
                    promise == null ? void 0 : promise.reset();
                }
            }; }, [promise]);
            var triggerMutation = (0, import_react3.useCallback)(function (arg) {
                var promise2 = dispatch(initiate(arg, { fixedCacheKey: fixedCacheKey }));
                setPromise(promise2);
                return promise2;
            }, [dispatch, initiate, fixedCacheKey]);
            var requestId = (promise || {}).requestId;
            var mutationSelector = (0, import_react3.useMemo)(function () { return (0, import_toolkit.createSelector)([select({ fixedCacheKey: fixedCacheKey, requestId: promise == null ? void 0 : promise.requestId })], selectFromResult); }, [select, promise, selectFromResult, fixedCacheKey]);
            var currentState = useSelector(mutationSelector, import_react_redux2.shallowEqual);
            var originalArgs = fixedCacheKey == null ? promise == null ? void 0 : promise.arg.originalArgs : void 0;
            var reset = (0, import_react3.useCallback)(function () {
                batch(function () {
                    if (promise) {
                        setPromise(void 0);
                    }
                    if (fixedCacheKey) {
                        dispatch(api.internalActions.removeMutationResult({
                            requestId: requestId,
                            fixedCacheKey: fixedCacheKey
                        }));
                    }
                });
            }, [dispatch, fixedCacheKey, promise, requestId]);
            var finalState = (0, import_react3.useMemo)(function () { return __spreadProps(__spreadValues({}, currentState), { originalArgs: originalArgs, reset: reset }); }, [currentState, originalArgs, reset]);
            return (0, import_react3.useMemo)(function () { return [triggerMutation, finalState]; }, [triggerMutation, finalState]);
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
function safeAssign(target) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    Object.assign.apply(Object, __spreadArray([target], args));
}
// src/query/react/module.ts
var import_react_redux3 = __toModule(require("react-redux"));
var reactHooksModuleName = /* @__PURE__ */ Symbol();
var reactHooksModule = function (_c) {
    var _d = _c === void 0 ? {} : _c, _e = _d.batch, batch = _e === void 0 ? import_react_redux3.batch : _e, _f = _d.useDispatch, useDispatch = _f === void 0 ? import_react_redux3.useDispatch : _f, _g = _d.useSelector, useSelector = _g === void 0 ? import_react_redux3.useSelector : _g, _h = _d.useStore, useStore = _h === void 0 ? import_react_redux3.useStore : _h, _j = _d.unstable__sideEffectsInRender, unstable__sideEffectsInRender = _j === void 0 ? false : _j;
    return ({
        name: reactHooksModuleName,
        init: function (api, _c, context) {
            var serializeQueryArgs = _c.serializeQueryArgs;
            var anyApi = api;
            var _d = buildHooks({
                api: api,
                moduleOptions: {
                    batch: batch,
                    useDispatch: useDispatch,
                    useSelector: useSelector,
                    useStore: useStore,
                    unstable__sideEffectsInRender: unstable__sideEffectsInRender
                },
                serializeQueryArgs: serializeQueryArgs,
                context: context
            }), buildQueryHooks = _d.buildQueryHooks, buildMutationHook = _d.buildMutationHook, usePrefetch = _d.usePrefetch;
            safeAssign(anyApi, { usePrefetch: usePrefetch });
            safeAssign(context, { batch: batch });
            return {
                injectEndpoint: function (endpointName, definition) {
                    if (isQueryDefinition(definition)) {
                        var _c = buildQueryHooks(endpointName), useQuery = _c.useQuery, useLazyQuery = _c.useLazyQuery, useLazyQuerySubscription = _c.useLazyQuerySubscription, useQueryState = _c.useQueryState, useQuerySubscription = _c.useQuerySubscription;
                        safeAssign(anyApi.endpoints[endpointName], {
                            useQuery: useQuery,
                            useLazyQuery: useLazyQuery,
                            useLazyQuerySubscription: useLazyQuerySubscription,
                            useQueryState: useQueryState,
                            useQuerySubscription: useQuerySubscription
                        });
                        api["use" + capitalize(endpointName) + "Query"] = useQuery;
                        api["useLazy" + capitalize(endpointName) + "Query"] = useLazyQuery;
                    }
                    else if (isMutationDefinition(definition)) {
                        var useMutation = buildMutationHook(endpointName);
                        safeAssign(anyApi.endpoints[endpointName], {
                            useMutation: useMutation
                        });
                        api["use" + capitalize(endpointName) + "Mutation"] = useMutation;
                    }
                }
            };
        }
    });
};
// src/query/react/index.ts
__reExport(exports, __toModule(require("@reduxjs/toolkit/query")));
// src/query/react/ApiProvider.tsx
var import_toolkit2 = __toModule(require("@reduxjs/toolkit"));
var import_react4 = __toModule(require("react"));
var import_react_redux4 = __toModule(require("react-redux"));
var import_query2 = __toModule(require("@reduxjs/toolkit/query"));
function ApiProvider(props) {
    var store = import_react4.default.useState(function () {
        var _c;
        return (0, import_toolkit2.configureStore)({
            reducer: (_c = {},
                _c[props.api.reducerPath] = props.api.reducer,
                _c),
            middleware: function (gDM) { return gDM().concat(props.api.middleware); }
        });
    })[0];
    (0, import_query2.setupListeners)(store.dispatch, props.setupListeners);
    return /* @__PURE__ */ import_react4.default.createElement(import_react_redux4.Provider, {
        store: store,
        context: props.context
    }, props.children);
}
// src/query/react/index.ts
var createApi = /* @__PURE__ */ (0, import_query3.buildCreateApi)((0, import_query3.coreModule)(), reactHooksModule());
//# sourceMappingURL=rtk-query-react.cjs.development.js.map