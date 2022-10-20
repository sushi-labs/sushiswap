'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../../internal/Action.cjs');
var internal_qualifier_QualifierValue = require('../../../internal/qualifier/QualifierValue.cjs');
var internal_qualifier_Qualifier = require('../../../internal/qualifier/Qualifier.cjs');
require('../../../qualifiers/flag/FlagQualifier.cjs');
require('../../../internal/models/QualifierModel.cjs');
require('../../../internal/models/qualifierToJson.cjs');
require('../../../internal/utils/unsupportedError.cjs');
require('../../../internal/utils/dataStructureUtils.cjs');
require('../../../internal/models/ActionModel.cjs');
require('../../../internal/models/actionToJson.cjs');

/**
 * @extends SDK.Action
 * @description A class for background transformations.
 */
var BackgroundColor = /** @class */ (function (_super) {
    tslib_es6.__extends(BackgroundColor, _super);
    function BackgroundColor(color) {
        var _this = _super.call(this) || this;
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('b', new internal_qualifier_QualifierValue.QualifierValue(color).setDelimiter('_')));
        return _this;
    }
    return BackgroundColor;
}(internal_Action.Action));

exports.BackgroundColor = BackgroundColor;
