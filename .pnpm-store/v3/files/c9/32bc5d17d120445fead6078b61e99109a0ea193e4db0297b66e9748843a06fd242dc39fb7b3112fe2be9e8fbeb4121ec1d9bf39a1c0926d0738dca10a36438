import { IActionModel } from "./IActionModel.js";
declare type ColorSpaceModeType = "srgb" | "srgbTrueColor" | "tinySrgb" | "cmyk" | "noCmyk" | "keepCmyk";
interface IDeliveryColorSpaceActionModel extends IActionModel {
    mode?: ColorSpaceModeType;
}
interface IDprModel extends IActionModel {
    "dpr"?: number | string;
}
interface IDensityModel extends IActionModel {
    "density": number | string;
}
interface IDefaultImageModel extends IActionModel {
    "publicId": string;
}
interface IDeliveryColorSpaceFromICCActionModel extends IActionModel {
    publicId?: string;
}
interface IDeliveryFormatModel extends IActionModel {
    "formatType"?: string | number;
    "lossy"?: boolean;
    "progressive"?: {
        "mode"?: string;
    };
    "preserveTransparency"?: boolean;
}
interface IDeliveryQualityModel extends IActionModel {
    "level"?: string | number;
    "chromaSubSampling"?: string;
    "quantization"?: number;
}
export { ColorSpaceModeType, IDeliveryColorSpaceActionModel, IDprModel, IDensityModel, IDefaultImageModel, IDeliveryColorSpaceFromICCActionModel, IDeliveryFormatModel, IDeliveryQualityModel };
