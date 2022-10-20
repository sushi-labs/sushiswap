'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_models_QualifierModel = require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');

/**
 * @memberOf Qualifiers.Source
 * @extends {QualifierModel}
 * @description An abstract class extended by all Source objects
 */
var BaseSource = /** @class */ (function (_super) {
    tslib_es6.__extends(BaseSource, _super);
    function BaseSource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @description Utility function to encode an asset publicID in an overlay
     * @protected
     * @example
     * encodeAssetPublicID('foo/bar'); // -> foo:bar
     */
    BaseSource.prototype.encodeAssetPublicID = function (publicID) {
        return publicID.replace(/\//g, ':');
    };
    /**
     * @description
     * Apply a transformation on the image source of the layer
     * @param {SDK.ImageTransformation} t An image transformation to apply to the layer
     * @returns {this}
     */
    BaseSource.prototype.transformation = function (t) {
        this._qualifierModel.transformation = t.toJson();
        this._transformation = t;
        return this;
    };
    /**
     * @description Returns the Transformation of the source
     * @return {SDK.Transformation}
     */
    BaseSource.prototype.getTransformation = function () {
        return this._transformation;
    };
    return BaseSource;
}(internal_models_QualifierModel.QualifierModel));

exports.BaseSource = BaseSource;
