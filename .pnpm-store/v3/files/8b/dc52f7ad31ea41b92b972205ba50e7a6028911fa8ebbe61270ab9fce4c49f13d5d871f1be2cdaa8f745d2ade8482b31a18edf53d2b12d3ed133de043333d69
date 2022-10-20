"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResultProcessor = void 0;
const accept_js_1 = require("./resultProcessor/accept.js");
function useResultProcessor(options) {
    return {
        onResultProcess({ request, acceptableMediaTypes, setResultProcessor }) {
            let acceptedMediaType;
            for (const mediaType of options.mediaTypes) {
                if (!acceptedMediaType && (0, accept_js_1.isAcceptableByRequest)(mediaType, request)) {
                    acceptedMediaType = mediaType;
                }
                acceptableMediaTypes.add(mediaType);
            }
            if (acceptedMediaType) {
                setResultProcessor(options.processResult, acceptedMediaType);
            }
        },
    };
}
exports.useResultProcessor = useResultProcessor;
