import { isIImageSourceModel } from "./IImageSourceModel.js";
import { ImageSource } from "../../qualifiers/source/sourceTypes/ImageSource.js";
import { isIFetchSourceModel } from "./IFetchSourceModel.js";
import { FetchSource } from "../../qualifiers/source/sourceTypes/FetchSource.js";
import { VideoSource } from "../../qualifiers/source/sourceTypes/VideoSource.js";
import { isITextSourceModel } from "./ITextSourceModel.js";
import { TextSource } from "../../qualifiers/source/sourceTypes/TextSource.js";
/**
 * Create Source from given model json
 * @param source
 * @param transformationFromJson
 */
export function createSourceFromModel(source, transformationFromJson) {
    if (isITextSourceModel(source)) {
        return TextSource.fromJson(source, transformationFromJson);
    }
    else if (isIImageSourceModel(source)) {
        return ImageSource.fromJson(source, transformationFromJson);
    }
    else if (isIFetchSourceModel(source)) {
        return FetchSource.fromJson(source, transformationFromJson);
    }
    else {
        return VideoSource.fromJson(source, transformationFromJson);
    }
}
