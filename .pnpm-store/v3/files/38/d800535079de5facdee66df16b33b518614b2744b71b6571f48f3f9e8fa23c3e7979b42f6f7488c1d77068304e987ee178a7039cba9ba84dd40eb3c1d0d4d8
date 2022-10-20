"use strict";

exports.__esModule = true;
var _exportNames = {
  batch: true
};
Object.defineProperty(exports, "batch", {
  enumerable: true,
  get: function () {
    return _reactBatchedUpdates.unstable_batchedUpdates;
  }
});

var _react = require("react");

var _withSelector = require("use-sync-external-store/with-selector");

var _reactBatchedUpdates = require("./utils/reactBatchedUpdates");

var _batch = require("./utils/batch");

var _useSelector = require("./hooks/useSelector");

var _connect = require("./components/connect");

var _exports = require("./exports");

Object.keys(_exports).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _exports[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _exports[key];
    }
  });
});
// The secondary entry point assumes we are working with React 18, and thus have
// useSyncExternalStore available. We can import that directly from React itself.
// The useSyncExternalStoreWithSelector has to be imported, but we can use the
// non-shim version. This shaves off the byte size of the shim.
(0, _useSelector.initializeUseSelector)(_withSelector.useSyncExternalStoreWithSelector);
(0, _connect.initializeConnect)(_react.useSyncExternalStore); // Enable batched updates in our subscriptions for use
// with standard React renderers (ReactDOM, React Native)

(0, _batch.setBatch)(_reactBatchedUpdates.unstable_batchedUpdates);