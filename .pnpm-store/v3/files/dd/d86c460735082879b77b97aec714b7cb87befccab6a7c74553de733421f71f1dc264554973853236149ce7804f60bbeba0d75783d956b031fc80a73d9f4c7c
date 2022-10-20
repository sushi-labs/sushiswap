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
 * @description Adjusts the fill light and blends the result with the original image.
 * @memberOf Actions.Adjust
 * @extends SDK.Action
 */
var FillLightAction = /** @class */ (function (_super) {
    tslib_es6.__extends(FillLightAction, _super);
    function FillLightAction() {
        return _super.call(this) || this;
    }
    /**
     * @description Sets the level of adjustment
     * @param {number} lvl How much to blend the adjusted fill light, where 0 means only use the original and 100 means only use the adjusted fill light result. (Range: 0 to 100, Server default: 100)
     */
    FillLightAction.prototype.blend = function (blend) {
        this.lvl = blend;
        return this;
    };
    /**
     * @description Sets the level of the bias
     * @param {number} biasLvl The bias to apply to the fill light effect (Range: -100 to 100, Server default: 0).
     */
    FillLightAction.prototype.bias = function (biasLvl) {
        this.biasLvl = biasLvl;
        return this;
    };
    FillLightAction.prototype.prepareQualifiers = function () {
        var qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(['fill_light', this.lvl, this.biasLvl]).setDelimiter(':');
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', qualifierValue));
        return this;
    };
    return FillLightAction;
}(internal_Action.Action));

exports.FillLightAction = FillLightAction;
