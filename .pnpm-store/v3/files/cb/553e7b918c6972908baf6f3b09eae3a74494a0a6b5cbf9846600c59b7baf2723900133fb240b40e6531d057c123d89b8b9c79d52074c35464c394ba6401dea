'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var internal_utils_prepareColor = require('../../internal/utils/prepareColor.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');

/**
 * @description Adds an outline to a transparent image. For examples, see the Image Transformations guide.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var EffectOutline = /** @class */ (function (_super) {
    tslib_es6.__extends(EffectOutline, _super);
    function EffectOutline() {
        var _this = _super.call(this) || this;
        _this._actionModel = {};
        _this._actionModel.actionType = 'outline';
        return _this;
    }
    /**
     * @description
     * How to apply the outline effect which can be one of the following values:
     * inner, inner_fill, outer, fill.
     * @param {OutlineModeType|string} mode  The type of outline effect. Use the constants defined in Outline.
     * @return {this}
     */
    EffectOutline.prototype.mode = function (mode) {
        this._actionModel.mode = mode;
        this._mode = mode;
        return this;
    };
    /**
     * The thickness of the outline in pixels. (Range: 1 to 100, Server default: 5)
     * @param {number} width
     * @return {this}
     */
    EffectOutline.prototype.width = function (width) {
        this._actionModel.width = width;
        this._width = width;
        return this;
    };
    /**
     * @description
     * The level of blur of the outline.
     * Range: 0 to 2000, Server default: 0
     * @param {number | string} lvl
     * @return {this}
     */
    EffectOutline.prototype.blurLevel = function (lvl) {
        this._actionModel.blurLevel = lvl;
        this._blurLevel = lvl;
        return this;
    };
    /**
     * @param {string | Qualifiers.Color} color One of the SDK Color values, string, or rgba: '#fff'
     * @return {this}
     */
    EffectOutline.prototype.color = function (color) {
        this._actionModel.color = color;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('co', internal_utils_prepareColor.prepareColor(color)));
    };
    EffectOutline.prototype.prepareQualifiers = function () {
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', new internal_qualifier_QualifierValue.QualifierValue(['outline', this._mode, this._width, this._blurLevel]).setDelimiter(':')));
    };
    EffectOutline.fromJson = function (actionModel) {
        var _a = actionModel; _a.actionType; var mode = _a.mode, color = _a.color, blurLevel = _a.blurLevel, width = _a.width;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this();
        mode && result.mode(mode);
        color && result.color(color);
        blurLevel && result.blurLevel(blurLevel);
        width && result.width(width);
        return result;
    };
    return EffectOutline;
}(internal_Action.Action));

exports.EffectOutline = EffectOutline;
