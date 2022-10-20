import { IActionModel } from "./IActionModel.js";
interface IKeyframeIntervalsActionModel extends IActionModel {
    interval?: number | string;
}
interface IFPSActionModel extends IActionModel {
    fps?: number;
}
interface IFPSRangeActionModel extends IActionModel {
    fps?: {
        from: number;
        to?: number;
    };
}
interface IBitRateActionModel extends IActionModel {
    bitRate?: number | string;
    constant?: boolean;
}
interface IAudioCodecActionModel extends IActionModel {
    audioCodec?: string;
}
interface IAudioFrequencyActionModel extends IActionModel {
    audioFrequencyType?: string;
}
interface IStreamingProfileActionModel extends IActionModel {
    profile?: string;
}
interface IToAnimatedActionModel extends IActionModel {
    animatedFormat?: string;
    sampling?: string | number;
    delay?: number;
}
interface IVideoCodecActionModel extends IActionModel {
    videoCodec?: {
        videoCodecName?: string;
        profile?: string;
        level?: string | number;
    };
}
export { IKeyframeIntervalsActionModel, IFPSActionModel, IFPSRangeActionModel, IBitRateActionModel, IAudioCodecActionModel, IAudioFrequencyActionModel, IStreamingProfileActionModel, IToAnimatedActionModel, IVideoCodecActionModel };
