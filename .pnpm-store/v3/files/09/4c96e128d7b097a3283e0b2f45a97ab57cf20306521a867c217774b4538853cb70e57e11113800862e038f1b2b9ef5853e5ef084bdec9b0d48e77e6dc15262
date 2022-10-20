(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define(['react'], factory) :
  (global = global || self, global.useEvent = factory(global.React));
}(this, (function (React) { 'use strict';

  function useEvent(target, type, listener, cleanup) {
    var storedListener = React.useRef(listener);
    var storedCleanup = React.useRef(cleanup);
    React.useEffect(function () {
      storedListener.current = listener;
      storedCleanup.current = cleanup;
    });
    React.useEffect(function () {
      var targetEl = target && 'current' in target ? target.current : target;
      if (!targetEl) return;
      var didUnsubscribe = 0;

      function listener() {
        if (didUnsubscribe) return;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        storedListener.current.apply(this, args);
      }

      targetEl.addEventListener(type, listener);
      var cleanup = storedCleanup.current;
      return function () {
        didUnsubscribe = 1;
        targetEl.removeEventListener(type, listener);
        cleanup && cleanup();
      }; // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, type]);
  }

  return useEvent;

})));
//# sourceMappingURL=use-event.dev.js.map
