"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lowestCommonPath = void 0;
function lowestCommonPath(paths) {
    const pathParts = paths.map((path) => path.split(/[\\/]/));
    const commonParts = pathParts[0].filter((part, index) => pathParts.every((parts) => parts[index] === part));
    return commonParts.join('/');
}
exports.lowestCommonPath = lowestCommonPath;
//# sourceMappingURL=lowestCommonPath.js.map