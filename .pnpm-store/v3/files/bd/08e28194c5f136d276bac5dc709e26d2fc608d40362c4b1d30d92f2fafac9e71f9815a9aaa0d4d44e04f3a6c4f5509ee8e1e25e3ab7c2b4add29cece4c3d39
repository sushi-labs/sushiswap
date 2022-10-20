'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * @description
 * Returns a string representing the float value of the input, if the input was a number-like.
 * Examples:
 * - '1.0' -> '1.0'
 * - 1 -> '1.0'
 * - '5' -> '5.0'
 * - 'auto' -> 'auto'
 * @private
 * @param {string|number} value
 * @return {string}
 */
function toFloatAsString(value) {
    // Turn the input to string
    // The Function will return `returnValue` value if the input is not a number-like expression
    var returnValue = value.toString();
    // if the string contains letters, return the input
    if (returnValue.match(/[A-Z]/gi)) {
        return returnValue;
    }
    // If the leading digit is 0, and we have more than 1 digit, it's not a number.
    // 00, 00000, 0x15 etc.
    if (returnValue.length > 1 && returnValue[0] === '0') {
        return returnValue;
    }
    // Final sanity check, parse the number as a float and check if its NaN
    var isNumberLike = !isNaN(parseFloat(returnValue)) && returnValue.indexOf(':') === -1;
    // If it's a number-like, but the input does not contain a decimal - add it.
    if (isNumberLike && returnValue.indexOf('.') === -1) {
        return returnValue + ".0";
    }
    else {
        // If the input already contains a decimal, just return the value
        return returnValue;
    }
}

exports.toFloatAsString = toFloatAsString;
