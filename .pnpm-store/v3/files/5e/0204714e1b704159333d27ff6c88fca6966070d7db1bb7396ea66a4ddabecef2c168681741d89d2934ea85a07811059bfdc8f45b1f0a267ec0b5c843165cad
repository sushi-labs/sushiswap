'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backwards_consts = require('../consts.cjs');

/**
 * Normalize an offset value
 * @param {String} expression a decimal value which may have a 'p' or '%' postfix. E.g. '35%', '0.4p'
 * @return {Object|String} a normalized String of the input value if possible otherwise the value itself
 */
function legacyNormalizeExpression(expression) {
    if (typeof expression !== 'string' || expression.length === 0 || expression.match(/^!.+!$/)) {
        if (expression) {
            return expression.toString();
        }
        else {
            return expression;
        }
    }
    expression = String(expression);
    var operators = "\\|\\||>=|<=|&&|!=|>|=|<|/|-|\\+|\\*|\\^";
    // operators
    var operatorsPattern = "((" + operators + ")(?=[ _]))";
    var operatorsReplaceRE = new RegExp(operatorsPattern, "g");
    expression = expression.replace(operatorsReplaceRE, function (match) {
        return backwards_consts.LEGACY_CONDITIONAL_OPERATORS[match];
    });
    // predefined variables
    var predefinedVarsPattern = "(" + Object.keys(backwards_consts.LEGACY_PREDEFINED_VARS).join("|") + ")";
    var userVariablePattern = '(\\$_*[^_ ]+)';
    var variablesReplaceRE = new RegExp(userVariablePattern + "|" + predefinedVarsPattern, "g");
    // @ts-ignore
    expression = expression.replace(variablesReplaceRE, function (match) { return (backwards_consts.LEGACY_PREDEFINED_VARS[match] || match); });
    return expression.replace(/[ _]+/g, '_');
}

exports.legacyNormalizeExpression = legacyNormalizeExpression;
