import { IColorModel } from "./IColorModel.js";
import { GradientDirectionType } from "../../types/types.js";
declare type IGradientColors = number | string;
interface IBackgroundModel {
    backgroundType: string;
}
interface IAutoBackgroundModel extends IBackgroundModel {
    backgroundType: 'auto';
}
interface IBlurredBackgroundModel extends IBackgroundModel {
    backgroundType: 'blurred';
    intensity?: number;
    brightness?: number;
}
interface IContrastPaletteBackgroundModel extends IBackgroundModel {
    contrast: boolean;
    palette: IColorModel[];
}
interface IBorderBackgroundModel extends IContrastPaletteBackgroundModel {
    backgroundType: 'border';
}
interface IBaseGradientBackgroundModel extends IContrastPaletteBackgroundModel {
    gradientColors?: IGradientColors;
    gradientDirection?: GradientDirectionType;
}
interface IBorderGradientBackgroundModel extends IBaseGradientBackgroundModel {
    backgroundType: 'borderGradient';
}
interface IColorBackgroundModel extends IBackgroundModel {
    backgroundType: 'color';
    color: IColorModel;
}
interface IPredominantBackgroundModel extends IContrastPaletteBackgroundModel {
    backgroundType: 'predominant';
}
interface IPredominantGradientBackgroundModel extends IBaseGradientBackgroundModel {
    backgroundType: 'predominantGradient';
}
/**
 * Create an IBackgroundModel from given background
 * @param background
 */
declare function createBackgroundModel(background: unknown): IBackgroundModel;
export { IAutoBackgroundModel, IBackgroundModel, IBlurredBackgroundModel, IBorderBackgroundModel, IBorderGradientBackgroundModel, IColorBackgroundModel, IPredominantBackgroundModel, IPredominantGradientBackgroundModel, createBackgroundModel };
