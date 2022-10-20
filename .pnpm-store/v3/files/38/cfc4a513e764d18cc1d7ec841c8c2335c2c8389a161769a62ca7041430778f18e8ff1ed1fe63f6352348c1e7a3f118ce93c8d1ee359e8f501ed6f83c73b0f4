import { Qualifier } from "../../internal/qualifier/Qualifier.js";
import { CompassGravity, ICompassGravity } from "./compassGravity/CompassGravity.js";
import { AutoGravity } from "./autoGravity/AutoGravity.js";
import { FocusOnGravity } from "./focusOnGravity/FocusOnGravity.js";
import { FocusOnValue } from "../focusOn.js";
import { AutoFocus } from "../autoFocus.js";
import { CompassQualifier } from "./qualifiers/compass/CompassQualifier.js";
import { XYCenterGravity } from "./xyCenterGravity/XYCenterGravity.js";
export declare type IGravityString = 'auto' | ICompassGravity;
export declare type IGravity = CompassGravity | AutoGravity | FocusOnGravity | XYCenterGravity | IGravityString | string;
export declare type IGravityValue = CompassQualifier | FocusOnValue | AutoFocus;
/**
 * @memberOf Gravity.GravityQualifier
 * @extends {SDK.Qualifier}
 */
declare class GravityQualifier extends Qualifier {
    /**
     * @param value, an array containing (GravityObject | AutoGravity | string) or a string;
     */
    constructor(value: IGravityValue | IGravityValue[] | string);
}
export { GravityQualifier };
