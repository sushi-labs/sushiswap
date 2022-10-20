"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathsFromSelectionSet = void 0;
const graphql_1 = require("graphql");
function pathsFromSelectionSet(selectionSet, path = []) {
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
exports.pathsFromSelectionSet = pathsFromSelectionSet;
function pathsFromSelection(selection, path) {
    var _a, _b;
    if (selection.kind === graphql_1.Kind.FIELD) {
        const responseKey = (_b = (_a = selection.alias) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : selection.name.value;
        if (selection.selectionSet) {
            return pathsFromSelectionSet(selection.selectionSet, path.concat([responseKey]));
        }
        else {
            return [path.concat([responseKey])];
        }
    }
    else if (selection.kind === graphql_1.Kind.INLINE_FRAGMENT) {
        return pathsFromSelectionSet(selection.selectionSet, path);
    }
}
