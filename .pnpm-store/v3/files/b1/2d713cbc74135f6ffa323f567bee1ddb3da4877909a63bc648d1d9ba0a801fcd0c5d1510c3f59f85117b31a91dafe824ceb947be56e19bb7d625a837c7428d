import VariableAction from "./VariableAction.js";
/**
 * @description Sets a user-defined variable from contextual metadata.
 * @memberOf Actions.Variable
 * @extends {Variable.VariableAction}
 * @see Visit {@link Actions.Variable|Variable} for an example
 */
class SetFromContextAction extends VariableAction {
    constructor(name, value) {
        // Required due to https://github.com/microsoft/TypeScript/issues/13029
        /* istanbul ignore next */
        super(name, `ctx:!${value}!`);
    }
}
export default SetFromContextAction;
