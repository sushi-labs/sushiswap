/**
 * @description Defines transformations for delivering your assets without changing the visual or audio experience for the end user.
 * @memberOf Actions
 * @namespace Delivery
 * @example
 * See the examples under every method
 */
import { DeliveryFormatAction } from "./delivery/DeliveryFormatAction.js";
import { DeliveryQualityAction } from "./delivery/DeliveryQualityAction.js";
import { FormatQualifier } from "../qualifiers/format/FormatQualifier.js";
import { DeliveryColorSpaceFromICCAction } from "./delivery/DeliveryColorSpaceFromICCAction.js";
import { DeliveryAction } from "./delivery/DeliveryAction.js";
import { ColorSpaceType } from "../types/types.js";
import { QualityTypes } from "../types/types.js";
import { ImageFormatType, VideoFormatType } from "../types/types.js";
import { DeliveryColorSpaceAction } from "./delivery/DeliveryColorSpaceAction.js";
import { DeliveryDPRAction } from "./delivery/DeliveryDPRAction.js";
export declare type IDeliveryAction = DeliveryAction | DeliveryColorSpaceAction | DeliveryColorSpaceFromICCAction | DeliveryDPRAction;
/**
 * @summary action
 * @description Defines the format of the delivered asset.
 *
 * <b>Learn more:</b>
 * {@link https://cloudinary.com/documentation/image_transformations#image_format_support|Image formats}
 * {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#transcoding_video_to_other_formats|Video formats}
 *
 * @memberOf Actions.Delivery
 * @param {string} format The file format. For a list of supported format types see {@link Qualifiers.Format| format types} for
 * possible values
 * @return {Actions.Delivery.DeliveryFormat}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {format} from "@cloudinary/url-gen/actions/delivery";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.delivery(
 *  format('jpg'),
 * );
 *
 */
declare function format(format: FormatQualifier | ImageFormatType | VideoFormatType | string): DeliveryFormatAction;
/**
 * @summary action
 * @description Deliver the image in the specified device pixel ratio.
 * @memberOf Actions.Delivery
 * @param {string} dpr The DPR (Device Pixel Ratio). Any positive float value.
 * @return {Actions.Delivery.DeliveryAction}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {dpr} from "@cloudinary/url-gen/actions/delivery";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.delivery(
 *  dpr('2.0'),
 * );
 */
declare function dpr(dpr: string | number): DeliveryDPRAction;
/**
 * @summary action
 * @description Controls the quality of the delivered image or video.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_optimization#how_to_optimize_image_quality|Image quality}
 *  {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#quality_control|Video quality}
 * @memberOf Actions.Delivery
 * @param {QualityTypes | string | number | Qualifiers.Quality} qualityType For a list of supported quality types see
 * {@link Qualifiers.Quality| quality types} for
 * possible values.
 * @return {Actions.Delivery.DeliveryQualityAction}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {quality} from "@cloudinary/url-gen/actions/delivery";
 * import {quality} from "@cloudinary/url-gen/qualifiers/quantity";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.delivery(
 *  quality('auto'),
 * );
 */
declare function quality(qualityType: QualityTypes | string | number): DeliveryQualityAction;
/**
 * @summary action
 * @description Controls the density to use when delivering an image or when converting a vector file such as a PDF or EPS
 * document to a web image delivery format.
 * @memberOf Actions.Delivery
 * @param {number | string} value The density in dpi.
 * @return {Actions.Delivery.DeliveryAction}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {density} from "@cloudinary/url-gen/actions/delivery";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.delivery(
 *  density(150),
 * );
 */
declare function density(value: number): DeliveryAction;
/**
 * @summary action
 * @description Default images can be used in the case that a requested image does not exist.
 * @memberOf Actions.Delivery
 * @param {string} publicIdWithExtension Default image public ID
 * @return {Actions.Delivery.DeliveryAction}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {defaultImage} from "@cloudinary/url-gen/actions/delivery";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.delivery(
 *  defaultImage('sample'),
 * );
 */
declare function defaultImage(publicIdWithExtension: string): DeliveryAction;
/**
 * @summary action
 * @description Controls the color space used for the delivered image.
 * @memberOf Actions.Delivery
 * @param {string | Qualifiers.ColorSpace} mode The color space.
 * @return {Actions.Delivery.DeliveryAction}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {colorSpace} from "@cloudinary/url-gen/actions/delivery";
 * import {trueColor} from "@cloudinary/url-gen/qualifiers/colorSpace";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.delivery(
 *  colorSpace(trueColor()),
 * );
 */
declare function colorSpace(mode: ColorSpaceType): DeliveryColorSpaceAction;
/**
 * @summary action
 * @description Specifies the ICC profile to use for the color space.
 * The ICC file must be uploaded to your account as a raw, authenticated file.
 * @memberOf Actions.Delivery
 * @param {string} publicId The public ID (including the file extension) of the ICC profile that defines the
 * color space.
 * @return {Actions.Delivery.DeliveryColorSpaceFromICC}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {colorSpaceFromICC} from "@cloudinary/url-gen/actions/delivery";
 * import {trueColor} from "@cloudinary/url-gen/qualifiers/colorSpace";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.delivery(
 *  colorSpaceFromICC('sample.icc'),
 * );
 */
declare function colorSpaceFromICC(publicId: string): DeliveryColorSpaceFromICCAction;
declare const Delivery: {
    format: typeof format;
    dpr: typeof dpr;
    density: typeof density;
    defaultImage: typeof defaultImage;
    colorSpace: typeof colorSpace;
    colorSpaceFromICC: typeof colorSpaceFromICC;
    quality: typeof quality;
};
export { Delivery, format, dpr, quality, density, defaultImage, colorSpace, colorSpaceFromICC };
