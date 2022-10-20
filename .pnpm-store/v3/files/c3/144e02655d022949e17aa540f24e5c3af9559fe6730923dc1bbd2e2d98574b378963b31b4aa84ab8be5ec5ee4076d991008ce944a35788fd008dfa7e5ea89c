"use strict";

exports.__esModule = true;
exports.useThrottleCallback = useThrottleCallback;
exports.useThrottle = useThrottle;

var React = /*#__PURE__*/_interopRequireWildcard( /*#__PURE__*/require("react"));

var _latest = /*#__PURE__*/_interopRequireDefault( /*#__PURE__*/require("@react-hook/latest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const perf = typeof performance !== 'undefined' ? performance : Date;

const now = () => perf.now();

function useThrottleCallback(callback, fps = 30, leading = false) {
  const storedCallback = (0, _latest.default)(callback);
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

function useThrottle(initialState, fps, leading) {
  const state = React.useState(initialState);
  return [state[0], useThrottleCallback(state[1], fps, leading)];
}