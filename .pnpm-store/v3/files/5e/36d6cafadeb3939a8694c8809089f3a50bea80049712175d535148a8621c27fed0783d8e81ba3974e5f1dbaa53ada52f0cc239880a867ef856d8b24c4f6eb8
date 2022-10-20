import { ISourceModel } from "./ISourceModel.js";
import { ITextStyleModel } from "./ITextStyleModel.js";
import { IColorModel } from "./IColorModel.js";
import { ITransformationModel } from "./ITransformationModel.js";
export interface ITextSourceModel extends ISourceModel {
    sourceType: 'text' | 'subtitles';
    text: string;
    textStyle: ITextStyleModel;
    textColor?: IColorModel;
    backgroundColor?: IColorModel;
    transformation?: ITransformationModel;
}
/**
 * Validates that given obj is an IImageSourceModel
 * @param obj
 */
export declare function isITextSourceModel(obj: unknown): obj is ITextSourceModel;
