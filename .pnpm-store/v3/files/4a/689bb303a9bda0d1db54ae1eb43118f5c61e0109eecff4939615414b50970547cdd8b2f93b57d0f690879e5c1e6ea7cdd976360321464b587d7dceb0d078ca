'use strict';

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var backwards_expression = require('./expression.cjs');

/**
 * Represents a transformation condition.
 * @param {string} conditionStr - a condition in string format
 * @class Condition
 * @example
 * // normally this class is not instantiated directly
 * var tr = cloudinary.Transformation.new()
 *    .if().width( ">", 1000).and().aspectRatio("<", "3:4").then()
 *      .width(1000)
 *      .crop("scale")
 *    .else()
 *      .width(500)
 *      .crop("scale")
 *
 * var tr = cloudinary.Transformation.new()
 *    .if("w > 1000 and aspectRatio < 3:4")
 *      .width(1000)
 *      .crop("scale")
 *    .else()
 *      .width(500)
 *      .crop("scale")
 *
 */
var Condition = /** @class */ (function (_super) {
    tslib_es6.__extends(Condition, _super);
    function Condition(conditionStr) {
        return _super.call(this, conditionStr) || this;
    }
    /**
     * @function Condition#height
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Condition} this condition
     */
    Condition.prototype.height = function (operator, value) {
        return this.predicate("h", operator, value);
    };
    /**
     * @function Condition#width
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Condition} this condition
     */
    Condition.prototype.width = function (operator, value) {
        return this.predicate("w", operator, value);
    };
    /**
     * @function Condition#aspectRatio
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Condition} this condition
     */
    Condition.prototype.aspectRatio = function (operator, value) {
        return this.predicate("ar", operator, value);
    };
    /**
     * @function Condition#pages
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Condition} this condition
     */
    Condition.prototype.pageCount = function (operator, value) {
        return this.predicate("pc", operator, value);
    };
    /**
     * @function Condition#faces
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Condition} this condition
     */
    Condition.prototype.faceCount = function (operator, value) {
        return this.predicate("fc", operator, value);
    };
    /**
     * @function Condition#duration
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Condition} this condition
     */
    Condition.prototype.duration = function (operator, value) {
        return this.predicate("du", operator, value);
    };
    /**
     * @function Condition#initialDuration
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Condition} this condition
     */
    Condition.prototype.initialDuration = function (operator, value) {
        return this.predicate("idu", operator, value);
    };
    return Condition;
}(backwards_expression));

module.exports = Condition;
