'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');

/**
 * @description Trims pixels according to the transparency levels of a given overlay image.
 * Wherever the overlay image is transparent, the original is shown, and wherever the overlay is opaque, the resulting image is transparent.
 * @extends SDK.Action
 * @param {Qualifiers.Source.ImageSource} imageSource
 * @memberOf Actions.Reshape
 * @see Visit {@link Actions.Reshape| Reshape} for examples
 */
var CutByImage = /** @class */ (function (_super) {
    tslib_es6.__extends(CutByImage, _super);
    function CutByImage(source) {
        var _this = _super.call(this) || this;
        _this.source = source;
        return _this;
    }
    /**
     * @description Defines the position of the layer.
     * @param {Qualifiers.Position} position The position of the overlay with respect to the base image.
     * @return {this}
     */
    CutByImage.prototype.position = function (position) {
        this._position = position;
        return this;
    };
    CutByImage.prototype.toString = function () {
        var _a;
        var close = new internal_Action.Action();
        // Our implementation prevents two `fl` keys in the same URL component
        // We also don't want to concatenate flags (fl_layer_apply.cutter)
        // We use this trick to create two separate flags
        close.addQualifier(new internal_qualifier_Qualifier.Qualifier('fl', 'cutter,fl_layer_apply'));
        (_a = this._position) === null || _a === void 0 ? void 0 : _a.qualifiers.forEach(function (qualifier) {
            close.addQualifier(qualifier);
        });
        return [
            this.source.getOpenSourceString('l'),
            this.source.getTransformation(),
            close
        ].filter(function (a) { return a; }).join('/');
    };
    return CutByImage;
}(internal_Action.Action));

module.exports = CutByImage;
