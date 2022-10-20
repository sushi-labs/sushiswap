import { Action } from "../../internal/Action.js";
import { VideoSource } from "../../qualifiers/source/sourceTypes/VideoSource.js";
import { ImageSource } from "../../qualifiers/source/sourceTypes/ImageSource.js";
import { FetchSource } from "../../qualifiers/source/sourceTypes/FetchSource.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
import { IConcatenateActionModel } from "../../internal/models/IConcatenateActionModel.js";
import { ITransformationFromJson } from "../../internal/models/IHasFromJson.js";
/**
 * @description Class for Concatenating another video.
 *
 * <b>Learn more</b>: {@link https://cloudinary.com/documentation/video_manipulation_and_delivery#concatenating_videos|Concatenating videos}
 * @extends SDK.Action
 * @memberOf Actions.VideoEdit
 * @see Visit {@link Actions.VideoEdit|VideoEdit} for an example
 */
declare class ConcatenateAction extends Action {
    private concatSource;
    private _prepend;
    private _duration;
    private _transition;
    protected _actionModel: IConcatenateActionModel;
    /**
     *
     * @param {Qualifiers.Source.VideoSource | Qualifiers.Source.ImageSource | Qualifiers.Source.FetchSource} source
     *         the Source to concatenate
     */
    constructor(source: VideoSource | ImageSource | FetchSource);
    /**
     * @description Sets the transition between a video and a concatenated source
     * @param {Qualifiers.Transition.VideoSource} source The source to concatenate.
     * @return {this}
     */
    transition(source: VideoSource): this;
    /**
     * @description Prepend the concatenated video - Adds the video before the original
     * @return {this}
     */
    prepend(): this;
    /**
     * The duration in seconds
     * @param {number} sec
     * @return {this}
     */
    duration(sec: number): this;
    /**
     * @description Get the transitionString for the toString() method
     * @return {string}
     */
    getTransitionString(): string;
    /**
     * @description Get the string representation of the Concatenation action
     */
    toString(): string;
    static fromJson(actionModel: IActionModel, transformationFromJson: ITransformationFromJson): ConcatenateAction;
}
export default ConcatenateAction;
