"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useArrowContainer = void 0;
var react_1 = require("react");
var useArrowContainer = function (_a) {
    var childRect = _a.childRect, popoverRect = _a.popoverRect, position = _a.position, arrowSize = _a.arrowSize, arrowColor = _a.arrowColor;
    var arrowContainerStyle = react_1.useMemo(function () {
        return ({
            padding: arrowSize,
        });
    }, [arrowSize]);
    var arrowStyle = react_1.useMemo(function () {
        return (__assign({ position: 'absolute' }, (function () {
            var arrowWidth = arrowSize * 2;
            var top = childRect.top - popoverRect.top + childRect.height / 2 - arrowWidth / 2;
            var left = childRect.left - popoverRect.left + childRect.width / 2 - arrowWidth / 2;
            var lowerBound = arrowSize;
            var leftUpperBound = popoverRect.width - arrowSize;
            var topUpperBound = popoverRect.height - arrowSize;
            left = left < lowerBound ? lowerBound : left;
            left = left + arrowWidth > leftUpperBound ? leftUpperBound - arrowWidth : left;
            top = top < lowerBound ? lowerBound : top;
            top = top + arrowWidth > topUpperBound ? topUpperBound - arrowWidth : top;
            top = Number.isNaN(top) ? 0 : top;
            left = Number.isNaN(left) ? 0 : left;
            switch (position) {
                case 'right':
                    return {
                        borderTop: arrowSize + "px solid transparent",
                        borderBottom: arrowSize + "px solid transparent",
                        borderRight: arrowSize + "px solid " + arrowColor,
                        left: 0,
                        top: top,
                    };
                case 'left':
                    return {
                        borderTop: arrowSize + "px solid transparent",
                        borderBottom: arrowSize + "px solid transparent",
                        borderLeft: arrowSize + "px solid " + arrowColor,
                        right: 0,
                        top: top,
                    };
                case 'bottom':
                    return {
                        borderLeft: arrowSize + "px solid transparent",
                        borderRight: arrowSize + "px solid transparent",
                        borderBottom: arrowSize + "px solid " + arrowColor,
                        top: 0,
                        left: left,
                    };
                case 'top':
                    return {
                        borderLeft: arrowSize + "px solid transparent",
                        borderRight: arrowSize + "px solid transparent",
                        borderTop: arrowSize + "px solid " + arrowColor,
                        bottom: 0,
                        left: left,
                    };
                default:
                    return {
                        display: 'hidden',
                    };
            }
        })()));
    }, [
        arrowColor,
        arrowSize,
        childRect.height,
        childRect.left,
        childRect.top,
        childRect.width,
        popoverRect.height,
        popoverRect.left,
        popoverRect.top,
        popoverRect.width,
        position,
    ]);
    return {
        arrowContainerStyle: arrowContainerStyle,
        arrowStyle: arrowStyle,
    };
};
exports.useArrowContainer = useArrowContainer;
//# sourceMappingURL=useArrowContainer.js.map