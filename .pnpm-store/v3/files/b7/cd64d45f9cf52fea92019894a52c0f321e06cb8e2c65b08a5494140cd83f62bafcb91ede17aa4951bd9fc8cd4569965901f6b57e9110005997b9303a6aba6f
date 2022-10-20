'use strict';

var config_CloudConfig = require('./CloudConfig.cjs');
var config_URLConfig = require('./URLConfig.cjs');
require('../tslib.es6-f1398b83.cjs');
require('../internal/internalConstants.cjs');
require('../internal/utils/objectFlip.cjs');
require('./BaseConfig.cjs');

var CloudinaryConfig = /** @class */ (function () {
    function CloudinaryConfig(configurations) {
        if (configurations === void 0) { configurations = {}; }
        this.cloud = new config_CloudConfig(configurations.cloud);
        this.url = new config_URLConfig(configurations.url || {});
    }
    /**
     * @description Setter for the cloudConfig
     * @param {ICloudConfig} cld
     */
    CloudinaryConfig.prototype.setCloudConfig = function (cld) {
        this.cloud = new config_CloudConfig(cld);
        return this;
    };
    /**
     * @description Setter for the urlConfig
     * @param {IURLConfig} url
     */
    CloudinaryConfig.prototype.setURLConfig = function (url) {
        this.url = new config_URLConfig(url);
        return this;
    };
    CloudinaryConfig.prototype.extend = function (configurations) {
        this.cloud = this.cloud.extend(configurations.cloud || {});
        this.url = this.url.extend(configurations.url || {});
        return this;
    };
    return CloudinaryConfig;
}());

module.exports = CloudinaryConfig;
