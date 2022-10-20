'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_Action = require('../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
var qualifiers_flag = require('../../qualifiers/flag.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');

/**
 * @description  Defines the clipping path to use when trimming pixels.
 * @extends SDK.Action
 * @memberOf Actions.PSDTools
 * @see Visit {@link Actions.PSDTools| PSDTools} for an example
 */
var ClipAction = /** @class */ (function (_super) {
    tslib_es6.__extends(ClipAction, _super);
    function ClipAction() {
        var _this = _super.call(this) || this;
        _this.isEvenOdd = false;
        return _this;
    }
    /**
     * @description The name of the path to clip by
     * @param {string} path
     * @return {this}
     */
    ClipAction.prototype.byName = function (path) {
        this.path = path;
        return this;
    };
    /**
     * @description The index of the path to clip by
     * @param {number} path
     * @return {this}
     */
    ClipAction.prototype.byIndex = function (path) {
        this.path = path;
        return this;
    };
    /**
     * @description Trims pixels according to a clipping path included in the original image using an evenodd clipping rule.
     * @return {this}
     */
    ClipAction.prototype.evenOdd = function () {
        this.isEvenOdd = true;
        return this;
    };
    ClipAction.prototype.prepareQualifiers = function () {
        var qualifierValue;
        if (typeof this.path === 'string') {
            qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(['name', this.path]).setDelimiter(':');
        }
        else {
            qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(this.path);
        }
        //handles flag
        if (this.isEvenOdd) {
            this.addFlag(qualifiers_flag.clipEvenOdd());
        }
        else {
            this.addFlag(qualifiers_flag.clip());
        }
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('pg', qualifierValue));
        return this;
    };
    return ClipAction;
}(internal_Action.Action));

exports.ClipAction = ClipAction;
