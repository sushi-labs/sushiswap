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
 * @description OpacityAction class, used to define the opacity of an asset
 * @memberOf Actions.Adjust
 * @extends SDK.Action
 */
var OpacityAdjustAction = /** @class */ (function (_super) {
    tslib_es6.__extends(OpacityAdjustAction, _super);
    function OpacityAdjustAction(level) {
        var _this = _super.call(this) || this;
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('o', level));
        return _this;
    }
    return OpacityAdjustAction;
}(internal_Action.Action));

exports.OpacityAdjustAction = OpacityAdjustAction;
