'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var internal_models_IImageSourceModel = require('./IImageSourceModel.cjs');
var qualifiers_source_sourceTypes_ImageSource = require('../../qualifiers/source/sourceTypes/ImageSource.cjs');
var internal_models_IFetchSourceModel = require('./IFetchSourceModel.cjs');
var qualifiers_source_sourceTypes_FetchSource = require('../../qualifiers/source/sourceTypes/FetchSource.cjs');
var qualifiers_source_sourceTypes_VideoSource = require('../../qualifiers/source/sourceTypes/VideoSource.cjs');
var internal_models_ITextSourceModel = require('./ITextSourceModel.cjs');
var qualifiers_source_sourceTypes_TextSource = require('../../qualifiers/source/sourceTypes/TextSource.cjs');
require('../../tslib.es6-f1398b83.cjs');
require('../../qualifiers/source/BaseSource.cjs');
require('./QualifierModel.cjs');
require('./qualifierToJson.cjs');
require('../utils/unsupportedError.cjs');
require('../../qualifiers/format/FormatQualifier.cjs');
require('../qualifier/QualifierValue.cjs');
require('../utils/base64Encode.cjs');
require('../../qualifiers/source/sourceTypes/BaseTextSource.cjs');
require('../../qualifiers/textStyle.cjs');
require('../../qualifiers/fontWeight.cjs');
require('../../qualifiers/fontStyle.cjs');
require('../../qualifiers/textDecoration.cjs');
require('../utils/serializeCloudinaryCharacters.cjs');
require('../../qualifiers/textStroke.cjs');
require('./IStrokeModel.cjs');
require('../Action.cjs');
require('../../qualifiers/flag/FlagQualifier.cjs');
require('../qualifier/Qualifier.cjs');
require('../utils/dataStructureUtils.cjs');
require('./ActionModel.cjs');
require('./actionToJson.cjs');
require('../utils/prepareColor.cjs');
require('./createTextStyleFromModel.cjs');

/**
 * Create Source from given model json
 * @param source
 * @param transformationFromJson
 */
function createSourceFromModel(source, transformationFromJson) {
    if (internal_models_ITextSourceModel.isITextSourceModel(source)) {
        return qualifiers_source_sourceTypes_TextSource.TextSource.fromJson(source, transformationFromJson);
    }
    else if (internal_models_IImageSourceModel.isIImageSourceModel(source)) {
        return qualifiers_source_sourceTypes_ImageSource.ImageSource.fromJson(source, transformationFromJson);
    }
    else if (internal_models_IFetchSourceModel.isIFetchSourceModel(source)) {
        return qualifiers_source_sourceTypes_FetchSource.FetchSource.fromJson(source, transformationFromJson);
    }
    else {
        return qualifiers_source_sourceTypes_VideoSource.VideoSource.fromJson(source, transformationFromJson);
    }
}

exports.createSourceFromModel = createSourceFromModel;
