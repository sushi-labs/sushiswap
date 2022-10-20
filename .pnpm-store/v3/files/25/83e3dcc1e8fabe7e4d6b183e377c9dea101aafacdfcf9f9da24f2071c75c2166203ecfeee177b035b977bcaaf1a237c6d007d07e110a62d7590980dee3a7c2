import { BaseSource } from "../BaseSource.js";
import { TextStyle } from "../../textStyle.js";
import { serializeCloudinaryCharacters } from "../../../internal/utils/serializeCloudinaryCharacters.js";
import { Action } from "../../../internal/Action.js";
import { Qualifier } from "../../../internal/qualifier/Qualifier.js";
import { prepareColor } from "../../../internal/utils/prepareColor.js";
/**
 * @memberOf Qualifiers.Source
 * @extends {Qualifiers.Source.BaseSource}
 * @description Defines the common interface for all text-based sources
 */
class BaseTextSource extends BaseSource {
    constructor(text, textStyle) {
        super();
        this.type = 'text';
        this.text = text;
        this._textStyle = textStyle;
        this._qualifierModel.sourceType = 'text';
        this._qualifierModel.text = text;
        if (textStyle instanceof TextStyle) {
            this._qualifierModel.textStyle = textStyle.toJson();
        }
    }
    encodeText(text) {
        return serializeCloudinaryCharacters(text);
    }
    textColor(color) {
        this._textColor = color;
        this._qualifierModel.textColor = color;
        return this;
    }
    backgroundColor(bgColor) {
        this._backgroundColor = bgColor;
        this._qualifierModel.backgroundColor = bgColor;
        return this;
    }
    textFit(textFit) {
        this._textFit = textFit;
        return this;
    }
    /**
     * @description
     * Returns the opening string of the layer,
     * This method is used internally within {@link SDK.LayerAction|LayerAction}
     * @returns {string}
     */
    getOpenSourceString(layerType) {
        const layerParam = [
            this.type,
            this._textStyle && this._textStyle.toString(),
            this.encodeText(this.text)
        ].filter((a) => a).join(':');
        const tmpAction = new Action();
        tmpAction.addQualifier(new Qualifier(layerType, layerParam));
        this._textColor && tmpAction.addQualifier(new Qualifier('co', prepareColor(this._textColor)));
        this._backgroundColor && tmpAction.addQualifier(new Qualifier('b', prepareColor(this._backgroundColor)));
        this._textFit && tmpAction.addQualifier(this._textFit);
        return tmpAction.toString();
    }
}
export { BaseTextSource };
