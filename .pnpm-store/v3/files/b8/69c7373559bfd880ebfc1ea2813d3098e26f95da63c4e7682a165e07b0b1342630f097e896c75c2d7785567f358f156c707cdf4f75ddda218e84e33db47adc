import { Action } from "../../internal/Action.js";
import { QualifierValue } from "../../internal/qualifier/QualifierValue.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @description Applies stripes to the image to help people with common color-blind conditions to differentiate between colors that are similar for them.
 *              You can replace colors using the xray() method.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
class AssistColorBlindEffectAction extends Action {
    constructor() {
        super();
        this._actionModel = {};
        this._actionModel.actionType = 'assistColorblind';
        this.addQualifier(new Qualifier('e', new QualifierValue('assist_colorblind')));
    }
    /**
     * @description Replaces problematic colors with colors that are easier to differentiate.
     * @return {this}
     */
    xray() {
        this._actionModel.type = 'xray';
        return this.addQualifier(new Qualifier('e', new QualifierValue(['assist_colorblind', 'xray']).setDelimiter(':')));
    }
    /**
     * @description Applies stripes of the specified intensity to help people with common color blind conditions to differentiate between colors that are similar for them.
     * @param {number | string} strength The intensity of the stripes. (Range: 1 to 100, Server default: 10)
     * @return {this}
     */
    stripesStrength(strength) {
        this._actionModel.type = 'stripes';
        this._actionModel.stripesStrength = strength;
        return this.addQualifier(new Qualifier('e', new QualifierValue(['assist_colorblind', strength]).setDelimiter(':')));
    }
    static fromJson(actionModel) {
        const { actionType, type, stripesStrength } = actionModel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        const result = new this();
        if (type === 'xray') {
            result.xray();
        }
        if (type === 'stripes') {
            stripesStrength && result.stripesStrength(stripesStrength);
        }
        return result;
    }
}
export { AssistColorBlindEffectAction };
