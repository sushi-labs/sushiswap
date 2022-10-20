import { Action } from "../../internal/Action.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
import { QualifierValue } from "../../internal/qualifier/QualifierValue.js";
/**
 * @description A class to round one or more corners of an image or video.
 * @extends SDK.Action
 * @memberOf Actions.RoundCorners
 * @see Visit {@link Actions.RoundCorners|RoundCorners} for an example
 */
class RoundCornersAction extends Action {
    constructor() {
        super();
    }
    /**
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @param {number} d
     * @return {RoundCornersAction}
     */
    radius(a, b, c, d) {
        const qualifierValue = new QualifierValue();
        // In case a === 0, check typeof
        typeof a !== undefined && qualifierValue.addValue(a);
        typeof b !== undefined && qualifierValue.addValue(b);
        typeof c !== undefined && qualifierValue.addValue(c);
        typeof d !== undefined && qualifierValue.addValue(d);
        this.addQualifier(new Qualifier('r').addValue(qualifierValue));
        return this;
    }
    /**
     * @description Applies maximum rounding to the corners of the asset. An asset with square dimensions becomes a circle.
     */
    max() {
        return this.addQualifier(new Qualifier('r', 'max'));
    }
}
export default RoundCornersAction;
