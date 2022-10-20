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
 * @extends SDK.Action
 * @description Converts the colors of every pixel in an image based on the supplied color matrix, in which the value of each color channel is calculated based on the values from all other channels (e.g. a 3x3 matrix for RGB, a 4x4 matrix for RGBA or CMYK, etc).<br/>
 * For every pixel in the image, take each color channel and adjust its value by the specified values of the matrix to get a new value.
 * @memberOf Actions.Adjust
 */
var RecolorAction = /** @class */ (function (_super) {
    tslib_es6.__extends(RecolorAction, _super);
    function RecolorAction(recolorMatrix) {
        var _this = _super.call(this) || this;
        _this.matrix = recolorMatrix;
        // Turn the matrix into a flat array of values
        // the values are ordered by row
        // [...row1, ...row2, ...row3, ..., row(n) ]
        var flat = [];
        for (var row = 0; row < recolorMatrix.length; row++) {
            for (var col = 0; col < recolorMatrix[row].length; col++) {
                flat.push(recolorMatrix[row][col].toString());
            }
        }
        var qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(tslib_es6.__spreadArrays(['recolor'], flat)).setDelimiter(':');
        _this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', qualifierValue));
        return _this;
    }
    return RecolorAction;
}(internal_Action.Action));

exports.RecolorAction = RecolorAction;
