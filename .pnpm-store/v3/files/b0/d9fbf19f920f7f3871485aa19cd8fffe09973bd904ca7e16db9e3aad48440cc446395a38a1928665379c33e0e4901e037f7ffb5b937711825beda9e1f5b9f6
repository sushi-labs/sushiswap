'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
 * @description Represents a layer in a Photoshop document.
 * </br><b>Learn more:</b> {@link https://cloudinary.com/documentation/paged_and_layered_media#deliver_selected_layers_of_a_psd_image|Deliver selected layers of a PSD image}
 * @extends SDK.Action
 * @memberOf Actions.PSDTools
 * @see Visit {@link Actions.PSDTools| PSDTools} for an example
 */
var GetLayerAction = /** @class */ (function (_super) {
    tslib_es6.__extends(GetLayerAction, _super);
    function GetLayerAction() {
        var _this = _super.call(this) || this;
        _this.qualifierValue = new internal_qualifier_QualifierValue.QualifierValue();
        _this.qualifierValue.delimiter = ';';
        return _this;
    }
    /**
     * @description deliver an image containing only specified layer of a Photoshop image from The layer index
     * @param {string|number} from the index of the layer
     */
    GetLayerAction.prototype.byIndex = function (from) {
        this.qualifierValue.addValue(from);
        return this;
    };
    /**
     * @description deliver an image containing only specified range of layers of a Photoshop image
     * @param {string|number} from The layer number
     * @param {string|number} to The layer number
     */
    GetLayerAction.prototype.byRange = function (from, to) {
        var range = new internal_qualifier_QualifierValue.QualifierValue(from);
        range.addValue(to);
        range.delimiter = '-';
        this.qualifierValue.addValue(range);
        return this;
    };
    /**
     * @description deliver an image containing only specified layer by name of a Photoshop image
     * @param {string|number} name The layer by name
     */
    GetLayerAction.prototype.byName = function (name) {
        this.name = name;
        this.qualifierValue.addValue(name);
        return this;
    };
    GetLayerAction.prototype.prepareQualifiers = function () {
        var qualifierValue = this.qualifierValue;
        if (this.name) {
            qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(['name', this.qualifierValue]).setDelimiter(':');
        }
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('pg', qualifierValue));
        return this;
    };
    return GetLayerAction;
}(internal_Action.Action));

exports.GetLayerAction = GetLayerAction;
