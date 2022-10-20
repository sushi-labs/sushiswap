'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backwards_utils_legacyNormalizeExpression = require('../utils/legacyNormalizeExpression.cjs');
require('../consts.cjs');

/**
 * Parse radius options
 * @private
 * @param {Array<string|number>|string|number} _radius The radius to parse
 * @return {string} radius transformation string
 */
function processRadius(_radius) {
    var radius = _radius;
    if (!radius) {
        return radius;
    }
    if (!Array.isArray(radius)) {
        radius = [radius];
    }
    if (radius.length === 0 || radius.length > 4) {
        throw new Error("Radius array should contain between 1 and 4 values");
    }
    if (radius.findIndex(function (x) { return x === null; }) >= 0) {
        throw new Error("Corner: Cannot be null");
    }
    return radius.map(backwards_utils_legacyNormalizeExpression.legacyNormalizeExpression).join(':');
}

exports.processRadius = processRadius;
