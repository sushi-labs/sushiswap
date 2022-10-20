import { stringPad } from "./stringPad.js";
/**
 * @private
 * @description Reverses the version positions, x.y.z turns to z.y.x
 *              Pads each segment with '0' so they have length of 2
 *              Example: 1.2.3 -> 03.02.01
 * @param {string} semVer Input can be either x.y.z or x.y
 * @return {string} in the form of zz.yy.xx (
 */
export function reverseVersion(semVer) {
    if (semVer.split('.').length < 2) {
        throw new Error('invalid semVer, must have at least two segments');
    }
    // Split by '.', reverse, create new array with padded values and concat it together
    return semVer.split('.').reverse().map((segment) => {
        // try to cast to number
        const asNumber = +segment;
        if (isNaN(asNumber) || asNumber < 0) {
            throw 'Invalid version number provided';
        }
        return stringPad(segment, 2, '0');
    }).join('.');
}
