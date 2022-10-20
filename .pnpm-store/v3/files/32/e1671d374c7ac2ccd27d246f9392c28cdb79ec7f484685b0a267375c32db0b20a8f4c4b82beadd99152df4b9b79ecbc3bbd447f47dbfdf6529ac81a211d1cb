import { Action } from "../../internal/Action.js";
import { TimelinePosition } from "../../qualifiers/video/TimelinePosition.js";
import { BlendModeQualifier } from "../../qualifiers/blendMode/BlendModeQualifier.js";
import { Position } from "../../qualifiers/position.js";
import { BaseSource } from "../../qualifiers/source/BaseSource.js";
import { BlendModeType } from "../../types/types.js";
import { IActionModel } from "../../internal/models/IActionModel.js";
import { IOverlayActionModel } from "../../internal/models/IOverlayActionModel.js";
import { ITransformationFromJson } from "../../internal/models/IHasFromJson.js";
/**
 * @extends SDK.Action
 * @memberOf SDK
 * @description
 * A generic Layer action that can add a Video, Text or Image layer.<br>
 * This class can represent an overlay or an underlay.
 */
declare class LayerAction extends Action {
    private source;
    private _position;
    private _blendMode;
    private _timelinePosition;
    protected _actionModel: IOverlayActionModel;
    layerType: 'u' | 'l';
    /**
     * @description Creates a LayerAction to be used with overlays and underlays
     * @param {ImageSource | TextSource | VideoSource} layerSource The Source used for the layer, use the builders provided {@link Qualifiers.Source|here}
     */
    constructor(layerSource: BaseSource);
    /**
     * @description Sets the layerType to 'u' (underlay) or 'l' (overlay).
     * @param {'u' | 'l'} type
     * @return {this}
     */
    setLayerType(type: 'u' | 'l'): this;
    /**
     * @description Sets the timeline position of the video layer
     * @param {Qualifiers.TimelinePosition} timelinePosition
     * @return {this}
     */
    timeline(timelinePosition: TimelinePosition): this;
    /**
     * @description Sets the position of the layer
     * @param {Qualifiers.Position} position
     * @return {this}
     */
    position(position: Position): this;
    /**
     * @description Specifies how to blend the image overlay with the base overlay
     * @param {Qualifiers.BlendMode|BlendModeType} blendMode
     * @return {this}
     */
    blendMode(blendMode: BlendModeType | BlendModeQualifier): this;
    /**
     * @private
     * @description
     * Closes a layer (layers are built in three stages -> /Open/Transform/Close).
     * @return {SDK.Action}
     */
    private closeLayer;
    /**
     * @private
     * @description
     * Opens a layer (layers are built in three stages -> /Open/Transform/Close).
     * @return string
     */
    private openLayer;
    /**
     * @description
     * Serializes the Layer to a string
     * @return {string}
     */
    toString(): string;
    static fromJson(actionModel: IActionModel, transformationFromJson: ITransformationFromJson): LayerAction;
}
export { LayerAction };
