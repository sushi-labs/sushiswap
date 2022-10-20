import { legacyNormalizeExpression } from "../utils/legacyNormalizeExpression.js";
/**
 * Parse radius options
 * @private
 * @param {Array<string|number>|string|number} _radius The radius to parse
 * @return {string} radius transformation string
 */
export function processRadius(_radius) {
    let radius = _radius;
    if (!radius) {
        return radius;
    }
    if (!Array.isArray(radius)) {
        radius = [radius];
    }
    if (radius.length === 0 || radius.length > 4) {
        throw new Error("Radius array should contain between 1 and 4 values");
    }
    if (radius.findIndex((x) => x === null) >= 0) {
        throw new Error("Corner: Cannot be null");
    }
    return radius.map(legacyNormalizeExpression).join(':');
}
