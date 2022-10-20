import * as React from 'react';

function useEvent(target, type, listener, cleanup) {
  const storedListener = React.useRef(listener);
  const storedCleanup = React.useRef(cleanup);
  React.useEffect(() => {
    storedListener.current = listener;
    storedCleanup.current = cleanup;
  });
  React.useEffect(() => {
    const targetEl = target && 'current' in target ? target.current : target;
    if (!targetEl) return;
    let didUnsubscribe = 0;

    function listener(...args) {
      if (didUnsubscribe) return;
      storedListener.current.apply(this, args);
    }

    targetEl.addEventListener(type, listener);
    const cleanup = storedCleanup.current;
    return () => {
      didUnsubscribe = 1;
      targetEl.removeEventListener(type, listener);
      cleanup && cleanup();
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, type]);
}

export default useEvent;