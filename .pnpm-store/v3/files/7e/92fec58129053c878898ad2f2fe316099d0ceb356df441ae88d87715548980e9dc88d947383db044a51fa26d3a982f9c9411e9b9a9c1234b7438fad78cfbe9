"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePopover = void 0;
var react_1 = require("react");
var util_1 = require("./util");
var useElementRef_1 = require("./useElementRef");
var usePopover = function (_a) {
    var isOpen = _a.isOpen, childRef = _a.childRef, positions = _a.positions, containerClassName = _a.containerClassName, parentElement = _a.parentElement, contentLocation = _a.contentLocation, align = _a.align, padding = _a.padding, reposition = _a.reposition, boundaryInset = _a.boundaryInset, boundaryElement = _a.boundaryElement, onPositionPopover = _a.onPositionPopover;
    var popoverRef = useElementRef_1.useElementRef(containerClassName, {
        position: 'fixed',
        overflow: 'visible',
        top: '0px',
        left: '0px',
    });
    var scoutRef = useElementRef_1.useElementRef('react-tiny-popover-scout', {
        position: 'fixed',
        top: '0px',
        left: '0px',
        width: '0px',
        height: '0px',
        visibility: 'hidden',
    });
    var positionPopover = react_1.useCallback(function (_a) {
        var _b, _c;
        var _d = _a === void 0 ? {} : _a, _e = _d.positionIndex, positionIndex = _e === void 0 ? 0 : _e, _f = _d.parentRect, parentRect = _f === void 0 ? parentElement.getBoundingClientRect() : _f, _g = _d.childRect, childRect = _g === void 0 ? (_b = childRef === null || childRef === void 0 ? void 0 : childRef.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect() : _g, _h = _d.scoutRect, scoutRect = _h === void 0 ? (_c = scoutRef === null || scoutRef === void 0 ? void 0 : scoutRef.current) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect() : _h, _j = _d.popoverRect, popoverRect = _j === void 0 ? popoverRef.current.getBoundingClientRect() : _j, _k = _d.boundaryRect, boundaryRect = _k === void 0 ? boundaryElement === parentElement
            ? parentRect
            : boundaryElement.getBoundingClientRect() : _k;
        if (!childRect || !parentRect || !isOpen) {
            return;
        }
        if (contentLocation) {
            var _l = typeof contentLocation === 'function'
                ? contentLocation({
                    childRect: childRect,
                    popoverRect: popoverRect,
                    parentRect: parentRect,
                    boundaryRect: boundaryRect,
                    padding: padding,
                    nudgedTop: 0,
                    nudgedLeft: 0,
                    boundaryInset: boundaryInset,
                    violations: util_1.Constants.EMPTY_CLIENT_RECT,
                    hasViolations: false,
                })
                : contentLocation, inputTop = _l.top, inputLeft = _l.left;
            var left_1 = parentRect.left + inputLeft;
            var top_1 = parentRect.top + inputTop;
            popoverRef.current.style.transform = "translate(" + (left_1 - scoutRect.left) + "px, " + (top_1 - scoutRect.top) + "px)";
            onPositionPopover({
                childRect: childRect,
                popoverRect: popoverRect,
                parentRect: parentRect,
                boundaryRect: boundaryRect,
                padding: padding,
                nudgedTop: 0,
                nudgedLeft: 0,
                boundaryInset: boundaryInset,
                violations: util_1.Constants.EMPTY_CLIENT_RECT,
                hasViolations: false,
            });
            return;
        }
        var isExhausted = positionIndex === positions.length;
        var position = isExhausted ? positions[0] : positions[positionIndex];
        var _m = util_1.getNewPopoverRect({
            childRect: childRect,
            popoverRect: popoverRect,
            boundaryRect: boundaryRect,
            position: position,
            align: align,
            padding: padding,
            reposition: reposition,
        }, boundaryInset), rect = _m.rect, boundaryViolation = _m.boundaryViolation;
        if (boundaryViolation && reposition && !isExhausted) {
            positionPopover({
                positionIndex: positionIndex + 1,
                childRect: childRect,
                popoverRect: popoverRect,
                parentRect: parentRect,
                boundaryRect: boundaryRect,
            });
            return;
        }
        var top = rect.top, left = rect.left, width = rect.width, height = rect.height;
        var shouldNudge = reposition && !isExhausted;
        var _o = util_1.getNudgedPopoverRect(rect, boundaryRect, boundaryInset), nudgedLeft = _o.left, nudgedTop = _o.top;
        var finalTop = top;
        var finalLeft = left;
        if (shouldNudge) {
            finalTop = nudgedTop;
            finalLeft = nudgedLeft;
        }
        popoverRef.current.style.transform = "translate(" + (finalLeft - scoutRect.left) + "px, " + (finalTop - scoutRect.top) + "px)";
        var potentialViolations = {
            top: boundaryRect.top + boundaryInset - finalTop,
            left: boundaryRect.left + boundaryInset - finalLeft,
            right: finalLeft + width - boundaryRect.right + boundaryInset,
            bottom: finalTop + height - boundaryRect.bottom + boundaryInset,
        };
        onPositionPopover({
            childRect: childRect,
            popoverRect: {
                top: finalTop,
                left: finalLeft,
                width: width,
                height: height,
                right: finalLeft + width,
                bottom: finalTop + height,
            },
            parentRect: parentRect,
            boundaryRect: boundaryRect,
            position: position,
            align: align,
            padding: padding,
            nudgedTop: nudgedTop - top,
            nudgedLeft: nudgedLeft - left,
            boundaryInset: boundaryInset,
            violations: {
                top: potentialViolations.top <= 0 ? 0 : potentialViolations.top,
                left: potentialViolations.left <= 0 ? 0 : potentialViolations.left,
                right: potentialViolations.right <= 0 ? 0 : potentialViolations.right,
                bottom: potentialViolations.bottom <= 0 ? 0 : potentialViolations.bottom,
            },
            hasViolations: potentialViolations.top > 0 ||
                potentialViolations.left > 0 ||
                potentialViolations.right > 0 ||
                potentialViolations.bottom > 0,
        });
    }, [
        parentElement,
        childRef,
        popoverRef,
        boundaryElement,
        contentLocation,
        positions,
        align,
        padding,
        reposition,
        boundaryInset,
        onPositionPopover,
        isOpen,
    ]);
    return {
        positionPopover: positionPopover,
        popoverRef: popoverRef,
        scoutRef: scoutRef,
    };
};
exports.usePopover = usePopover;
//# sourceMappingURL=usePopover.js.map