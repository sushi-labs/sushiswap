export function useResultProcessor(options) {
    const isMatch = options.match || (() => true);
    return {
        onResultProcess({ request, result, setResultProcessor }) {
            if (isMatch(request, result)) {
                setResultProcessor(options.processResult);
            }
        },
    };
}
