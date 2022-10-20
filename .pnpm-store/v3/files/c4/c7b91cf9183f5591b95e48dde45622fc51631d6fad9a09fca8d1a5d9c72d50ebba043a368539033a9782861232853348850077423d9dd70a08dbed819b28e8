/**
 *
 * @private
 * @description An isomorphic Base64 function, provides browser and server support.
 * @param {string} input - A string to encode with base64
 */
function base64Encode(input) {
    // Browser
    let encodedResult = '';
    if (typeof window !== 'undefined') {
        // encodeURI the input to support unicode characters
        // Since the URI might be encoded already, we try to decode it once before
        encodedResult = btoa(encodeURI(decodeURI(input)));
    }
    else {
        // NodeJS support
        encodedResult = global.Buffer.from(input).toString('base64');
    }
    return encodedResult
        .replace(/\+/g, '-') // Convert '+' to '-'
        .replace(/\//g, '_'); // Convert '/' to '_';
}
export { base64Encode };
