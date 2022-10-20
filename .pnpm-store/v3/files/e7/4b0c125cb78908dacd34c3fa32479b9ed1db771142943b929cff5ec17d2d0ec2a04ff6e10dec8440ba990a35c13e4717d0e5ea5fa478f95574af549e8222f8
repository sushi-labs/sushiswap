import { IActionModel } from "./IActionModel.js";
import { ISourceModel } from "./ISourceModel.js";
import { IPositionModel } from "./IPositionModel.js";
import { ITimelinePositionModel } from "./ITimelinePositionModel.js";
export interface IOverlayActionModel extends IActionModel {
    actionType: 'overlay' | 'underlay';
    source: ISourceModel;
    position?: IPositionModel;
    timelinePosition?: ITimelinePositionModel;
    blendMode?: {
        blendModeType?: string;
        level?: number | string;
    };
}
