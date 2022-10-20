'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');

/**
 * @description - This Action, while belonging to Effect, acts as a modified overlay.
 *                The class implements the Builder pattern, where strength() and preserveColor()
 *                are applied to the instance, and toString() is responsible to combining them into the right result.
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var StyleTransfer = /** @class */ (function (_super) {
    tslib_es6.__extends(StyleTransfer, _super);
    /**
     * The Image Source used to create the style transfer,
     * Use the Image Source builder to quickly create a source:
     * </br>Import: {@link Qualifiers.Source|import Sources from '@cloudinary/url-gen/qualifiers/sources';}
     * </br>Create: `Source.image('dog')`
     * @param {ImageSource} imageSource
     */
    function StyleTransfer(imageSource) {
        var _this = _super.call(this) || this;
        _this.imageSource = imageSource;
        return _this;
    }
    /**
     * Determines the strength in which the styleTransfer is applied.
     * @param {number} [effectStrength] - The strength level, 1-100, default: 100
     * @return {this}
     */
    StyleTransfer.prototype.strength = function (effectStrength) {
        if (effectStrength === void 0) { effectStrength = null; }
        this.effectStrength = effectStrength;
        return this;
    };
    /**
     * More aggressively preserves the colors of the the target photo,
     * Can be used with `strength()` to enhance this behaviour
     * @param {boolean} bool
     * @return {this}
     */
    StyleTransfer.prototype.preserveColor = function (bool) {
        if (bool === void 0) { bool = true; }
        this.preserve = bool;
        return this;
    };
    /**
     * The `build` phase of the Action, used internally to concat all the options received into a single string.
     * The result of this method is the toString() of the imageLayer provided in the constructor.
     * @return {string}
     */
    StyleTransfer.prototype.toString = function () {
        var NAME = 'style_transfer';
        var PRES = this.preserve ? 'preserve_color' : null;
        var STRENGTH = this.effectStrength;
        // Create the style effect
        var styleEffect = new internal_qualifier_Qualifier.Qualifier('e', new internal_qualifier_QualifierValue.QualifierValue([NAME, PRES, STRENGTH]));
        // Handle the source for publicID,
        var sourceOpenString = this.imageSource.getOpenSourceString('l');
        // Handle source transformation
        var imgTx = this.imageSource.getTransformation();
        var sourceTransformation = imgTx ? imgTx.toString() : '';
        return [
            sourceOpenString,
            sourceTransformation,
            styleEffect + ",fl_layer_apply"
        ].filter(function (a) { return a; }).join('/');
    };
    return StyleTransfer;
}(internal_Action.Action));

exports.StyleTransfer = StyleTransfer;
