'use strict';

var tslib_es6 = require('../tslib.es6-f1398b83.cjs');
var config_BaseConfig = require('./BaseConfig.cjs');
var internal_internalConstants = require('../internal/internalConstants.cjs');
require('../internal/utils/objectFlip.cjs');

var URLConfig = /** @class */ (function (_super) {
    tslib_es6.__extends(URLConfig, _super);
    /**
     * @param {IURLConfig} userURLConfig
     */
    function URLConfig(userURLConfig) {
        var _this = _super.call(this) || this;
        var urlConfig = _this.filterOutNonSupportedKeys(userURLConfig, internal_internalConstants.ALLOWED_URL_CONFIG);
        Object.assign(_this, {
            secure: true
        }, urlConfig);
        return _this;
    }
    URLConfig.prototype.extend = function (userURLConfig) {
        var urlConfig = this.filterOutNonSupportedKeys(userURLConfig, internal_internalConstants.ALLOWED_URL_CONFIG);
        return new URLConfig(Object.assign({}, this, urlConfig));
    };
    /**
     * @param {string} value Sets the cname
     */
    URLConfig.prototype.setCname = function (value) {
        this.cname = value;
        return this;
    };
    /**
     * @param {string} value Sets the secureDistribution
     */
    URLConfig.prototype.setSecureDistribution = function (value) {
        this.secureDistribution = value;
        return this;
    };
    /**
     * @param {boolean} value Sets whether to use a private CDN (Removes cloudName from URL)
     */
    URLConfig.prototype.setPrivateCdn = function (value) {
        this.privateCdn = value;
        return this;
    };
    /**
     * @param value Sets whether or not to sign the URL
     */
    URLConfig.prototype.setSignUrl = function (value) {
        this.signUrl = value;
        return this;
    };
    /**
     * @param value Sets whether or not to use a long signature
     */
    URLConfig.prototype.setLongUrlSignature = function (value) {
        this.longUrlSignature = value;
        return this;
    };
    /**
     * @param value Sets whether or not to shorten the URL
     */
    URLConfig.prototype.setShorten = function (value) {
        this.shorten = value;
        return this;
    };
    /**
     * @param value Sets whether or not to use a root path
     */
    URLConfig.prototype.setUseRootPath = function (value) {
        this.useRootPath = value;
        return this;
    };
    /**
     * @param value Sets whether or not to deliver the asset through https
     */
    URLConfig.prototype.setSecure = function (value) {
        this.secure = value;
        return this;
    };
    /**
     * @param value Sets whether to force a version in the URL
     */
    URLConfig.prototype.setForceVersion = function (value) {
        this.forceVersion = value;
        return this;
    };
    return URLConfig;
}(config_BaseConfig));

module.exports = URLConfig;
