import { Action } from "../../../internal/Action.js";
import { QualifierValue } from "../../../internal/qualifier/QualifierValue.js";
import { Qualifier } from "../../../internal/qualifier/Qualifier.js";
/**
 * @extends SDK.Action
 * @description A class for background transformations.
 */
class BackgroundColor extends Action {
    constructor(color) {
        super();
        this.addQualifier(new Qualifier('b', new QualifierValue(color).setDelimiter('_')));
    }
}
export { BackgroundColor };
