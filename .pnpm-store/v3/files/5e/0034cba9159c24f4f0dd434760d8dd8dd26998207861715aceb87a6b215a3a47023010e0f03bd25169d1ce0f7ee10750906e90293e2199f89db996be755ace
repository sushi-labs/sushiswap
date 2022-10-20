'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_utils_toFloatAsString = require('../../internal/utils/toFloatAsString.cjs');
var qualifiers_aspectRatio_AspectRatioQualifierValue = require('../../qualifiers/aspectRatio/AspectRatioQualifierValue.cjs');
var qualifiers_flag = require('../../qualifiers/flag.cjs');
var qualifiers_flag_FlagQualifier = require('../../qualifiers/flag/FlagQualifier.cjs');
var internal_internalConstants = require('../../internal/internalConstants.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/objectFlip.cjs');

/**
 * @description Defines a resize using width and height.
 * @extends SDK.Action
 * @memberOf Actions.Resize
 * @see Visit {@link Actions.Resize| Resize} for examples
 */
var ResizeSimpleAction = /** @class */ (function (_super) {
    tslib_es6.__extends(ResizeSimpleAction, _super);
    /**
     * @param {string} cropType
     * @param {number | string} cropWidth The required width of a transformed asset.
     * @param {number | string} cropHeight The required height of a transformed asset.
     */
    function ResizeSimpleAction(cropType, cropWidth, cropHeight) {
        var _this = _super.call(this) || this;
        _this._actionModel = { dimensions: {} };
        _this._actionModel.actionType = internal_internalConstants.CROP_MODE_TO_ACTION_TYPE_MAP[cropType] || cropType;
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('c', cropType));
        cropWidth && _this.width(cropWidth);
        cropHeight && _this.height(cropHeight);
        return _this;
    }
    /**
     * @description Sets the height of the resize
     * @param {string | number} x The height in pixels (if an integer is specified) or as a percentage (if a float is specified).
     */
    ResizeSimpleAction.prototype.height = function (x) {
        this._actionModel.dimensions.height = x;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('h', x));
    };
    /**
     * @description Sets the width of the resize
     * @param {string | number} x The width in pixels (if an integer is specified) or as a percentage (if a float is specified).
     */
    ResizeSimpleAction.prototype.width = function (x) {
        this._actionModel.dimensions.width = x;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('w', x));
    };
    /**
     * @description Sets the aspect ratio of the asset.
     * For a list of supported types see {@link Qualifiers.AspectRatio|
      * AspectRatio values}
     * @param {AspectRatioType|number|string} ratio The new aspect ratio, specified as a percentage or ratio.
     * @return {this}
     */
    ResizeSimpleAction.prototype.aspectRatio = function (ratio) {
        // toFloatAsString is used to ensure 1 turns into 1.0
        if (ratio instanceof qualifiers_aspectRatio_AspectRatioQualifierValue.AspectRatioQualifierValue) {
            this._actionModel.dimensions.aspectRatio = "" + ratio;
            return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('ar', ratio));
        }
        if (typeof ratio === 'number' || typeof ratio === 'string') {
            this._actionModel.dimensions.aspectRatio = internal_utils_toFloatAsString.toFloatAsString(ratio);
            return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('ar', internal_utils_toFloatAsString.toFloatAsString(ratio)));
        }
        if (ratio instanceof qualifiers_flag_FlagQualifier.FlagQualifier) {
            this._actionModel.dimensions.aspectRatio = "" + ratio.qualifierValue;
            return this.addFlag(ratio);
        }
    };
    /**
     * @description Modifies percentage-based width & height parameters of overlays and underlays (e.g., 1.0) to be relative to the containing image instead of the added layer.
     * @return {this}
     */
    ResizeSimpleAction.prototype.relative = function () {
        this._actionModel.relative = true;
        return this.addFlag(qualifiers_flag.relative());
    };
    /**
     * @description Modifies percentage-based width & height parameters of overlays and underlays (e.g., 1.0) to be relative to the overlaid region
     * @return {this}
     */
    ResizeSimpleAction.prototype.regionRelative = function () {
        this._actionModel.regionRelative = true;
        return this.addFlag(qualifiers_flag.regionRelative());
    };
    ResizeSimpleAction.fromJson = function (actionModel) {
        var _a = actionModel, actionType = _a.actionType, dimensions = _a.dimensions, relative = _a.relative, regionRelative = _a.regionRelative;
        var aspectRatio = dimensions.aspectRatio, width = dimensions.width, height = dimensions.height;
        var cropMode = internal_internalConstants.ACTION_TYPE_TO_CROP_MODE_MAP[actionType] || actionType;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(cropMode, width, height);
        aspectRatio && result.aspectRatio(aspectRatio === 'ignore_aspect_ratio' ? qualifiers_flag.ignoreInitialAspectRatio() : aspectRatio);
        relative && result.relative();
        regionRelative && result.regionRelative();
        return result;
    };
    return ResizeSimpleAction;
}(internal_Action.Action));

exports.ResizeSimpleAction = ResizeSimpleAction;
