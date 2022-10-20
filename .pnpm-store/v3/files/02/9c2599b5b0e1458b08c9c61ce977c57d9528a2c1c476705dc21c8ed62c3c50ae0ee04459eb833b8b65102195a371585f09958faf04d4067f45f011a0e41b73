'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_qualifier_QualifierValue = require('../../internal/qualifier/QualifierValue.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
var actions_delivery_DeliveryAction = require('./DeliveryAction.cjs');
var internal_internalConstants = require('../../internal/internalConstants.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/Action.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../qualifiers/format/FormatQualifier.cjs');
require('../../internal/utils/objectFlip.cjs');

/**
 * @description Controls the quality of the delivered image or video.
 * @memberOf Actions.Delivery
 * @extends {Actions.Delivery.DeliveryAction}
 * @see Visit {@link Actions.Delivery|Delivery} for an example
 */
var DeliveryQualityAction = /** @class */ (function (_super) {
    tslib_es6.__extends(DeliveryQualityAction, _super);
    /**
     * @param {Qualifiers.Quality} qualityValue a Quality value
     */
    function DeliveryQualityAction(qualityValue) {
        return _super.call(this, 'q', qualityValue.toString(), 'level') || this;
    }
    /**
     * Selet the Chroma sub sampling</br>
     * <b>Learn more</b>: {@link https://cloudinary.com/documentation/image_transformations#toggling_chroma_subsampling|Toggling chroma subsampling}
     * @param {420 | 444 | number} type The chroma sub sampling type
     */
    DeliveryQualityAction.prototype.chromaSubSampling = function (type) {
        this._actionModel.chromaSubSampling = internal_internalConstants.CHROMA_VALUE_TO_CHROMA_MODEL_ENUM[type];
        var qualityWithSubSampling = new internal_qualifier_QualifierValue.QualifierValue([this._actionModel.level, type]);
        qualityWithSubSampling.setDelimiter(':');
        // We either have chroma or quantization, but not both
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('q', qualityWithSubSampling));
    };
    /**
     * Controls the final quality by setting a maximum quantization percentage
     * @param {number} val
     */
    DeliveryQualityAction.prototype.quantization = function (val) {
        this._actionModel.quantization = val;
        var qualityWithQuantization = new internal_qualifier_QualifierValue.QualifierValue([this._actionModel.level, "qmax_" + val]).setDelimiter(':');
        // We either have chroma or quantization, but not both
        return this.addQualifier(new internal_qualifier_Qualifier.Qualifier('q', qualityWithQuantization));
    };
    DeliveryQualityAction.fromJson = function (actionModel) {
        var _a = actionModel, level = _a.level, chromaSubSampling = _a.chromaSubSampling, quantization = _a.quantization;
        var levelType = internal_internalConstants.ACTION_TYPE_TO_QUALITY_MODE_MAP[level] || level;
        var result = new this(levelType);
        if (chromaSubSampling) {
            //Turn strings like 'CHROMA_420' to 420
            var chromaValue = internal_internalConstants.CHROMA_MODEL_ENUM_TO_CHROMA_VALUE[chromaSubSampling.toUpperCase()];
            chromaValue && result.chromaSubSampling(+chromaValue);
        }
        quantization && result.quantization(quantization);
        return result;
    };
    return DeliveryQualityAction;
}(actions_delivery_DeliveryAction.DeliveryAction));

exports.DeliveryQualityAction = DeliveryQualityAction;
