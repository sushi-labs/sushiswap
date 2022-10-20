import { TypeNameMetaFieldDef } from 'graphql';
import { pathsFromSelectionSet } from './pathsFromSelectionSet.js';
export function getSourcePaths(mappingInstructions, selectionSet) {
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
        const paths = pathsFromSelectionSet(selectionSet);
        for (const path of paths) {
            sourcePaths.push(path);
        }
        sourcePaths.push([TypeNameMetaFieldDef.name]);
    }
    return sourcePaths;
}
