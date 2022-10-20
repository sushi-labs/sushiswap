'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../tslib.es6-f1398b83.cjs');
var internal_qualifier_Qualifier = require('../../internal/qualifier/Qualifier.cjs');
require('../../internal/qualifier/QualifierValue.cjs');
require('../../internal/models/QualifierModel.cjs');
require('../../internal/models/qualifierToJson.cjs');
require('../../internal/utils/unsupportedError.cjs');

/**
 * @description A VideoCodec class, this class has no methods, and just sets the codec type (vp9, vp8, etc.)
 * @memberOf Qualifiers.VideoCodec
 */
var VideoCodecType = /** @class */ (function (_super) {
    tslib_es6.__extends(VideoCodecType, _super);
    function VideoCodecType(type) {
        var _this = _super.call(this, 'vc') || this;
        _this._type = type;
        _this.addValue(type);
        return _this;
    }
    VideoCodecType.prototype.getType = function () {
        return this._type;
    };
    return VideoCodecType;
}(internal_qualifier_Qualifier.Qualifier));
/**
 * @description An Advanced VideoCodec class with Profile and Level methods
 * @memberOf Qualifiers.VideoCodec
 */
var AdvVideoCodecType = /** @class */ (function (_super) {
    tslib_es6.__extends(AdvVideoCodecType, _super);
    function AdvVideoCodecType(type) {
        var _this = _super.call(this, 'vc') || this;
        _this._type = type;
        return _this;
    }
    AdvVideoCodecType.prototype.getType = function () {
        return this._type;
    };
    /**
     * @description Specifies the profile to use with the h264 codec.
     * @param {Qualifiers.VideoCodecProfile | string} profile Sets the profile of the video codec
     * @example new AdvVideoCodecType('h264').profile(VideoCodecProfile.baseline())
     * @return this;
     */
    AdvVideoCodecType.prototype.profile = function (profile) {
        this._prof = profile;
        return this;
    };
    AdvVideoCodecType.prototype.getProfile = function () {
        return this._prof;
    };
    /**
     * @description Specifies the level to use with the h264 codec and specified profile.
     * @param {Qualifiers.VideoCodecLevel | number | string} lvl
     * @example new AdvVideoCodecType('h264').profile(VideoCodecLevel.baseline())
     * @return this;
     */
    AdvVideoCodecType.prototype.level = function (lvl) {
        this._lvl = lvl;
        return this;
    };
    AdvVideoCodecType.prototype.getLevel = function () {
        return this._lvl;
    };
    /**
     * @description returns a toString representation of this qualifier
     * @return string;
     */
    AdvVideoCodecType.prototype.toString = function () {
        return "vc_" + this._type + ":" + this._prof + ":" + this._lvl;
    };
    return AdvVideoCodecType;
}(internal_qualifier_Qualifier.Qualifier));

exports.AdvVideoCodecType = AdvVideoCodecType;
exports.VideoCodecType = VideoCodecType;
