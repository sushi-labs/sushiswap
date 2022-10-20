/**
 * @description Defines the available modes to use with the improve effect.
 * @namespace ImproveMode
 * @memberOf Qualifiers
 * @see To be used with an {@link Actions.Adjust.ImproveAction|Adjust Improve}
 * @example
 * import {Cloudinary} from "@cloudinary/url-gen/instance/Cloudinary";
 * import {outdoor} from "@cloudinary/url-gen/qualifiers/improveMode";
 * import {improve} from "@cloudinary/url-gen/actions/adjust";
 *
 * const yourCldInstance = new Cloudinary({cloud: {cloudName: 'demo'}});
 * const image = yourCldInstance.image('woman');
 * image.adjust(improve().mode(outdoor()));
 */
/**
 * @summary qualifier
 * @memberOf Qualifiers.ImproveMode
 * @description Use this mode to get better results on outdoor images.
 * @return string
 */
declare function outdoor(): string;
/**
 * @summary qualifier
 * @memberOf Qualifiers.ImproveMode
 * @description Use this mode to get better results on images with indoor lighting and shadows.
 * @return string
 */
declare function indoor(): string;
declare const ImproveMode: {
    indoor: typeof indoor;
    outdoor: typeof outdoor;
};
export { outdoor, indoor, ImproveMode };
