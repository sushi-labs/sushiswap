"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useElementRef = void 0;
var react_1 = require("react");
var util_1 = require("./util");
var useElementRef = function (containerClassName, containerStyle) {
    var element = react_1.useMemo(function () { return util_1.createContainer(containerStyle, containerClassName); }, [containerClassName, containerStyle]);
    return react_1.useRef(element);
};
exports.useElementRef = useElementRef;
//# sourceMappingURL=useElementRef.js.map