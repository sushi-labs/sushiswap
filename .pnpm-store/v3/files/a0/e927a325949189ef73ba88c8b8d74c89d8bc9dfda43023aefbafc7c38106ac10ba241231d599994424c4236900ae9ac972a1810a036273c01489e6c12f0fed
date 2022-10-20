/**
 * @description Round one or more corners of an image or video.
 *
 * <b>Learn more:</b>
 * {@link https://cloudinary.com/documentation/image_transformations#rounding_corners_and_creating_circular_images|Rounded images}
 * {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#rounding_corners_and_creating_circular_videos|Rounded videos}
 * @memberOf Actions
 * @namespace RoundCorners
 * @example
 * <caption>Round corners by a radius</caption>
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {byRadius, max} from "@cloudinary/url-gen/actions/roundCorners";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * // By a radius
 * image.roundCorners(byRadius(10));
 * // Or just the maximum possible
 * image.roundCorners(max());
 * image.toURL();
 */
import RoundCornersAction from "./roundCorners/RoundCornersAction.js";
/**
 * @summary action
 * @description Generates an asset with a circular crop using the 'max' radius value.
 * @memberOf Actions.RoundCorners
 * @return {Actions.RoundCorners.RoundCornersAction}
 */
function max() {
    return new RoundCornersAction().max();
}
/**
 * @summary action
 * @description Rounds the specified corners of an image or a video by specifying 1-4 pixel values as follows:
 *
 * * 1 value: All four corners are rounded equally according to the specified value.
 * * 2 values: 1st value => top-left & bottom-right. 2nd value => top-right & bottom-left.
 * * 3 values: 1st value => top-left. 2nd value => top-right & bottom-left. 3rd value => bottom-right.
 * * 4 values: Each corner specified separately, in clockwise order, starting with top-left.
 *
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} d
 * @memberOf Actions.RoundCorners
 * @return {Actions.RoundCorners.RoundCornersAction}
 */
function byRadius(a, b, c, d) {
    return new RoundCornersAction().radius(a, b, c, d);
}
const RoundCorners = { byRadius, max };
export { RoundCorners, byRadius, max };
