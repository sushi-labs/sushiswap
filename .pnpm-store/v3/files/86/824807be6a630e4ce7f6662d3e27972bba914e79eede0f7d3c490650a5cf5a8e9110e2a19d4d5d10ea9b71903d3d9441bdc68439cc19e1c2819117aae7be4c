import { Action } from "../../internal/Action.js";
import { ImproveActionModel } from "../../internal/models/IAdjustActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @description Defines how to improve an image by automatically adjusting image colors, contrast and brightness.</br>
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#image_improvement_effects|Image improvement effects}
 * @memberOf Actions.Adjust
 */
declare class ImproveAction extends Action {
    private modeValue;
    private blendValue;
    protected _actionModel: ImproveActionModel;
    constructor();
    /**
     *
     * @description The improve mode.
     * @param {Qualifiers.ImproveMode | string} value
     */
    mode(value: 'outdoor' | 'indoor' | string): this;
    /**
     * @description How much to blend the improved result with the original image, where 0 means only use the original and 100 means only use the improved result. (Range: 0 to 100, Server default: 100)
     * @param {number} value
     */
    blend(value: number): this;
    protected prepareQualifiers(): this;
    static fromJson(actionModel: IActionModel): ImproveAction;
}
export { ImproveAction };
