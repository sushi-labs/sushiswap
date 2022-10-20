"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMemoizedArray = void 0;
var react_1 = require("react");
var useMemoizedArray = function (externalArray) {
    var prevArrayRef = react_1.useRef(externalArray);
    var array = react_1.useMemo(function () {
        if (prevArrayRef.current === externalArray)
            return prevArrayRef.current;
        if (prevArrayRef.current.length !== externalArray.length) {
            prevArrayRef.current = externalArray;
            return externalArray;
        }
        for (var i = 0; i < externalArray.length; i += 1) {
            if (externalArray[i] !== prevArrayRef.current[i]) {
                prevArrayRef.current = externalArray;
                return externalArray;
            }
        }
        return prevArrayRef.current;
    }, [externalArray]);
    return array;
};
exports.useMemoizedArray = useMemoizedArray;
//# sourceMappingURL=useMemoizedArray.js.map