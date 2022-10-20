"use strict";

exports.__esModule = true;
exports.default = void 0;

var React = /*#__PURE__*/_interopRequireWildcard( /*#__PURE__*/require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var _default = useEvent;
exports.default = _default;