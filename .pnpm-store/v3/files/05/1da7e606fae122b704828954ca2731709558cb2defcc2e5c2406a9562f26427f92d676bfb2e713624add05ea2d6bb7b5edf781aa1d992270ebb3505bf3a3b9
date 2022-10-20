"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResultProcessor = void 0;
function useResultProcessor(options) {
    const isMatch = options.match || (() => true);
    return {
        onResultProcess({ request, result, setResultProcessor }) {
            if (isMatch(request, result)) {
                setResultProcessor(options.processResult);
            }
        },
    };
}
exports.useResultProcessor = useResultProcessor;
