import { Position } from "../../qualifiers/position.js";
import { createGravityFromModel } from "./createGravityFromModel.js";
/**
 * Create Position from given IPositionModel
 * @param position
 */
export function createPositionFromModel(position) {
    const { offsetX, offsetY, tiled, allowOverflow, gravity } = position;
    const result = new Position();
    if (offsetX) {
        result.offsetX(offsetX);
    }
    if (offsetY) {
        result.offsetY(offsetY);
    }
    if (tiled) {
        result.tiled();
    }
    if (allowOverflow != null) {
        result.allowOverflow(allowOverflow);
    }
    if (gravity) {
        result.gravity(createGravityFromModel(gravity));
    }
    return result;
}
