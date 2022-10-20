import { IActionModel } from "./IActionModel.js";
import { Action } from "../Action.js";
import { Transformation } from "../../transformation/Transformation.js";
import { ITransformationModel } from "./ITransformationModel.js";
export declare type ITransformationFromJson = (transformationModel: ITransformationModel) => Transformation;
export interface IHasFromJson {
    fromJson: (actionModel: IActionModel, transformationFromJson?: ITransformationFromJson) => Action;
}
