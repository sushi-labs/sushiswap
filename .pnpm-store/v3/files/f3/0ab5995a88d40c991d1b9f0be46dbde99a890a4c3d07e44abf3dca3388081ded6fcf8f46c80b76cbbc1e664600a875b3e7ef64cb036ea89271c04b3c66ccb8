'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');

/**
 * @description Vectorizes the image.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var VectorizeEffectAction = /** @class */ (function (_super) {
    tslib_es6.__extends(VectorizeEffectAction, _super);
    function VectorizeEffectAction() {
        var _this = _super.call(this) || this;
        _this._actionModel = {};
        _this._actionModel.actionType = 'vectorize';
        return _this;
    }
    /**
     * @description The number of colors. (Range: 2 to 30, Server default: 10)
     * @param {number | string} num
     * @return {this}
     */
    VectorizeEffectAction.prototype.numOfColors = function (num) {
        this._actionModel.numOfColors = num;
        this._numOfColors = num;
        return this;
    };
    /**
     * @description The level of detail. Specify either a percentage of the original image (Range: 0.0 to 1.0) or an absolute number of pixels (Range: 0 to 1000). (Server default: 300)
     * @param {number | string} num
     * @return {this}
     */
    VectorizeEffectAction.prototype.detailsLevel = function (num) {
        this._actionModel.detailLevel = num;
        this._detailsLevel = num;
        return this;
    };
    /**
     * @description The size of speckles to suppress. Specify either a percentage of the original image (Range: 0.0 to 1.0) or an absolute number of pixels (Range: 0 to 100, Server default: 2)
     * @param {number | string} num
     * @return {this}
     */
    VectorizeEffectAction.prototype.despeckleLevel = function (num) {
        this._actionModel.despeckleLevel = num;
        this._despeckleLevel = num;
        return this;
    };
    /**
     * @description The corner threshold. Specify 100 for no smoothing (polygon corners), 0 for completely smooth corners. (Range: 0 to 100, Default: 25)
     * @param {number | string} num
     * @return {this}
     */
    VectorizeEffectAction.prototype.cornersLevel = function (num) {
        this._actionModel.cornersLevel = num;
        this._cornersLevel = num;
        return this;
    };
    /**
     * @description The optimization value. Specify 100 for least optimization and the largest file. (Range: 0 to 100, Server default: 100).
     * @param {number} num
     * @return {this}
     */
    VectorizeEffectAction.prototype.paths = function (num) {
        this._actionModel.paths = num;
        this._paths = num;
        return this;
    };
    VectorizeEffectAction.prototype.prepareQualifiers = function () {
        var str = 'vectorize';
        if (this._numOfColors) {
            str += ":" + new internal_qualifier_QualifierValue.QualifierValue("colors:" + this._numOfColors).toString();
        }
        if (this._detailsLevel) {
            str += ":" + new internal_qualifier_QualifierValue.QualifierValue("detail:" + this._detailsLevel).toString();
        }
        if (this._despeckleLevel) {
            str += ":" + new internal_qualifier_QualifierValue.QualifierValue("despeckle:" + this._despeckleLevel).toString();
        }
        if (this._paths) {
            str += ":" + new internal_qualifier_QualifierValue.QualifierValue("paths:" + this._paths).toString();
        }
        if (this._cornersLevel) {
            str += ":" + new internal_qualifier_QualifierValue.QualifierValue("corners:" + this._cornersLevel).toString();
        }
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', str));
    };
    VectorizeEffectAction.fromJson = function (actionModel) {
        var _a = actionModel; _a.actionType; var paths = _a.paths, cornersLevel = _a.cornersLevel, despeckleLevel = _a.despeckleLevel, detailLevel = _a.detailLevel, numOfColors = _a.numOfColors;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this();
        paths && result.paths(paths);
        cornersLevel && result.cornersLevel(cornersLevel);
        despeckleLevel && result.despeckleLevel(despeckleLevel);
        detailLevel && result.detailsLevel(detailLevel);
        numOfColors && result.numOfColors(numOfColors);
        return result;
    };
    return VectorizeEffectAction;
}(internal_Action.Action));

exports.VectorizeEffectAction = VectorizeEffectAction;
