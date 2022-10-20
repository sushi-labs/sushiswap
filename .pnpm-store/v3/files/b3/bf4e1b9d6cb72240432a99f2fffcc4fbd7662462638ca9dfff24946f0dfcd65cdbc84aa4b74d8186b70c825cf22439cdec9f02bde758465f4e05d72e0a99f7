import { BaseSource } from "../BaseSource.js";
import { SystemColors } from "../../color.js";
import { TextStyle } from "../../textStyle.js";
import { IBaseTextSourceModel } from "../../../internal/models/ITextSourceModel.js";
import { TextFitQualifier } from "../../textFit.js";
/**
 * @memberOf Qualifiers.Source
 * @extends {Qualifiers.Source.BaseSource}
 * @description Defines the common interface for all text-based sources
 */
declare class BaseTextSource extends BaseSource {
    private text;
    protected _textStyle: TextStyle | string;
    protected _textColor: SystemColors;
    protected _backgroundColor: SystemColors;
    protected type: string;
    protected _qualifierModel: Partial<IBaseTextSourceModel>;
    protected _textFit: TextFitQualifier;
    constructor(text: string, textStyle?: TextStyle | string);
    encodeText(text: string): string;
    textColor(color: SystemColors): this;
    backgroundColor(bgColor: SystemColors): this;
    textFit(textFit: TextFitQualifier): this;
    /**
     * @description
     * Returns the opening string of the layer,
     * This method is used internally within {@link SDK.LayerAction|LayerAction}
     * @returns {string}
     */
    getOpenSourceString(layerType: 'u' | 'l'): string;
}
export { BaseTextSource };
