"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAcceptableByRequest = exports.getMediaTypesForRequest = void 0;
const utils_1 = require("@graphql-tools/utils");
exports.getMediaTypesForRequest = (0, utils_1.memoize1)(function getMediaTypesForRequest(request) {
    const accepts = (request.headers.get('accept') || '*/*')
        .replace(/\s/g, '')
        .toLowerCase()
        .split(',');
    const mediaTypes = [];
    for (const accept of accepts) {
        const [mediaType, ...params] = accept.split(';');
        const charset = params?.find((param) => param.includes('charset=')) || 'charset=utf-8'; // utf-8 is assumed when not specified;
        if (charset !== 'charset=utf-8') {
            // only utf-8 is supported
            continue;
        }
        mediaTypes.push(mediaType);
    }
    return mediaTypes;
});
function isAcceptableByRequest(askedMediaType, request) {
    const mediaTypes = (0, exports.getMediaTypesForRequest)(request);
    const [askedPre, askedSuf] = askedMediaType.split('/');
    return mediaTypes.some((mediaType) => {
        const [pre, suf] = mediaType.split('/');
        if (pre === '*' || pre === askedPre) {
            if (suf === '*' || suf === askedSuf) {
                return true;
            }
        }
        return false;
    });
}
exports.isAcceptableByRequest = isAcceptableByRequest;
