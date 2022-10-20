import { Qualifier } from "../../internal/qualifier/Qualifier.js";
/**
 * @description A VideoCodec class, this class has no methods, and just sets the codec type (vp9, vp8, etc.)
 * @memberOf Qualifiers.VideoCodec
 */
declare class VideoCodecType extends Qualifier {
    private _type;
    constructor(type: string);
    getType(): string;
}
/**
 * @description An Advanced VideoCodec class with Profile and Level methods
 * @memberOf Qualifiers.VideoCodec
 */
declare class AdvVideoCodecType extends Qualifier {
    private _prof;
    private _lvl;
    private readonly _type;
    constructor(type: string);
    getType(): string;
    /**
     * @description Specifies the profile to use with the h264 codec.
     * @param {Qualifiers.VideoCodecProfile | string} profile Sets the profile of the video codec
     * @example new AdvVideoCodecType('h264').profile(VideoCodecProfile.baseline())
     * @return this;
     */
    profile(profile: string): this;
    getProfile(): string;
    /**
     * @description Specifies the level to use with the h264 codec and specified profile.
     * @param {Qualifiers.VideoCodecLevel | number | string} lvl
     * @example new AdvVideoCodecType('h264').profile(VideoCodecLevel.baseline())
     * @return this;
     */
    level(lvl: number | string): this;
    getLevel(): number | string;
    /**
     * @description returns a toString representation of this qualifier
     * @return string;
     */
    toString(): string;
}
export { VideoCodecType, AdvVideoCodecType };
