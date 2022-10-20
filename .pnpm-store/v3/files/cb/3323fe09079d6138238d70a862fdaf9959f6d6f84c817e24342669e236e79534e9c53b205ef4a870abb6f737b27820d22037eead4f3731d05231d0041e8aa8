import { handleStreamOrSingleExecutionResult } from '../utils.js';
const makeHandleResult = (formatter) => ({ args, result, setResult, }) => {
    const modified = formatter(result, args);
    if (modified !== false) {
        setResult(modified);
    }
};
export const usePayloadFormatter = (formatter) => ({
    onExecute() {
        const handleResult = makeHandleResult(formatter);
        return {
            onExecuteDone(payload) {
                return handleStreamOrSingleExecutionResult(payload, handleResult);
            },
        };
    },
});
