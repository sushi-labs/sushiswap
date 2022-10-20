import { Qualifier } from "../../internal/qualifier/Qualifier.js";
import { Action } from "../../internal/Action.js";
import { toFloatAsString } from "../../internal/utils/toFloatAsString.js";
import { AspectRatioQualifierValue } from "../../qualifiers/aspectRatio/AspectRatioQualifierValue.js";
import { ignoreInitialAspectRatio, regionRelative, relative } from "../../qualifiers/flag.js";
import { FlagQualifier } from "../../qualifiers/flag/FlagQualifier.js";
import { ACTION_TYPE_TO_CROP_MODE_MAP, CROP_MODE_TO_ACTION_TYPE_MAP } from "../../internal/internalConstants.js";
/**
 * @description Defines a resize using width and height.
 * @extends SDK.Action
 * @memberOf Actions.Resize
 * @see Visit {@link Actions.Resize| Resize} for examples
 */
class ResizeSimpleAction extends Action {
    /**
     * @param {string} cropType
     * @param {number | string} cropWidth The required width of a transformed asset.
     * @param {number | string} cropHeight The required height of a transformed asset.
     */
    constructor(cropType, cropWidth, cropHeight) {
        super();
        this._actionModel = { dimensions: {} };
        this._actionModel.actionType = CROP_MODE_TO_ACTION_TYPE_MAP[cropType] || cropType;
        this.addQualifier(new Qualifier('c', cropType));
        cropWidth && this.width(cropWidth);
        cropHeight && this.height(cropHeight);
    }
    /**
     * @description Sets the height of the resize
     * @param {string | number} x The height in pixels (if an integer is specified) or as a percentage (if a float is specified).
     */
    height(x) {
        this._actionModel.dimensions.height = x;
        return this.addQualifier(new Qualifier('h', x));
    }
    /**
     * @description Sets the width of the resize
     * @param {string | number} x The width in pixels (if an integer is specified) or as a percentage (if a float is specified).
     */
    width(x) {
        this._actionModel.dimensions.width = x;
        return this.addQualifier(new Qualifier('w', x));
    }
    /**
     * @description Sets the aspect ratio of the asset.
     * For a list of supported types see {@link Qualifiers.AspectRatio|
      * AspectRatio values}
     * @param {AspectRatioType|number|string} ratio The new aspect ratio, specified as a percentage or ratio.
     * @return {this}
     */
    aspectRatio(ratio) {
        // toFloatAsString is used to ensure 1 turns into 1.0
        if (ratio instanceof AspectRatioQualifierValue) {
            this._actionModel.dimensions.aspectRatio = `${ratio}`;
            return this.addQualifier(new Qualifier('ar', ratio));
        }
        if (typeof ratio === 'number' || typeof ratio === 'string') {
            this._actionModel.dimensions.aspectRatio = toFloatAsString(ratio);
            return this.addQualifier(new Qualifier('ar', toFloatAsString(ratio)));
        }
        if (ratio instanceof FlagQualifier) {
            this._actionModel.dimensions.aspectRatio = `${ratio.qualifierValue}`;
            return this.addFlag(ratio);
        }
    }
    /**
     * @description Modifies percentage-based width & height parameters of overlays and underlays (e.g., 1.0) to be relative to the containing image instead of the added layer.
     * @return {this}
     */
    relative() {
        this._actionModel.relative = true;
        return this.addFlag(relative());
    }
    /**
     * @description Modifies percentage-based width & height parameters of overlays and underlays (e.g., 1.0) to be relative to the overlaid region
     * @return {this}
     */
    regionRelative() {
        this._actionModel.regionRelative = true;
        return this.addFlag(regionRelative());
    }
    static fromJson(actionModel) {
        const { actionType, dimensions, relative, regionRelative } = actionModel;
        const { aspectRatio, width, height } = dimensions;
        const cropMode = ACTION_TYPE_TO_CROP_MODE_MAP[actionType] || actionType;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        const result = new this(cropMode, width, height);
        aspectRatio && result.aspectRatio(aspectRatio === 'ignore_aspect_ratio' ? ignoreInitialAspectRatio() : aspectRatio);
        relative && result.relative();
        regionRelative && result.regionRelative();
        return result;
    }
}
export { ResizeSimpleAction };
