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
var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
        if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
            target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
        for (var prop of __getOwnPropSymbols(source)) {
            if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
                target[prop] = source[prop];
        }
    return target;
};
// src/query/core/apiState.ts
var QueryStatus;
(function (QueryStatus2) {
    QueryStatus2["uninitialized"] = "uninitialized";
    QueryStatus2["pending"] = "pending";
    QueryStatus2["fulfilled"] = "fulfilled";
    QueryStatus2["rejected"] = "rejected";
})(QueryStatus || (QueryStatus = {}));
function getRequestStatusFlags(status) {
    return {
        status,
        isUninitialized: status === QueryStatus.uninitialized,
        isLoading: status === QueryStatus.pending,
        isSuccess: status === QueryStatus.fulfilled,
        isError: status === QueryStatus.rejected
    };
}
// src/query/utils/isAbsoluteUrl.ts
function isAbsoluteUrl(url) {
    return new RegExp(`(^|:)//`).test(url);
}
// src/query/utils/joinUrls.ts
var withoutTrailingSlash = (url) => url.replace(/\/$/, "");
var withoutLeadingSlash = (url) => url.replace(/^\//, "");
function joinUrls(base, url) {
    if (!base) {
        return url;
    }
    if (!url) {
        return base;
    }
    if (isAbsoluteUrl(url)) {
        return url;
    }
    base = withoutTrailingSlash(base);
    url = withoutLeadingSlash(url);
    return `${base}/${url}`;
}
// src/query/utils/flatten.ts
var flatten = (arr) => [].concat(...arr);
// src/query/utils/isOnline.ts
function isOnline() {
    return typeof navigator === "undefined" ? true : navigator.onLine === void 0 ? true : navigator.onLine;
}
// src/query/utils/isDocumentVisible.ts
function isDocumentVisible() {
    if (typeof document === "undefined") {
        return true;
    }
    return document.visibilityState !== "hidden";
}
// src/query/utils/copyWithStructuralSharing.ts
import { isPlainObject as _iPO } from "@reduxjs/toolkit";
var isPlainObject = _iPO;
function copyWithStructuralSharing(oldObj, newObj) {
    if (oldObj === newObj || !(isPlainObject(oldObj) && isPlainObject(newObj) || Array.isArray(oldObj) && Array.isArray(newObj))) {
        return newObj;
    }
    const newKeys = Object.keys(newObj);
    const oldKeys = Object.keys(oldObj);
    let isSameObject = newKeys.length === oldKeys.length;
    const mergeObj = Array.isArray(newObj) ? [] : {};
    for (const key of newKeys) {
        mergeObj[key] = copyWithStructuralSharing(oldObj[key], newObj[key]);
        if (isSameObject)
            isSameObject = oldObj[key] === mergeObj[key];
    }
    return isSameObject ? oldObj : mergeObj;
}
// src/query/fetchBaseQuery.ts
import { isPlainObject as isPlainObject2 } from "@reduxjs/toolkit";
var defaultFetchFn = (...args) => fetch(...args);
var defaultValidateStatus = (response) => response.status >= 200 && response.status <= 299;
var isJsonContentType = (headers) => {
    var _a, _b;
    return (_b = (_a = headers.get("content-type")) == null ? void 0 : _a.trim()) == null ? void 0 : _b.startsWith("application/json");
};
var handleResponse = async (response, responseHandler) => {
    if (typeof responseHandler === "function") {
        return responseHandler(response);
    }
    if (responseHandler === "text") {
        return response.text();
    }
    if (responseHandler === "json") {
        const text = await response.text();
        return text.length ? JSON.parse(text) : null;
    }
};
function stripUndefined(obj) {
    if (!isPlainObject2(obj)) {
        return obj;
    }
    const copy = __spreadValues({}, obj);
    for (const [k, v] of Object.entries(copy)) {
        if (typeof v === "undefined")
            delete copy[k];
    }
    return copy;
}
function fetchBaseQuery(_a = {}) {
    var _b = _a, { baseUrl, prepareHeaders = (x) => x, fetchFn = defaultFetchFn, paramsSerializer } = _b, baseFetchOptions = __objRest(_b, [
        "baseUrl",
        "prepareHeaders",
        "fetchFn",
        "paramsSerializer"
    ]);
    if (typeof fetch === "undefined" && fetchFn === defaultFetchFn) {
        console.warn("Warning: `fetch` is not available. Please supply a custom `fetchFn` property to use `fetchBaseQuery` on SSR environments.");
    }
    return async (arg, api) => {
        const { signal, getState, extra, endpoint, forced, type } = api;
        let meta;
        let _a2 = typeof arg == "string" ? { url: arg } : arg, { url, method = "GET", headers = new Headers({}), body = void 0, params = void 0, responseHandler = "json", validateStatus = defaultValidateStatus } = _a2, rest = __objRest(_a2, [
            "url",
            "method",
            "headers",
            "body",
            "params",
            "responseHandler",
            "validateStatus"
        ]);
        let config = __spreadValues(__spreadProps(__spreadValues({}, baseFetchOptions), {
            method,
            signal,
            body
        }), rest);
        config.headers = await prepareHeaders(new Headers(stripUndefined(headers)), { getState, extra, endpoint, forced, type });
        const isJsonifiable = (body2) => typeof body2 === "object" && (isPlainObject2(body2) || Array.isArray(body2) || typeof body2.toJSON === "function");
        if (!config.headers.has("content-type") && isJsonifiable(body)) {
            config.headers.set("content-type", "application/json");
        }
        if (isJsonifiable(body) && isJsonContentType(config.headers)) {
            config.body = JSON.stringify(body);
        }
        if (params) {
            const divider = ~url.indexOf("?") ? "&" : "?";
            const query = paramsSerializer ? paramsSerializer(params) : new URLSearchParams(stripUndefined(params));
            url += divider + query;
        }
        url = joinUrls(baseUrl, url);
        const request = new Request(url, config);
        const requestClone = request.clone();
        meta = { request: requestClone };
        let response;
        try {
            response = await fetchFn(request);
        }
        catch (e) {
            return { error: { status: "FETCH_ERROR", error: String(e) }, meta };
        }
        const responseClone = response.clone();
        meta.response = responseClone;
        let resultData;
        let responseText = "";
        try {
            let handleResponseError;
            await Promise.all([
                handleResponse(response, responseHandler).then((r) => resultData = r, (e) => handleResponseError = e),
                responseClone.text().then((r) => responseText = r, () => {
                })
            ]);
            if (handleResponseError)
                throw handleResponseError;
        }
        catch (e) {
            return {
                error: {
                    status: "PARSING_ERROR",
                    originalStatus: response.status,
                    data: responseText,
                    error: String(e)
                },
                meta
            };
        }
        return validateStatus(response, resultData) ? {
            data: resultData,
            meta
        } : {
            error: {
                status: response.status,
                data: resultData
            },
            meta
        };
    };
}
// src/query/HandledError.ts
var HandledError = class {
    constructor(value, meta = void 0) {
        this.value = value;
        this.meta = meta;
    }
};
// src/query/retry.ts
async function defaultBackoff(attempt = 0, maxRetries = 5) {
    const attempts = Math.min(attempt, maxRetries);
    const timeout = ~~((Math.random() + 0.4) * (300 << attempts));
    await new Promise((resolve) => setTimeout((res) => resolve(res), timeout));
}
function fail(e) {
    throw Object.assign(new HandledError({ error: e }), {
        throwImmediately: true
    });
}
var retryWithBackoff = (baseQuery, defaultOptions) => async (args, api, extraOptions) => {
    const options = __spreadValues(__spreadValues({
        maxRetries: 5,
        backoff: defaultBackoff
    }, defaultOptions), extraOptions);
    let retry2 = 0;
    while (true) {
        try {
            const result = await baseQuery(args, api, extraOptions);
            if (result.error) {
                throw new HandledError(result);
            }
            return result;
        }
        catch (e) {
            retry2++;
            if (e.throwImmediately || retry2 > options.maxRetries) {
                if (e instanceof HandledError) {
                    return e.value;
                }
                throw e;
            }
            await options.backoff(retry2, options.maxRetries);
        }
    }
};
var retry = /* @__PURE__ */ Object.assign(retryWithBackoff, { fail });
// src/query/core/setupListeners.ts
import { createAction } from "@reduxjs/toolkit";
var onFocus = /* @__PURE__ */ createAction("__rtkq/focused");
var onFocusLost = /* @__PURE__ */ createAction("__rtkq/unfocused");
var onOnline = /* @__PURE__ */ createAction("__rtkq/online");
var onOffline = /* @__PURE__ */ createAction("__rtkq/offline");
var initialized = false;
function setupListeners(dispatch, customHandler) {
    function defaultHandler() {
        const handleFocus = () => dispatch(onFocus());
        const handleFocusLost = () => dispatch(onFocusLost());
        const handleOnline = () => dispatch(onOnline());
        const handleOffline = () => dispatch(onOffline());
        const handleVisibilityChange = () => {
            if (window.document.visibilityState === "visible") {
                handleFocus();
            }
            else {
                handleFocusLost();
            }
        };
        if (!initialized) {
            if (typeof window !== "undefined" && window.addEventListener) {
                window.addEventListener("visibilitychange", handleVisibilityChange, false);
                window.addEventListener("focus", handleFocus, false);
                window.addEventListener("online", handleOnline, false);
                window.addEventListener("offline", handleOffline, false);
                initialized = true;
            }
        }
        const unsubscribe = () => {
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            initialized = false;
        };
        return unsubscribe;
    }
    return customHandler ? customHandler(dispatch, { onFocus, onFocusLost, onOffline, onOnline }) : defaultHandler();
}
// src/query/core/buildSelectors.ts
import { createNextState, createSelector } from "@reduxjs/toolkit";
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
function calculateProvidedBy(description, result, error, queryArg, meta, assertTagTypes) {
    if (isFunction(description)) {
        return description(result, error, queryArg, meta).map(expandTagDescription).map(assertTagTypes);
    }
    if (Array.isArray(description)) {
        return description.map(expandTagDescription).map(assertTagTypes);
    }
    return [];
}
function isFunction(t) {
    return typeof t === "function";
}
function expandTagDescription(description) {
    return typeof description === "string" ? { type: description } : description;
}
// src/query/core/buildSlice.ts
import { combineReducers, createAction as createAction2, createSlice, isAnyOf, isFulfilled as isFulfilled2, isRejectedWithValue as isRejectedWithValue2 } from "@reduxjs/toolkit";
// src/query/core/buildThunks.ts
import { isAllOf, isFulfilled, isPending, isRejected, isRejectedWithValue } from "@reduxjs/toolkit";
import { isDraftable, produceWithPatches } from "immer";
import { createAsyncThunk } from "@reduxjs/toolkit";
function defaultTransformResponse(baseQueryReturnValue) {
    return baseQueryReturnValue;
}
function buildThunks({ reducerPath, baseQuery, context: { endpointDefinitions }, serializeQueryArgs, api }) {
    const patchQueryData = (endpointName, args, patches) => (dispatch) => {
        const endpointDefinition = endpointDefinitions[endpointName];
        dispatch(api.internalActions.queryResultPatched({
            queryCacheKey: serializeQueryArgs({
                queryArgs: args,
                endpointDefinition,
                endpointName
            }),
            patches
        }));
    };
    const updateQueryData = (endpointName, args, updateRecipe) => (dispatch, getState) => {
        const currentState = api.endpoints[endpointName].select(args)(getState());
        let ret = {
            patches: [],
            inversePatches: [],
            undo: () => dispatch(api.util.patchQueryData(endpointName, args, ret.inversePatches))
        };
        if (currentState.status === QueryStatus.uninitialized) {
            return ret;
        }
        if ("data" in currentState) {
            if (isDraftable(currentState.data)) {
                const [, patches, inversePatches] = produceWithPatches(currentState.data, updateRecipe);
                ret.patches.push(...patches);
                ret.inversePatches.push(...inversePatches);
            }
            else {
                const value = updateRecipe(currentState.data);
                ret.patches.push({ op: "replace", path: [], value });
                ret.inversePatches.push({
                    op: "replace",
                    path: [],
                    value: currentState.data
                });
            }
        }
        dispatch(api.util.patchQueryData(endpointName, args, ret.patches));
        return ret;
    };
    const executeEndpoint = async (arg, { signal, rejectWithValue, fulfillWithValue, dispatch, getState, extra }) => {
        const endpointDefinition = endpointDefinitions[arg.endpointName];
        try {
            let transformResponse = defaultTransformResponse;
            let result;
            const baseQueryApi = {
                signal,
                dispatch,
                getState,
                extra,
                endpoint: arg.endpointName,
                type: arg.type,
                forced: arg.type === "query" ? isForcedQuery(arg, getState()) : void 0
            };
            if (endpointDefinition.query) {
                result = await baseQuery(endpointDefinition.query(arg.originalArgs), baseQueryApi, endpointDefinition.extraOptions);
                if (endpointDefinition.transformResponse) {
                    transformResponse = endpointDefinition.transformResponse;
                }
            }
            else {
                result = await endpointDefinition.queryFn(arg.originalArgs, baseQueryApi, endpointDefinition.extraOptions, (arg2) => baseQuery(arg2, baseQueryApi, endpointDefinition.extraOptions));
            }
            if (typeof process !== "undefined" && true) {
                const what = endpointDefinition.query ? "`baseQuery`" : "`queryFn`";
                let err;
                if (!result) {
                    err = `${what} did not return anything.`;
                }
                else if (typeof result !== "object") {
                    err = `${what} did not return an object.`;
                }
                else if (result.error && result.data) {
                    err = `${what} returned an object containing both \`error\` and \`result\`.`;
                }
                else if (result.error === void 0 && result.data === void 0) {
                    err = `${what} returned an object containing neither a valid \`error\` and \`result\`. At least one of them should not be \`undefined\``;
                }
                else {
                    for (const key of Object.keys(result)) {
                        if (key !== "error" && key !== "data" && key !== "meta") {
                            err = `The object returned by ${what} has the unknown property ${key}.`;
                            break;
                        }
                    }
                }
                if (err) {
                    console.error(`Error encountered handling the endpoint ${arg.endpointName}.
              ${err}
              It needs to return an object with either the shape \`{ data: <value> }\` or \`{ error: <value> }\` that may contain an optional \`meta\` property.
              Object returned was:`, result);
                }
            }
            if (result.error)
                throw new HandledError(result.error, result.meta);
            return fulfillWithValue(await transformResponse(result.data, result.meta, arg.originalArgs), {
                fulfilledTimeStamp: Date.now(),
                baseQueryMeta: result.meta
            });
        }
        catch (error) {
            if (error instanceof HandledError) {
                return rejectWithValue(error.value, { baseQueryMeta: error.meta });
            }
            if (typeof process !== "undefined" && true) {
                console.error(`An unhandled error occured processing a request for the endpoint "${arg.endpointName}".
In the case of an unhandled error, no tags will be "provided" or "invalidated".`, error);
            }
            else {
                console.error(error);
            }
            throw error;
        }
    };
    function isForcedQuery(arg, state) {
        var _a, _b, _c, _d;
        const requestState = (_b = (_a = state[reducerPath]) == null ? void 0 : _a.queries) == null ? void 0 : _b[arg.queryCacheKey];
        const baseFetchOnMountOrArgChange = (_c = state[reducerPath]) == null ? void 0 : _c.config.refetchOnMountOrArgChange;
        const fulfilledVal = requestState == null ? void 0 : requestState.fulfilledTimeStamp;
        const refetchVal = (_d = arg.forceRefetch) != null ? _d : arg.subscribe && baseFetchOnMountOrArgChange;
        if (refetchVal) {
            return refetchVal === true || (Number(new Date()) - Number(fulfilledVal)) / 1e3 >= refetchVal;
        }
        return false;
    }
    const queryThunk = createAsyncThunk(`${reducerPath}/executeQuery`, executeEndpoint, {
        getPendingMeta() {
            return { startedTimeStamp: Date.now() };
        },
        condition(arg, { getState }) {
            var _a, _b;
            const state = getState();
            const requestState = (_b = (_a = state[reducerPath]) == null ? void 0 : _a.queries) == null ? void 0 : _b[arg.queryCacheKey];
            const fulfilledVal = requestState == null ? void 0 : requestState.fulfilledTimeStamp;
            if ((requestState == null ? void 0 : requestState.status) === "pending")
                return false;
            if (isForcedQuery(arg, state))
                return true;
            if (fulfilledVal)
                return false;
            return true;
        },
        dispatchConditionRejection: true
    });
    const mutationThunk = createAsyncThunk(`${reducerPath}/executeMutation`, executeEndpoint, {
        getPendingMeta() {
            return { startedTimeStamp: Date.now() };
        }
    });
    const hasTheForce = (options) => "force" in options;
    const hasMaxAge = (options) => "ifOlderThan" in options;
    const prefetch = (endpointName, arg, options) => (dispatch, getState) => {
        const force = hasTheForce(options) && options.force;
        const maxAge = hasMaxAge(options) && options.ifOlderThan;
        const queryAction = (force2 = true) => api.endpoints[endpointName].initiate(arg, { forceRefetch: force2 });
        const latestStateValue = api.endpoints[endpointName].select(arg)(getState());
        if (force) {
            dispatch(queryAction());
        }
        else if (maxAge) {
            const lastFulfilledTs = latestStateValue == null ? void 0 : latestStateValue.fulfilledTimeStamp;
            if (!lastFulfilledTs) {
                dispatch(queryAction());
                return;
            }
            const shouldRetrigger = (Number(new Date()) - Number(new Date(lastFulfilledTs))) / 1e3 >= maxAge;
            if (shouldRetrigger) {
                dispatch(queryAction());
            }
        }
        else {
            dispatch(queryAction(false));
        }
    };
    function matchesEndpoint(endpointName) {
        return (action) => {
            var _a, _b;
            return ((_b = (_a = action == null ? void 0 : action.meta) == null ? void 0 : _a.arg) == null ? void 0 : _b.endpointName) === endpointName;
        };
    }
    function buildMatchThunkActions(thunk, endpointName) {
        return {
            matchPending: isAllOf(isPending(thunk), matchesEndpoint(endpointName)),
            matchFulfilled: isAllOf(isFulfilled(thunk), matchesEndpoint(endpointName)),
            matchRejected: isAllOf(isRejected(thunk), matchesEndpoint(endpointName))
        };
    }
    return {
        queryThunk,
        mutationThunk,
        prefetch,
        updateQueryData,
        patchQueryData,
        buildMatchThunkActions
    };
}
function calculateProvidedByThunk(action, type, endpointDefinitions, assertTagType) {
    return calculateProvidedBy(endpointDefinitions[action.meta.arg.endpointName][type], isFulfilled(action) ? action.payload : void 0, isRejectedWithValue(action) ? action.payload : void 0, action.meta.arg.originalArgs, "baseQueryMeta" in action.meta ? action.meta.baseQueryMeta : void 0, assertTagType);
}
// src/query/core/buildSlice.ts
import { applyPatches } from "immer";
function updateQuerySubstateIfExists(state, queryCacheKey, update) {
    const substate = state[queryCacheKey];
    if (substate) {
        update(substate);
    }
}
function getMutationCacheKey(id) {
    var _a;
    return (_a = "arg" in id ? id.arg.fixedCacheKey : id.fixedCacheKey) != null ? _a : id.requestId;
}
function updateMutationSubstateIfExists(state, id, update) {
    const substate = state[getMutationCacheKey(id)];
    if (substate) {
        update(substate);
    }
}
var initialState = {};
function buildSlice({ reducerPath, queryThunk, mutationThunk, context: { endpointDefinitions: definitions, apiUid, extractRehydrationInfo, hasRehydrationInfo }, assertTagType, config }) {
    const resetApiState = createAction2(`${reducerPath}/resetApiState`);
    const querySlice = createSlice({
        name: `${reducerPath}/queries`,
        initialState,
        reducers: {
            removeQueryResult(draft, { payload: { queryCacheKey } }) {
                delete draft[queryCacheKey];
            },
            queryResultPatched(draft, { payload: { queryCacheKey, patches } }) {
                updateQuerySubstateIfExists(draft, queryCacheKey, (substate) => {
                    substate.data = applyPatches(substate.data, patches.concat());
                });
            }
        },
        extraReducers(builder) {
            builder.addCase(queryThunk.pending, (draft, { meta, meta: { arg } }) => {
                var _a, _b;
                if (arg.subscribe) {
                    (_b = draft[_a = arg.queryCacheKey]) != null ? _b : draft[_a] = {
                        status: QueryStatus.uninitialized,
                        endpointName: arg.endpointName
                    };
                }
                updateQuerySubstateIfExists(draft, arg.queryCacheKey, (substate) => {
                    substate.status = QueryStatus.pending;
                    substate.requestId = meta.requestId;
                    if (arg.originalArgs !== void 0) {
                        substate.originalArgs = arg.originalArgs;
                    }
                    substate.startedTimeStamp = meta.startedTimeStamp;
                });
            }).addCase(queryThunk.fulfilled, (draft, { meta, payload }) => {
                updateQuerySubstateIfExists(draft, meta.arg.queryCacheKey, (substate) => {
                    var _a;
                    if (substate.requestId !== meta.requestId)
                        return;
                    substate.status = QueryStatus.fulfilled;
                    substate.data = ((_a = definitions[meta.arg.endpointName].structuralSharing) != null ? _a : true) ? copyWithStructuralSharing(substate.data, payload) : payload;
                    delete substate.error;
                    substate.fulfilledTimeStamp = meta.fulfilledTimeStamp;
                });
            }).addCase(queryThunk.rejected, (draft, { meta: { condition, arg, requestId }, error, payload }) => {
                updateQuerySubstateIfExists(draft, arg.queryCacheKey, (substate) => {
                    if (condition) {
                    }
                    else {
                        if (substate.requestId !== requestId)
                            return;
                        substate.status = QueryStatus.rejected;
                        substate.error = payload != null ? payload : error;
                    }
                });
            }).addMatcher(hasRehydrationInfo, (draft, action) => {
                const { queries } = extractRehydrationInfo(action);
                for (const [key, entry] of Object.entries(queries)) {
                    if ((entry == null ? void 0 : entry.status) === QueryStatus.fulfilled || (entry == null ? void 0 : entry.status) === QueryStatus.rejected) {
                        draft[key] = entry;
                    }
                }
            });
        }
    });
    const mutationSlice = createSlice({
        name: `${reducerPath}/mutations`,
        initialState,
        reducers: {
            removeMutationResult(draft, { payload }) {
                const cacheKey = getMutationCacheKey(payload);
                if (cacheKey in draft) {
                    delete draft[cacheKey];
                }
            }
        },
        extraReducers(builder) {
            builder.addCase(mutationThunk.pending, (draft, { meta, meta: { requestId, arg, startedTimeStamp } }) => {
                if (!arg.track)
                    return;
                draft[getMutationCacheKey(meta)] = {
                    requestId,
                    status: QueryStatus.pending,
                    endpointName: arg.endpointName,
                    startedTimeStamp
                };
            }).addCase(mutationThunk.fulfilled, (draft, { payload, meta }) => {
                if (!meta.arg.track)
                    return;
                updateMutationSubstateIfExists(draft, meta, (substate) => {
                    if (substate.requestId !== meta.requestId)
                        return;
                    substate.status = QueryStatus.fulfilled;
                    substate.data = payload;
                    substate.fulfilledTimeStamp = meta.fulfilledTimeStamp;
                });
            }).addCase(mutationThunk.rejected, (draft, { payload, error, meta }) => {
                if (!meta.arg.track)
                    return;
                updateMutationSubstateIfExists(draft, meta, (substate) => {
                    if (substate.requestId !== meta.requestId)
                        return;
                    substate.status = QueryStatus.rejected;
                    substate.error = payload != null ? payload : error;
                });
            }).addMatcher(hasRehydrationInfo, (draft, action) => {
                const { mutations } = extractRehydrationInfo(action);
                for (const [key, entry] of Object.entries(mutations)) {
                    if (((entry == null ? void 0 : entry.status) === QueryStatus.fulfilled || (entry == null ? void 0 : entry.status) === QueryStatus.rejected) && key !== (entry == null ? void 0 : entry.requestId)) {
                        draft[key] = entry;
                    }
                }
            });
        }
    });
    const invalidationSlice = createSlice({
        name: `${reducerPath}/invalidation`,
        initialState,
        reducers: {},
        extraReducers(builder) {
            builder.addCase(querySlice.actions.removeQueryResult, (draft, { payload: { queryCacheKey } }) => {
                for (const tagTypeSubscriptions of Object.values(draft)) {
                    for (const idSubscriptions of Object.values(tagTypeSubscriptions)) {
                        const foundAt = idSubscriptions.indexOf(queryCacheKey);
                        if (foundAt !== -1) {
                            idSubscriptions.splice(foundAt, 1);
                        }
                    }
                }
            }).addMatcher(hasRehydrationInfo, (draft, action) => {
                var _a, _b, _c, _d;
                const { provided } = extractRehydrationInfo(action);
                for (const [type, incomingTags] of Object.entries(provided)) {
                    for (const [id, cacheKeys] of Object.entries(incomingTags)) {
                        const subscribedQueries = (_d = (_b = (_a = draft[type]) != null ? _a : draft[type] = {})[_c = id || "__internal_without_id"]) != null ? _d : _b[_c] = [];
                        for (const queryCacheKey of cacheKeys) {
                            const alreadySubscribed = subscribedQueries.includes(queryCacheKey);
                            if (!alreadySubscribed) {
                                subscribedQueries.push(queryCacheKey);
                            }
                        }
                    }
                }
            }).addMatcher(isAnyOf(isFulfilled2(queryThunk), isRejectedWithValue2(queryThunk)), (draft, action) => {
                var _a, _b, _c, _d;
                const providedTags = calculateProvidedByThunk(action, "providesTags", definitions, assertTagType);
                const { queryCacheKey } = action.meta.arg;
                for (const { type, id } of providedTags) {
                    const subscribedQueries = (_d = (_b = (_a = draft[type]) != null ? _a : draft[type] = {})[_c = id || "__internal_without_id"]) != null ? _d : _b[_c] = [];
                    const alreadySubscribed = subscribedQueries.includes(queryCacheKey);
                    if (!alreadySubscribed) {
                        subscribedQueries.push(queryCacheKey);
                    }
                }
            });
        }
    });
    const subscriptionSlice = createSlice({
        name: `${reducerPath}/subscriptions`,
        initialState,
        reducers: {
            updateSubscriptionOptions(draft, { payload: { queryCacheKey, requestId, options } }) {
                var _a;
                if ((_a = draft == null ? void 0 : draft[queryCacheKey]) == null ? void 0 : _a[requestId]) {
                    draft[queryCacheKey][requestId] = options;
                }
            },
            unsubscribeQueryResult(draft, { payload: { queryCacheKey, requestId } }) {
                if (draft[queryCacheKey]) {
                    delete draft[queryCacheKey][requestId];
                }
            }
        },
        extraReducers: (builder) => {
            builder.addCase(querySlice.actions.removeQueryResult, (draft, { payload: { queryCacheKey } }) => {
                delete draft[queryCacheKey];
            }).addCase(queryThunk.pending, (draft, { meta: { arg, requestId } }) => {
                var _a, _b, _c, _d;
                if (arg.subscribe) {
                    const substate = (_b = draft[_a = arg.queryCacheKey]) != null ? _b : draft[_a] = {};
                    substate[requestId] = (_d = (_c = arg.subscriptionOptions) != null ? _c : substate[requestId]) != null ? _d : {};
                }
            }).addCase(queryThunk.rejected, (draft, { meta: { condition, arg, requestId }, error, payload }) => {
                var _a, _b, _c, _d;
                if (condition && arg.subscribe) {
                    const substate = (_b = draft[_a = arg.queryCacheKey]) != null ? _b : draft[_a] = {};
                    substate[requestId] = (_d = (_c = arg.subscriptionOptions) != null ? _c : substate[requestId]) != null ? _d : {};
                }
            }).addMatcher(hasRehydrationInfo, (draft) => __spreadValues({}, draft));
        }
    });
    const configSlice = createSlice({
        name: `${reducerPath}/config`,
        initialState: __spreadValues({
            online: isOnline(),
            focused: isDocumentVisible(),
            middlewareRegistered: false
        }, config),
        reducers: {
            middlewareRegistered(state, { payload }) {
                state.middlewareRegistered = state.middlewareRegistered === "conflict" || apiUid !== payload ? "conflict" : true;
            }
        },
        extraReducers: (builder) => {
            builder.addCase(onOnline, (state) => {
                state.online = true;
            }).addCase(onOffline, (state) => {
                state.online = false;
            }).addCase(onFocus, (state) => {
                state.focused = true;
            }).addCase(onFocusLost, (state) => {
                state.focused = false;
            }).addMatcher(hasRehydrationInfo, (draft) => __spreadValues({}, draft));
        }
    });
    const combinedReducer = combineReducers({
        queries: querySlice.reducer,
        mutations: mutationSlice.reducer,
        provided: invalidationSlice.reducer,
        subscriptions: subscriptionSlice.reducer,
        config: configSlice.reducer
    });
    const reducer = (state, action) => combinedReducer(resetApiState.match(action) ? void 0 : state, action);
    const actions = __spreadProps(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, configSlice.actions), querySlice.actions), subscriptionSlice.actions), mutationSlice.actions), {
        unsubscribeMutationResult: mutationSlice.actions.removeMutationResult,
        resetApiState
    });
    return { reducer, actions };
}
// src/query/core/buildSelectors.ts
var skipToken = /* @__PURE__ */ Symbol.for("RTKQ/skipToken");
var skipSelector = skipToken;
var initialSubState = {
    status: QueryStatus.uninitialized
};
var defaultQuerySubState = /* @__PURE__ */ createNextState(initialSubState, () => {
});
var defaultMutationSubState = /* @__PURE__ */ createNextState(initialSubState, () => {
});
function buildSelectors({ serializeQueryArgs, reducerPath }) {
    return { buildQuerySelector, buildMutationSelector, selectInvalidatedBy };
    function withRequestFlags(substate) {
        return __spreadValues(__spreadValues({}, substate), getRequestStatusFlags(substate.status));
    }
    function selectInternalState(rootState) {
        const state = rootState[reducerPath];
        if (true) {
            if (!state) {
                if (selectInternalState.triggered)
                    return state;
                selectInternalState.triggered = true;
                console.error(`Error: No data found at \`state.${reducerPath}\`. Did you forget to add the reducer to the store?`);
            }
        }
        return state;
    }
    function buildQuerySelector(endpointName, endpointDefinition) {
        return (queryArgs) => {
            const selectQuerySubState = createSelector(selectInternalState, (internalState) => {
                var _a, _b;
                return (_b = queryArgs === skipToken ? void 0 : (_a = internalState == null ? void 0 : internalState.queries) == null ? void 0 : _a[serializeQueryArgs({
                    queryArgs,
                    endpointDefinition,
                    endpointName
                })]) != null ? _b : defaultQuerySubState;
            });
            return createSelector(selectQuerySubState, withRequestFlags);
        };
    }
    function buildMutationSelector() {
        return (id) => {
            var _a;
            let mutationId;
            if (typeof id === "object") {
                mutationId = (_a = getMutationCacheKey(id)) != null ? _a : skipToken;
            }
            else {
                mutationId = id;
            }
            const selectMutationSubstate = createSelector(selectInternalState, (internalState) => {
                var _a2, _b;
                return (_b = mutationId === skipToken ? void 0 : (_a2 = internalState == null ? void 0 : internalState.mutations) == null ? void 0 : _a2[mutationId]) != null ? _b : defaultMutationSubState;
            });
            return createSelector(selectMutationSubstate, withRequestFlags);
        };
    }
    function selectInvalidatedBy(state, tags) {
        var _a;
        const apiState = state[reducerPath];
        const toInvalidate = new Set();
        for (const tag of tags.map(expandTagDescription)) {
            const provided = apiState.provided[tag.type];
            if (!provided) {
                continue;
            }
            let invalidateSubscriptions = (_a = tag.id !== void 0 ? provided[tag.id] : flatten(Object.values(provided))) != null ? _a : [];
            for (const invalidate of invalidateSubscriptions) {
                toInvalidate.add(invalidate);
            }
        }
        return flatten(Array.from(toInvalidate.values()).map((queryCacheKey) => {
            const querySubState = apiState.queries[queryCacheKey];
            return querySubState ? [
                {
                    queryCacheKey,
                    endpointName: querySubState.endpointName,
                    originalArgs: querySubState.originalArgs
                }
            ] : [];
        }));
    }
}
// src/query/defaultSerializeQueryArgs.ts
import { isPlainObject as isPlainObject3 } from "@reduxjs/toolkit";
var defaultSerializeQueryArgs = ({ endpointName, queryArgs }) => {
    return `${endpointName}(${JSON.stringify(queryArgs, (key, value) => isPlainObject3(value) ? Object.keys(value).sort().reduce((acc, key2) => {
        acc[key2] = value[key2];
        return acc;
    }, {}) : value)})`;
};
// src/query/createApi.ts
import { nanoid } from "@reduxjs/toolkit";
import { defaultMemoize } from "reselect";
function buildCreateApi(...modules) {
    return function baseCreateApi(options) {
        const extractRehydrationInfo = defaultMemoize((action) => {
            var _a, _b;
            return (_b = options.extractRehydrationInfo) == null ? void 0 : _b.call(options, action, {
                reducerPath: (_a = options.reducerPath) != null ? _a : "api"
            });
        });
        const optionsWithDefaults = __spreadProps(__spreadValues({
            reducerPath: "api",
            serializeQueryArgs: defaultSerializeQueryArgs,
            keepUnusedDataFor: 60,
            refetchOnMountOrArgChange: false,
            refetchOnFocus: false,
            refetchOnReconnect: false
        }, options), {
            extractRehydrationInfo,
            tagTypes: [...options.tagTypes || []]
        });
        const context = {
            endpointDefinitions: {},
            batch(fn) {
                fn();
            },
            apiUid: nanoid(),
            extractRehydrationInfo,
            hasRehydrationInfo: defaultMemoize((action) => extractRehydrationInfo(action) != null)
        };
        const api = {
            injectEndpoints,
            enhanceEndpoints({ addTagTypes, endpoints }) {
                if (addTagTypes) {
                    for (const eT of addTagTypes) {
                        if (!optionsWithDefaults.tagTypes.includes(eT)) {
                            optionsWithDefaults.tagTypes.push(eT);
                        }
                    }
                }
                if (endpoints) {
                    for (const [endpointName, partialDefinition] of Object.entries(endpoints)) {
                        if (typeof partialDefinition === "function") {
                            partialDefinition(context.endpointDefinitions[endpointName]);
                        }
                        else {
                            Object.assign(context.endpointDefinitions[endpointName] || {}, partialDefinition);
                        }
                    }
                }
                return api;
            }
        };
        const initializedModules = modules.map((m) => m.init(api, optionsWithDefaults, context));
        function injectEndpoints(inject) {
            const evaluatedEndpoints = inject.endpoints({
                query: (x) => __spreadProps(__spreadValues({}, x), { type: DefinitionType.query }),
                mutation: (x) => __spreadProps(__spreadValues({}, x), { type: DefinitionType.mutation })
            });
            for (const [endpointName, definition] of Object.entries(evaluatedEndpoints)) {
                if (!inject.overrideExisting && endpointName in context.endpointDefinitions) {
                    if (typeof process !== "undefined" && true) {
                        console.error(`called \`injectEndpoints\` to override already-existing endpointName ${endpointName} without specifying \`overrideExisting: true\``);
                    }
                    continue;
                }
                context.endpointDefinitions[endpointName] = definition;
                for (const m of initializedModules) {
                    m.injectEndpoint(endpointName, definition);
                }
            }
            return api;
        }
        return api.injectEndpoints({ endpoints: options.endpoints });
    };
}
// src/query/fakeBaseQuery.ts
function fakeBaseQuery() {
    return function () {
        throw new Error("When using `fakeBaseQuery`, all queries & mutations must use the `queryFn` definition syntax.");
    };
}
// src/query/core/buildMiddleware/index.ts
import { compose } from "redux";
import { createAction as createAction3 } from "@reduxjs/toolkit";
// src/query/core/buildMiddleware/cacheCollection.ts
var build = ({ reducerPath, api, context }) => {
    const { removeQueryResult, unsubscribeQueryResult } = api.internalActions;
    return (mwApi) => {
        const currentRemovalTimeouts = {};
        return (next) => (action) => {
            var _a;
            const result = next(action);
            if (unsubscribeQueryResult.match(action)) {
                const state = mwApi.getState()[reducerPath];
                const { queryCacheKey } = action.payload;
                handleUnsubscribe(queryCacheKey, (_a = state.queries[queryCacheKey]) == null ? void 0 : _a.endpointName, mwApi, state.config);
            }
            if (api.util.resetApiState.match(action)) {
                for (const [key, timeout] of Object.entries(currentRemovalTimeouts)) {
                    if (timeout)
                        clearTimeout(timeout);
                    delete currentRemovalTimeouts[key];
                }
            }
            if (context.hasRehydrationInfo(action)) {
                const state = mwApi.getState()[reducerPath];
                const { queries } = context.extractRehydrationInfo(action);
                for (const [queryCacheKey, queryState] of Object.entries(queries)) {
                    handleUnsubscribe(queryCacheKey, queryState == null ? void 0 : queryState.endpointName, mwApi, state.config);
                }
            }
            return result;
        };
        function handleUnsubscribe(queryCacheKey, endpointName, api2, config) {
            var _a;
            const endpointDefinition = context.endpointDefinitions[endpointName];
            const keepUnusedDataFor = (_a = endpointDefinition == null ? void 0 : endpointDefinition.keepUnusedDataFor) != null ? _a : config.keepUnusedDataFor;
            const currentTimeout = currentRemovalTimeouts[queryCacheKey];
            if (currentTimeout) {
                clearTimeout(currentTimeout);
            }
            currentRemovalTimeouts[queryCacheKey] = setTimeout(() => {
                const subscriptions = api2.getState()[reducerPath].subscriptions[queryCacheKey];
                if (!subscriptions || Object.keys(subscriptions).length === 0) {
                    api2.dispatch(removeQueryResult({ queryCacheKey }));
                }
                delete currentRemovalTimeouts[queryCacheKey];
            }, keepUnusedDataFor * 1e3);
        }
    };
};
// src/query/core/buildMiddleware/invalidationByTags.ts
import { isAnyOf as isAnyOf2, isFulfilled as isFulfilled3, isRejectedWithValue as isRejectedWithValue3 } from "@reduxjs/toolkit";
var build2 = ({ reducerPath, context, context: { endpointDefinitions }, mutationThunk, api, assertTagType, refetchQuery }) => {
    const { removeQueryResult } = api.internalActions;
    return (mwApi) => (next) => (action) => {
        const result = next(action);
        if (isAnyOf2(isFulfilled3(mutationThunk), isRejectedWithValue3(mutationThunk))(action)) {
            invalidateTags(calculateProvidedByThunk(action, "invalidatesTags", endpointDefinitions, assertTagType), mwApi);
        }
        if (api.util.invalidateTags.match(action)) {
            invalidateTags(calculateProvidedBy(action.payload, void 0, void 0, void 0, void 0, assertTagType), mwApi);
        }
        return result;
    };
    function invalidateTags(tags, mwApi) {
        const rootState = mwApi.getState();
        const state = rootState[reducerPath];
        const toInvalidate = api.util.selectInvalidatedBy(rootState, tags);
        context.batch(() => {
            const valuesArray = Array.from(toInvalidate.values());
            for (const { queryCacheKey } of valuesArray) {
                const querySubState = state.queries[queryCacheKey];
                const subscriptionSubState = state.subscriptions[queryCacheKey];
                if (querySubState && subscriptionSubState) {
                    if (Object.keys(subscriptionSubState).length === 0) {
                        mwApi.dispatch(removeQueryResult({
                            queryCacheKey
                        }));
                    }
                    else if (querySubState.status !== QueryStatus.uninitialized) {
                        mwApi.dispatch(refetchQuery(querySubState, queryCacheKey));
                    }
                    else {
                    }
                }
            }
        });
    }
};
// src/query/core/buildMiddleware/polling.ts
var build3 = ({ reducerPath, queryThunk, api, refetchQuery }) => {
    return (mwApi) => {
        const currentPolls = {};
        return (next) => (action) => {
            const result = next(action);
            if (api.internalActions.updateSubscriptionOptions.match(action) || api.internalActions.unsubscribeQueryResult.match(action)) {
                updatePollingInterval(action.payload, mwApi);
            }
            if (queryThunk.pending.match(action) || queryThunk.rejected.match(action) && action.meta.condition) {
                updatePollingInterval(action.meta.arg, mwApi);
            }
            if (queryThunk.fulfilled.match(action) || queryThunk.rejected.match(action) && !action.meta.condition) {
                startNextPoll(action.meta.arg, mwApi);
            }
            if (api.util.resetApiState.match(action)) {
                clearPolls();
            }
            return result;
        };
        function startNextPoll({ queryCacheKey }, api2) {
            const state = api2.getState()[reducerPath];
            const querySubState = state.queries[queryCacheKey];
            const subscriptions = state.subscriptions[queryCacheKey];
            if (!querySubState || querySubState.status === QueryStatus.uninitialized)
                return;
            const lowestPollingInterval = findLowestPollingInterval(subscriptions);
            if (!Number.isFinite(lowestPollingInterval))
                return;
            const currentPoll = currentPolls[queryCacheKey];
            if (currentPoll == null ? void 0 : currentPoll.timeout) {
                clearTimeout(currentPoll.timeout);
                currentPoll.timeout = void 0;
            }
            const nextPollTimestamp = Date.now() + lowestPollingInterval;
            const currentInterval = currentPolls[queryCacheKey] = {
                nextPollTimestamp,
                pollingInterval: lowestPollingInterval,
                timeout: setTimeout(() => {
                    currentInterval.timeout = void 0;
                    api2.dispatch(refetchQuery(querySubState, queryCacheKey));
                }, lowestPollingInterval)
            };
        }
        function updatePollingInterval({ queryCacheKey }, api2) {
            const state = api2.getState()[reducerPath];
            const querySubState = state.queries[queryCacheKey];
            const subscriptions = state.subscriptions[queryCacheKey];
            if (!querySubState || querySubState.status === QueryStatus.uninitialized) {
                return;
            }
            const lowestPollingInterval = findLowestPollingInterval(subscriptions);
            if (!Number.isFinite(lowestPollingInterval)) {
                cleanupPollForKey(queryCacheKey);
                return;
            }
            const currentPoll = currentPolls[queryCacheKey];
            const nextPollTimestamp = Date.now() + lowestPollingInterval;
            if (!currentPoll || nextPollTimestamp < currentPoll.nextPollTimestamp) {
                startNextPoll({ queryCacheKey }, api2);
            }
        }
        function cleanupPollForKey(key) {
            const existingPoll = currentPolls[key];
            if (existingPoll == null ? void 0 : existingPoll.timeout) {
                clearTimeout(existingPoll.timeout);
            }
            delete currentPolls[key];
        }
        function clearPolls() {
            for (const key of Object.keys(currentPolls)) {
                cleanupPollForKey(key);
            }
        }
    };
    function findLowestPollingInterval(subscribers = {}) {
        let lowestPollingInterval = Number.POSITIVE_INFINITY;
        for (const subscription of Object.values(subscribers)) {
            if (!!subscription.pollingInterval)
                lowestPollingInterval = Math.min(subscription.pollingInterval, lowestPollingInterval);
        }
        return lowestPollingInterval;
    }
};
// src/query/core/buildMiddleware/windowEventHandling.ts
var build4 = ({ reducerPath, context, api, refetchQuery }) => {
    const { removeQueryResult } = api.internalActions;
    return (mwApi) => (next) => (action) => {
        const result = next(action);
        if (onFocus.match(action)) {
            refetchValidQueries(mwApi, "refetchOnFocus");
        }
        if (onOnline.match(action)) {
            refetchValidQueries(mwApi, "refetchOnReconnect");
        }
        return result;
    };
    function refetchValidQueries(api2, type) {
        const state = api2.getState()[reducerPath];
        const queries = state.queries;
        const subscriptions = state.subscriptions;
        context.batch(() => {
            for (const queryCacheKey of Object.keys(subscriptions)) {
                const querySubState = queries[queryCacheKey];
                const subscriptionSubState = subscriptions[queryCacheKey];
                if (!subscriptionSubState || !querySubState)
                    continue;
                const shouldRefetch = Object.values(subscriptionSubState).some((sub) => sub[type] === true) || Object.values(subscriptionSubState).every((sub) => sub[type] === void 0) && state.config[type];
                if (shouldRefetch) {
                    if (Object.keys(subscriptionSubState).length === 0) {
                        api2.dispatch(removeQueryResult({
                            queryCacheKey
                        }));
                    }
                    else if (querySubState.status !== QueryStatus.uninitialized) {
                        api2.dispatch(refetchQuery(querySubState, queryCacheKey));
                    }
                }
            }
        });
    }
};
// src/query/core/buildMiddleware/cacheLifecycle.ts
import { isAsyncThunkAction, isFulfilled as isFulfilled4 } from "@reduxjs/toolkit";
var neverResolvedError = new Error("Promise never resolved before cacheEntryRemoved.");
var build5 = ({ api, reducerPath, context, queryThunk, mutationThunk }) => {
    const isQueryThunk = isAsyncThunkAction(queryThunk);
    const isMutationThunk = isAsyncThunkAction(mutationThunk);
    const isFullfilledThunk = isFulfilled4(queryThunk, mutationThunk);
    return (mwApi) => {
        const lifecycleMap = {};
        return (next) => (action) => {
            const stateBefore = mwApi.getState();
            const result = next(action);
            const cacheKey = getCacheKey(action);
            if (queryThunk.pending.match(action)) {
                const oldState = stateBefore[reducerPath].queries[cacheKey];
                const state = mwApi.getState()[reducerPath].queries[cacheKey];
                if (!oldState && state) {
                    handleNewKey(action.meta.arg.endpointName, action.meta.arg.originalArgs, cacheKey, mwApi, action.meta.requestId);
                }
            }
            else if (mutationThunk.pending.match(action)) {
                const state = mwApi.getState()[reducerPath].mutations[cacheKey];
                if (state) {
                    handleNewKey(action.meta.arg.endpointName, action.meta.arg.originalArgs, cacheKey, mwApi, action.meta.requestId);
                }
            }
            else if (isFullfilledThunk(action)) {
                const lifecycle = lifecycleMap[cacheKey];
                if (lifecycle == null ? void 0 : lifecycle.valueResolved) {
                    lifecycle.valueResolved({
                        data: action.payload,
                        meta: action.meta.baseQueryMeta
                    });
                    delete lifecycle.valueResolved;
                }
            }
            else if (api.internalActions.removeQueryResult.match(action) || api.internalActions.removeMutationResult.match(action)) {
                const lifecycle = lifecycleMap[cacheKey];
                if (lifecycle) {
                    delete lifecycleMap[cacheKey];
                    lifecycle.cacheEntryRemoved();
                }
            }
            else if (api.util.resetApiState.match(action)) {
                for (const [cacheKey2, lifecycle] of Object.entries(lifecycleMap)) {
                    delete lifecycleMap[cacheKey2];
                    lifecycle.cacheEntryRemoved();
                }
            }
            return result;
        };
        function getCacheKey(action) {
            if (isQueryThunk(action))
                return action.meta.arg.queryCacheKey;
            if (isMutationThunk(action))
                return action.meta.requestId;
            if (api.internalActions.removeQueryResult.match(action))
                return action.payload.queryCacheKey;
            if (api.internalActions.removeMutationResult.match(action))
                return getMutationCacheKey(action.payload);
            return "";
        }
        function handleNewKey(endpointName, originalArgs, queryCacheKey, mwApi2, requestId) {
            const endpointDefinition = context.endpointDefinitions[endpointName];
            const onCacheEntryAdded = endpointDefinition == null ? void 0 : endpointDefinition.onCacheEntryAdded;
            if (!onCacheEntryAdded)
                return;
            let lifecycle = {};
            const cacheEntryRemoved = new Promise((resolve) => {
                lifecycle.cacheEntryRemoved = resolve;
            });
            const cacheDataLoaded = Promise.race([
                new Promise((resolve) => {
                    lifecycle.valueResolved = resolve;
                }),
                cacheEntryRemoved.then(() => {
                    throw neverResolvedError;
                })
            ]);
            cacheDataLoaded.catch(() => {
            });
            lifecycleMap[queryCacheKey] = lifecycle;
            const selector = api.endpoints[endpointName].select(endpointDefinition.type === DefinitionType.query ? originalArgs : queryCacheKey);
            const extra = mwApi2.dispatch((_, __, extra2) => extra2);
            const lifecycleApi = __spreadProps(__spreadValues({}, mwApi2), {
                getCacheEntry: () => selector(mwApi2.getState()),
                requestId,
                extra,
                updateCachedData: endpointDefinition.type === DefinitionType.query ? (updateRecipe) => mwApi2.dispatch(api.util.updateQueryData(endpointName, originalArgs, updateRecipe)) : void 0,
                cacheDataLoaded,
                cacheEntryRemoved
            });
            const runningHandler = onCacheEntryAdded(originalArgs, lifecycleApi);
            Promise.resolve(runningHandler).catch((e) => {
                if (e === neverResolvedError)
                    return;
                throw e;
            });
        }
    };
};
// src/query/core/buildMiddleware/queryLifecycle.ts
import { isPending as isPending2, isRejected as isRejected2, isFulfilled as isFulfilled5 } from "@reduxjs/toolkit";
var build6 = ({ api, context, queryThunk, mutationThunk }) => {
    const isPendingThunk = isPending2(queryThunk, mutationThunk);
    const isRejectedThunk = isRejected2(queryThunk, mutationThunk);
    const isFullfilledThunk = isFulfilled5(queryThunk, mutationThunk);
    return (mwApi) => {
        const lifecycleMap = {};
        return (next) => (action) => {
            var _a, _b, _c;
            const result = next(action);
            if (isPendingThunk(action)) {
                const { requestId, arg: { endpointName, originalArgs } } = action.meta;
                const endpointDefinition = context.endpointDefinitions[endpointName];
                const onQueryStarted = endpointDefinition == null ? void 0 : endpointDefinition.onQueryStarted;
                if (onQueryStarted) {
                    const lifecycle = {};
                    const queryFulfilled = new Promise((resolve, reject) => {
                        lifecycle.resolve = resolve;
                        lifecycle.reject = reject;
                    });
                    queryFulfilled.catch(() => {
                    });
                    lifecycleMap[requestId] = lifecycle;
                    const selector = api.endpoints[endpointName].select(endpointDefinition.type === DefinitionType.query ? originalArgs : requestId);
                    const extra = mwApi.dispatch((_, __, extra2) => extra2);
                    const lifecycleApi = __spreadProps(__spreadValues({}, mwApi), {
                        getCacheEntry: () => selector(mwApi.getState()),
                        requestId,
                        extra,
                        updateCachedData: endpointDefinition.type === DefinitionType.query ? (updateRecipe) => mwApi.dispatch(api.util.updateQueryData(endpointName, originalArgs, updateRecipe)) : void 0,
                        queryFulfilled
                    });
                    onQueryStarted(originalArgs, lifecycleApi);
                }
            }
            else if (isFullfilledThunk(action)) {
                const { requestId, baseQueryMeta } = action.meta;
                (_a = lifecycleMap[requestId]) == null ? void 0 : _a.resolve({
                    data: action.payload,
                    meta: baseQueryMeta
                });
                delete lifecycleMap[requestId];
            }
            else if (isRejectedThunk(action)) {
                const { requestId, rejectedWithValue, baseQueryMeta } = action.meta;
                (_c = lifecycleMap[requestId]) == null ? void 0 : _c.reject({
                    error: (_b = action.payload) != null ? _b : action.error,
                    isUnhandledError: !rejectedWithValue,
                    meta: baseQueryMeta
                });
                delete lifecycleMap[requestId];
            }
            return result;
        };
    };
};
// src/query/core/buildMiddleware/devMiddleware.ts
var build7 = ({ api, context: { apiUid }, reducerPath }) => {
    return (mwApi) => {
        let initialized2 = false;
        return (next) => (action) => {
            var _a, _b;
            if (!initialized2) {
                initialized2 = true;
                mwApi.dispatch(api.internalActions.middlewareRegistered(apiUid));
            }
            const result = next(action);
            if (api.util.resetApiState.match(action)) {
                mwApi.dispatch(api.internalActions.middlewareRegistered(apiUid));
            }
            if (typeof process !== "undefined" && true) {
                if (api.internalActions.middlewareRegistered.match(action) && action.payload === apiUid && ((_b = (_a = mwApi.getState()[reducerPath]) == null ? void 0 : _a.config) == null ? void 0 : _b.middlewareRegistered) === "conflict") {
                    console.warn(`There is a mismatch between slice and middleware for the reducerPath "${reducerPath}".
You can only have one api per reducer path, this will lead to crashes in various situations!${reducerPath === "api" ? `
If you have multiple apis, you *have* to specify the reducerPath option when using createApi!` : ""}`);
                }
            }
            return result;
        };
    };
};
// src/query/core/buildMiddleware/index.ts
function buildMiddleware(input) {
    const { reducerPath, queryThunk } = input;
    const actions = {
        invalidateTags: createAction3(`${reducerPath}/invalidateTags`)
    };
    const middlewares = [
        build7,
        build,
        build2,
        build3,
        build4,
        build5,
        build6
    ].map((build8) => build8(__spreadProps(__spreadValues({}, input), {
        refetchQuery
    })));
    const middleware = (mwApi) => (next) => {
        const applied = compose(...middlewares.map((middleware2) => middleware2(mwApi)))(next);
        return (action) => {
            if (mwApi.getState()[reducerPath]) {
                return applied(action);
            }
            return next(action);
        };
    };
    return { middleware, actions };
    function refetchQuery(querySubState, queryCacheKey, override = {}) {
        return queryThunk(__spreadValues({
            type: "query",
            endpointName: querySubState.endpointName,
            originalArgs: querySubState.originalArgs,
            subscribe: false,
            forceRefetch: true,
            queryCacheKey
        }, override));
    }
}
// src/query/core/buildInitiate.ts
function buildInitiate({ serializeQueryArgs, queryThunk, mutationThunk, api, context }) {
    const runningQueries = {};
    const runningMutations = {};
    const { unsubscribeQueryResult, removeMutationResult, updateSubscriptionOptions } = api.internalActions;
    return {
        buildInitiateQuery,
        buildInitiateMutation,
        getRunningOperationPromises,
        getRunningOperationPromise
    };
    function getRunningOperationPromise(endpointName, argOrRequestId) {
        const endpointDefinition = context.endpointDefinitions[endpointName];
        if (endpointDefinition.type === DefinitionType.query) {
            const queryCacheKey = serializeQueryArgs({
                queryArgs: argOrRequestId,
                endpointDefinition,
                endpointName
            });
            return runningQueries[queryCacheKey];
        }
        else {
            return runningMutations[argOrRequestId];
        }
    }
    function getRunningOperationPromises() {
        return [
            ...Object.values(runningQueries),
            ...Object.values(runningMutations)
        ].filter((t) => !!t);
    }
    function middlewareWarning(getState) {
        var _a, _b;
        if (true) {
            if (middlewareWarning.triggered)
                return;
            const registered = (_b = (_a = getState()[api.reducerPath]) == null ? void 0 : _a.config) == null ? void 0 : _b.middlewareRegistered;
            if (registered !== void 0) {
                ;
                middlewareWarning.triggered = true;
            }
            if (registered === false) {
                console.warn(`Warning: Middleware for RTK-Query API at reducerPath "${api.reducerPath}" has not been added to the store.
Features like automatic cache collection, automatic refetching etc. will not be available.`);
            }
        }
    }
    function buildInitiateQuery(endpointName, endpointDefinition) {
        const queryAction = (arg, { subscribe = true, forceRefetch, subscriptionOptions } = {}) => (dispatch, getState) => {
            const queryCacheKey = serializeQueryArgs({
                queryArgs: arg,
                endpointDefinition,
                endpointName
            });
            const thunk = queryThunk({
                type: "query",
                subscribe,
                forceRefetch,
                subscriptionOptions,
                endpointName,
                originalArgs: arg,
                queryCacheKey
            });
            const thunkResult = dispatch(thunk);
            middlewareWarning(getState);
            const { requestId, abort } = thunkResult;
            const statePromise = Object.assign(Promise.all([runningQueries[queryCacheKey], thunkResult]).then(() => api.endpoints[endpointName].select(arg)(getState())), {
                arg,
                requestId,
                subscriptionOptions,
                queryCacheKey,
                abort,
                async unwrap() {
                    const result = await statePromise;
                    if (result.isError) {
                        throw result.error;
                    }
                    return result.data;
                },
                refetch() {
                    dispatch(queryAction(arg, { subscribe: false, forceRefetch: true }));
                },
                unsubscribe() {
                    if (subscribe)
                        dispatch(unsubscribeQueryResult({
                            queryCacheKey,
                            requestId
                        }));
                },
                updateSubscriptionOptions(options) {
                    statePromise.subscriptionOptions = options;
                    dispatch(updateSubscriptionOptions({
                        endpointName,
                        requestId,
                        queryCacheKey,
                        options
                    }));
                }
            });
            if (!runningQueries[queryCacheKey]) {
                runningQueries[queryCacheKey] = statePromise;
                statePromise.then(() => {
                    delete runningQueries[queryCacheKey];
                });
            }
            return statePromise;
        };
        return queryAction;
    }
    function buildInitiateMutation(endpointName) {
        return (arg, { track = true, fixedCacheKey } = {}) => (dispatch, getState) => {
            const thunk = mutationThunk({
                type: "mutation",
                endpointName,
                originalArgs: arg,
                track,
                fixedCacheKey
            });
            const thunkResult = dispatch(thunk);
            middlewareWarning(getState);
            const { requestId, abort, unwrap } = thunkResult;
            const returnValuePromise = thunkResult.unwrap().then((data) => ({ data })).catch((error) => ({ error }));
            const reset = () => {
                dispatch(removeMutationResult({ requestId, fixedCacheKey }));
            };
            const ret = Object.assign(returnValuePromise, {
                arg: thunkResult.arg,
                requestId,
                abort,
                unwrap,
                unsubscribe: reset,
                reset
            });
            runningMutations[requestId] = ret;
            ret.then(() => {
                delete runningMutations[requestId];
            });
            if (fixedCacheKey) {
                runningMutations[fixedCacheKey] = ret;
                ret.then(() => {
                    if (runningMutations[fixedCacheKey] === ret)
                        delete runningMutations[fixedCacheKey];
                });
            }
            return ret;
        };
    }
}
// src/query/tsHelpers.ts
function assertCast(v) {
}
function safeAssign(target, ...args) {
    Object.assign(target, ...args);
}
// src/query/core/module.ts
import { enablePatches } from "immer";
var coreModuleName = /* @__PURE__ */ Symbol();
var coreModule = () => ({
    name: coreModuleName,
    init(api, { baseQuery, tagTypes, reducerPath, serializeQueryArgs, keepUnusedDataFor, refetchOnMountOrArgChange, refetchOnFocus, refetchOnReconnect }, context) {
        enablePatches();
        assertCast(serializeQueryArgs);
        const assertTagType = (tag) => {
            if (typeof process !== "undefined" && true) {
                if (!tagTypes.includes(tag.type)) {
                    console.error(`Tag type '${tag.type}' was used, but not specified in \`tagTypes\`!`);
                }
            }
            return tag;
        };
        Object.assign(api, {
            reducerPath,
            endpoints: {},
            internalActions: {
                onOnline,
                onOffline,
                onFocus,
                onFocusLost
            },
            util: {}
        });
        const { queryThunk, mutationThunk, patchQueryData, updateQueryData, prefetch, buildMatchThunkActions } = buildThunks({
            baseQuery,
            reducerPath,
            context,
            api,
            serializeQueryArgs
        });
        const { reducer, actions: sliceActions } = buildSlice({
            context,
            queryThunk,
            mutationThunk,
            reducerPath,
            assertTagType,
            config: {
                refetchOnFocus,
                refetchOnReconnect,
                refetchOnMountOrArgChange,
                keepUnusedDataFor,
                reducerPath
            }
        });
        safeAssign(api.util, {
            patchQueryData,
            updateQueryData,
            prefetch,
            resetApiState: sliceActions.resetApiState
        });
        safeAssign(api.internalActions, sliceActions);
        Object.defineProperty(api.util, "updateQueryResult", {
            get() {
                if (typeof process !== "undefined" && true) {
                    console.warn("`api.util.updateQueryResult` has been renamed to `api.util.updateQueryData`, please change your code accordingly");
                }
                return api.util.updateQueryData;
            }
        });
        Object.defineProperty(api.util, "patchQueryResult", {
            get() {
                if (typeof process !== "undefined" && true) {
                    console.warn("`api.util.patchQueryResult` has been renamed to `api.util.patchQueryData`, please change your code accordingly");
                }
                return api.util.patchQueryData;
            }
        });
        const { middleware, actions: middlewareActions } = buildMiddleware({
            reducerPath,
            context,
            queryThunk,
            mutationThunk,
            api,
            assertTagType
        });
        safeAssign(api.util, middlewareActions);
        safeAssign(api, { reducer, middleware });
        const { buildQuerySelector, buildMutationSelector, selectInvalidatedBy } = buildSelectors({
            serializeQueryArgs,
            reducerPath
        });
        safeAssign(api.util, { selectInvalidatedBy });
        const { buildInitiateQuery, buildInitiateMutation, getRunningOperationPromises, getRunningOperationPromise } = buildInitiate({
            queryThunk,
            mutationThunk,
            api,
            serializeQueryArgs,
            context
        });
        safeAssign(api.util, {
            getRunningOperationPromises,
            getRunningOperationPromise
        });
        return {
            name: coreModuleName,
            injectEndpoint(endpointName, definition) {
                var _a, _b;
                const anyApi = api;
                (_b = (_a = anyApi.endpoints)[endpointName]) != null ? _b : _a[endpointName] = {};
                if (isQueryDefinition(definition)) {
                    safeAssign(anyApi.endpoints[endpointName], {
                        select: buildQuerySelector(endpointName, definition),
                        initiate: buildInitiateQuery(endpointName, definition)
                    }, buildMatchThunkActions(queryThunk, endpointName));
                }
                else if (isMutationDefinition(definition)) {
                    safeAssign(anyApi.endpoints[endpointName], {
                        select: buildMutationSelector(),
                        initiate: buildInitiateMutation(endpointName)
                    }, buildMatchThunkActions(mutationThunk, endpointName));
                }
            }
        };
    }
});
// src/query/core/index.ts
var createApi = /* @__PURE__ */ buildCreateApi(coreModule());
export { QueryStatus, buildCreateApi, copyWithStructuralSharing, coreModule, createApi, fakeBaseQuery, fetchBaseQuery, retry, setupListeners, skipSelector, skipToken };
//# sourceMappingURL=rtk-query.modern.development.js.map