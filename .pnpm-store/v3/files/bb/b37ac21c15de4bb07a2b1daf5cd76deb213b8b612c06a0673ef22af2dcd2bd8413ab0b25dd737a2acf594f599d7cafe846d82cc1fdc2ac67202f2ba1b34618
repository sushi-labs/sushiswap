'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var qualifiers_flag = require('../../qualifiers/flag.cjs');
var actions_delivery_DeliveryAction = require('./DeliveryAction.cjs');
var qualifiers_progressive = require('../../qualifiers/progressive.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/qualifier/Qualifier.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');
require('../../internal/Action.cjs');
require('../../internal/utils/dataStructureUtils.cjs');
require('../../internal/models/ActionModel.cjs');
require('../../internal/models/actionToJson.cjs');
require('../../qualifiers/format/FormatQualifier.cjs');
require('../../internal/internalConstants.cjs');
require('../../internal/utils/objectFlip.cjs');

/**
 * @memberOf Actions.Delivery
 * @extends {Actions.Delivery.DeliveryAction}
 * @see Visit {@link Actions.Delivery|Delivery} for an example
 */
var DeliveryFormatAction = /** @class */ (function (_super) {
    tslib_es6.__extends(DeliveryFormatAction, _super);
    function DeliveryFormatAction(deliveryKey, deliveryType) {
        return _super.call(this, deliveryKey, deliveryType, 'formatType') || this;
    }
    /**
     * @description Uses lossy compression when delivering animated GIF files.
     * @return {this}
     */
    DeliveryFormatAction.prototype.lossy = function () {
        this._actionModel.lossy = true;
        this.addFlag(qualifiers_flag.lossy());
        return this;
    };
    /**
     * @description Uses progressive compression when delivering JPG file format.
     * @return {this}
     */
    DeliveryFormatAction.prototype.progressive = function (mode) {
        if (mode instanceof qualifiers_progressive.ProgressiveQualifier) {
            this._actionModel.progressive = { mode: mode.getFlagValue() };
            this.addFlag(mode);
        }
        else {
            this._actionModel.progressive = { mode: mode };
            this.addFlag(qualifiers_flag.progressive(mode));
        }
        return this;
    };
    /**
     * @description Ensures that images with a transparency channel are delivered in PNG format.
     */
    DeliveryFormatAction.prototype.preserveTransparency = function () {
        this._actionModel.preserveTransparency = true;
        this.addFlag(qualifiers_flag.preserveTransparency());
        return this;
    };
    DeliveryFormatAction.fromJson = function (actionModel) {
        var _a = actionModel, formatType = _a.formatType, lossy = _a.lossy, progressive = _a.progressive, preserveTransparency = _a.preserveTransparency;
        var result;
        if (formatType) {
            result = new this('f', formatType);
        }
        else {
            result = new this('f');
        }
        if (progressive) {
            if (progressive.mode) {
                result.progressive(progressive.mode);
            }
            else {
                result.progressive();
            }
        }
        lossy && result.lossy();
        preserveTransparency && result.preserveTransparency();
        return result;
    };
    return DeliveryFormatAction;
}(actions_delivery_DeliveryAction.DeliveryAction));

exports.DeliveryFormatAction = DeliveryFormatAction;
