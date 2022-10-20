'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../../../tslib.es6-f1398b83.cjs');
var qualifiers_source_sourceTypes_BaseTextSource = require('./BaseTextSource.cjs');
var internal_models_createTextStyleFromModel = require('../../../internal/models/createTextStyleFromModel.cjs');
require('../BaseSource.cjs');
require('../../../internal/models/QualifierModel.cjs');
require('../../../internal/models/qualifierToJson.cjs');
require('../../../internal/utils/unsupportedError.cjs');
require('../../textStyle.cjs');
require('../../fontWeight.cjs');
require('../../fontStyle.cjs');
require('../../textDecoration.cjs');
require('../../../internal/utils/serializeCloudinaryCharacters.cjs');
require('../../textStroke.cjs');
require('../../../internal/models/IStrokeModel.cjs');
require('../../../internal/Action.cjs');
require('../../flag/FlagQualifier.cjs');
require('../../../internal/qualifier/QualifierValue.cjs');
require('../../../internal/qualifier/Qualifier.cjs');
require('../../../internal/utils/dataStructureUtils.cjs');
require('../../../internal/models/ActionModel.cjs');
require('../../../internal/models/actionToJson.cjs');
require('../../../internal/utils/prepareColor.cjs');

/**
 * @memberOf Qualifiers.Source
 * @extends {Qualifiers.Source.BaseTextSource}
 * @description Defines how to manipulate a text layer
 */
var TextSource = /** @class */ (function (_super) {
    tslib_es6.__extends(TextSource, _super);
    function TextSource(fileName, textStyle) {
        /* istanbul ignore next */
        return _super.call(this, fileName, textStyle) || this;
    }
    TextSource.fromJson = function (qualifierModel, transformationFromJson) {
        var text = qualifierModel.text, textStyle = qualifierModel.textStyle, textColor = qualifierModel.textColor, backgroundColor = qualifierModel.backgroundColor, transformation = qualifierModel.transformation;
        // We are using this() to allow inheriting classes to use super.fromJson.apply(this, [qualifierModel])
        // This allows the inheriting classes to determine the class to be created
        var result = new this(text, textStyle ? internal_models_createTextStyleFromModel.createTextStyleFromModel(textStyle) : undefined);
        if (transformation) {
            result.transformation(transformationFromJson(transformation));
        }
        if (textColor) {
            result.textColor(textColor);
        }
        if (backgroundColor) {
            result.backgroundColor(backgroundColor);
        }
        return result;
    };
    return TextSource;
}(qualifiers_source_sourceTypes_BaseTextSource.BaseTextSource));

exports.TextSource = TextSource;
