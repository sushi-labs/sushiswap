import { TextStyle } from "../../qualifiers/textStyle.js";
import { solid } from "../../qualifiers/textStroke.js";
/**
 * Create TextStyle from ITextStyleModel
 * @param textStyleModel
 */
export function createTextStyleFromModel(textStyleModel) {
    const { fontFamily, fontSize, fontWeight, fontStyle, fontAntialias, fontHinting, textDecoration, textAlignment, stroke, letterSpacing, lineSpacing, } = textStyleModel;
    const result = new TextStyle(fontFamily, fontSize);
    if (fontWeight) {
        result.fontWeight(fontWeight);
    }
    if (fontStyle) {
        result.fontStyle(fontStyle);
    }
    if (fontAntialias) {
        result.fontAntialias(fontAntialias);
    }
    if (fontHinting) {
        result.fontHinting(fontHinting);
    }
    if (textDecoration) {
        result.textDecoration(textDecoration);
    }
    if (textAlignment) {
        result.textAlignment(textAlignment);
    }
    if (stroke) {
        result.stroke();
        if (typeof stroke !== "boolean") {
            result.stroke(solid(stroke.width, stroke.color));
        }
    }
    if (letterSpacing) {
        result.letterSpacing(letterSpacing);
    }
    if (lineSpacing) {
        result.lineSpacing(lineSpacing);
    }
    return result;
}
