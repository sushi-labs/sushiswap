'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backwards_consts = require('../consts.cjs');

/**
 * Split a range into the start and end values
 * @param range
 */
function splitRange(range) {
    switch (range && range.constructor) {
        case String:
            if (!backwards_consts.OFFSET_ANY_PATTERN_RE.test(range)) {
                return range;
            }
            return range.split("..");
        case Array:
            return [[range], range[range.length - 1]];
        default:
            return [null, null];
    }
}

exports.splitRange = splitRange;
