'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var qualifiers_source_BaseSource = require('../BaseSource.cjs');
var qualifiers_format_FormatQualifier = require('../../format/FormatQualifier.cjs');
var internal_utils_base64Encode = require('../../../internal/utils/base64Encode.cjs');
require('../../../internal/models/QualifierModel.cjs');
require('../../../internal/models/qualifierToJson.cjs');
require('../../../internal/utils/unsupportedError.cjs');
require('../../../internal/qualifier/QualifierValue.cjs');

/**
 * @memberOf Qualifiers.Source
 * @extends {Qualifiers.Source.BaseSource}
 * @description Defines how to manipulate a Fetch layer
 * <div class="panel panel-warning">
 *   <div class="panel-heading">Notice</div>
 *   <div class="panel-body">
 *     This class is used as a Qualifier for the asset.overlay() and asset.underlay() methods.</br>
 *     You can find regular images and videos transformations below:
 *   </div>
  *   <ul>
 *     <li>{@link SDK.ImageTransformation| Image Transformations}</li>
 *     <li>{@link SDK.VideoTransformation| Video Transformations}</li>
 *   </ul>
 * </div>
 *
 * {@link https://cloudinary.com/documentation/fetch_remote_images|Learn more about fetching from a remote URL}
 */
var FetchSource = /** @class */ (function (_super) {
    tslib_es6.__extends(FetchSource, _super);
    function FetchSource(remoteURL) {
        var _this = _super.call(this) || this;
        _this._qualifierModel = {
            sourceType: 'fetch',
            url: remoteURL
        };
        _this._remoteURL = remoteURL;
        return _this;
    }
    /**
     * @description
     * Returns the opening string of the layer,
     * This method is used internally within {@link SDK.LayerAction|LayerAction}
     * @returns {string}
     */
    FetchSource.prototype.getOpenSourceString = function (layerType) {
        if (this._format) {
            return layerType + "_fetch:" + internal_utils_base64Encode.base64Encode(this._remoteURL) + "." + this._format.toString();
        }
        else {
            return layerType + "_fetch:" + internal_utils_base64Encode.base64Encode(this._remoteURL);
        }
    };
    /**
     * @description
     * Apply a format for the image source of the layer
     * @param {FormatQualifier} format A to apply to the layered image, see more {@link Qualifiers.Format|here}
     * @returns {this}
     */
    FetchSource.prototype.format = function (format) {
        this._qualifierModel.format = format.toString();
        this._format = format;
        return this;
    };
    FetchSource.fromJson = function (qualifierModel, transformationFromJson) {
        var url = qualifierModel.url, transformation = qualifierModel.transformation, format = qualifierModel.format;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [qualifierModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(url);
        if (transformation) {
            result.transformation(transformationFromJson(transformation));
        }
        if (format) {
            result.format(new qualifiers_format_FormatQualifier.FormatQualifier(format));
        }
        return result;
    };
    return FetchSource;
}(qualifiers_source_BaseSource.BaseSource));

exports.FetchSource = FetchSource;
