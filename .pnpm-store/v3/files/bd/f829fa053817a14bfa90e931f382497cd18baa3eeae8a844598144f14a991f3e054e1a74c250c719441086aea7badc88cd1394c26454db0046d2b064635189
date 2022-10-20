"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRequestParser = void 0;
const DEFAULT_MATCHER = () => true;
function useRequestParser(options) {
    const matchFn = options.match || DEFAULT_MATCHER;
    return {
        onRequestParse({ request, setRequestParser }) {
            if (matchFn(request)) {
                setRequestParser(function useRequestParserFn(request) {
                    return options.parse(request);
                });
            }
        },
    };
}
exports.useRequestParser = useRequestParser;
