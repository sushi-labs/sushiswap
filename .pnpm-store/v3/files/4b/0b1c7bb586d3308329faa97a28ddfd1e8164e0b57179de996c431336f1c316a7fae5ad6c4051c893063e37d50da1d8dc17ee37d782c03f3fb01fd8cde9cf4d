import { IGravity } from "../../qualifiers/gravity/GravityQualifier.js";
import { ICompassGravity } from "../../qualifiers/gravity/compassGravity/CompassGravity.js";
export interface IGravityModel {
    gravityType: string;
    [x: string]: unknown;
}
export interface ICompassGravityModel extends IGravityModel {
    compass: ICompassGravity;
}
export interface IOcrGravityModel extends IGravityModel {
}
export interface IAutoGravityObjectModel {
    object: string;
    weight?: number;
    avoid?: boolean;
}
export interface IAutoGravityModel extends IGravityModel {
    autoFocus: IAutoGravityObjectModel[];
}
export interface IFocusOnGravityModel extends IGravityModel {
    focusOnObjects: string[];
    fallbackGravity?: IAutoGravityModel;
}
/**
 * Create a model of given gravity
 * @param gravity
 */
export declare function createGravityModel(gravity: IGravity): IGravityModel;
