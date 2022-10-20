"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourcePaths = void 0;
const graphql_1 = require("graphql");
const pathsFromSelectionSet_js_1 = require("./pathsFromSelectionSet.js");
function getSourcePaths(mappingInstructions, selectionSet) {
    const sourcePaths = [];
    for (const mappingInstruction of mappingInstructions) {
        const { sourcePath } = mappingInstruction;
        if (sourcePath.length) {
            sourcePaths.push(sourcePath);
            continue;
        }
        if (selectionSet == null) {
            continue;
        }
        const paths = (0, pathsFromSelectionSet_js_1.pathsFromSelectionSet)(selectionSet);
        for (const path of paths) {
            sourcePaths.push(path);
        }
        sourcePaths.push([graphql_1.TypeNameMetaFieldDef.name]);
    }
    return sourcePaths;
}
exports.getSourcePaths = getSourcePaths;
