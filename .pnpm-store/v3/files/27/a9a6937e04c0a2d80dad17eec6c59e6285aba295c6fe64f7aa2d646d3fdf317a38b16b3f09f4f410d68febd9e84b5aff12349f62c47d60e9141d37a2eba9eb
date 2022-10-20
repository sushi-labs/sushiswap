import { ISourceModel } from "./ISourceModel.js";
import { ITextStyleModel } from "./ITextStyleModel.js";
import { IColorModel } from "./IColorModel.js";
import { ITransformationModel } from "./ITransformationModel.js";
export interface IBaseTextSourceModel extends ISourceModel {
    textColor?: IColorModel;
    backgroundColor?: IColorModel;
    transformation?: ITransformationModel;
}
export interface ITextSourceModel extends IBaseTextSourceModel {
    textStyle: ITextStyleModel;
    sourceType: 'text';
    text: string;
}
/**
 * Validates that given obj is an IImageSourceModel
 * @param obj
 */
export declare function isITextSourceModel(obj: unknown): obj is ITextSourceModel;
