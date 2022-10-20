'use strict';

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var backwards_legacyLayer_layer = require('./layer.cjs');
var internal_utils_dataStructureUtils = require('../../internal/utils/dataStructureUtils.cjs');
var internal_utils_base64Encode = require('../../internal/utils/base64Encode.cjs');
require('../utils/snakeCase.cjs');

var FetchLayer = /** @class */ (function (_super) {
    tslib_es6.__extends(FetchLayer, _super);
    /**
     * @class FetchLayer
     * @classdesc Creates an image layer using a remote URL.
     * @param {Object|string} options - layer parameters or a url
     * @param {string} options.url the url of the image to fetch
     */
    function FetchLayer(options) {
        var _this = _super.call(this, options) || this;
        if (internal_utils_dataStructureUtils.isString(options)) {
            _this.options.url = options;
        }
        else if (options != null ? options.url : void 0) {
            _this.options.url = options.url;
        }
        return _this;
    }
    FetchLayer.prototype.url = function (url) {
        this.options.url = url;
        return this;
    };
    /**
     * generate the string representation of the layer
     * @function FetchLayer#toString
     * @return {String}
     */
    FetchLayer.prototype.toString = function () {
        return "fetch:" + internal_utils_base64Encode.base64Encode(this.options.url);
    };
    return FetchLayer;
}(backwards_legacyLayer_layer));

module.exports = FetchLayer;
