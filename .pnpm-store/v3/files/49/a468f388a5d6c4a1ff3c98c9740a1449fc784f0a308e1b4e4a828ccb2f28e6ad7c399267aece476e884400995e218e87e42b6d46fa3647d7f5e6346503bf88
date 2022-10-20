import { IActionModel } from "./IActionModel.js";
export interface IVolumeByDecibelsModel {
    mode: 'decibels';
    value: number;
}
export interface IVolumeByPercentModel {
    mode: 'percent';
    value: number;
}
export interface IVolumeMuteModel {
    mode: 'mute';
}
export declare type IVolumeValueModel = IVolumeByDecibelsModel | IVolumeByPercentModel | IVolumeMuteModel;
export interface IVolumeActionModel extends IActionModel {
    volumeValue: IVolumeValueModel;
}
