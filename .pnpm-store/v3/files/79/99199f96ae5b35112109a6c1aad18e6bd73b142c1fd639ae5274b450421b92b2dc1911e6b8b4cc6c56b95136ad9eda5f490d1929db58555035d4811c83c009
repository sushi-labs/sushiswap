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
 * @description Applies a pre-defined named transformation of the given name, used with a builder from {@link Actions.NamedTransformation|Named Transformation}
 * @extends SDK.Action
 * @memberOf Actions.NamedTransformation
 * @see Visit {@link Actions.NamedTransformation|Named Transformation} for an example
 */
var NamedTransformationAction = /** @class */ (function (_super) {
    tslib_es6.__extends(NamedTransformationAction, _super);
    /**
     *
     * @param {string} name The name of the named transformation
     */
    function NamedTransformationAction(name) {
        var _this = _super.call(this) || this;
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('t', name));
        return _this;
    }
    return NamedTransformationAction;
}(internal_Action.Action));

exports.NamedTransformationAction = NamedTransformationAction;
