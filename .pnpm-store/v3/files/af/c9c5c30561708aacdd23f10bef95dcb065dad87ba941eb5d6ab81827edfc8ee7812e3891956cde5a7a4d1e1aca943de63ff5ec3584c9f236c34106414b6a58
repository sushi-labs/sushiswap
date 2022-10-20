import { isAcceptableByRequest } from './resultProcessor/accept.js';
export function useResultProcessor(options) {
    return {
        onResultProcess({ request, acceptableMediaTypes, setResultProcessor }) {
            let acceptedMediaType;
            for (const mediaType of options.mediaTypes) {
                if (!acceptedMediaType && isAcceptableByRequest(mediaType, request)) {
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
