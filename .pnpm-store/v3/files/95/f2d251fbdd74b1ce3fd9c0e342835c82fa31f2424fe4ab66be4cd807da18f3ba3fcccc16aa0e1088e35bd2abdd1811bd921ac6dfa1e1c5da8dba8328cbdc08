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
 * @description A class that defines how to remove the background of an asset
 * @extends SDK.Action
 * @memberOf Actions.Effect
 * @see Visit {@link Actions.Effect|Effect} for an example
 */
var RemoveBackgroundAction = /** @class */ (function (_super) {
    tslib_es6.__extends(RemoveBackgroundAction, _super);
    function RemoveBackgroundAction() {
        var _this = _super.call(this) || this;
        _this.overwriteQualifier();
        return _this;
    }
    /**
     * @description Everytime this method is called, it will overwrite the e_bgremoval qualifier with new values
     * @private
     */
    RemoveBackgroundAction.prototype.overwriteQualifier = function () {
        var value = ['bgremoval', this._screen ? 'screen' : '', (this._colorToRemove || '').replace('#', '')];
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('e', new internal_qualifier_QualifierValue.QualifierValue(value)));
    };
    /**
     * @description The strength of the shadow. (Range: 0 to 100, Server default: 40)
     * @param {number} useScreen Boolean, defaults to true
     * @return {this}
     */
    RemoveBackgroundAction.prototype.screen = function (useScreen) {
        if (useScreen === void 0) { useScreen = true; }
        this._screen = useScreen;
        return this.overwriteQualifier();
    };
    /**
     * @description The color to remove from the background
     * @param {SystemColors} color
     * @return {this}
     */
    RemoveBackgroundAction.prototype.colorToRemove = function (color) {
        this._colorToRemove = color;
        return this.overwriteQualifier();
    };
    return RemoveBackgroundAction;
}(internal_Action.Action));

exports.RemoveBackgroundAction = RemoveBackgroundAction;
