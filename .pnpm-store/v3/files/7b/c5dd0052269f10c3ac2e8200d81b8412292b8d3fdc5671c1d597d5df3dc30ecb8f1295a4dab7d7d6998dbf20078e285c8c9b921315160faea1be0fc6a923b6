/**
 * @private
 * @description Adds left padding to a string with the desired substring the provided number of times
 * @example stringPad(foo, 3, 'a'') // -> aaafoo
 * @param {string} value
 * @param {number} _targetLength
 * @param {string} _padString
 */
export function stringPad(value, _targetLength, _padString) {
    let targetLength = _targetLength >> 0; //truncate if number or convert non-number to 0;
    let padString = String((typeof _padString !== 'undefined' ? _padString : ' '));
    if (value.length > targetLength) {
        return String(value);
    }
    else {
        targetLength = targetLength - value.length;
        if (targetLength > padString.length) {
            padString += repeatStringNumTimes(padString, targetLength / padString.length);
        }
        return padString.slice(0, targetLength) + String(value);
    }
}
/**
 * @description Repeat a string multiple times, cross-browser-safe alternative to string.repeat()
 * @param string
 * @param _times
 */
function repeatStringNumTimes(string, _times) {
    let times = _times;
    let repeatedString = "";
    while (times > 0) {
        repeatedString += string;
        times--;
    }
    return repeatedString;
}
