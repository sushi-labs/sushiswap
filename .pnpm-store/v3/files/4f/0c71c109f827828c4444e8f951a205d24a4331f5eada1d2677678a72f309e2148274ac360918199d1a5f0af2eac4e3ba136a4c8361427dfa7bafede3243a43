'use strict';

/**
 * Represents a transformation expression.
 * @param {string} expressionStr - An expression in string format.
 * @class Expression
 *
 */
var Expression = /** @class */ (function () {
    function Expression(expressionStr) {
        /**
         * @protected
         * @inner Expression-expressions
         */
        this.expressions = [];
        if (expressionStr != null) {
            this.expressions.push(Expression.normalize(expressionStr));
        }
    }
    /**
     * Convenience constructor method
     * @function Expression.new
     */
    Expression.new = function (expressionStr) {
        return new this(expressionStr);
    };
    /**
     * Normalize a string expression
     * @function Cloudinary#normalize
     * @param {string} expression a expression, e.g. "w gt 100", "width_gt_100", "width > 100"
     * @return {string} the normalized form of the value expression, e.g. "w_gt_100"
     */
    Expression.normalize = function (expression) {
        var operators, operatorsPattern, operatorsReplaceRE, predefinedVarsPattern, predefinedVarsReplaceRE;
        if (expression == null) {
            return expression;
        }
        expression = String(expression);
        operators = "\\|\\||>=|<=|&&|!=|>|=|<|/|-|\\+|\\*|\\^";
        // operators
        operatorsPattern = "((" + operators + ")(?=[ _]))";
        operatorsReplaceRE = new RegExp(operatorsPattern, "g");
        // @ts-ignore
        expression = expression.replace(operatorsReplaceRE, function (match) { return OPERATORS[match]; });
        // predefined variables
        predefinedVarsPattern = "(" + Object.keys(PREDEFINED_VARS).join("|") + ")";
        predefinedVarsReplaceRE = new RegExp(predefinedVarsPattern, "g");
        // @ts-ignore
        expression = expression.replace(predefinedVarsReplaceRE, function (match, p1, offset) { return (expression[offset - 1] === '$' ? match : PREDEFINED_VARS[match]); });
        return expression.replace(/[ _]+/g, '_');
    };
    /**
     * Serialize the expression
     * @return {string} the expression as a string
     */
    Expression.prototype.serialize = function () {
        return Expression.normalize(this.expressions.join("_"));
    };
    Expression.prototype.toString = function () {
        return this.serialize();
    };
    /**
     * Get the parent transformation of this expression
     * @return Transformation
     */
    Expression.prototype.getParent = function () {
        return this.parent;
    };
    /**
     * Set the parent transformation of this expression
     * @param {Transformation} the parent transformation
     * @return {Expression} this expression
     */
    Expression.prototype.setParent = function (parent) {
        this.parent = parent;
        return this;
    };
    /**
     * Add a expression
     * @function Expression#predicate
     * @internal
     */
    Expression.prototype.predicate = function (name, operator, value) {
        // @ts-ignore
        if (OPERATORS[operator] != null) {
            // @ts-ignore
            operator = OPERATORS[operator];
        }
        this.expressions.push(name + "_" + operator + "_" + value);
        return this;
    };
    /**
     * @function Expression#and
     */
    Expression.prototype.and = function () {
        this.expressions.push("and");
        return this;
    };
    /**
     * @function Expression#or
     */
    Expression.prototype.or = function () {
        this.expressions.push("or");
        return this;
    };
    /**
     * Conclude expression
     * @function Expression#then
     * @return {Transformation} the transformation this expression is defined for
     */
    Expression.prototype.then = function () {
        return this.getParent().if(this.toString());
    };
    /**
     * @function Expression#height
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Expression} this expression
     */
    Expression.prototype.height = function (operator, value) {
        return this.predicate("h", operator, value);
    };
    /**
     * @function Expression#width
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Expression} this expression
     */
    Expression.prototype.width = function (operator, value) {
        return this.predicate("w", operator, value);
    };
    /**
     * @function Expression#aspectRatio
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Expression} this expression
     */
    Expression.prototype.aspectRatio = function (operator, value) {
        return this.predicate("ar", operator, value);
    };
    /**
     * @function Expression#pages
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Expression} this expression
     */
    Expression.prototype.pageCount = function (operator, value) {
        return this.predicate("pc", operator, value);
    };
    /**
     * @function Expression#faces
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Expression} this expression
     */
    Expression.prototype.faceCount = function (operator, value) {
        return this.predicate("fc", operator, value);
    };
    Expression.prototype.value = function (value) {
        this.expressions.push(value);
        return this;
    };
    /**
     */
    Expression.variable = function (name, value) {
        return new this(name).value(value);
    };
    /**
     * @returns Expression a new expression with the predefined variable "width"
     * @function Expression.width
     */
    Expression.width = function () {
        return new this("width");
    };
    /**
     * @returns Expression a new expression with the predefined variable "height"
     * @function Expression.height
     */
    Expression.height = function () {
        return new this("height");
    };
    /**
     * @returns Expression a new expression with the predefined variable "initialWidth"
     * @function Expression.initialWidth
     */
    Expression.initialWidth = function () {
        return new this("initialWidth");
    };
    /**
     * @returns Expression a new expression with the predefined variable "initialHeight"
     * @function Expression.initialHeight
     */
    Expression.initialHeight = function () {
        return new this("initialHeight");
    };
    /**
     * @returns Expression a new expression with the predefined variable "aspectRatio"
     * @function Expression.aspectRatio
     */
    Expression.aspectRatio = function () {
        return new this("aspectRatio");
    };
    /**
     * @returns Expression a new expression with the predefined variable "initialAspectRatio"
     * @function Expression.initialAspectRatio
     */
    Expression.initialAspectRatio = function () {
        return new this("initialAspectRatio");
    };
    /**
     * @returns Expression a new expression with the predefined variable "pageCount"
     * @function Expression.pageCount
     */
    Expression.pageCount = function () {
        return new this("pageCount");
    };
    /**
     * @returns Expression new expression with the predefined variable "faceCount"
     * @function Expression.faceCount
     */
    Expression.faceCount = function () {
        return new this("faceCount");
    };
    /**
     * @returns Expression a new expression with the predefined variable "currentPage"
     * @function Expression.currentPage
     */
    Expression.currentPage = function () {
        return new this("currentPage");
    };
    /**
     * @returns Expression a new expression with the predefined variable "tags"
     * @function Expression.tags
     */
    Expression.tags = function () {
        return new this("tags");
    };
    /**
     * @returns Expression a new expression with the predefined variable "pageX"
     * @function Expression.pageX
     */
    Expression.pageX = function () {
        return new this("pageX");
    };
    /**
     * @returns Expression a new expression with the predefined variable "pageY"
     * @function Expression.pageY
     */
    Expression.pageY = function () {
        return new this("pageY");
    };
    return Expression;
}());
/**
 * @internal
 */
var OPERATORS = {
    "=": 'eq',
    "!=": 'ne',
    "<": 'lt',
    ">": 'gt',
    "<=": 'lte',
    ">=": 'gte',
    "&&": 'and',
    "||": 'or',
    "*": "mul",
    "/": "div",
    "+": "add",
    "-": "sub",
    "^": "pow",
};
/**
 * @internal
 */
var PREDEFINED_VARS = {
    "aspect_ratio": "ar",
    "aspectRatio": "ar",
    "current_page": "cp",
    "currentPage": "cp",
    "preview:duration": "preview:duration",
    "duration": "du",
    "face_count": "fc",
    "faceCount": "fc",
    "height": "h",
    "initial_aspect_ratio": "iar",
    "initial_duration": "idu",
    "initial_height": "ih",
    "initial_width": "iw",
    "initialAspectRatio": "iar",
    "initialDuration": "idu",
    "initialHeight": "ih",
    "initialWidth": "iw",
    "page_count": "pc",
    "page_x": "px",
    "page_y": "py",
    "pageCount": "pc",
    "pageX": "px",
    "pageY": "py",
    "tags": "tags",
    "width": "w"
};

module.exports = Expression;
