import { useRef, useEffect } from 'react';

function useEvent(target, type, listener, cleanup) {
  var storedListener = useRef(listener);
  var storedCleanup = useRef(cleanup);
  useEffect(() => {
    storedListener.current = listener;
    storedCleanup.current = cleanup;
  });
  useEffect(() => {
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
    return () => {
      didUnsubscribe = 1;
      targetEl.removeEventListener(type, listener);
      cleanup && cleanup();
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, type]);
}

export default useEvent;
//# sourceMappingURL=index.dev.mjs.map
