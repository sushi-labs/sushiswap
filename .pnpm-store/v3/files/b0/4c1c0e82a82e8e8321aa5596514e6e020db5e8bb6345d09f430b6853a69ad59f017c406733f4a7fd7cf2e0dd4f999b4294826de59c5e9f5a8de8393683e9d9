'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backwards_consts = require('../consts.cjs');

/**
 *
 * @param value
 */
function normRangeValues(value) {
    var offset = String(value).match(backwards_consts.RANGE_VALUE_RE);
    if (offset) {
        var modifier = offset[5] ? 'p' : '';
        return "" + (offset[1] || offset[4]) + modifier;
    }
    else {
        return value;
    }
}

exports.normRangeValues = normRangeValues;
