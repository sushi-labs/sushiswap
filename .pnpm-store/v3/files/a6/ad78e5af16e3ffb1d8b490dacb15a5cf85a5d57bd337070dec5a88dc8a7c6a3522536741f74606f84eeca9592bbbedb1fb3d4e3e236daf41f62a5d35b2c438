import { LEGACY_PREDEFINED_VARS, LEGACY_CONDITIONAL_OPERATORS } from "../consts.js";
/**
 * Normalize an offset value
 * @param {String} expression a decimal value which may have a 'p' or '%' postfix. E.g. '35%', '0.4p'
 * @return {Object|String} a normalized String of the input value if possible otherwise the value itself
 */
export function legacyNormalizeExpression(expression) {
    if (typeof expression !== 'string' || expression.length === 0 || expression.match(/^!.+!$/)) {
        if (expression) {
            return expression.toString();
        }
        else {
            return expression;
        }
    }
    expression = String(expression);
    const operators = "\\|\\||>=|<=|&&|!=|>|=|<|/|-|\\+|\\*|\\^";
    // operators
    const operatorsPattern = "((" + operators + ")(?=[ _]))";
    const operatorsReplaceRE = new RegExp(operatorsPattern, "g");
    expression = expression.replace(operatorsReplaceRE, (match) => {
        return LEGACY_CONDITIONAL_OPERATORS[match];
    });
    // predefined variables
    const predefinedVarsPattern = "(" + Object.keys(LEGACY_PREDEFINED_VARS).join("|") + ")";
    const userVariablePattern = '(\\$_*[^_ ]+)';
    const variablesReplaceRE = new RegExp(`${userVariablePattern}|${predefinedVarsPattern}`, "g");
    // @ts-ignore
    expression = expression.replace(variablesReplaceRE, (match) => (LEGACY_PREDEFINED_VARS[match] || match));
    return expression.replace(/[ _]+/g, '_');
}
