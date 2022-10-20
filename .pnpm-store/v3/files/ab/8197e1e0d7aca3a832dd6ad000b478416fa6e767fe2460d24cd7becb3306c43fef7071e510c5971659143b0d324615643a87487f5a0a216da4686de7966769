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
 * @description Applies stripes to the image to help people with common color-blind conditions to differentiate between colors that are similar for them.
 *              You can replace colors using the xray() method.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var AssistColorBlindEffectAction = /** @class */ (function (_super) {
    tslib_es6.__extends(AssistColorBlindEffectAction, _super);
    function AssistColorBlindEffectAction() {
        var _this = _super.call(this) || this;
        _this._actionModel = {};
        _this._actionModel.actionType = 'assistColorblind';
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', new internal_qualifier_QualifierValue.QualifierValue('assist_colorblind')));
        return _this;
    }
    /**
     * @description Replaces problematic colors with colors that are easier to differentiate.
     * @return {this}
     */
    AssistColorBlindEffectAction.prototype.xray = function () {
        this._actionModel.type = 'xray';
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', new internal_qualifier_QualifierValue.QualifierValue(['assist_colorblind', 'xray']).setDelimiter(':')));
    };
    /**
     * @description Applies stripes of the specified intensity to help people with common color blind conditions to differentiate between colors that are similar for them.
     * @param {number | string} strength The intensity of the stripes. (Range: 1 to 100, Server default: 10)
     * @return {this}
     */
    AssistColorBlindEffectAction.prototype.stripesStrength = function (strength) {
        this._actionModel.type = 'stripes';
        this._actionModel.stripesStrength = strength;
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', new internal_qualifier_QualifierValue.QualifierValue(['assist_colorblind', strength]).setDelimiter(':')));
    };
    AssistColorBlindEffectAction.fromJson = function (actionModel) {
        var _a = actionModel; _a.actionType; var type = _a.type, stripesStrength = _a.stripesStrength;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this();
        if (type === 'xray') {
            result.xray();
        }
        if (type === 'stripes') {
            stripesStrength && result.stripesStrength(stripesStrength);
        }
        return result;
    };
    return AssistColorBlindEffectAction;
}(internal_Action.Action));

exports.AssistColorBlindEffectAction = AssistColorBlindEffectAction;
