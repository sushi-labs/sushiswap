import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import useEvent from './useEvent';
import useLayoutEffect, { useLayoutUpdateEffect } from './useLayoutEffect';
import useState from './useState';
var Source;

(function (Source) {
  Source[Source["INNER"] = 0] = "INNER";
  Source[Source["PROP"] = 1] = "PROP";
})(Source || (Source = {}));
/** We only think `undefined` is empty */


function hasValue(value) {
  return value !== undefined;
}
/**
 * Similar to `useState` but will use props value if provided.
 * Note that internal use rc-util `useState` hook.
 */


export default function useMergedState(defaultStateValue, option) {
  var _ref = option || {},
      defaultValue = _ref.defaultValue,
      value = _ref.value,
      onChange = _ref.onChange,
      postState = _ref.postState; // ======================= Init =======================


  var _useState = useState(function () {
    var finalValue = undefined;
    var source;

    if (hasValue(value)) {
      finalValue = value;
      source = Source.PROP;
    } else if (hasValue(defaultValue)) {
      finalValue = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
      source = Source.PROP;
    } else {
      finalValue = typeof defaultStateValue === 'function' ? defaultStateValue() : defaultStateValue;
      source = Source.INNER;
    }

    return [finalValue, source, finalValue];
  }),
      _useState2 = _slicedToArray(_useState, 2),
      mergedValue = _useState2[0],
      setMergedValue = _useState2[1];

  var chosenValue = hasValue(value) ? value : mergedValue[0];
  var postMergedValue = postState ? postState(chosenValue) : chosenValue; // ======================= Sync =======================

  useLayoutUpdateEffect(function () {
    setMergedValue(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 1),
          prevValue = _ref3[0];

      return [value, Source.PROP, prevValue];
    });
  }, [value]); // ====================== Update ======================

  var changeEventPrevRef = React.useRef();
  var triggerChange = useEvent(function (updater, ignoreDestroy) {
    setMergedValue(function (prev) {
      var _prev = _slicedToArray(prev, 3),
          prevValue = _prev[0],
          prevSource = _prev[1],
          prevPrevValue = _prev[2];

      var nextValue = typeof updater === 'function' ? updater(prevValue) : updater; // Do nothing if value not change

      if (nextValue === prevValue) {
        return prev;
      } // Use prev prev value if is in a batch update to avoid missing data


      var overridePrevValue = prevSource === Source.INNER && changeEventPrevRef.current !== prevPrevValue ? prevPrevValue : prevValue;
      return [nextValue, Source.INNER, overridePrevValue];
    }, ignoreDestroy);
  }); // ====================== Change ======================

  var onChangeFn = useEvent(onChange);
  useLayoutEffect(function () {
    var _mergedValue = _slicedToArray(mergedValue, 3),
        current = _mergedValue[0],
        source = _mergedValue[1],
        prev = _mergedValue[2];

    if (current !== prev && source === Source.INNER) {
      onChangeFn(current, prev);
      changeEventPrevRef.current = prev;
    }
  }, [mergedValue]);
  return [postMergedValue, triggerChange];
}