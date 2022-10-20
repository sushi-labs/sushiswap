import { BaseTextSource } from "./BaseTextSource.js";
import { TextStyle } from "../../textStyle.js";
import { ISubtitlesSourceModel } from "../../../internal/models/ISubtitlesSourceModel.js";
/**
 * @memberOf Qualifiers.Source
 * @extends {Qualifiers.Source.SubtitlesSource}
 * @description Defines how to manipulate a Subtitles layer
 */
declare class SubtitlesSource extends BaseTextSource {
    protected type: string;
    protected _qualifierModel: ISubtitlesSourceModel;
    constructor(fileName: string);
    /**
     * @description Set the textStyle for the subtitles layer
     * @param {TextStyle} textStyle
     */
    textStyle(textStyle: TextStyle): this;
    /**
     *
     * @description Used within getOpenSourceString of TextSource, this function overwrites the default encoding behaviour
     * Subtitle file names require a different encoding than texts
     * @param text
     * @example
     * encodeText('foo/bar'); // -> foo:bar
     */
    encodeText(text: string): string;
}
export { SubtitlesSource };
