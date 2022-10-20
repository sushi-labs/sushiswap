(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define(['react'], factory) :
  (global = global || self, global.useLatest = factory(global.React));
}(this, (function (React) { 'use strict';

  var useLatest = function useLatest(current) {
    var storedValue = React.useRef(current);
    React.useEffect(function () {
      storedValue.current = current;
    });
    return storedValue;
  };

  return useLatest;

})));
//# sourceMappingURL=use-latest.dev.js.map
