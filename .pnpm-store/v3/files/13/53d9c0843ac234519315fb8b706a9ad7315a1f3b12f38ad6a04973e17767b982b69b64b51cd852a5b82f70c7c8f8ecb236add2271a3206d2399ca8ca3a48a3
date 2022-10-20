'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var qualifiers_flag = require('../flag.cjs');
var internal_models_createGravityModel = require('../../internal/models/createGravityModel.cjs');
require('../flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../gravity/autoGravity/AutoGravity.cjs');
require('../gravity/GravityQualifier.cjs');
require('../gravity/focusOnGravity/FocusOnGravity.cjs');
require('../gravity.cjs');
require('../gravity/compassGravity/CompassGravity.cjs');
require('../gravity/xyCenterGravity/XYCenterGravity.cjs');
require('../gravity/qualifiers/focusOn/FocusOnValue.cjs');

/**
 * @description
 * Defines the position of a layer: overlay or underlay.</br>
 * Even though Position is technically an action qualifier, it implements exactly the same functionality as an action.</br>
 * This is true because Position is compounded of multiple qualifiers</br>
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#image_and_text_overlays|Applying overlays to images} | {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#adding_image_overlays|Applying overlays to videos}
 *
 * @extends {SDK.Actions}
 */
var PositionQualifier = /** @class */ (function (_super) {
    tslib_es6.__extends(PositionQualifier, _super);
    function PositionQualifier() {
        var _this = _super.call(this) || this;
        _this._actionModel = {};
        return _this;
    }
    PositionQualifier.prototype.gravity = function (gravityQualifier) {
        this.addQualifier(gravityQualifier);
        this._actionModel.gravity = internal_models_createGravityModel.createGravityModel(gravityQualifier);
        return this;
    };
    /**
     * @description Tiles the overlay across your image.
     * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#tiling_overlays|Tiling overlay}
     */
    PositionQualifier.prototype.tiled = function () {
        this.addFlag(qualifiers_flag.tiled());
        this._actionModel.tiled = true;
        return this;
    };
    /**
     * TODO - This should accept a boolean value
     * @description Prevents an image or text overlay from extending a delivered image canvas beyond the dimensions of the base image
     * <b>Learn more:</b> {@link https://cloudinary.com/documentation/transformation_reference#fl_no_overflow|Overflow in overlays}
     */
    PositionQualifier.prototype.allowOverflow = function (bool) {
        if (bool === void 0) { bool = true; }
        if (bool === false) {
            this.addFlag(qualifiers_flag.noOverflow());
        }
        this._actionModel.allowOverflow = bool;
        return this;
    };
    /**
     * @description Set the X Offset
     * @param {number | string} offsetX
     * @return {this}
     */
    PositionQualifier.prototype.offsetX = function (offsetX) {
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('x', offsetX));
        this._actionModel.offsetX = offsetX;
        return this;
    };
    /**
     * @description Set the Y Offset
     * @param {number | string} offsetY
     * @return {this}
     */
    PositionQualifier.prototype.offsetY = function (offsetY) {
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('y', offsetY));
        this._actionModel.offsetY = offsetY;
        return this;
    };
    return PositionQualifier;
}(internal_Action.Action));

exports.PositionQualifier = PositionQualifier;
