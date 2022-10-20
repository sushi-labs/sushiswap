'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var qualifiers_source_BaseSource = require('../BaseSource.cjs');
require('../../../internal/models/QualifierModel.cjs');
require('../../../internal/models/qualifierToJson.cjs');
require('../../../internal/utils/unsupportedError.cjs');

/**
 * @memberOf Qualifiers.Source
 * @extends {Qualifiers.Source.BaseSource}
 * @description Defines how to manipulate an image layer
 * <div class="panel panel-warning">
 *   <div class="panel-heading">Notice</div>
 *   <div class="panel-body">
 *     This class is used as a Qualifier for the asset.overlay() and asset.underlay() methods.</br>
 *     You can find regular images and videos transformations below:
 *   </div>
 *   <ul>
 *     <li>{@link SDK.ImageTransformation| Image Transformations}</li>
 *     <li>{@link SDK.VideoTransformation| Video Transformations}
 *   </ul>
 * </div>
 */
var ImageSource = /** @class */ (function (_super) {
    tslib_es6.__extends(ImageSource, _super);
    function ImageSource(publicID) {
        var _this = _super.call(this) || this;
        _this._publicID = publicID;
        _this._qualifierModel = {
            publicId: publicID,
            sourceType: 'image'
        };
        return _this;
    }
    /**
     * @description
     * Returns the opening string of the layer,
     * This method is used internally within {@link SDK.LayerAction|LayerAction}
     * @returns {string}
     */
    ImageSource.prototype.getOpenSourceString = function (layerType) {
        var encodedPublicID = this.encodeAssetPublicID(this._publicID);
        if (this._format) {
            return layerType + "_" + encodedPublicID + "." + this._format.toString();
        }
        else {
            return layerType + "_" + encodedPublicID;
        }
    };
    /**
     * @description
     * Apply a format for the image source of the layer
     * @param {FormatQualifier} format A to apply to the layered image, see more {@link Qualifiers.Format|here}
     * @returns {this}
     */
    ImageSource.prototype.format = function (format) {
        this._format = format;
        return this;
    };
    ImageSource.prototype.toJson = function () {
        var result = _super.prototype.toJson.call(this);
        if (result.publicId && this._format) {
            result.publicId = result.publicId + "." + this._format.toString();
        }
        return result;
    };
    ImageSource.fromJson = function (qualifierModel, transformationFromJson) {
        var publicId = qualifierModel.publicId, transformation = qualifierModel.transformation;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [qualifierModel])
        // This allows the inheriting classes to determine the class to be created
        // @ts-ignore
        var result = new this(publicId);
        if (transformation) {
            result.transformation(transformationFromJson(transformation));
        }
        return result;
    };
    return ImageSource;
}(qualifiers_source_BaseSource.BaseSource));

exports.ImageSource = ImageSource;
