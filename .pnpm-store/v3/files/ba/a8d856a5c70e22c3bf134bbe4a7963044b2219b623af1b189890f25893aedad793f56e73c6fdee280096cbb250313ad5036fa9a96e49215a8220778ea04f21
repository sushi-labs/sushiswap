'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var querySyncStoragePersister = require('@tanstack/query-sync-storage-persister');
var reactQuery = require('@tanstack/react-query');
var reactQueryPersistClient = require('@tanstack/react-query-persist-client');
var core = require('@wagmi/core');
var React = require('react');
var pkg = require('use-sync-external-store/shim/index.js');
var ethers = require('ethers/lib/ethers');
var withSelector_js = require('use-sync-external-store/shim/with-selector.js');
var internal = require('@wagmi/core/internal');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);
var pkg__namespace = /*#__PURE__*/_interopNamespace(pkg);

const useSyncExternalStore = pkg__namespace.useSyncExternalStore;

function isQueryKey(value) {
  return Array.isArray(value);
}

function parseQueryArgs(arg1, arg2, arg3) {
  if (!isQueryKey(arg1)) {
    return arg1;
  }

  if (typeof arg2 === 'function') {
    return { ...arg3,
      queryKey: arg1,
      queryFn: arg2
    };
  }

  return { ...arg2,
    queryKey: arg1
  };
}
function shouldThrowError(_useErrorBoundary, params) {
  // Allow useErrorBoundary function to override throwing behavior on a per-error basis
  if (typeof _useErrorBoundary === 'function') {
    return _useErrorBoundary(...params);
  }

  return !!_useErrorBoundary;
}
function trackResult(result, observer) {
  const trackedResult = {};
  Object.keys(result).forEach(key => {
    Object.defineProperty(trackedResult, key, {
      configurable: false,
      enumerable: true,
      get: () => {
        // @ts-expect-error – aware we are mutating private `trackedProps` property.
        observer.trackedProps.add(key);
        return result[key];
      }
    });
  });
  return trackedResult;
}

function useBaseQuery(options, Observer) {
  const queryClient = reactQuery.useQueryClient({
    context: options.context
  });
  const isRestoring = reactQuery.useIsRestoring();
  const errorResetBoundary = reactQuery.useQueryErrorResetBoundary();
  const defaultedOptions = queryClient.defaultQueryOptions(options); // Make sure results are optimistically set in fetching state before subscribing or updating options

  defaultedOptions._optimisticResults = isRestoring ? 'isRestoring' : 'optimistic'; // Include callbacks in batch renders

  if (defaultedOptions.onError) {
    defaultedOptions.onError = reactQuery.notifyManager.batchCalls(defaultedOptions.onError);
  }

  if (defaultedOptions.onSuccess) {
    defaultedOptions.onSuccess = reactQuery.notifyManager.batchCalls(defaultedOptions.onSuccess);
  }

  if (defaultedOptions.onSettled) {
    defaultedOptions.onSettled = reactQuery.notifyManager.batchCalls(defaultedOptions.onSettled);
  }

  if (defaultedOptions.suspense) {
    // Always set stale time when using suspense to prevent
    // fetching again when directly mounting after suspending
    if (typeof defaultedOptions.staleTime !== 'number') {
      defaultedOptions.staleTime = 1000;
    }
  }

  if (defaultedOptions.suspense || defaultedOptions.useErrorBoundary) {
    // Prevent retrying failed query if the error boundary has not been reset yet
    if (!errorResetBoundary.isReset()) {
      defaultedOptions.retryOnMount = false;
    }
  }

  const [observer] = React__namespace.useState(() => new Observer(queryClient, defaultedOptions));
  const result = observer.getOptimisticResult(defaultedOptions);
  useSyncExternalStore(React__namespace.useCallback(onStoreChange => isRestoring ? () => undefined : observer.subscribe(reactQuery.notifyManager.batchCalls(onStoreChange)), [observer, isRestoring]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
  React__namespace.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
  React__namespace.useEffect(() => {
    // Do not notify on updates because of changes in the options because
    // these changes should already be reflected in the optimistic result.
    observer.setOptions(defaultedOptions, {
      listeners: false
    });
  }, [defaultedOptions, observer]); // Handle suspense

  if (defaultedOptions.suspense && result.isLoading && result.isFetching && !isRestoring) {
    throw observer.fetchOptimistic(defaultedOptions).then(_ref => {
      var _defaultedOptions$onS, _defaultedOptions$onS2;

      let {
        data
      } = _ref;
      (_defaultedOptions$onS = defaultedOptions.onSuccess) === null || _defaultedOptions$onS === void 0 ? void 0 : _defaultedOptions$onS.call(defaultedOptions, data);
      (_defaultedOptions$onS2 = defaultedOptions.onSettled) === null || _defaultedOptions$onS2 === void 0 ? void 0 : _defaultedOptions$onS2.call(defaultedOptions, data, null);
    }).catch(error => {
      var _defaultedOptions$onE, _defaultedOptions$onS3;

      errorResetBoundary.clearReset();
      (_defaultedOptions$onE = defaultedOptions.onError) === null || _defaultedOptions$onE === void 0 ? void 0 : _defaultedOptions$onE.call(defaultedOptions, error);
      (_defaultedOptions$onS3 = defaultedOptions.onSettled) === null || _defaultedOptions$onS3 === void 0 ? void 0 : _defaultedOptions$onS3.call(defaultedOptions, undefined, error);
    });
  } // Handle error boundary


  if (result.isError && !errorResetBoundary.isReset() && !result.isFetching && shouldThrowError(defaultedOptions.useErrorBoundary, [result.error, observer.getCurrentQuery()])) {
    throw result.error;
  }

  const status = result.status === 'loading' && result.fetchStatus === 'idle' ? 'idle' : result.status;
  const isIdle = status === 'idle';
  const isLoading = status === 'loading' && result.fetchStatus === 'fetching';
  return { ...result,
    defaultedOptions,
    isIdle,
    isLoading,
    observer,
    status
  };
}

const Context = /*#__PURE__*/React__namespace.createContext(undefined);
const queryClientContext = /*#__PURE__*/React__namespace.createContext(undefined);
function WagmiConfig(_ref) {
  let {
    children,
    client
  } = _ref;
  return /*#__PURE__*/React__namespace.createElement(Context.Provider, {
    value: client
  }, /*#__PURE__*/React__namespace.createElement(reactQuery.QueryClientProvider, {
    client: client.queryClient,
    context: queryClientContext
  }, children));
}
function useClient() {
  const client = React__namespace.useContext(Context);
  if (!client) throw new Error(['`useClient` must be used within `WagmiConfig`.\n', 'Read more: https://wagmi.sh/docs/WagmiConfig'].join('\n'));
  return client;
}

function useInfiniteQuery(arg1, arg2, arg3) {
  const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
  const baseQuery = useBaseQuery({
    context: queryClientContext,
    ...parsedOptions
  }, reactQuery.InfiniteQueryObserver);
  const result = {
    data: baseQuery.data,
    error: baseQuery.error,
    fetchNextPage: baseQuery.fetchNextPage,
    fetchStatus: baseQuery.fetchStatus,
    hasNextPage: baseQuery.hasNextPage,
    isError: baseQuery.isError,
    isFetched: baseQuery.isFetched,
    isFetching: baseQuery.isFetching,
    isFetchingNextPage: baseQuery.isFetchingNextPage,
    isIdle: baseQuery.isIdle,
    isLoading: baseQuery.isLoading,
    isRefetching: baseQuery.isRefetching,
    isSuccess: baseQuery.isSuccess,
    refetch: baseQuery.refetch,
    status: baseQuery.status,
    internal: {
      dataUpdatedAt: baseQuery.dataUpdatedAt,
      errorUpdatedAt: baseQuery.errorUpdatedAt,
      failureCount: baseQuery.failureCount,
      isFetchedAfterMount: baseQuery.isFetchedAfterMount,
      isLoadingError: baseQuery.isLoadingError,
      isPaused: baseQuery.isPaused,
      isPlaceholderData: baseQuery.isPlaceholderData,
      isPreviousData: baseQuery.isPreviousData,
      isRefetchError: baseQuery.isRefetchError,
      isStale: baseQuery.isStale,
      remove: baseQuery.remove
    }
  }; // Handle result property usage tracking

  return !baseQuery.defaultedOptions.notifyOnChangeProps ? trackResult(result, baseQuery.observer) : result;
}

function useMutation(arg1, arg2, arg3) {
  const options = reactQuery.parseMutationArgs(arg1, arg2, arg3);
  return reactQuery.useMutation({
    context: queryClientContext,
    ...options
  });
}

function useQuery(arg1, arg2, arg3) {
  const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
  const baseQuery = useBaseQuery({
    context: queryClientContext,
    ...parsedOptions
  }, reactQuery.QueryObserver);
  const result = {
    data: baseQuery.data,
    error: baseQuery.error,
    fetchStatus: baseQuery.fetchStatus,
    isError: baseQuery.isError,
    isFetched: baseQuery.isFetched,
    isFetching: baseQuery.isFetching,
    isIdle: baseQuery.isIdle,
    isLoading: baseQuery.isLoading,
    isRefetching: baseQuery.isRefetching,
    isSuccess: baseQuery.isSuccess,
    refetch: baseQuery.refetch,
    status: baseQuery.status,
    internal: {
      dataUpdatedAt: baseQuery.dataUpdatedAt,
      errorUpdatedAt: baseQuery.errorUpdatedAt,
      failureCount: baseQuery.failureCount,
      isFetchedAfterMount: baseQuery.isFetchedAfterMount,
      isLoadingError: baseQuery.isLoadingError,
      isPaused: baseQuery.isPaused,
      isPlaceholderData: baseQuery.isPlaceholderData,
      isPreviousData: baseQuery.isPreviousData,
      isRefetchError: baseQuery.isRefetchError,
      isStale: baseQuery.isStale,
      remove: baseQuery.remove
    }
  }; // Handle result property usage tracking

  return !baseQuery.defaultedOptions.notifyOnChangeProps ? trackResult(result, baseQuery.observer) : result;
}

const useQueryClient = () => reactQuery.useQueryClient({
  context: queryClientContext
});

function useProvider() {
  let {
    chainId
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return withSelector_js.useSyncExternalStoreWithSelector(cb => core.watchProvider({
    chainId
  }, cb), () => core.getProvider({
    chainId
  }), () => core.getProvider({
    chainId
  }), x => x, (a, b) => a.network.chainId === b.network.chainId);
}

function useWebSocketProvider() {
  let {
    chainId
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return withSelector_js.useSyncExternalStoreWithSelector(cb => core.watchWebSocketProvider({
    chainId
  }, cb), () => core.getWebSocketProvider({
    chainId
  }), () => core.getWebSocketProvider({
    chainId
  }), x => x, (a, b) => (a === null || a === void 0 ? void 0 : a.network.chainId) === (b === null || b === void 0 ? void 0 : b.network.chainId));
}

function useChainId() {
  let {
    chainId
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const provider = useProvider({
    chainId
  });
  return provider.network.chainId;
}

function useForceUpdate() {
  const [, forceUpdate] = React__namespace.useReducer(x => x + 1, 0);
  return forceUpdate;
}

const queryKey$f = _ref => {
  let {
    chainId
  } = _ref;
  return [{
    entity: 'blockNumber',
    chainId
  }];
};

const queryFn$f = _ref2 => {
  let {
    queryKey: [{
      chainId
    }]
  } = _ref2;
  return core.fetchBlockNumber({
    chainId
  });
};

function useBlockNumber() {
  let {
    cacheTime = 0,
    chainId: chainId_,
    enabled = true,
    staleTime,
    suspense,
    watch = false,
    onBlock,
    onError,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const chainId = useChainId({
    chainId: chainId_
  });
  const provider = useProvider({
    chainId
  });
  const webSocketProvider = useWebSocketProvider({
    chainId
  });
  const queryClient = useQueryClient();
  React__namespace.useEffect(() => {
    if (!watch && !onBlock) return; // We need to debounce the listener as we want to opt-out
    // of the behavior where ethers emits a "block" event for
    // every block that was missed in between the `pollingInterval`.
    // We are setting a wait time of 1 as emitting an event in
    // ethers takes ~0.1ms.

    const listener = internal.debounce(blockNumber => {
      // Just to be safe in case the provider implementation
      // calls the event callback after .off() has been called
      if (watch) queryClient.setQueryData(queryKey$f({
        chainId
      }), blockNumber);
      if (onBlock) onBlock(blockNumber);
    }, 1);
    const provider_ = webSocketProvider !== null && webSocketProvider !== void 0 ? webSocketProvider : provider;
    provider_.on('block', listener);
    return () => {
      provider_.off('block', listener);
    };
  }, [chainId, onBlock, provider, queryClient, watch, webSocketProvider]);
  return useQuery(queryKey$f({
    chainId
  }), queryFn$f, {
    cacheTime,
    enabled,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  });
}

const queryKey$e = _ref => {
  let {
    chainId,
    formatUnits
  } = _ref;
  return [{
    entity: 'feeData',
    chainId,
    formatUnits
  }];
};

const queryFn$e = _ref2 => {
  let {
    queryKey: [{
      chainId,
      formatUnits
    }]
  } = _ref2;
  return core.fetchFeeData({
    chainId,
    formatUnits
  });
};

function useFeeData() {
  let {
    cacheTime,
    chainId: chainId_,
    enabled = true,
    formatUnits = 'wei',
    staleTime,
    suspense,
    watch,
    onError,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const chainId = useChainId({
    chainId: chainId_
  });
  const feeDataQuery = useQuery(queryKey$e({
    chainId,
    formatUnits
  }), queryFn$e, {
    cacheTime,
    enabled,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  });
  const {
    data: blockNumber
  } = useBlockNumber({
    chainId,
    watch
  });
  React__namespace.useEffect(() => {
    if (!enabled) return;
    if (!watch) return;
    if (!blockNumber) return;
    feeDataQuery.refetch(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);
  return feeDataQuery;
}

function useInvalidateOnBlock(_ref) {
  let {
    chainId,
    enabled,
    queryKey
  } = _ref;
  const queryClient = useQueryClient();
  useBlockNumber({
    chainId,
    onBlock: enabled ? () => queryClient.invalidateQueries(queryKey) : undefined
  });
}

const isPlainObject = obj => typeof obj === 'object' && !Array.isArray(obj);

function useSyncExternalStoreWithTracked(subscribe, getSnapshot) {
  let getServerSnapshot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : getSnapshot;
  let isEqual = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : (a, b) => core.deepEqual(a, b);
  const trackedKeys = React__namespace.useRef([]);
  const result = withSelector_js.useSyncExternalStoreWithSelector(subscribe, getSnapshot, getServerSnapshot, x => x, (a, b) => {
    if (isPlainObject(a) && isPlainObject(b)) {
      for (const key of trackedKeys.current) {
        const equal = isEqual(a[key], b[key]);
        if (!equal) return false;
      }

      return true;
    }

    return isEqual(a, b);
  });

  if (isPlainObject(result)) {
    const trackedResult = { ...result
    };
    Object.defineProperties(trackedResult, Object.entries(trackedResult).reduce((res, _ref) => {
      let [key, value] = _ref;
      return { ...res,
        [key]: {
          configurable: false,
          enumerable: true,
          get: () => {
            if (!trackedKeys.current.includes(key)) {
              trackedKeys.current.push(key);
            }

            return value;
          }
        }
      };
    }, {}));
    return trackedResult;
  }

  return result;
}

const queryKey$d = () => [{
  entity: 'signer'
}];

const queryFn$d = () => core.fetchSigner();

function useSigner() {
  let {
    suspense,
    onError,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const signerQuery = useQuery(queryKey$d(), queryFn$d, {
    cacheTime: 0,
    staleTime: Infinity,
    suspense,
    onError,
    onSettled,
    onSuccess
  });
  const queryClient = useQueryClient();
  React__namespace.useEffect(() => {
    const unwatch = core.watchSigner(signer => queryClient.setQueryData(queryKey$d(), signer));
    return unwatch;
  }, [queryClient]);
  return signerQuery;
}

const findAndReplace = (cacheRef, _ref) => {
  let {
    find,
    replace
  } = _ref;

  if (cacheRef && find(cacheRef)) {
    return replace(cacheRef);
  }

  if (typeof cacheRef !== 'object') {
    return cacheRef;
  }

  if (Array.isArray(cacheRef)) {
    return cacheRef.map(item => findAndReplace(item, {
      find,
      replace
    }));
  }

  if (cacheRef instanceof Object) {
    return Object.entries(cacheRef).reduce((curr, _ref2) => {
      let [key, value] = _ref2;
      return { ...curr,
        [key]: findAndReplace(value, {
          find,
          replace
        })
      };
    }, {});
  }

  return cacheRef;
};

function deserialize(cachedString) {
  const cache = JSON.parse(cachedString);
  const deserializedCacheWithBigNumbers = findAndReplace(cache, {
    find: data => data.type === 'BigNumber',
    replace: data => ethers.BigNumber.from(data.hex)
  });
  return deserializedCacheWithBigNumbers;
}

/**
 * @function getReferenceKey
 *
 * @description
 * get the reference key for the circular value
 *
 * @param keys the keys to build the reference key from
 * @param cutoff the maximum number of keys to include
 * @returns the reference key
 */
function getReferenceKey(keys, cutoff) {
  return keys.slice(0, cutoff).join('.') || '.';
}
/**
 * @function getCutoff
 *
 * @description
 * faster `Array.prototype.indexOf` implementation build for slicing / splicing
 *
 * @param array the array to match the value in
 * @param value the value to match
 * @returns the matching index, or -1
 */


function getCutoff(array, value) {
  const {
    length
  } = array;

  for (let index = 0; index < length; ++index) {
    if (array[index] === value) {
      return index + 1;
    }
  }

  return 0;
}

/**
 * @function createReplacer
 *
 * @description
 * create a replacer method that handles circular values
 *
 * @param [replacer] a custom replacer to use for non-circular values
 * @param [circularReplacer] a custom replacer to use for circular methods
 * @returns the value to stringify
 */
function createReplacer(replacer, circularReplacer) {
  const hasReplacer = typeof replacer === 'function';
  const hasCircularReplacer = typeof circularReplacer === 'function';
  const cache = [];
  const keys = [];
  return function replace(key, value) {
    if (typeof value === 'object') {
      if (cache.length) {
        const thisCutoff = getCutoff(cache, this);

        if (thisCutoff === 0) {
          cache[cache.length] = this;
        } else {
          cache.splice(thisCutoff);
          keys.splice(thisCutoff);
        }

        keys[keys.length] = key;
        const valueCutoff = getCutoff(cache, value);

        if (valueCutoff !== 0) {
          return hasCircularReplacer ? circularReplacer.call(this, key, value, getReferenceKey(keys, valueCutoff)) : "[ref=".concat(getReferenceKey(keys, valueCutoff), "]");
        }
      } else {
        cache[0] = value;
        keys[0] = key;
      }
    }

    return hasReplacer ? replacer.call(this, key, value) : value;
  };
}
/**
 * @function stringify
 *
 * @description
 * stringifier that handles circular values
 * Forked from https://github.com/planttheidea/fast-stringify
 *
 * @param value to stringify
 * @param [replacer] a custom replacer function for handling standard values
 * @param [indent] the number of spaces to indent the output by
 * @param [circularReplacer] a custom replacer function for handling circular values
 * @returns the stringified output
 */


function serialize(value, replacer, indent, circularReplacer) {
  return JSON.stringify(value, createReplacer(replacer, circularReplacer), indent !== null && indent !== void 0 ? indent : undefined);
}

function createClient(_ref) {
  let {
    queryClient = new reactQuery.QueryClient({
      defaultOptions: {
        queries: {
          cacheTime: 1000 * 60 * 60 * 24,
          // 24 hours
          networkMode: 'offlineFirst',
          refetchOnWindowFocus: false,
          retry: 0
        },
        mutations: {
          networkMode: 'offlineFirst'
        }
      }
    }),
    persister = typeof window !== 'undefined' ? querySyncStoragePersister.createSyncStoragePersister({
      key: 'wagmi.cache',
      storage: window.localStorage,
      serialize,
      deserialize
    }) : undefined,
    ...config
  } = _ref;
  const client = core.createClient(config);
  if (persister) reactQueryPersistClient.persistQueryClient({
    queryClient,
    persister,
    dehydrateOptions: {
      shouldDehydrateQuery: query => query.cacheTime !== 0 && query.queryHash !== JSON.stringify(queryKey$d())
    }
  });
  return Object.assign(client, {
    queryClient
  });
}

function useAccount() {
  let {
    onConnect,
    onDisconnect
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const account = useSyncExternalStoreWithTracked(core.watchAccount, core.getAccount);
  const {
    subscribe
  } = useClient();
  React__namespace.useEffect(() => {
    // No need to subscribe if these callbacks aren't defined
    if (!onConnect && !onDisconnect) return; // Trigger update when status changes

    const unsubscribe = subscribe(state => state.status, (status, prevStatus) => {
      if (!!onConnect && status === 'connected') {
        const {
          address,
          connector
        } = core.getAccount();
        onConnect({
          address,
          connector,
          isReconnected: prevStatus === 'reconnecting'
        });
      }

      if (!!onDisconnect && prevStatus !== 'connecting' && status === 'disconnected') onDisconnect();
    });
    return unsubscribe;
  }, [onConnect, onDisconnect, subscribe]);
  return account;
}

const queryKey$c = _ref => {
  let {
    addressOrName,
    chainId,
    formatUnits,
    token
  } = _ref;
  return [{
    entity: 'balance',
    addressOrName,
    chainId,
    formatUnits,
    token
  }];
};

const queryFn$c = _ref2 => {
  let {
    queryKey: [{
      addressOrName,
      chainId,
      formatUnits,
      token
    }]
  } = _ref2;
  if (!addressOrName) throw new Error('address is required');
  return core.fetchBalance({
    addressOrName,
    chainId,
    formatUnits,
    token
  });
};

function useBalance() {
  let {
    addressOrName,
    cacheTime,
    chainId: chainId_,
    enabled = true,
    formatUnits,
    staleTime,
    suspense,
    token,
    watch,
    onError,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const chainId = useChainId({
    chainId: chainId_
  });
  const balanceQuery = useQuery(queryKey$c({
    addressOrName,
    chainId,
    formatUnits,
    token
  }), queryFn$c, {
    cacheTime,
    enabled: Boolean(enabled && addressOrName),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  });
  const {
    data: blockNumber
  } = useBlockNumber({
    chainId,
    watch
  });
  React__namespace.useEffect(() => {
    if (!enabled) return;
    if (!watch) return;
    if (!blockNumber) return;
    if (!addressOrName) return;
    balanceQuery.refetch(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);
  return balanceQuery;
}

const mutationKey$8 = args => [{
  entity: 'connect',
  ...args
}];

const mutationFn$7 = args => {
  const {
    connector,
    chainId
  } = args;
  if (!connector) throw new Error('connector is required');
  return core.connect({
    connector,
    chainId
  });
};

function useConnect() {
  let {
    chainId,
    connector,
    onError,
    onMutate,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const client = useClient();
  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables
  } = useMutation(mutationKey$8({
    connector,
    chainId
  }), mutationFn$7, {
    onError,
    onMutate,
    onSettled,
    onSuccess
  });
  const connect = React__namespace.useCallback(args => {
    var _args$chainId, _args$connector;

    return mutate({
      chainId: (_args$chainId = args === null || args === void 0 ? void 0 : args.chainId) !== null && _args$chainId !== void 0 ? _args$chainId : chainId,
      connector: (_args$connector = args === null || args === void 0 ? void 0 : args.connector) !== null && _args$connector !== void 0 ? _args$connector : connector
    });
  }, [chainId, connector, mutate]);
  const connectAsync = React__namespace.useCallback(args => {
    var _args$chainId2, _args$connector2;

    return mutateAsync({
      chainId: (_args$chainId2 = args === null || args === void 0 ? void 0 : args.chainId) !== null && _args$chainId2 !== void 0 ? _args$chainId2 : chainId,
      connector: (_args$connector2 = args === null || args === void 0 ? void 0 : args.connector) !== null && _args$connector2 !== void 0 ? _args$connector2 : connector
    });
  }, [chainId, connector, mutateAsync]);
  return {
    connect,
    connectAsync,
    connectors: client.connectors,
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    pendingConnector: variables === null || variables === void 0 ? void 0 : variables.connector,
    reset,
    status,
    variables
  };
}

const mutationKey$7 = [{
  entity: 'disconnect'
}];

const mutationFn$6 = () => core.disconnect();

function useDisconnect() {
  let {
    onError,
    onMutate,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const {
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate: disconnect,
    mutateAsync: disconnectAsync,
    reset,
    status
  } = useMutation(mutationKey$7, mutationFn$6, { ...(onError ? {
      onError(error, _variables, context) {
        onError(error, context);
      }

    } : {}),
    onMutate,
    ...(onSettled ? {
      onSettled(_data, error, _variables, context) {
        onSettled(error, context);
      }

    } : {}),
    ...(onSuccess ? {
      onSuccess(_data, _variables, context) {
        onSuccess(context);
      }

    } : {})
  });
  return {
    disconnect,
    disconnectAsync,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    status
  };
}

function useNetwork() {
  return useSyncExternalStoreWithTracked(core.watchNetwork, core.getNetwork);
}

const mutationKey$6 = args => [{
  entity: 'signMessage',
  ...args
}];

const mutationFn$5 = args => {
  const {
    message
  } = args;
  if (!message) throw new Error('message is required');
  return core.signMessage({
    message
  });
};

function useSignMessage() {
  let {
    message,
    onError,
    onMutate,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables
  } = useMutation(mutationKey$6({
    message
  }), mutationFn$5, {
    onError,
    onMutate,
    onSettled,
    onSuccess
  });
  const signMessage = React__namespace.useCallback(args => mutate(args || {
    message
  }), [message, mutate]);
  const signMessageAsync = React__namespace.useCallback(args => mutateAsync(args || {
    message
  }), [message, mutateAsync]);
  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    signMessage,
    signMessageAsync,
    status,
    variables
  };
}

const mutationKey$5 = args => [{
  entity: 'signTypedData',
  ...args
}];

const mutationFn$4 = args => {
  const {
    domain,
    types,
    value
  } = args;
  if (!domain || !types || !value) throw new Error('domain, types, and value are all required');
  return core.signTypedData({
    domain,
    types,
    value
  });
};

function useSignTypedData() {
  let {
    domain,
    types,
    value,
    onError,
    onMutate,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables
  } = useMutation(mutationKey$5({
    domain,
    types,
    value
  }), mutationFn$4, {
    onError,
    onMutate,
    onSettled,
    onSuccess
  });
  const signTypedData = React__namespace.useCallback(args => mutate(args || {
    domain,
    types,
    value
  }), [domain, types, value, mutate]);
  const signTypedDataAsync = React__namespace.useCallback(args => mutateAsync(args || {
    domain,
    types,
    value
  }), [domain, types, value, mutateAsync]);
  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    signTypedData,
    signTypedDataAsync,
    status,
    variables
  };
}

const mutationKey$4 = args => [{
  entity: 'switchNetwork',
  ...args
}];

const mutationFn$3 = args => {
  const {
    chainId
  } = args;
  if (!chainId) throw new Error('chainId is required');
  return core.switchNetwork({
    chainId
  });
};

function useSwitchNetwork() {
  var _client$connector, _client$chains;

  let {
    chainId,
    throwForSwitchChainNotSupported,
    onError,
    onMutate,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const client = useClient();
  const forceUpdate = useForceUpdate();
  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables
  } = useMutation(mutationKey$4({
    chainId
  }), mutationFn$3, {
    onError,
    onMutate,
    onSettled,
    onSuccess
  });
  const switchNetwork_ = React__namespace.useCallback(chainId_ => mutate({
    chainId: chainId_ !== null && chainId_ !== void 0 ? chainId_ : chainId
  }), [chainId, mutate]);
  const switchNetworkAsync_ = React__namespace.useCallback(chainId_ => mutateAsync({
    chainId: chainId_ !== null && chainId_ !== void 0 ? chainId_ : chainId
  }), [chainId, mutateAsync]); // Trigger update when connector changes since not all connectors support chain switching

  React__namespace.useEffect(() => {
    const unwatch = client.subscribe(_ref => {
      let {
        chains,
        connector
      } = _ref;
      return {
        chains,
        connector
      };
    }, forceUpdate);
    return unwatch;
  }, [client, forceUpdate]);
  let switchNetwork;
  let switchNetworkAsync;
  const supportsSwitchChain = !!((_client$connector = client.connector) !== null && _client$connector !== void 0 && _client$connector.switchChain);

  if (throwForSwitchChainNotSupported || supportsSwitchChain) {
    switchNetwork = switchNetwork_;
    switchNetworkAsync = switchNetworkAsync_;
  }

  return {
    chains: (_client$chains = client.chains) !== null && _client$chains !== void 0 ? _client$chains : [],
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    pendingChainId: variables === null || variables === void 0 ? void 0 : variables.chainId,
    reset,
    status,
    switchNetwork,
    switchNetworkAsync,
    variables
  };
}

const useContract = _ref => {
  let {
    addressOrName,
    contractInterface,
    signerOrProvider
  } = _ref;
  return React__namespace.useMemo(() => {
    return core.getContract({
      addressOrName,
      contractInterface,
      signerOrProvider
    });
  }, [addressOrName, contractInterface, signerOrProvider]);
};

const useContractEvent = _ref => {
  var _ref2;

  let {
    addressOrName,
    chainId,
    contractInterface,
    listener,
    eventName,
    signerOrProvider,
    once
  } = _ref;
  const provider = useProvider({
    chainId
  });
  const webSocketProvider = useWebSocketProvider({
    chainId
  });
  const contract = useContract({
    addressOrName,
    contractInterface,
    signerOrProvider: (_ref2 = webSocketProvider !== null && webSocketProvider !== void 0 ? webSocketProvider : provider) !== null && _ref2 !== void 0 ? _ref2 : signerOrProvider
  });
  const listenerRef = React__namespace.useRef(listener);
  listenerRef.current = listener;
  React__namespace.useEffect(() => {
    const handler = function () {
      for (var _len = arguments.length, event = new Array(_len), _key = 0; _key < _len; _key++) {
        event[_key] = arguments[_key];
      }

      return listenerRef.current(event);
    };

    const contract_ = contract;
    if (once) contract_.once(eventName, handler);else contract_.on(eventName, handler);
    return () => {
      contract_.off(eventName, handler);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, eventName]);
};

const paginatedIndexesConfig = (fn, _ref) => {
  let {
    perPage,
    start,
    direction
  } = _ref;
  return {
    getNextPageParam: (lastPage, pages) => (lastPage === null || lastPage === void 0 ? void 0 : lastPage.length) === perPage ? pages.length : undefined,
    contracts: function () {
      let page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return [...Array(perPage).keys()].map(index => {
        return direction === 'increment' ? start + index + page * perPage : start - index - page * perPage;
      }).filter(index => index >= 0).map(fn);
    }
  };
};
const queryKey$b = _ref2 => {
  let [{
    cacheKey,
    overrides
  }] = _ref2;
  return [{
    entity: 'readContractsInfinite',
    cacheKey,
    overrides
  }];
};

const queryFn$b = _ref3 => {
  let {
    contracts
  } = _ref3;
  return _ref4 => {
    let {
      queryKey: [{
        overrides
      }],
      pageParam
    } = _ref4;
    return core.readContracts({
      contracts: contracts(pageParam || undefined),
      overrides
    });
  };
};

function useContractInfiniteReads(_ref5) {
  let {
    cacheKey,
    cacheTime,
    contracts,
    enabled: enabled_ = true,
    getNextPageParam,
    isDataEqual = core.deepEqual,
    keepPreviousData,
    onError,
    onSettled,
    onSuccess,
    overrides,
    select,
    staleTime,
    suspense
  } = _ref5;
  const queryKey_ = React__namespace.useMemo(() => queryKey$b([{
    cacheKey,
    overrides
  }]), [cacheKey, overrides]);
  const enabled = React__namespace.useMemo(() => {
    const enabled = Boolean(enabled_ && contracts);
    return enabled;
  }, [contracts, enabled_]);
  return useInfiniteQuery(queryKey_, queryFn$b({
    contracts
  }), {
    cacheTime,
    enabled,
    getNextPageParam,
    isDataEqual,
    keepPreviousData,
    select,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  });
}

const queryKey$a = _ref => {
  let [{
    addressOrName,
    args,
    chainId,
    functionName,
    overrides
  }, {
    blockNumber
  }] = _ref;
  return [{
    entity: 'readContract',
    addressOrName,
    args,
    blockNumber,
    chainId,
    functionName,
    overrides
  }];
};

const queryFn$a = _ref2 => {
  let {
    contractInterface
  } = _ref2;
  return async _ref3 => {
    var _await$readContract;

    let {
      queryKey: [{
        addressOrName,
        args,
        chainId,
        functionName,
        overrides
      }]
    } = _ref3;
    return (_await$readContract = await core.readContract({
      addressOrName,
      args,
      chainId,
      contractInterface,
      functionName,
      overrides
    })) !== null && _await$readContract !== void 0 ? _await$readContract : null;
  };
};

function useContractRead(_ref4) {
  let {
    addressOrName,
    contractInterface,
    functionName,
    args,
    chainId: chainId_,
    overrides,
    cacheOnBlock = false,
    cacheTime,
    enabled: enabled_ = true,
    isDataEqual = core.deepEqual,
    select,
    staleTime,
    suspense,
    watch,
    onError,
    onSettled,
    onSuccess
  } = _ref4;
  const chainId = useChainId({
    chainId: chainId_
  });
  const {
    data: blockNumber
  } = useBlockNumber({
    chainId,
    enabled: watch || cacheOnBlock,
    watch
  });
  const queryKey_ = React__namespace.useMemo(() => queryKey$a([{
    addressOrName,
    args,
    chainId,
    functionName,
    overrides
  }, {
    blockNumber: cacheOnBlock ? blockNumber : undefined
  }]), [addressOrName, args, blockNumber, cacheOnBlock, chainId, functionName, overrides]);
  const enabled = React__namespace.useMemo(() => {
    let enabled = Boolean(enabled_ && addressOrName && functionName);
    if (cacheOnBlock) enabled = Boolean(enabled && blockNumber);
    return enabled;
  }, [addressOrName, blockNumber, cacheOnBlock, enabled_, functionName]);
  useInvalidateOnBlock({
    chainId,
    enabled: watch && !cacheOnBlock,
    queryKey: queryKey_
  });
  return useQuery(queryKey_, queryFn$a({
    contractInterface
  }), {
    cacheTime,
    enabled,
    isDataEqual,
    select: data => {
      const result = core.parseContractResult({
        contractInterface,
        data,
        functionName
      });
      return select ? select(result) : result;
    },
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  });
}

const queryKey$9 = _ref => {
  let [{
    allowFailure,
    contracts,
    overrides
  }, {
    blockNumber,
    chainId
  }] = _ref;
  return [{
    entity: 'readContracts',
    allowFailure,
    blockNumber,
    chainId,
    contracts: contracts.map(_ref2 => {
      let {
        addressOrName,
        args,
        chainId,
        functionName
      } = _ref2;
      return {
        addressOrName,
        args,
        chainId,
        functionName
      };
    }),
    overrides
  }];
};

const queryFn$9 = _ref3 => {
  let {
    contractInterfaces
  } = _ref3;
  return _ref4 => {
    let {
      queryKey: [{
        allowFailure,
        contracts: contracts_,
        overrides
      }]
    } = _ref4;
    const contracts = contracts_.map((contract, i) => ({ ...contract,
      contractInterface: contractInterfaces[i]
    }));
    return core.readContracts({
      allowFailure,
      contracts,
      overrides
    });
  };
};

function useContractReads(_ref5) {
  let {
    allowFailure = true,
    cacheOnBlock = false,
    cacheTime,
    contracts,
    overrides,
    enabled: enabled_ = true,
    isDataEqual = core.deepEqual,
    keepPreviousData,
    onError,
    onSettled,
    onSuccess,
    select,
    staleTime,
    suspense,
    watch
  } = _ref5;
  const {
    data: blockNumber
  } = useBlockNumber({
    enabled: watch || cacheOnBlock,
    watch
  });
  const chainId = useChainId();
  const queryKey_ = React__namespace.useMemo(() => queryKey$9([{
    allowFailure,
    contracts,
    overrides
  }, {
    blockNumber: cacheOnBlock ? blockNumber : undefined,
    chainId
  }]), [allowFailure, blockNumber, cacheOnBlock, chainId, contracts, overrides]);
  const contractInterfaces = contracts.map(_ref6 => {
    let {
      contractInterface
    } = _ref6;
    return contractInterface;
  });
  const enabled = React__namespace.useMemo(() => {
    let enabled = Boolean(enabled_ && contracts.length > 0);
    if (cacheOnBlock) enabled = Boolean(enabled && blockNumber);
    return enabled;
  }, [blockNumber, cacheOnBlock, contracts, enabled_]);
  useInvalidateOnBlock({
    enabled: watch && !cacheOnBlock,
    queryKey: queryKey_
  });
  return useQuery(queryKey_, queryFn$9({
    contractInterfaces
  }), {
    cacheTime,
    enabled,
    isDataEqual,
    keepPreviousData,
    staleTime,
    select: data => {
      const result = data.map((data, i) => {
        var _contracts$i, _contracts$i2;

        return contracts[i] ? core.parseContractResult({
          contractInterface: (_contracts$i = contracts[i]) === null || _contracts$i === void 0 ? void 0 : _contracts$i.contractInterface,
          functionName: (_contracts$i2 = contracts[i]) === null || _contracts$i2 === void 0 ? void 0 : _contracts$i2.functionName,
          data
        }) : data;
      });
      return select ? select(result) : result;
    },
    suspense,
    onError,
    onSettled,
    onSuccess
  });
}

const mutationKey$3 = _ref => {
  let [{
    addressOrName,
    args,
    chainId,
    contractInterface,
    functionName,
    overrides,
    request
  }] = _ref;
  return [{
    entity: 'writeContract',
    addressOrName,
    args,
    chainId,
    contractInterface,
    functionName,
    overrides,
    request
  }];
};

const mutationFn$2 = _ref2 => {
  let {
    addressOrName,
    args,
    chainId,
    contractInterface,
    functionName,
    mode,
    overrides,
    request
  } = _ref2;
  return core.writeContract({
    addressOrName,
    args,
    chainId,
    contractInterface,
    functionName,
    mode,
    overrides,
    request
  });
};
/**
 * @description Hook for calling an ethers Contract [write](https://docs.ethers.io/v5/api/contract/contract/#Contract--write)
 * method.
 *
 * It is highly recommended to pair this with the [`usePrepareContractWrite` hook](/docs/prepare-hooks/usePrepareContractWrite)
 * to [avoid UX pitfalls](https://wagmi.sh/docs/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks).
 *
 * @example
 * import { useContractWrite, usePrepareContractWrite } from 'wagmi'
 *
 * const { config } = usePrepareContractWrite({
 *  addressOrName: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
 *  contractInterface: wagmigotchiABI,
 *  functionName: 'feed',
 * })
 * const { data, isLoading, isSuccess, write } = useContractWrite(config)
 *
 */


function useContractWrite(_ref3) {
  let {
    addressOrName,
    args,
    chainId,
    contractInterface,
    functionName,
    mode,
    overrides,
    request,
    onError,
    onMutate,
    onSettled,
    onSuccess
  } = _ref3;
  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables
  } = useMutation(mutationKey$3([{
    addressOrName,
    contractInterface,
    functionName,
    args,
    chainId,
    mode,
    overrides,
    request
  }]), mutationFn$2, {
    onError,
    onMutate,
    onSettled,
    onSuccess
  });
  const write = React__namespace.useCallback(overrideConfig => {
    var _overrideConfig$reckl, _overrideConfig$reckl2;

    return mutate({
      addressOrName,
      args: (_overrideConfig$reckl = overrideConfig === null || overrideConfig === void 0 ? void 0 : overrideConfig.recklesslySetUnpreparedArgs) !== null && _overrideConfig$reckl !== void 0 ? _overrideConfig$reckl : args,
      chainId,
      contractInterface,
      functionName,
      mode: overrideConfig ? 'recklesslyUnprepared' : mode,
      overrides: (_overrideConfig$reckl2 = overrideConfig === null || overrideConfig === void 0 ? void 0 : overrideConfig.recklesslySetUnpreparedOverrides) !== null && _overrideConfig$reckl2 !== void 0 ? _overrideConfig$reckl2 : overrides,
      request
    });
  }, [addressOrName, args, chainId, contractInterface, functionName, mode, mutate, overrides, request]);
  const writeAsync = React__namespace.useCallback(overrideConfig => {
    var _overrideConfig$reckl3, _overrideConfig$reckl4;

    return mutateAsync({
      addressOrName,
      args: (_overrideConfig$reckl3 = overrideConfig === null || overrideConfig === void 0 ? void 0 : overrideConfig.recklesslySetUnpreparedArgs) !== null && _overrideConfig$reckl3 !== void 0 ? _overrideConfig$reckl3 : args,
      chainId,
      contractInterface,
      functionName,
      mode: overrideConfig ? 'recklesslyUnprepared' : mode,
      overrides: (_overrideConfig$reckl4 = overrideConfig === null || overrideConfig === void 0 ? void 0 : overrideConfig.recklesslySetUnpreparedOverrides) !== null && _overrideConfig$reckl4 !== void 0 ? _overrideConfig$reckl4 : overrides,
      request
    });
  }, [addressOrName, args, chainId, contractInterface, functionName, mode, mutateAsync, overrides, request]);
  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    status,
    variables,
    write: mode === 'prepared' && !request ? undefined : write,
    writeAsync: mode === 'prepared' && !request ? undefined : writeAsync
  };
}

const mutationKey$2 = _ref => {
  let [{
    addressOrName,
    args,
    chainId,
    contractInterface,
    overrides
  }] = _ref;
  return [{
    entity: 'writeContract',
    addressOrName,
    args,
    chainId,
    contractInterface,
    overrides
  }];
};
/** @deprecated */

function useDeprecatedContractWrite(_ref2) {
  let {
    addressOrName,
    args,
    chainId,
    contractInterface,
    functionName,
    overrides,
    signerOrProvider,
    onError,
    onMutate,
    onSettled,
    onSuccess
  } = _ref2;
  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables
  } = useMutation(mutationKey$2([{
    addressOrName,
    args,
    chainId,
    contractInterface,
    functionName,
    overrides
  }]), _ref3 => {
    let {
      args,
      overrides
    } = _ref3;
    return core.deprecatedWriteContract({
      addressOrName,
      args,
      chainId,
      contractInterface,
      functionName,
      overrides,
      signerOrProvider
    });
  }, {
    onError,
    onMutate,
    onSettled,
    onSuccess
  });
  const write = React__namespace.useCallback(overrideConfig => mutate({
    addressOrName,
    chainId,
    contractInterface,
    functionName,
    signerOrProvider,
    ...(overrideConfig || {
      args,
      overrides
    })
  }), [addressOrName, args, chainId, contractInterface, functionName, mutate, overrides, signerOrProvider]);
  const writeAsync = React__namespace.useCallback(overrideConfig => mutateAsync({
    addressOrName,
    chainId,
    contractInterface,
    functionName,
    signerOrProvider,
    ...(overrideConfig || {
      args,
      overrides
    })
  }), [addressOrName, args, chainId, contractInterface, functionName, mutateAsync, overrides, signerOrProvider]);
  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    status,
    variables,
    write,
    writeAsync
  };
}

const queryKey$8 = (_ref, _ref2) => {
  let {
    args,
    addressOrName,
    functionName,
    overrides
  } = _ref;
  let {
    chainId,
    signerAddress
  } = _ref2;
  return [{
    entity: 'prepareContractTransaction',
    addressOrName,
    args,
    chainId,
    functionName,
    overrides,
    signerAddress
  }];
};

const queryFn$8 = _ref3 => {
  let {
    contractInterface,
    signer
  } = _ref3;
  return _ref4 => {
    let {
      queryKey: [{
        args,
        addressOrName,
        functionName,
        overrides
      }]
    } = _ref4;
    return core.prepareWriteContract({
      args,
      addressOrName,
      contractInterface,
      functionName,
      overrides,
      signer
    });
  };
};
/**
 * @description Hook for preparing a contract write to be sent via [`useContractWrite`](/docs/hooks/useContractWrite).
 *
 * Eagerly fetches the parameters required for sending a contract write transaction such as the gas estimate.
 *
 * @example
 * import { useContractWrite, usePrepareContractWrite } from 'wagmi'
 *
 * const { config } = usePrepareContractWrite({
 *  addressOrName: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
 *  contractInterface: wagmigotchiABI,
 *  functionName: 'feed',
 * })
 * const { data, isLoading, isSuccess, write } = useContractWrite(config)
 *
 */


function usePrepareContractWrite(_ref5) {
  let {
    addressOrName,
    contractInterface,
    functionName,
    args,
    overrides,
    cacheTime,
    enabled = true,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  } = _ref5;
  const chainId = useChainId();
  const {
    data: signer
  } = useSigner();
  const prepareContractWriteQuery = useQuery(queryKey$8({
    addressOrName,
    functionName,
    args,
    overrides
  }, {
    chainId,
    signerAddress: signer === null || signer === void 0 ? void 0 : signer._address
  }), queryFn$8({
    contractInterface,
    signer
  }), {
    cacheTime,
    enabled: Boolean(enabled && signer),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  });
  return Object.assign(prepareContractWriteQuery, {
    config: {
      addressOrName,
      args,
      contractInterface,
      overrides,
      functionName,
      request: undefined,
      mode: 'prepared',
      ...prepareContractWriteQuery.data
    }
  });
}

const queryKey$7 = _ref => {
  let {
    address,
    chainId,
    formatUnits
  } = _ref;
  return [{
    entity: 'token',
    address,
    chainId,
    formatUnits
  }];
};

const queryFn$7 = _ref2 => {
  let {
    queryKey: [{
      address,
      chainId,
      formatUnits
    }]
  } = _ref2;
  if (!address) throw new Error('address is required');
  return core.fetchToken({
    address,
    chainId,
    formatUnits
  });
};

function useToken() {
  let {
    address,
    chainId: chainId_,
    formatUnits = 'ether',
    cacheTime,
    enabled = true,
    staleTime = 1000 * 60 * 60 * 24,
    // 24 hours
    suspense,
    onError,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const chainId = useChainId({
    chainId: chainId_
  });
  return useQuery(queryKey$7({
    address,
    chainId,
    formatUnits
  }), queryFn$7, {
    cacheTime,
    enabled: Boolean(enabled && address),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  });
}

const queryKey$6 = _ref => {
  let {
    chainId,
    name
  } = _ref;
  return [{
    entity: 'ensAddress',
    chainId,
    name
  }];
};

const queryFn$6 = _ref2 => {
  let {
    queryKey: [{
      chainId,
      name
    }]
  } = _ref2;
  if (!name) throw new Error('name is required');
  return core.fetchEnsAddress({
    chainId,
    name
  });
};

function useEnsAddress() {
  let {
    cacheTime,
    chainId: chainId_,
    enabled = true,
    name,
    staleTime = 1000 * 60 * 60 * 24,
    // 24 hours
    suspense,
    onError,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const chainId = useChainId({
    chainId: chainId_
  });
  return useQuery(queryKey$6({
    chainId,
    name
  }), queryFn$6, {
    cacheTime,
    enabled: Boolean(enabled && chainId && name),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  });
}

const queryKey$5 = _ref => {
  let {
    addressOrName,
    chainId
  } = _ref;
  return [{
    entity: 'ensAvatar',
    addressOrName,
    chainId
  }];
};

const queryFn$5 = _ref2 => {
  let {
    queryKey: [{
      addressOrName,
      chainId
    }]
  } = _ref2;
  if (!addressOrName) throw new Error('addressOrName is required');
  return core.fetchEnsAvatar({
    addressOrName,
    chainId
  });
};

function useEnsAvatar() {
  let {
    addressOrName,
    cacheTime,
    chainId: chainId_,
    enabled = true,
    staleTime = 1000 * 60 * 60 * 24,
    // 24 hours
    suspense,
    onError,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const chainId = useChainId({
    chainId: chainId_
  });
  return useQuery(queryKey$5({
    addressOrName,
    chainId
  }), queryFn$5, {
    cacheTime,
    enabled: Boolean(enabled && addressOrName && chainId),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  });
}

const queryKey$4 = _ref => {
  let {
    address,
    chainId
  } = _ref;
  return [{
    entity: 'ensName',
    address,
    chainId
  }];
};

const queryFn$4 = _ref2 => {
  let {
    queryKey: [{
      address,
      chainId
    }]
  } = _ref2;
  if (!address) throw new Error('address is required');
  return core.fetchEnsName({
    address,
    chainId
  });
};

function useEnsName() {
  let {
    address,
    cacheTime,
    chainId: chainId_,
    enabled = true,
    staleTime = 1000 * 60 * 60 * 24,
    // 24 hours
    suspense,
    onError,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const chainId = useChainId({
    chainId: chainId_
  });
  return useQuery(queryKey$4({
    address,
    chainId
  }), queryFn$4, {
    cacheTime,
    enabled: Boolean(enabled && address && chainId),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  });
}

const queryKey$3 = _ref => {
  let {
    chainId,
    name
  } = _ref;
  return [{
    entity: 'ensResolver',
    chainId,
    name
  }];
};

const queryFn$3 = _ref2 => {
  let {
    queryKey: [{
      chainId,
      name
    }]
  } = _ref2;
  if (!name) throw new Error('name is required');
  return core.fetchEnsResolver({
    chainId,
    name
  });
};

function useEnsResolver() {
  let {
    cacheTime,
    chainId: chainId_,
    enabled = true,
    name,
    staleTime = 1000 * 60 * 60 * 24,
    // 24 hours
    suspense,
    onError,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const chainId = useChainId({
    chainId: chainId_
  });
  return useQuery(queryKey$3({
    chainId,
    name
  }), queryFn$3, {
    cacheTime,
    enabled: Boolean(enabled && chainId && name),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  });
}

const mutationKey$1 = args => [{
  entity: 'sendTransaction',
  ...args
}];

const mutationFn$1 = args => {
  const {
    chainId,
    request
  } = args;
  if (!request) throw new Error('request is required');
  return core.deprecatedSendTransaction({
    chainId,
    request
  });
};
/** @deprecated */


function useDeprecatedSendTransaction() {
  let {
    chainId,
    request,
    onError,
    onMutate,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables
  } = useMutation(mutationKey$1({
    chainId,
    request
  }), mutationFn$1, {
    onError,
    onMutate,
    onSettled,
    onSuccess
  });
  const sendTransaction = React__namespace.useCallback(args => mutate({
    chainId,
    request,
    ...(args !== null && args !== void 0 ? args : {})
  }), [chainId, mutate, request]);
  const sendTransactionAsync = React__namespace.useCallback(args => mutateAsync({
    chainId,
    request,
    ...(args !== null && args !== void 0 ? args : {})
  }), [chainId, mutateAsync, request]);
  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    sendTransaction,
    sendTransactionAsync,
    status,
    variables
  };
}

const queryKey$2 = _ref => {
  let {
    chainId,
    request
  } = _ref;
  return [{
    entity: 'prepareSendTransaction',
    chainId,
    request
  }];
};

const queryFn$2 = _ref2 => {
  let {
    queryKey: [{
      request
    }]
  } = _ref2;
  if (!request.to) throw new Error('request.to is required');
  return core.prepareSendTransaction({
    request: { ...request,
      to: request.to
    }
  });
};
/**
 * @description Hook for preparing a transaction to be sent via [`useSendTransaction`](/docs/hooks/useSendTransaction).
 *
 * Eagerly fetches the parameters required for sending a transaction such as the gas estimate and resolving an ENS address (if required).
 *
 * @example
 * import { useSendTransaction, usePrepareSendTransaction } from 'wagmi'
 *
 * const config = usePrepareSendTransaction({
 *   to: 'moxey.eth',
 *   value: parseEther('1'),
 * })
 * const result = useSendTransaction(config)
 */


function usePrepareSendTransaction(_ref3) {
  let {
    request,
    cacheTime,
    enabled = true,
    staleTime = 1000 * 60 * 60 * 24,
    // 24 hours
    suspense,
    onError,
    onSettled,
    onSuccess
  } = _ref3;
  const chainId = useChainId();
  const provider = useProvider();
  const prepareSendTransactionQuery = useQuery(queryKey$2({
    request,
    chainId
  }), queryFn$2, {
    cacheTime,
    enabled: Boolean(enabled && provider && request.to),
    isDataEqual: core.deepEqual,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  });
  return Object.assign(prepareSendTransactionQuery, {
    config: {
      request: undefined,
      mode: 'prepared',
      ...prepareSendTransactionQuery.data
    }
  });
}

const mutationKey = args => [{
  entity: 'sendTransaction',
  ...args
}];

const mutationFn = _ref => {
  let {
    chainId,
    mode,
    request
  } = _ref;
  return core.sendTransaction({
    chainId,
    mode,
    request
  });
};
/**
 * @description Hook for sending a transaction.
 *
 * It is recommended to pair this with the [`usePrepareSendTransaction` hook](/docs/prepare-hooks/usePrepareSendTransaction)
 * to [avoid UX pitfalls](https://wagmi.sh/docs/prepare-hooks/intro#ux-pitfalls-without-prepare-hooks).
 *
 * @example
 * import { useSendTransaction, usePrepareSendTransaction } from 'wagmi'
 *
 * const config = usePrepareSendTransaction({
 *   request: {
 *     to: 'moxey.eth',
 *     value: parseEther('1'),
 *   }
 * })
 * const result = useSendTransaction(config)
 */


function useSendTransaction(_ref2) {
  let {
    chainId,
    mode,
    request,
    onError,
    onMutate,
    onSettled,
    onSuccess
  } = _ref2;
  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    status,
    variables
  } = useMutation(mutationKey({
    chainId,
    mode,
    request
  }), mutationFn, {
    onError,
    onMutate,
    onSettled,
    onSuccess
  });
  const sendTransaction = React__namespace.useCallback(args => {
    var _args$recklesslySetUn;

    return mutate({
      chainId,
      mode,
      request: (_args$recklesslySetUn = args === null || args === void 0 ? void 0 : args.recklesslySetUnpreparedRequest) !== null && _args$recklesslySetUn !== void 0 ? _args$recklesslySetUn : request
    });
  }, [chainId, mode, mutate, request]);
  const sendTransactionAsync = React__namespace.useCallback(args => {
    var _args$recklesslySetUn2;

    return mutateAsync({
      chainId,
      mode,
      request: (_args$recklesslySetUn2 = args === null || args === void 0 ? void 0 : args.recklesslySetUnpreparedRequest) !== null && _args$recklesslySetUn2 !== void 0 ? _args$recklesslySetUn2 : request
    });
  }, [chainId, mode, mutateAsync, request]);
  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    sendTransaction: mode === 'prepared' && !request ? undefined : sendTransaction,
    sendTransactionAsync: mode === 'prepared' && !request ? undefined : sendTransactionAsync,
    status,
    variables
  };
}

const queryKey$1 = _ref => {
  let {
    chainId,
    hash
  } = _ref;
  return [{
    entity: 'transaction',
    chainId,
    hash
  }];
};

const queryFn$1 = _ref2 => {
  let {
    queryKey: [{
      chainId,
      hash
    }]
  } = _ref2;
  if (!hash) throw new Error('hash is required');
  return core.fetchTransaction({
    chainId,
    hash
  });
};
/**
 * @description Fetches transaction for hash
 *
 * @example
 * import { useTransaction } from 'wagmi'
 *
 * const result = useTransaction({
 *  chainId: 1,
 *  hash: '0x...',
 * })
 */


function useTransaction() {
  let {
    cacheTime = 0,
    chainId: chainId_,
    enabled = true,
    hash,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const chainId = useChainId({
    chainId: chainId_
  });
  return useQuery(queryKey$1({
    chainId,
    hash
  }), queryFn$1, {
    cacheTime,
    enabled: Boolean(enabled && hash),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  });
}

const queryKey = _ref => {
  let {
    confirmations,
    chainId,
    hash,
    timeout,
    wait
  } = _ref;
  return [{
    entity: 'waitForTransaction',
    confirmations,
    chainId,
    hash,
    timeout,
    wait
  }];
};

const queryFn = _ref2 => {
  let {
    queryKey: [{
      chainId,
      confirmations,
      hash,
      timeout,
      wait
    }]
  } = _ref2;
  return core.waitForTransaction({
    chainId,
    confirmations,
    hash,
    timeout,
    wait
  });
};

function useWaitForTransaction() {
  let {
    chainId: chainId_,
    confirmations,
    hash,
    timeout,
    wait,
    cacheTime,
    enabled = true,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const chainId = useChainId({
    chainId: chainId_
  });
  return useQuery(queryKey({
    chainId,
    confirmations,
    hash,
    timeout,
    wait
  }), queryFn, {
    cacheTime,
    enabled: Boolean(enabled && (hash || wait)),
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess
  });
}

Object.defineProperty(exports, 'AddChainError', {
  enumerable: true,
  get: function () { return core.AddChainError; }
});
Object.defineProperty(exports, 'ChainDoesNotSupportMulticallError', {
  enumerable: true,
  get: function () { return core.ChainDoesNotSupportMulticallError; }
});
Object.defineProperty(exports, 'ChainMismatchError', {
  enumerable: true,
  get: function () { return core.ChainMismatchError; }
});
Object.defineProperty(exports, 'ChainNotConfiguredError', {
  enumerable: true,
  get: function () { return core.ChainNotConfiguredError; }
});
Object.defineProperty(exports, 'Client', {
  enumerable: true,
  get: function () { return core.Client; }
});
Object.defineProperty(exports, 'Connector', {
  enumerable: true,
  get: function () { return core.Connector; }
});
Object.defineProperty(exports, 'ConnectorAlreadyConnectedError', {
  enumerable: true,
  get: function () { return core.ConnectorAlreadyConnectedError; }
});
Object.defineProperty(exports, 'ConnectorNotFoundError', {
  enumerable: true,
  get: function () { return core.ConnectorNotFoundError; }
});
Object.defineProperty(exports, 'ContractMethodDoesNotExistError', {
  enumerable: true,
  get: function () { return core.ContractMethodDoesNotExistError; }
});
Object.defineProperty(exports, 'ContractMethodNoResultError', {
  enumerable: true,
  get: function () { return core.ContractMethodNoResultError; }
});
Object.defineProperty(exports, 'ContractMethodRevertedError', {
  enumerable: true,
  get: function () { return core.ContractMethodRevertedError; }
});
Object.defineProperty(exports, 'ContractResultDecodeError', {
  enumerable: true,
  get: function () { return core.ContractResultDecodeError; }
});
Object.defineProperty(exports, 'ProviderChainsNotFound', {
  enumerable: true,
  get: function () { return core.ProviderChainsNotFound; }
});
Object.defineProperty(exports, 'ProviderRpcError', {
  enumerable: true,
  get: function () { return core.ProviderRpcError; }
});
Object.defineProperty(exports, 'ResourceUnavailableError', {
  enumerable: true,
  get: function () { return core.ResourceUnavailableError; }
});
Object.defineProperty(exports, 'RpcError', {
  enumerable: true,
  get: function () { return core.RpcError; }
});
Object.defineProperty(exports, 'SwitchChainError', {
  enumerable: true,
  get: function () { return core.SwitchChainError; }
});
Object.defineProperty(exports, 'SwitchChainNotSupportedError', {
  enumerable: true,
  get: function () { return core.SwitchChainNotSupportedError; }
});
Object.defineProperty(exports, 'UserRejectedRequestError', {
  enumerable: true,
  get: function () { return core.UserRejectedRequestError; }
});
Object.defineProperty(exports, 'alchemyRpcUrls', {
  enumerable: true,
  get: function () { return core.alchemyRpcUrls; }
});
Object.defineProperty(exports, 'allChains', {
  enumerable: true,
  get: function () { return core.allChains; }
});
Object.defineProperty(exports, 'chain', {
  enumerable: true,
  get: function () { return core.chain; }
});
Object.defineProperty(exports, 'chainId', {
  enumerable: true,
  get: function () { return core.chainId; }
});
Object.defineProperty(exports, 'configureChains', {
  enumerable: true,
  get: function () { return core.configureChains; }
});
Object.defineProperty(exports, 'createStorage', {
  enumerable: true,
  get: function () { return core.createStorage; }
});
Object.defineProperty(exports, 'deepEqual', {
  enumerable: true,
  get: function () { return core.deepEqual; }
});
Object.defineProperty(exports, 'defaultChains', {
  enumerable: true,
  get: function () { return core.defaultChains; }
});
Object.defineProperty(exports, 'defaultL2Chains', {
  enumerable: true,
  get: function () { return core.defaultL2Chains; }
});
Object.defineProperty(exports, 'erc20ABI', {
  enumerable: true,
  get: function () { return core.erc20ABI; }
});
Object.defineProperty(exports, 'erc721ABI', {
  enumerable: true,
  get: function () { return core.erc721ABI; }
});
Object.defineProperty(exports, 'etherscanBlockExplorers', {
  enumerable: true,
  get: function () { return core.etherscanBlockExplorers; }
});
Object.defineProperty(exports, 'infuraRpcUrls', {
  enumerable: true,
  get: function () { return core.infuraRpcUrls; }
});
Object.defineProperty(exports, 'publicRpcUrls', {
  enumerable: true,
  get: function () { return core.publicRpcUrls; }
});
Object.defineProperty(exports, 'readContracts', {
  enumerable: true,
  get: function () { return core.readContracts; }
});
exports.Context = Context;
exports.WagmiConfig = WagmiConfig;
exports.createClient = createClient;
exports.deserialize = deserialize;
exports.paginatedIndexesConfig = paginatedIndexesConfig;
exports.serialize = serialize;
exports.useAccount = useAccount;
exports.useBalance = useBalance;
exports.useBlockNumber = useBlockNumber;
exports.useClient = useClient;
exports.useConnect = useConnect;
exports.useContract = useContract;
exports.useContractEvent = useContractEvent;
exports.useContractInfiniteReads = useContractInfiniteReads;
exports.useContractRead = useContractRead;
exports.useContractReads = useContractReads;
exports.useContractWrite = useContractWrite;
exports.useDeprecatedContractWrite = useDeprecatedContractWrite;
exports.useDeprecatedSendTransaction = useDeprecatedSendTransaction;
exports.useDisconnect = useDisconnect;
exports.useEnsAddress = useEnsAddress;
exports.useEnsAvatar = useEnsAvatar;
exports.useEnsName = useEnsName;
exports.useEnsResolver = useEnsResolver;
exports.useFeeData = useFeeData;
exports.useInfiniteQuery = useInfiniteQuery;
exports.useMutation = useMutation;
exports.useNetwork = useNetwork;
exports.usePrepareContractWrite = usePrepareContractWrite;
exports.usePrepareSendTransaction = usePrepareSendTransaction;
exports.useProvider = useProvider;
exports.useQuery = useQuery;
exports.useQueryClient = useQueryClient;
exports.useSendTransaction = useSendTransaction;
exports.useSignMessage = useSignMessage;
exports.useSignTypedData = useSignTypedData;
exports.useSigner = useSigner;
exports.useSwitchNetwork = useSwitchNetwork;
exports.useToken = useToken;
exports.useTransaction = useTransaction;
exports.useWaitForTransaction = useWaitForTransaction;
exports.useWebSocketProvider = useWebSocketProvider;
