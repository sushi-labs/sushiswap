import { Action } from "../../internal/Action.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @description Applies a pre-defined named transformation of the given name, used with a builder from {@link Actions.NamedTransformation|Named Transformation}
 * @extends SDK.Action
 * @memberOf Actions.NamedTransformation
 * @see Visit {@link Actions.NamedTransformation|Named Transformation} for an example
 */
class NamedTransformationAction extends Action {
    /**
     *
     * @param {string} name The name of the named transformation
     */
    constructor(name) {
        super();
        this.addQualifier(new Qualifier('t', name));
    }
}
export { NamedTransformationAction };
