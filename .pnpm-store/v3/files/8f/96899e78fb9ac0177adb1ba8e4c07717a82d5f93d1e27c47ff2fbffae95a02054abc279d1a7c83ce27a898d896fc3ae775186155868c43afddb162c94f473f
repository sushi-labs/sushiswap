/**
 * Represents a transformation expression.
 * @param {string} expressionStr - An expression in string format.
 * @class Expression
 *
 */
declare class Expression {
    private expressions;
    private parent;
    constructor(expressionStr: string);
    /**
     * Convenience constructor method
     * @function Expression.new
     */
    static new(expressionStr?: string): Expression;
    /**
     * Normalize a string expression
     * @function Cloudinary#normalize
     * @param {string} expression a expression, e.g. "w gt 100", "width_gt_100", "width > 100"
     * @return {string} the normalized form of the value expression, e.g. "w_gt_100"
     */
    static normalize(expression: string | number): string | number;
    /**
     * Serialize the expression
     * @return {string} the expression as a string
     */
    serialize(): string | number;
    toString(): string | number;
    /**
     * Get the parent transformation of this expression
     * @return Transformation
     */
    getParent(): any;
    /**
     * Set the parent transformation of this expression
     * @param {Transformation} the parent transformation
     * @return {Expression} this expression
     */
    setParent(parent: any): this;
    /**
     * Add a expression
     * @function Expression#predicate
     * @internal
     */
    predicate(name: string, operator: string | number, value: any): this;
    /**
     * @function Expression#and
     */
    and(): this;
    /**
     * @function Expression#or
     */
    or(): this;
    /**
     * Conclude expression
     * @function Expression#then
     * @return {Transformation} the transformation this expression is defined for
     */
    then(): any;
    /**
     * @function Expression#height
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Expression} this expression
     */
    height(operator: string, value: string | number): this;
    /**
     * @function Expression#width
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Expression} this expression
     */
    width(operator: string, value: string | number): this;
    /**
     * @function Expression#aspectRatio
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Expression} this expression
     */
    aspectRatio(operator: string, value: string | number): this;
    /**
     * @function Expression#pages
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Expression} this expression
     */
    pageCount(operator: string, value: string | number): this;
    /**
     * @function Expression#faces
     * @param {string} operator the comparison operator (e.g. "<", "lt")
     * @param {string|number} value the right hand side value
     * @return {Expression} this expression
     */
    faceCount(operator: string, value: string | number): this;
    value(value: string | number): this;
    /**
     */
    static variable(name: string, value: string | number): Expression;
    /**
     * @returns Expression a new expression with the predefined variable "width"
     * @function Expression.width
     */
    static width(): Expression;
    /**
     * @returns Expression a new expression with the predefined variable "height"
     * @function Expression.height
     */
    static height(): Expression;
    /**
     * @returns Expression a new expression with the predefined variable "initialWidth"
     * @function Expression.initialWidth
     */
    static initialWidth(): Expression;
    /**
     * @returns Expression a new expression with the predefined variable "initialHeight"
     * @function Expression.initialHeight
     */
    static initialHeight(): Expression;
    /**
     * @returns Expression a new expression with the predefined variable "aspectRatio"
     * @function Expression.aspectRatio
     */
    static aspectRatio(): Expression;
    /**
     * @returns Expression a new expression with the predefined variable "initialAspectRatio"
     * @function Expression.initialAspectRatio
     */
    static initialAspectRatio(): Expression;
    /**
     * @returns Expression a new expression with the predefined variable "pageCount"
     * @function Expression.pageCount
     */
    static pageCount(): Expression;
    /**
     * @returns Expression new expression with the predefined variable "faceCount"
     * @function Expression.faceCount
     */
    static faceCount(): Expression;
    /**
     * @returns Expression a new expression with the predefined variable "currentPage"
     * @function Expression.currentPage
     */
    static currentPage(): Expression;
    /**
     * @returns Expression a new expression with the predefined variable "tags"
     * @function Expression.tags
     */
    static tags(): Expression;
    /**
     * @returns Expression a new expression with the predefined variable "pageX"
     * @function Expression.pageX
     */
    static pageX(): Expression;
    /**
     * @returns Expression a new expression with the predefined variable "pageY"
     * @function Expression.pageY
     */
    static pageY(): Expression;
}
export default Expression;
