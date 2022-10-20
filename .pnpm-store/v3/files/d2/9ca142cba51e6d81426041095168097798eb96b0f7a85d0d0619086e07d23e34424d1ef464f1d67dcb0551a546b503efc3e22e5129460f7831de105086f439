import Expression from "../expression.js";
/**
 * Process DPR value. If input is 1 returns 1.0
 * @param value
 */
export function processDpr(value) {
    let dpr = value.toString();
    if (dpr != null ? dpr.match(/^\d+$/) : void 0) {
        return dpr + ".0";
    }
    else {
        return Expression.normalize(dpr);
    }
}
