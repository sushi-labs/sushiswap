'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');

/**
 * @description Defines how to improve an image by automatically adjusting image colors, contrast and brightness.</br>
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#image_improvement_effects|Image improvement effects}
 * @memberOf Actions.Adjust
 */
var ImproveAction = /** @class */ (function (_super) {
    tslib_es6.__extends(ImproveAction, _super);
    function ImproveAction() {
        var _this = _super.call(this) || this;
        _this._actionModel = { actionType: 'improve' };
        return _this;
    }
    /**
     *
     * @description The improve mode.
     * @param {Qualifiers.ImproveMode | string} value
     */
    ImproveAction.prototype.mode = function (value) {
        this.modeValue = value;
        this._actionModel.mode = value;
        return this;
    };
    /**
     * @description How much to blend the improved result with the original image, where 0 means only use the original and 100 means only use the improved result. (Range: 0 to 100, Server default: 100)
     * @param {number} value
     */
    ImproveAction.prototype.blend = function (value) {
        this.blendValue = value;
        this._actionModel.blend = value;
        return this;
    };
    ImproveAction.prototype.prepareQualifiers = function () {
        var qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(['improve', this.modeValue, this.blendValue]).setDelimiter(':');
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', qualifierValue));
        return this;
    };
    ImproveAction.fromJson = function (actionModel) {
        var _a = actionModel, mode = _a.mode, blend = _a.blend;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this();
        mode && result.mode(mode);
        blend && result.blend(blend);
        return result;
    };
    return ImproveAction;
}(internal_Action.Action));

exports.ImproveAction = ImproveAction;
