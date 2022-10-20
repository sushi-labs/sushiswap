import { BaseTextSource } from "./BaseTextSource.js";
/**
 * @memberOf Qualifiers.Source
 * @extends {Qualifiers.Source.SubtitlesSource}
 * @description Defines how to manipulate a Subtitles layer
 */
class SubtitlesSource extends BaseTextSource {
    constructor(fileName) {
        super(fileName);
        this.type = 'subtitles'; // used within TextSource for l/u_subtitles:
        this._qualifierModel = {
            sourceType: 'subtitles',
            publicId: fileName
        };
    }
    /**
     * @description Set the textStyle for the subtitles layer
     * @param {TextStyle} textStyle
     */
    textStyle(textStyle) {
        this._textStyle = textStyle;
        this._qualifierModel.textStyle = textStyle.toJson();
        return this;
    }
    /**
     *
     * @description Used within getOpenSourceString of TextSource, this function overwrites the default encoding behaviour
     * Subtitle file names require a different encoding than texts
     * @param text
     * @example
     * encodeText('foo/bar'); // -> foo:bar
     */
    encodeText(text) {
        return text.replace(/\//g, ':');
    }
}
export { SubtitlesSource };
