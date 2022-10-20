import { BackgroundAutoBorderQualifier } from "./background/shared/auto/BackgroundAutoBorderQualifier.js";
import { BackgroundBorderGradientQualifier } from "./background/shared/gradient/BackgroundBorderGradientQualifier.js";
import { BackgroundAutoPredominantQualifier } from "./background/shared/auto/BackgroundAutoPredominantQualifier.js";
import { BackgroundPredominantGradientQualifier } from "./background/shared/gradient/BackgroundPredominantGradientQualifier.js";
import BlurredBackgroundAction from "./background/shared/BlurredBackgroundAction.js";
import { BackgroundQualifier } from "./background/shared/base/BackgroundQualifier.js";
import { SystemColors } from "./color.js";
/**
 * @description Defines the background color to use instead of transparent background areas or when resizing with padding.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#setting_background_color|Setting background for images} | {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#background_color|Setting background for videos}
 *
 * @namespace Background
 * @memberOf Qualifiers
 */
/**
 * @summary qualifier
 * @description Selects the predominant color while taking only the image border pixels into account.
 * @memberOf Qualifiers.Background
 * @return {BackgroundAutoBorderQualifier}
 */
declare function border(): BackgroundAutoBorderQualifier;
/**
 * @summary qualifier
 * @description Automatically determines the color to use for padding, if needed when resizing an asset.
 *
 * <b>Learn more:</b> {@link https://cloudinary.com/documentation/image_transformations#content_aware_padding|Content-aware padding}
 * @memberOf Qualifiers.Background
 * @return {Qualifiers.Background.BackgroundQualifier}
 */
declare function auto(): BackgroundQualifier;
/**
 * @summary qualifier
 * @description Applies a padding gradient fade effect using the predominant colors in the border of the image.
 * @memberOf Qualifiers.Background
 * @return {BackgroundBorderGradientQualifier}
 */
declare function borderGradient(): BackgroundBorderGradientQualifier;
/**
 * @summary qualifier
 * @description Applies a padding gradient fade effect using the predominant colors in the image.
 * @memberOf Qualifiers.Background
 * @return {BackgroundPredominantGradientQualifier}
 */
declare function predominantGradient(): BackgroundPredominantGradientQualifier;
/**
 * @summary qualifier
 * @description Selects the predominant color while taking all pixels in the image into account
 * @memberOf Qualifiers.Background
 * @return {BackgroundAutoPredominantQualifier}
 */
declare function predominant(): BackgroundAutoPredominantQualifier;
/**
 * @summary qualifier
 * @description Selects the predominant color while taking all pixels in the image into account.
 * @memberOf Qualifiers.Background
 * @return {Qualifiers.Background.BackgroundQualifier}
 */
declare function color(colorStr: SystemColors): BackgroundQualifier;
/**
 * @summary qualifier
 * @description Selects the predominant color while taking all pixels in the image into account.
 * @memberOf Qualifiers.Background
 * @return {BlurredBackgroundAction}
 */
declare function blurred(): BlurredBackgroundAction;
declare const Background: {
    auto: typeof auto;
    border: typeof border;
    borderGradient: typeof borderGradient;
    predominantGradient: typeof predominantGradient;
    predominant: typeof predominant;
    color: typeof color;
    blurred: typeof blurred;
};
export { auto, border, borderGradient, predominantGradient, predominant, color, blurred, Background };
