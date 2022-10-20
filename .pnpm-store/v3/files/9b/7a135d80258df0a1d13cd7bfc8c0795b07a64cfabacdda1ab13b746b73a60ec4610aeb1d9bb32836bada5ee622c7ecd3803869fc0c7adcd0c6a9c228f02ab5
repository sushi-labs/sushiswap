"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCancelToResponseStream = exports.cancelNeeded = void 0;
const utils_1 = require("@graphql-tools/utils");
function cancelNeeded() {
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
exports.cancelNeeded = cancelNeeded;
function addCancelToResponseStream(resultStream, controller) {
    return (0, utils_1.withCancel)(resultStream, () => {
        if (!controller.signal.aborted) {
            controller.abort();
        }
    });
}
exports.addCancelToResponseStream = addCancelToResponseStream;
