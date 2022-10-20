import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @description A VideoCodec class, this class has no methods, and just sets the codec type (vp9, vp8, etc.)
 * @memberOf Qualifiers.VideoCodec
 */
class VideoCodecType extends Qualifier {
    constructor(type) {
        super('vc');
        this._type = type;
        this.addValue(type);
    }
    getType() {
        return this._type;
    }
}
/**
 * @description An Advanced VideoCodec class with Profile and Level methods
 * @memberOf Qualifiers.VideoCodec
 */
class AdvVideoCodecType extends Qualifier {
    constructor(type) {
        super('vc');
        this._type = type;
    }
    getType() {
        return this._type;
    }
    /**
     * @description Specifies the profile to use with the h264 codec.
     * @param {Qualifiers.VideoCodecProfile | string} profile Sets the profile of the video codec
     * @example new AdvVideoCodecType('h264').profile(VideoCodecProfile.baseline())
     * @return this;
     */
    profile(profile) {
        this._prof = profile;
        return this;
    }
    getProfile() {
        return this._prof;
    }
    /**
     * @description Specifies the level to use with the h264 codec and specified profile.
     * @param {Qualifiers.VideoCodecLevel | number | string} lvl
     * @example new AdvVideoCodecType('h264').profile(VideoCodecLevel.baseline())
     * @return this;
     */
    level(lvl) {
        this._lvl = lvl;
        return this;
    }
    getLevel() {
        return this._lvl;
    }
    /**
     * @description returns a toString representation of this qualifier
     * @return string;
     */
    toString() {
        return `vc_${this._type}:${this._prof}:${this._lvl}`;
    }
}
export { VideoCodecType, AdvVideoCodecType };
