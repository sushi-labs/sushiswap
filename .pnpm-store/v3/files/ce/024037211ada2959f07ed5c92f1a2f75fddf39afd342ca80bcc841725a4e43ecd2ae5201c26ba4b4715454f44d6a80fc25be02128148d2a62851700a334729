import { Action } from "../internal/Action.js";
/**
 * @description Delivers an animated GIF that contains additional loops of the GIF.
 * The total number of iterations is the number of additional loops plus one.
 * You can also specify the loop effect without a numeric value to instruct it to loop the GIF infinitely.
 *
 * @memberOf Actions
 * @namespace Animated
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {animated} from "@cloudinary/url-gen/actions/animated";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.animated(edit().delay(200).loop(3)));
 */
/**
 * @memberOf Actions.Animated
 * @see Actions.Animated
 * @example
 * // Used through a builder function Animated.edit(), and not by creating a new instance
 * import {Cloudinary} from "@cloudinary/url-gen";
 * import {edit} from "@cloudinary/url-gen/actions/animated";
 *
 * const yourCldInstance = new Cloudinary({cloud:{cloudName:'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.animated(edit().delay(200).loop(3)));
 */
declare class AnimatedAction extends Action {
    constructor();
    /**
     * @description Controls the time delay between the frames of an animated image, in milliseconds.
     * @param {number} delayValue The delay in milliseconds
     * @return {this}
     */
    delay(delayValue: number): this;
    /**
     * @description Delivers an animated GIF that contains additional loops of the GIF.
     * @param {number} additionalLoops The additional number of times to play the animated GIF.
     * @return {this}
     */
    loop(additionalLoops?: number): this;
}
/**
 * @summary action
 * @memberOf Actions.Animated
 * @description Delivers an animated GIF.
 * @return {Actions.Animated.AnimatedAction}
 */
declare function edit(): AnimatedAction;
declare const Animated: {
    edit: typeof edit;
};
export { AnimatedAction, Animated, edit };
