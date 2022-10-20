'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');

/**
 * @description Simulates the way an image would appear to someone with the specified color blind condition
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var SimulateColorBlindEffectAction = /** @class */ (function (_super) {
    tslib_es6.__extends(SimulateColorBlindEffectAction, _super);
    function SimulateColorBlindEffectAction() {
        var _this = _super.call(this) || this;
        _this._actionModel = {};
        _this._actionModel.actionType = 'simulateColorblind';
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', "simulate_colorblind"));
        return _this;
    }
    SimulateColorBlindEffectAction.prototype.setQualifier = function (val) {
        var strToAppend = ":" + val;
        if (val) {
            this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', "simulate_colorblind" + strToAppend));
        }
        return this;
    };
    /**
     * @description Sets the color blind condition to simulate.
     * @param {Qualifiers.simulateColorBlindValues | SimulateColorBlindType | string} cond
     * @return {this}
     */
    SimulateColorBlindEffectAction.prototype.condition = function (cond) {
        this._actionModel.condition = cond;
        return this.setQualifier(cond);
    };
    SimulateColorBlindEffectAction.fromJson = function (actionModel) {
        var _a = actionModel; _a.actionType; var condition = _a.condition;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this();
        condition && result.condition(condition);
        return result;
    };
    return SimulateColorBlindEffectAction;
}(internal_Action.Action));

exports.SimulateColorBlindEffectAction = SimulateColorBlindEffectAction;
