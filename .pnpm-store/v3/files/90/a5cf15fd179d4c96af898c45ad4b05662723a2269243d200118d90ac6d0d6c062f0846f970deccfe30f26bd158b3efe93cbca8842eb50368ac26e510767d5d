'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backwards_expression = require('../expression.cjs');

/**
 * Process DPR value. If input is 1 returns 1.0
 * @param value
 */
function processDpr(value) {
    var dpr = value.toString();
    if (dpr != null ? dpr.match(/^\d+$/) : void 0) {
        return dpr + ".0";
    }
    else {
        return backwards_expression.normalize(dpr);
    }
}

exports.processDpr = processDpr;
