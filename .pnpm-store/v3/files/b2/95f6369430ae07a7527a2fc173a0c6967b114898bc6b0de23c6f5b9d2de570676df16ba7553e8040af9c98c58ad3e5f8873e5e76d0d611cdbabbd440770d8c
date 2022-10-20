'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var qualifiers_source_BaseSource = require('../BaseSource.cjs');
var qualifiers_textStyle = require('../../textStyle.cjs');
var internal_utils_serializeCloudinaryCharacters = require('../../../internal/utils/serializeCloudinaryCharacters.cjs');
var internal_Action = require('../../../internal/Action.cjs');
var internal_qualifier_Qualifier = require('../../../internal/qualifier/Qualifier.cjs');
var internal_utils_prepareColor = require('../../../internal/utils/prepareColor.cjs');
require('../../../internal/models/QualifierModel.cjs');
require('../../../internal/models/qualifierToJson.cjs');
require('../../../internal/utils/unsupportedError.cjs');
require('../../fontWeight.cjs');
require('../../fontStyle.cjs');
require('../../textDecoration.cjs');
require('../../textStroke.cjs');
require('../../../internal/models/IStrokeModel.cjs');
require('../../flag/FlagQualifier.cjs');
require('../../../internal/qualifier/QualifierValue.cjs');
require('../../../internal/utils/dataStructureUtils.cjs');
require('../../../internal/models/ActionModel.cjs');
require('../../../internal/models/actionToJson.cjs');

/**
 * @memberOf Qualifiers.Source
 * @extends {Qualifiers.Source.BaseSource}
 * @description Defines the common interface for all text-based sources
 */
var BaseTextSource = /** @class */ (function (_super) {
    tslib_es6.__extends(BaseTextSource, _super);
    function BaseTextSource(text, textStyle) {
        var _this = _super.call(this) || this;
        _this.type = 'text';
        _this.text = text;
        _this._textStyle = textStyle;
        _this._qualifierModel.sourceType = 'text';
        _this._qualifierModel.text = text;
        if (textStyle instanceof qualifiers_textStyle.TextStyle) {
            _this._qualifierModel.textStyle = textStyle.toJson();
        }
        return _this;
    }
    BaseTextSource.prototype.encodeText = function (text) {
        return internal_utils_serializeCloudinaryCharacters.serializeCloudinaryCharacters(text);
    };
    BaseTextSource.prototype.textColor = function (color) {
        this._textColor = color;
        this._qualifierModel.textColor = color;
        return this;
    };
    BaseTextSource.prototype.backgroundColor = function (bgColor) {
        this._backgroundColor = bgColor;
        this._qualifierModel.backgroundColor = bgColor;
        return this;
    };
    BaseTextSource.prototype.textFit = function (textFit) {
        this._textFit = textFit;
        return this;
    };
    /**
     * @description
     * Returns the opening string of the layer,
     * This method is used internally within {@link SDK.LayerAction|LayerAction}
     * @returns {string}
     */
    BaseTextSource.prototype.getOpenSourceString = function (layerType) {
        var layerParam = [
            this.type,
            this._textStyle && this._textStyle.toString(),
            this.encodeText(this.text)
        ].filter(function (a) { return a; }).join(':');
        var tmpAction = new internal_Action.Action();
        tmpAction.addQualifier(new internal_qualifier_Qualifier.Qualifier(layerType, layerParam));
        this._textColor && tmpAction.addQualifier(new internal_qualifier_Qualifier.Qualifier('co', internal_utils_prepareColor.prepareColor(this._textColor)));
        this._backgroundColor && tmpAction.addQualifier(new internal_qualifier_Qualifier.Qualifier('b', internal_utils_prepareColor.prepareColor(this._backgroundColor)));
        this._textFit && tmpAction.addQualifier(this._textFit);
        return tmpAction.toString();
    };
    return BaseTextSource;
}(qualifiers_source_BaseSource.BaseSource));

exports.BaseTextSource = BaseTextSource;
