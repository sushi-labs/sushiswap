'use strict';

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var internal_internalConstants = require('../internal/internalConstants.cjs');
var config_BaseConfig = require('./BaseConfig.cjs');
require('../internal/utils/objectFlip.cjs');

var CloudConfig = /** @class */ (function (_super) {
    tslib_es6.__extends(CloudConfig, _super);
    /**
     * @param {ICloudConfig} userCloudConfig {@link ICloudConfig}
     *
     */
    function CloudConfig(userCloudConfig) {
        var _this = _super.call(this) || this;
        var cloudConfig = _this.filterOutNonSupportedKeys(userCloudConfig, internal_internalConstants.ALLOWED_CLOUD_CONFIG);
        Object.assign(_this, cloudConfig);
        if (!_this.cloudName) {
            throw 'Missing mandatory field cloudName';
        }
        return _this;
    }
    CloudConfig.prototype.extend = function (userCloudConfig) {
        var cloudConfig = this.filterOutNonSupportedKeys(userCloudConfig, internal_internalConstants.ALLOWED_CLOUD_CONFIG);
        return new CloudConfig(Object.assign({}, this, cloudConfig));
    };
    /**
     * @param {string} value Sets the CloudName
     */
    CloudConfig.prototype.setCloudName = function (value) {
        this.cloudName = value;
        return this;
    };
    /**
     * @param {string} value Sets the API Key
     */
    CloudConfig.prototype.setApiKey = function (value) {
        this.apiKey = value;
        return this;
    };
    /**
     * @param {string} value Sets the API Secret
     */
    CloudConfig.prototype.setApiSecret = function (value) {
        this.apiSecret = value;
        return this;
    };
    return CloudConfig;
}(config_BaseConfig));

module.exports = CloudConfig;
