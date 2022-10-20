import { CONDITIONAL_OPERATORS, RESERVED_NAMES } from "../internal/internalConstants.js";
import { ExpressionQualifier } from "./expression/ExpressionQualifier.js";
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
    const reservedOperatorList = Object.keys(CONDITIONAL_OPERATORS).map((key) => {
        return `\\s${key.replace(/(\*|\+|\^|\|)/g, '\\$1')}\\s`;
    });
    // reservedOperatorList is now an array of values, joining with | creates the regex list
    const regexSafeOperatorList = reservedOperatorList.join('|');
    const operatorsReplaceRE = new RegExp(`(${regexSafeOperatorList})`, "g");
    // First, we replace all the operators
    // Notice how we pad the matched operators with `_`, this is following the step above.
    // This turns $foo * $bar into $foo_mul_$bar (notice how the spaces were replaced with an underscore
    const stringWithOperators = exp.toString()
        .replace(operatorsReplaceRE, (match) => {
        // match contains spaces around the expression, we need to trim it as the original list
        // does not contain spaces.
        return `_${CONDITIONAL_OPERATORS[match.trim()]}_`;
    });
    // Handle reserved names (width, height, etc.)
    const ReservedNames = Object.keys(RESERVED_NAMES);
    const regexSafeReservedNameList = ReservedNames.join('|');
    // Gather all statements that begin with a dollar sign, underscore or a space
    // Gather all RESERVED NAMES
    // $foo_bar is matched
    // height is matched
    const reservedNamesRE = new RegExp(`(\\$_*[^_ ]+)|${regexSafeReservedNameList}`, "g");
    // Since this regex captures both user variables and our reserved keywords, we need to add some logic in the replacer
    const stringWithVariables = stringWithOperators.replace(reservedNamesRE, (match) => {
        // Do not do anything to user variables (anything starting with $)
        if (match.startsWith('$')) {
            return match;
        }
        else {
            return RESERVED_NAMES[match] || match;
        }
    });
    // Serialize remaining spaces with an underscore
    const finalExpressionString = stringWithVariables.replace(/\s/g, '_');
    return new ExpressionQualifier(finalExpressionString);
}
// as a namespace
const Expression = {
    expression
};
export { Expression, expression };
