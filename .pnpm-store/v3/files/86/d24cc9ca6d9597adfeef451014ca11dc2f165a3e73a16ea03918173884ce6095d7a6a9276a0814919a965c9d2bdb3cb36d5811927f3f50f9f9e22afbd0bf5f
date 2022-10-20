import { Kind } from 'graphql';
export function pathsFromSelectionSet(selectionSet, path = []) {
    var _a;
    const paths = [];
    for (const selection of selectionSet.selections) {
        const additions = (_a = pathsFromSelection(selection, path)) !== null && _a !== void 0 ? _a : [];
        for (const addition of additions) {
            paths.push(addition);
        }
    }
    return paths;
}
function pathsFromSelection(selection, path) {
    var _a, _b;
    if (selection.kind === Kind.FIELD) {
        const responseKey = (_b = (_a = selection.alias) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : selection.name.value;
        if (selection.selectionSet) {
            return pathsFromSelectionSet(selection.selectionSet, path.concat([responseKey]));
        }
        else {
            return [path.concat([responseKey])];
        }
    }
    else if (selection.kind === Kind.INLINE_FRAGMENT) {
        return pathsFromSelectionSet(selection.selectionSet, path);
    }
}
