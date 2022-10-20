import { Action } from "../../internal/Action.js";
import { ExpressionQualifier } from "../../qualifiers/expression/ExpressionQualifier.js";
declare type TypeVariableValue = number | string | ExpressionQualifier;
/**
 * @description Defines an new user variable.
 * @memberOf Actions.Variable
 * @extends SDK.Action
 * @see Visit {@link Actions.Variable|Variable} for an example
 */
declare class VariableAction extends Action {
    private isFloat;
    private isNumber;
    protected readonly value: TypeVariableValue;
    protected readonly name: string;
    constructor(name: string, value: TypeVariableValue);
    /**
     * @description Converts the returned value to type float.
     */
    asFloat(): this;
    /**
     * @description Converts the returned value to type number.
     */
    asInteger(): this;
    protected prepareQualifiers(): this;
}
export default VariableAction;
