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
exports.Popover = exports.usePopover = exports.ArrowContainer = exports.useArrowContainer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var PopoverPortal_1 = require("./PopoverPortal");
var util_1 = require("./util");
var usePopover_1 = require("./usePopover");
Object.defineProperty(exports, "usePopover", { enumerable: true, get: function () { return usePopover_1.usePopover; } });
var useMemoizedArray_1 = require("./useMemoizedArray");
var useArrowContainer_1 = require("./useArrowContainer");
Object.defineProperty(exports, "useArrowContainer", { enumerable: true, get: function () { return useArrowContainer_1.useArrowContainer; } });
var ArrowContainer_1 = require("./ArrowContainer");
Object.defineProperty(exports, "ArrowContainer", { enumerable: true, get: function () { return ArrowContainer_1.ArrowContainer; } });
var PopoverInternal = react_1.forwardRef(function (_a, externalRef) {
    var isOpen = _a.isOpen, children = _a.children, content = _a.content, _b = _a.positions, externalPositions = _b === void 0 ? util_1.Constants.DEFAULT_POSITIONS : _b, _c = _a.align, align = _c === void 0 ? util_1.Constants.DEFAULT_ALIGN : _c, _d = _a.padding, padding = _d === void 0 ? 0 : _d, _e = _a.reposition, reposition = _e === void 0 ? true : _e, _f = _a.parentElement, parentElement = _f === void 0 ? window.document.body : _f, _g = _a.boundaryElement, boundaryElement = _g === void 0 ? parentElement : _g, _h = _a.containerClassName, containerClassName = _h === void 0 ? 'react-tiny-popover-container' : _h, containerStyle = _a.containerStyle, contentLocation = _a.contentLocation, _j = _a.boundaryInset, boundaryInset = _j === void 0 ? 0 : _j, onClickOutside = _a.onClickOutside;
    var positions = useMemoizedArray_1.useMemoizedArray(externalPositions);
    // TODO: factor prevs out into a custom prevs hook
    var prevIsOpen = react_1.useRef(false);
    var prevPositions = react_1.useRef();
    var prevContentLocation = react_1.useRef();
    var prevReposition = react_1.useRef(reposition);
    var childRef = react_1.useRef();
    var _k = react_1.useState({
        align: align,
        nudgedLeft: 0,
        nudgedTop: 0,
        position: positions[0],
        padding: padding,
        childRect: util_1.Constants.EMPTY_CLIENT_RECT,
        popoverRect: util_1.Constants.EMPTY_CLIENT_RECT,
        parentRect: util_1.Constants.EMPTY_CLIENT_RECT,
        boundaryRect: util_1.Constants.EMPTY_CLIENT_RECT,
        boundaryInset: boundaryInset,
        violations: util_1.Constants.EMPTY_CLIENT_RECT,
        hasViolations: false,
    }), popoverState = _k[0], setPopoverState = _k[1];
    var onPositionPopover = react_1.useCallback(function (popoverState) { return setPopoverState(popoverState); }, []);
    var _l = usePopover_1.usePopover({
        isOpen: isOpen,
        childRef: childRef,
        containerClassName: containerClassName,
        parentElement: parentElement,
        boundaryElement: boundaryElement,
        contentLocation: contentLocation,
        positions: positions,
        align: align,
        padding: padding,
        boundaryInset: boundaryInset,
        reposition: reposition,
        onPositionPopover: onPositionPopover,
    }), positionPopover = _l.positionPopover, popoverRef = _l.popoverRef, scoutRef = _l.scoutRef;
    react_1.useLayoutEffect(function () {
        var shouldUpdate = true;
        var updatePopover = function () {
            var _a, _b;
            if (isOpen && shouldUpdate) {
                var childRect = (_a = childRef === null || childRef === void 0 ? void 0 : childRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
                var popoverRect = (_b = popoverRef === null || popoverRef === void 0 ? void 0 : popoverRef.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
                if (childRect != null &&
                    popoverRect != null &&
                    (!util_1.rectsAreEqual(childRect, {
                        top: popoverState.childRect.top,
                        left: popoverState.childRect.left,
                        width: popoverState.childRect.width,
                        height: popoverState.childRect.height,
                        bottom: popoverState.childRect.top + popoverState.childRect.height,
                        right: popoverState.childRect.left + popoverState.childRect.width,
                    }) ||
                        popoverRect.width !== popoverState.popoverRect.width ||
                        popoverRect.height !== popoverState.popoverRect.height ||
                        popoverState.padding !== padding ||
                        popoverState.align !== align ||
                        positions !== prevPositions.current ||
                        contentLocation !== prevContentLocation.current ||
                        reposition !== prevReposition.current)) {
                    positionPopover();
                }
                // TODO: factor prev checks out into the custom prevs hook
                if (positions !== prevPositions.current) {
                    prevPositions.current = positions;
                }
                if (contentLocation !== prevContentLocation.current) {
                    prevContentLocation.current = contentLocation;
                }
                if (reposition !== prevReposition.current) {
                    prevReposition.current = reposition;
                }
                if (shouldUpdate) {
                    window.requestAnimationFrame(updatePopover);
                }
            }
            prevIsOpen.current = isOpen;
        };
        window.requestAnimationFrame(updatePopover);
        return function () {
            shouldUpdate = false;
        };
    }, [
        align,
        contentLocation,
        isOpen,
        padding,
        popoverRef,
        popoverState.align,
        popoverState.childRect.height,
        popoverState.childRect.left,
        popoverState.childRect.top,
        popoverState.childRect.width,
        popoverState.padding,
        popoverState.popoverRect.height,
        popoverState.popoverRect.width,
        positionPopover,
        positions,
        reposition,
    ]);
    react_1.useEffect(function () {
        var popoverElement = popoverRef.current;
        Object.assign(popoverElement.style, containerStyle);
        return function () {
            Object.keys(containerStyle !== null && containerStyle !== void 0 ? containerStyle : {}).forEach(function (key) {
                return delete popoverElement.style[key];
            });
        };
    }, [containerStyle, isOpen, popoverRef]);
    var handleOnClickOutside = react_1.useCallback(function (e) {
        var _a, _b;
        if (isOpen &&
            !((_a = popoverRef.current) === null || _a === void 0 ? void 0 : _a.contains(e.target)) &&
            !((_b = childRef.current) === null || _b === void 0 ? void 0 : _b.contains(e.target))) {
            onClickOutside === null || onClickOutside === void 0 ? void 0 : onClickOutside(e);
        }
    }, [isOpen, onClickOutside, popoverRef]);
    var handleWindowResize = react_1.useCallback(function () {
        if (childRef.current) {
            window.requestAnimationFrame(function () { return positionPopover(); });
        }
    }, [positionPopover]);
    react_1.useEffect(function () {
        window.addEventListener('click', handleOnClickOutside, true);
        window.addEventListener('resize', handleWindowResize);
        return function () {
            window.removeEventListener('click', handleOnClickOutside, true);
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [handleOnClickOutside, handleWindowResize]);
    var handleRef = react_1.useCallback(function (node) {
        childRef.current = node;
        if (externalRef != null) {
            if (typeof externalRef === 'object') {
                externalRef.current = node;
            }
            else if (typeof externalRef === 'function') {
                externalRef(node);
            }
        }
    }, [externalRef]);
    var renderChild = function () {
        return react_1.cloneElement(children, {
            ref: handleRef,
        });
    };
    var renderPopover = function () {
        if (!isOpen)
            return null;
        return (jsx_runtime_1.jsx(PopoverPortal_1.PopoverPortal, __assign({ element: popoverRef.current, scoutElement: scoutRef.current, container: parentElement }, { children: typeof content === 'function' ? content(popoverState) : content }), void 0));
    };
    return (jsx_runtime_1.jsxs(jsx_runtime_1.Fragment, { children: [renderChild(), renderPopover()] }, void 0));
});
exports.Popover = react_1.forwardRef(function (props, ref) {
    if (typeof window === 'undefined')
        return props.children;
    return jsx_runtime_1.jsx(PopoverInternal, __assign({}, props, { ref: ref }), void 0);
});
//# sourceMappingURL=Popover.js.map