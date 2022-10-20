/**
 * Return true is value is a number or a string representation of a number.
 * @function Util.isNumberLike
 * @param {*} value
 * @returns {boolean} true if value is a number
 * @example
 *    Util.isNumber(0) // true
 *    Util.isNumber("1.3") // true
 *    Util.isNumber("") // false
 *    Util.isNumber(undefined) // false
 */
export const isNumberLike = function (value) {
    return (value != null) && !isNaN(parseFloat(value));
};
