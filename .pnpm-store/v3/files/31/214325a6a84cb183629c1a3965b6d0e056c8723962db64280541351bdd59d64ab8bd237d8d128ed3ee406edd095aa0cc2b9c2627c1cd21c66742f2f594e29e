'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../../internal/Action.cjs');
var internal_qualifier_QualifierValue = require('../../../internal/qualifier/QualifierValue.cjs');
var internal_qualifier_Qualifier = require('../../../internal/qualifier/Qualifier.cjs');
var internal_internalConstants = require('../../../internal/internalConstants.cjs');
require('../../../qualifiers/flag/FlagQualifier.cjs');
require('../../../internal/utils/dataStructureUtils.cjs');
require('../../../internal/models/ActionModel.cjs');
require('../../../internal/models/actionToJson.cjs');
require('../../../internal/utils/unsupportedError.cjs');
require('../../../internal/models/QualifierModel.cjs');
require('../../../internal/models/qualifierToJson.cjs');
require('../../../internal/utils/objectFlip.cjs');

/**
 * @description A class that defines a simple effect of the type e_{effectName}
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var SimpleEffectAction = /** @class */ (function (_super) {
    tslib_es6.__extends(SimpleEffectAction, _super);
    function SimpleEffectAction(effectType, level) {
        var _this = _super.call(this) || this;
        _this._actionModel = {};
        _this._actionModel.actionType = internal_internalConstants.EFFECT_MODE_TO_ACTION_TYPE_MAP[effectType] || effectType;
        var qualifierEffect = _this.createEffectQualifier(effectType, level);
        _this.addQualifier(qualifierEffect);
        return _this;
    }
    SimpleEffectAction.prototype.createEffectQualifier = function (effectType, level) {
        var qualifierValue;
        if (level) {
            qualifierValue = new internal_qualifier_QualifierValue.QualifierValue([effectType, "" + level]).setDelimiter(':');
        }
        else {
            qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(effectType);
        }
        return new internal_qualifier_Qualifier.Qualifier('e', qualifierValue);
    };
    SimpleEffectAction.fromJson = function (actionModel) {
        var _a = actionModel, actionType = _a.actionType, level = _a.level, strength = _a.strength;
        var effectType = internal_internalConstants.ACTION_TYPE_TO_EFFECT_MODE_MAP[actionType] || actionType;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [actionModel])
        // This allows the inheriting classes to determine the class to be created
        // @ts-ignore
        var result = new this(effectType, level ? level : strength);
        return result;
    };
    return SimpleEffectAction;
}(internal_Action.Action));

exports.SimpleEffectAction = SimpleEffectAction;
