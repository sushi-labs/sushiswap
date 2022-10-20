import { withCancel } from '@graphql-tools/utils';
export function cancelNeeded() {
    var _a, _b;
    if ((_b = (_a = globalThis.process) === null || _a === void 0 ? void 0 : _a.versions) === null || _b === void 0 ? void 0 : _b.node) {
        const [nodeMajorStr, nodeMinorStr] = process.versions.node.split('.');
        const nodeMajor = parseInt(nodeMajorStr);
        const nodeMinor = parseInt(nodeMinorStr);
        if (nodeMajor > 16 || (nodeMajor === 16 && nodeMinor >= 5)) {
            return false;
        }
        return true;
    }
    return false;
}
export function addCancelToResponseStream(resultStream, controller) {
    return withCancel(resultStream, () => {
        if (!controller.signal.aborted) {
            controller.abort();
        }
    });
}
