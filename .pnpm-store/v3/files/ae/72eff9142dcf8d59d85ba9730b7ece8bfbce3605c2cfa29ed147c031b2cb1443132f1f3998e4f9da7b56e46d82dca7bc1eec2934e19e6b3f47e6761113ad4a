'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/qualifier/Qualifier.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');

/**
 * @description Removes the edges of the image based on the color of the corner pixels.
 * Specify a color other than the color of the corner pixels using the colorOverride() method
 * @extends SDK.Action
 * @memberOf Actions.Reshape
 * @see Visit {@link Actions.Reshape| Reshape} for examples
 */
var TrimAction = /** @class */ (function (_super) {
    tslib_es6.__extends(TrimAction, _super);
    function TrimAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {number} tolerance The tolerance level for color similarity.
     */
    TrimAction.prototype.colorSimilarity = function (tolerance) {
        this._tolerance = tolerance;
        return this;
    };
    /**
     * @param {string | Qualifiers.Color} color Overrides the corner pixels color with the specified color.
     */
    TrimAction.prototype.colorOverride = function (color) {
        this._color = color;
        return this;
    };
    TrimAction.prototype.toString = function () {
        // image.reshape(Reshape.trim()->colorSimilarity(50)->colorOverride(Color.YELLOW));
        // e_trim:50:yellow
        return [
            'e_trim',
            this._tolerance,
            this._color
        ].filter(function (a) { return a; }).join(':');
    };
    return TrimAction;
}(internal_Action.Action));

exports.TrimAction = TrimAction;
