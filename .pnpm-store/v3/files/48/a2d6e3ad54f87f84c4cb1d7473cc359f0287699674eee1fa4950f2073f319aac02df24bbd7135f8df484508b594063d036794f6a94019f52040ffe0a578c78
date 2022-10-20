import { Action } from "../../internal/Action.js";
import { QualifierValue } from "../../internal/qualifier/QualifierValue.js";
import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @description Defines how to improve an image by automatically adjusting image colors, contrast and brightness.</br>
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#image_improvement_effects|Image improvement effects}
 * @memberOf Actions.Adjust
 */
class ImproveAction extends Action {
    constructor() {
        super();
        this._actionModel = { actionType: 'improve' };
    }
    /**
     *
     * @description The improve mode.
     * @param {Qualifiers.ImproveMode | string} value
     */
    mode(value) {
        this.modeValue = value;
        this._actionModel.mode = value;
        return this;
    }
    /**
     * @description How much to blend the improved result with the original image, where 0 means only use the original and 100 means only use the improved result. (Range: 0 to 100, Server default: 100)
     * @param {number} value
     */
    blend(value) {
        this.blendValue = value;
        this._actionModel.blend = value;
        return this;
    }
    prepareQualifiers() {
        const qualifierValue = new QualifierValue(['improve', this.modeValue, this.blendValue]).setDelimiter(':');
        this.addQualifier(new Qualifier('e', qualifierValue));
        return this;
    }
    static fromJson(actionModel) {
        const { mode, blend } = actionModel;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        const result = new this();
        mode && result.mode(mode);
        blend && result.blend(blend);
        return result;
    }
}
export { ImproveAction };
