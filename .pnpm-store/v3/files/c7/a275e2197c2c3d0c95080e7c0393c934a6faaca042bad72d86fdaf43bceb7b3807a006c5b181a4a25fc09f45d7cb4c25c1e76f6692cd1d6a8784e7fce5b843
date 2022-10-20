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
class ProgressiveQualifier extends FlagQualifier {
    constructor(mode) {
        super('progressive', mode);
    }
}
/**
 * @memberOf Qualifiers.Progressive
 */
function none() {
    return new ProgressiveQualifier('none');
}
/**
 * @memberOf Qualifiers.Progressive
 */
function semi() {
    return new ProgressiveQualifier('semi');
}
/**
 * @memberOf Qualifiers.Progressive
 */
function steep() {
    return new ProgressiveQualifier('steep');
}
/**
 * @memberOf Qualifiers.Progressive
 */
function progressive() {
    return new ProgressiveQualifier();
}
const Progressive = {
    semi,
    none,
    steep,
    progressive,
    ProgressiveQualifier
};
export { Progressive, semi, none, steep, progressive, ProgressiveQualifier };
