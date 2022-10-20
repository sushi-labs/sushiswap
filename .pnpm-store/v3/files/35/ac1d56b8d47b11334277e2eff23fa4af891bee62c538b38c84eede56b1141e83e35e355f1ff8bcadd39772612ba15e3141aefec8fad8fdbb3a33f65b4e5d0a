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
 * @description Represents an embedded smart object in a Photoshop document.
 * </br><b>Learn more:</b> {@link https://cloudinary.com/documentation/paged_and_layered_media#extract_the_original_content_of_an_embedded_object|Extract the original content of an embedded Photoshop object}
 * @extends SDK.Action
 * @memberOf Actions.PSDTools
 * @see Visit {@link Actions.PSDTools| PSDTools} for an example
 */
var SmartObjectAction = /** @class */ (function (_super) {
    tslib_es6.__extends(SmartObjectAction, _super);
    function SmartObjectAction() {
        var _this = _super.call(this) || this;
        _this.qualifierValue = new internal_qualifier_QualifierValue.QualifierValue();
        _this.useName = false;
        _this.qualifierValue.delimiter = ';';
        return _this;
    }
    /**
     * @description Creates a new instance using the specified number.
     * @param index The number.
     */
    SmartObjectAction.prototype.byIndex = function (index) {
        this.smartObjectValue = index;
        this.qualifierValue.addValue(index);
        return this;
    };
    /**
     * @description Creates an instance using the name.
     * @param {string} layerName The name of the layer
     */
    SmartObjectAction.prototype.byLayerName = function (layerName) {
        this.useName = true;
        this.qualifierValue.addValue(layerName);
        return this;
    };
    SmartObjectAction.prototype.prepareQualifiers = function () {
        var qualifierValue;
        if (this.useName) {
            qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(['embedded:name', this.qualifierValue]);
        }
        else {
            qualifierValue = new internal_qualifier_QualifierValue.QualifierValue(['embedded', this.qualifierValue]);
        }
        this.addQualifier(new internal_qualifier_Qualifier.Qualifier('pg', qualifierValue));
    };
    return SmartObjectAction;
}(internal_Action.Action));

exports.SmartObjectAction = SmartObjectAction;
