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
 * @description Defines how to manipulate a video layer, is an instance of a {@link VideoTransformation|VideoTransformation}
 * <div class="panel panel-primary">
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
var VideoSource = /** @class */ (function (_super) {
    tslib_es6.__extends(VideoSource, _super);
    function VideoSource(publicID) {
        var _this = _super.call(this) || this;
        _this._publicID = publicID;
        _this._qualifierModel = {
            publicId: publicID,
            sourceType: 'video'
        };
        return _this;
    }
    /**
     * @description
     * Returns the opening string of the layer,
     * This method is used internally within {@link SDK.LayerAction|LayerAction}
     * @returns {string}
     */
    VideoSource.prototype.getOpenSourceString = function (layerType) {
        var encodedPublicID = this.encodeAssetPublicID(this._publicID);
        return layerType + "_video:" + encodedPublicID;
    };
    VideoSource.fromJson = function (qualifierModel, transformationFromJson) {
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
    return VideoSource;
}(qualifiers_source_BaseSource.BaseSource));

exports.VideoSource = VideoSource;
