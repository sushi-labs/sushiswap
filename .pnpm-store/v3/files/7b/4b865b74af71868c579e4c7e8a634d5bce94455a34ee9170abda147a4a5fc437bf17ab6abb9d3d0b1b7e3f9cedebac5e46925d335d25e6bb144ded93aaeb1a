(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.QuerySyncStoragePersister = {}));
})(this, (function (exports) { 'use strict';

  function createSyncStoragePersister({
    storage,
    key = "REACT_QUERY_OFFLINE_CACHE",
    throttleTime = 1000,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    retry
  }) {
    if (typeof storage !== 'undefined') {
      const trySave = persistedClient => {
        try {
          storage.setItem(key, serialize(persistedClient));
        } catch (error) {
          return error;
        }
      };

      return {
        persistClient: throttle(persistedClient => {
          let client = persistedClient;
          let error = trySave(client);
          let errorCount = 0;

          while (error && client) {
            errorCount++;
            client = retry == null ? void 0 : retry({
              persistedClient: client,
              error,
              errorCount
            });

            if (client) {
              error = trySave(client);
            }
          }
        }, throttleTime),
        restoreClient: () => {
          const cacheString = storage.getItem(key);

          if (!cacheString) {
            return;
          }

          return deserialize(cacheString);
        },
        removeClient: () => {
          storage.removeItem(key);
        }
      };
    }

    return {
      persistClient: noop,
      restoreClient: () => undefined,
      removeClient: noop
    };
  }

  function throttle(func, wait = 100) {
    let timer = null;
    let params;
    return function (...args) {
      params = args;

      if (timer === null) {
        timer = setTimeout(() => {
          func(...params);
          timer = null;
        }, wait);
      }
    };
  } // eslint-disable-next-line @typescript-eslint/no-empty-function


  function noop() {}

  exports.createSyncStoragePersister = createSyncStoragePersister;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.development.js.map
