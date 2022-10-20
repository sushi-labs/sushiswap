import * as React from 'react';
import useLatest from '@react-hook/latest';
const perf = typeof performance !== 'undefined' ? performance : Date;

const now = () => perf.now();

export function useThrottleCallback(callback, fps = 30, leading = false) {
  const storedCallback = useLatest(callback);
  const ms = 1000 / fps;
  const prev = React.useRef(0);
  const trailingTimeout = React.useRef();

  const clearTrailing = () => trailingTimeout.current && clearTimeout(trailingTimeout.current);

  const deps = [fps, leading, storedCallback]; // Reset any time the deps change

  function _ref() {
    prev.current = 0;
    clearTrailing();
  }

  React.useEffect(() => _ref, deps);
  return React.useCallback(function () {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    const rightNow = now();

    const call = () => {
      prev.current = rightNow;
      clearTrailing();
      storedCallback.current.apply(null, args);
    };

    const current = prev.current; // leading

    if (leading && current === 0) return call(); // body

    if (rightNow - current > ms) {
      if (current > 0) return call();
      prev.current = rightNow;
    } // trailing


    clearTrailing();
    trailingTimeout.current = setTimeout(() => {
      call();
      prev.current = 0;
    }, ms);
  }, deps);
}
export function useThrottle(initialState, fps, leading) {
  const state = React.useState(initialState);
  return [state[0], useThrottleCallback(state[1], fps, leading)];
}