import { Action } from "../../internal/Action.js";
import { AspectRatioQualifierValue } from "../../qualifiers/aspectRatio/AspectRatioQualifierValue.js";
import { FlagQualifier } from "../../qualifiers/flag/FlagQualifier.js";
import { ExpressionQualifier } from "../../qualifiers/expression/ExpressionQualifier.js";
import { AspectRatioType } from "../../types/types.js";
import { IResizeSimpleActionModel } from "../../internal/models/IResizeSimpleActionModel.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
/**
 * @description Defines a resize using width and height.
 * @extends SDK.Action
 * @memberOf Actions.Resize
 * @see Visit {@link Actions.Resize| Resize} for examples
 */
declare class ResizeSimpleAction extends Action {
    protected _actionModel: IResizeSimpleActionModel;
    /**
     * @param {string} cropType
     * @param {number | string} cropWidth The required width of a transformed asset.
     * @param {number | string} cropHeight The required height of a transformed asset.
     */
    constructor(cropType: string, cropWidth: number | string, cropHeight?: number | string);
    /**
     * @description Sets the height of the resize
     * @param {string | number} x The height in pixels (if an integer is specified) or as a percentage (if a float is specified).
     */
    height(x: number | string | ExpressionQualifier): this;
    /**
     * @description Sets the width of the resize
     * @param {string | number} x The width in pixels (if an integer is specified) or as a percentage (if a float is specified).
     */
    width(x: number | string | ExpressionQualifier): this;
    /**
     * @description Sets the aspect ratio of the asset.
     * For a list of supported types see {@link Qualifiers.AspectRatio|
      * AspectRatio values}
     * @param {AspectRatioType|number|string} ratio The new aspect ratio, specified as a percentage or ratio.
     * @return {this}
     */
    aspectRatio(ratio: AspectRatioType | AspectRatioQualifierValue | FlagQualifier | number | string): this;
    /**
     * @description Modifies percentage-based width & height parameters of overlays and underlays (e.g., 1.0) to be relative to the containing image instead of the added layer.
     * @return {this}
     */
    relative(): this;
    /**
     * @description Modifies percentage-based width & height parameters of overlays and underlays (e.g., 1.0) to be relative to the overlaid region
     * @return {this}
     */
    regionRelative(): this;
    static fromJson(actionModel: IActionModel): ResizeSimpleAction;
}
export { ResizeSimpleAction };
