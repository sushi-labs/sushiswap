(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tanstack/query-core'), require('react'), require('@tanstack/react-query')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tanstack/query-core', 'react', '@tanstack/react-query'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ReactQueryPersistClient = {}, global.QueryCore, global.React, global.ReactQuery));
})(this, (function (exports, queryCore, React, reactQuery) { 'use strict';

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

  /**
   * Restores persisted data to the QueryCache
   *  - data obtained from persister.restoreClient
   *  - data is hydrated using hydrateOptions
   * If data is expired, busted, empty, or throws, it runs persister.removeClient
   */
  async function persistQueryClientRestore({
    queryClient,
    persister,
    maxAge = 1000 * 60 * 60 * 24,
    buster = '',
    hydrateOptions
  }) {
    try {
      const persistedClient = await persister.restoreClient();

      if (persistedClient) {
        if (persistedClient.timestamp) {
          const expired = Date.now() - persistedClient.timestamp > maxAge;
          const busted = persistedClient.buster !== buster;

          if (expired || busted) {
            persister.removeClient();
          } else {
            queryCore.hydrate(queryClient, persistedClient.clientState, hydrateOptions);
          }
        } else {
          persister.removeClient();
        }
      }
    } catch (err) {
      {
        queryClient.getLogger().error(err);
        queryClient.getLogger().warn('Encountered an error attempting to restore client cache from persisted location. As a precaution, the persisted cache will be discarded.');
      }

      persister.removeClient();
    }
  }
  /**
   * Persists data from the QueryCache
   *  - data dehydrated using dehydrateOptions
   *  - data is persisted using persister.persistClient
   */

  async function persistQueryClientSave({
    queryClient,
    persister,
    buster = '',
    dehydrateOptions
  }) {
    const persistClient = {
      buster,
      timestamp: Date.now(),
      clientState: queryCore.dehydrate(queryClient, dehydrateOptions)
    };
    await persister.persistClient(persistClient);
  }
  /**
   * Subscribe to QueryCache and MutationCache updates (for persisting)
   * @returns an unsubscribe function (to discontinue monitoring)
   */

  function persistQueryClientSubscribe(props) {
    const unsubscribeQueryCache = props.queryClient.getQueryCache().subscribe(() => {
      persistQueryClientSave(props);
    });
    const unusbscribeMutationCache = props.queryClient.getMutationCache().subscribe(() => {
      persistQueryClientSave(props);
    });
    return () => {
      unsubscribeQueryCache();
      unusbscribeMutationCache();
    };
  }
  /**
   * Restores persisted data to QueryCache and persists further changes.
   */

  function persistQueryClient(props) {
    let hasUnsubscribed = false;
    let persistQueryClientUnsubscribe;

    const unsubscribe = () => {
      hasUnsubscribed = true;
      persistQueryClientUnsubscribe == null ? void 0 : persistQueryClientUnsubscribe();
    }; // Attempt restore


    const restorePromise = persistQueryClientRestore(props).then(() => {
      if (!hasUnsubscribed) {
        // Subscribe to changes in the query cache to trigger the save
        persistQueryClientUnsubscribe = persistQueryClientSubscribe(props);
      }
    });
    return [unsubscribe, restorePromise];
  }

  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };
    return _extends.apply(this, arguments);
  }

  const PersistQueryClientProvider = ({
    client,
    children,
    persistOptions,
    onSuccess,
    ...props
  }) => {
    const [isRestoring, setIsRestoring] = React__namespace.useState(true);
    const refs = React__namespace.useRef({
      persistOptions,
      onSuccess
    });
    React__namespace.useEffect(() => {
      refs.current = {
        persistOptions,
        onSuccess
      };
    });
    React__namespace.useEffect(() => {
      let isStale = false;
      setIsRestoring(true);
      const [unsubscribe, promise] = persistQueryClient({ ...refs.current.persistOptions,
        queryClient: client
      });
      promise.then(() => {
        if (!isStale) {
          refs.current.onSuccess == null ? void 0 : refs.current.onSuccess();
          setIsRestoring(false);
        }
      });
      return () => {
        isStale = true;
        unsubscribe();
      };
    }, [client]);
    return /*#__PURE__*/React__namespace.createElement(reactQuery.QueryClientProvider, _extends({
      client: client
    }, props), /*#__PURE__*/React__namespace.createElement(reactQuery.IsRestoringProvider, {
      value: isRestoring
    }, children));
  };

  const removeOldestQuery = ({
    persistedClient
  }) => {
    const mutations = [...persistedClient.clientState.mutations];
    const queries = [...persistedClient.clientState.queries];
    const client = { ...persistedClient,
      clientState: {
        mutations,
        queries
      }
    }; // sort queries by dataUpdatedAt (oldest first)

    const sortedQueries = [...queries].sort((a, b) => a.state.dataUpdatedAt - b.state.dataUpdatedAt); // clean oldest query

    if (sortedQueries.length > 0) {
      const oldestData = sortedQueries.shift();
      client.clientState.queries = queries.filter(q => q !== oldestData);
      return client;
    }

    return undefined;
  };

  exports.PersistQueryClientProvider = PersistQueryClientProvider;
  exports.persistQueryClient = persistQueryClient;
  exports.persistQueryClientRestore = persistQueryClientRestore;
  exports.persistQueryClientSave = persistQueryClientSave;
  exports.persistQueryClientSubscribe = persistQueryClientSubscribe;
  exports.removeOldestQuery = removeOldestQuery;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.development.js.map
