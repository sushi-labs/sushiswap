/**
 * @description Contains functions to select the mode when using a progressive format.
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/transformation_reference#fl_progressive|Progressive modes}
 * @memberOf Qualifiers
 * @namespace Progressive
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {format} from "@cloudinary/url-gen/actions/delivery";
 * import {jpg} from "@cloudinary/url-gen/qualifiers/format";
 * import {steep} from "@cloudinary/url-gen/qualifiers/progressive";
 *
 * const yourCldInstance = new Cloudinary({cloud: {cloudName: 'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.delivery(format(jpg()).progressive(steep()))
 */
import { FlagQualifier } from "./flag/FlagQualifier.js";
declare class ProgressiveQualifier extends FlagQualifier {
    constructor(mode?: string);
}
/**
 * @memberOf Qualifiers.Progressive
 */
declare function none(): FlagQualifier;
/**
 * @memberOf Qualifiers.Progressive
 */
declare function semi(): FlagQualifier;
/**
 * @memberOf Qualifiers.Progressive
 */
declare function steep(): FlagQualifier;
/**
 * @memberOf Qualifiers.Progressive
 */
declare function progressive(): FlagQualifier;
declare const Progressive: {
    semi: typeof semi;
    none: typeof none;
    steep: typeof steep;
    progressive: typeof progressive;
    ProgressiveQualifier: typeof ProgressiveQualifier;
};
export { Progressive, semi, none, steep, progressive, ProgressiveQualifier };
