'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var internal_internalConstants = require('../internal/internalConstants.cjs');
var qualifiers_expression_ExpressionQualifier = require('./expression/ExpressionQualifier.cjs');
require('../internal/utils/objectFlip.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../internal/qualifier/QualifierValue.cjs');

/**
 * @description
 * Used for variable or conditional expressions
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/user_defined_variables#arithmetic_expressions|Arithmetic expressions }
 * @namespace Expression
 * @memberOf Qualifiers
 */
/**
 * @summary qualifier
 * @memberOf Qualifiers.Expression
 * @return {Qualifiers.Expression.ExpressionQualifier}
 */
function expression(exp) {
    // Prepare the CONDITIONAL_OPERATORS object to be used in a regex
    // Properly escape |, +, ^ and *
    // This step also adds a regex space ( \s ) around each operator, since these are only replaced when wrapped with spaces
    // $foo * $bar is replaced to $foo_mul_$bar
    // $foo*bar is treated AS-IS.
    var reservedOperatorList = Object.keys(internal_internalConstants.CONDITIONAL_OPERATORS).map(function (key) {
        return "\\s" + key.replace(/(\*|\+|\^|\|)/g, '\\$1') + "\\s";
    });
    // reservedOperatorList is now an array of values, joining with | creates the regex list
    var regexSafeOperatorList = reservedOperatorList.join('|');
    var operatorsReplaceRE = new RegExp("(" + regexSafeOperatorList + ")", "g");
    // First, we replace all the operators
    // Notice how we pad the matched operators with `_`, this is following the step above.
    // This turns $foo * $bar into $foo_mul_$bar (notice how the spaces were replaced with an underscore
    var stringWithOperators = exp.toString()
        .replace(operatorsReplaceRE, function (match) {
        // match contains spaces around the expression, we need to trim it as the original list
        // does not contain spaces.
        return "_" + internal_internalConstants.CONDITIONAL_OPERATORS[match.trim()] + "_";
    });
    // Handle reserved names (width, height, etc.)
    var ReservedNames = Object.keys(internal_internalConstants.RESERVED_NAMES);
    var regexSafeReservedNameList = ReservedNames.join('|');
    // Gather all statements that begin with a dollar sign, underscore or a space
    // Gather all RESERVED NAMES
    // $foo_bar is matched
    // height is matched
    var reservedNamesRE = new RegExp("(\\$_*[^_ ]+)|" + regexSafeReservedNameList, "g");
    // Since this regex captures both user variables and our reserved keywords, we need to add some logic in the replacer
    var stringWithVariables = stringWithOperators.replace(reservedNamesRE, function (match) {
        // Do not do anything to user variables (anything starting with $)
        if (match.startsWith('$')) {
            return match;
        }
        else {
            return internal_internalConstants.RESERVED_NAMES[match] || match;
        }
    });
    // Serialize remaining spaces with an underscore
    var finalExpressionString = stringWithVariables.replace(/\s/g, '_');
    return new qualifiers_expression_ExpressionQualifier.ExpressionQualifier(finalExpressionString);
}
// as a namespace
var Expression = {
    expression: expression
};

exports.Expression = Expression;
exports.expression = expression;
