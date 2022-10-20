'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
var internal_Action = require('../../internal/Action.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');

/**
 * @description Changes the main background color to the one specified, as if a 'theme change' was applied (e.g. dark mode vs light mode).
 * @extends SDK.Action
 * @memberOf {Actions.Effect}
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var ThemeEffect = /** @class */ (function (_super) {
    tslib_es6.__extends(ThemeEffect, _super);
    function ThemeEffect(color) {
        var _this = _super.call(this) || this;
        _this.effectName = 'theme';
        _this.color = color;
        return _this;
    }
    /**
     * @description The sensitivity to photographic elements of an image.
     *              A value of 0 treats the whole image as non-photographic.
     *              A value of 200 treats the whole image as photographic, so no theme change is applied.
     * @param {number} photosensitivity
     * @return {this}
     */
    ThemeEffect.prototype.photosensitivity = function (photosensitivity) {
        this._photosensitivity = photosensitivity;
        return this;
    };
    ThemeEffect.prototype.prepareQualifiers = function () {
        var sensitivity = this._photosensitivity ? ":photosensitivity_" + this._photosensitivity : '';
        // Replace # in hex colors (#fff -> fff)
        var val = this.effectName + ":color_" + this.color.replace('#', '') + sensitivity;
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', new internal_qualifier_QualifierValue.QualifierValue(val)));
        return;
    };
    return ThemeEffect;
}(internal_Action.Action));

exports.ThemeEffect = ThemeEffect;
