'use strict';

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
 * @description A class to round one or more corners of an image or video.
 * @extends SDK.Action
 * @memberOf Actions.RoundCorners
 * @see Visit {@link Actions.RoundCorners|RoundCorners} for an example
 */
var RoundCornersAction = /** @class */ (function (_super) {
    tslib_es6.__extends(RoundCornersAction, _super);
    function RoundCornersAction() {
        return _super.call(this) || this;
    }
    /**
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @param {number} d
     * @return {RoundCornersAction}
     */
    RoundCornersAction.prototype.radius = function (a, b, c, d) {
        var qualifierValue = new internal_qualifier_QualifierValue.QualifierValue();
        // In case a === 0, check typeof
        typeof a !== undefined && qualifierValue.addValue(a);
        typeof b !== undefined && qualifierValue.addValue(b);
        typeof c !== undefined && qualifierValue.addValue(c);
        typeof d !== undefined && qualifierValue.addValue(d);
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('r').addValue(qualifierValue));
        return this;
    };
    /**
     * @description Applies maximum rounding to the corners of the asset. An asset with square dimensions becomes a circle.
     */
    RoundCornersAction.prototype.max = function () {
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('r', 'max'));
    };
    return RoundCornersAction;
}(internal_Action.Action));

module.exports = RoundCornersAction;
