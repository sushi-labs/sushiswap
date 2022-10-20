"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdgeRuntime = void 0;
const vm_1 = require("@edge-runtime/vm");
const version_1 = require("./version");
/**
 * Store handlers that the user defined from code so that we can invoke them
 * from the Node.js realm.
 */
let HANDLERS;
/**
 * An EdgeVM that also allows to add and remove event listeners for unhandled
 * rejections and FetchEvent. It also allows to dispatch fetch events which
 * enables it to work behind a server.
 */
class EdgeRuntime extends vm_1.EdgeVM {
    constructor(options) {
        super({
            ...options,
            extend: (context) => {
                var _a, _b;
                return (_b = (_a = options === null || options === void 0 ? void 0 : options.extend) === null || _a === void 0 ? void 0 : _a.call(options, context)) !== null && _b !== void 0 ? _b : context;
            },
        });
        Object.defineProperty(this.context, '__onUnhandledRejectionHandler', {
            value: (handlers) => (HANDLERS = handlers),
            configurable: false,
            enumerable: false,
            writable: true,
        });
        Object.defineProperty(this, '__rejectionHandlers', {
            get: () => HANDLERS,
            configurable: false,
            enumerable: false,
        });
        Object.defineProperty(this.context, 'VercelRuntime', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: { version: version_1.VERSION },
        });
        this.evaluate(getFetchEventCode());
        this.evaluate(getDefineEventListenersCode());
        this.dispatchFetch = this.evaluate(getDispatchFetchCode());
        if (options === null || options === void 0 ? void 0 : options.initialCode) {
            this.evaluate(options.initialCode);
        }
    }
}
exports.EdgeRuntime = EdgeRuntime;
/**
 * Define a system-level handler to make sure that we report to the user
 * whenever there is an unhandled rejection before the process crashes.
 */
process.on('unhandledRejection', (reason, promise) => {
    HANDLERS === null || HANDLERS === void 0 ? void 0 : HANDLERS.forEach((handler) => handler(reason, promise));
});
/**
 * Gets a string with polyfills for FetchEvent and PromiseRejection which
 * are required to dispatch event and to model unhandled rejection events.
 */
function getFetchEventCode() {
    return `
    class FetchEvent extends Event {
      constructor(request) {
        super('fetch')
        this.request = request
        this.response = null
        this.awaiting = new Set()
      }

      respondWith(response) {
        this.response = response
      }

      waitUntil(promise) {
        this.awaiting.add(promise)
        promise.finally(() => this.awaiting.delete(promise))
      }
    }

    class PromiseRejectionEvent extends Event {
      constructor(type, init) {
        super(type, { cancelable: true })
        this.promise = init.promise
        this.reason = init.reason
      }
    }
  `;
}
/**
 * Generates polyfills for addEventListener and removeEventListener. It keeps
 * all listeners in hidden property __listeners. It will also call a hook
 * `__onUnhandledRejectionHandler` when unhandled rejection events are added
 * or removed and prevent from having more than one FetchEvent handler.
 */
function getDefineEventListenersCode() {
    return `
    Object.defineProperty(self, '__listeners', {
      configurable: false,
      enumerable: false,
      value: {},
      writable: true,
    })

    function addEventListener(type, handler) {
      const eventType = type.toLowerCase();
      if (eventType === 'fetch' && self.__listeners.fetch) {
        throw new TypeError('You can register just one "fetch" event listener');
      }

      self.__listeners[eventType] = self.__listeners[eventType] || [];
      self.__listeners[eventType].push(handler);

      if (eventType === 'unhandledrejection') {
        self.__onUnhandledRejectionHandler(self.__listeners.unhandledrejection)
      }
    }

    function removeEventListener(type, handler) {
      const eventType = type.toLowerCase();
      if (self.__listeners[eventType]) {
        self.__listeners[eventType] = self.__listeners[eventType].filter(item => {
          return item !== handler;
        });

        if (self.__listeners[eventType].length === 0) {
          delete self.__listeners[eventType];
        }
      }

      if (eventType === 'unhandledrejection') {
        self.__onUnhandledRejectionHandler(self.__listeners.unhandledrejection)
      }
    }
  `;
}
/**
 * Generates the code to dispatch a FetchEvent invoking the handlers defined
 * for such events. In case there is no event handler defined it will throw
 * an error.
 */
function getDispatchFetchCode() {
    return `(async function dispatchFetch(input, init) {
    const request = new Request(input, init);
    const event = new FetchEvent(request);
    if (!self.__listeners.fetch) {
      throw new Error("No fetch event listeners found");
    }

    const getResponse = ({ response, error }) => {
     if (error || !response || !(response instanceof Response)) {
        console.error(error ? error : 'The event listener did not respond')
        response = new Response(null, {
          statusText: 'Internal Server Error',
          status: 500
        })
      }

      response.waitUntil = () => Promise.all(event.awaiting);
      return response;
    }

    try {
      await self.__listeners.fetch[0].call(event, event)
    } catch (error) {
      return getResponse({ error })
    }

    return Promise.resolve(event.response)
      .then(response => getResponse({ response }))
      .catch(error => getResponse({ error }))
  })`;
}
//# sourceMappingURL=edge-runtime.js.map