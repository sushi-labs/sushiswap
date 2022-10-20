"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preparseMergeArgsExpr = exports.EXPANSION_PREFIX = exports.KEY_DELIMITER = void 0;
exports.KEY_DELIMITER = '__dot__';
exports.EXPANSION_PREFIX = '__exp';
function preparseMergeArgsExpr(mergeArgsExpr) {
    const variableRegex = /\$[_A-Za-z][_A-Za-z0-9.]*/g;
    const dotRegex = /\./g;
    mergeArgsExpr = mergeArgsExpr.replace(variableRegex, variable => variable.replace(dotRegex, exports.KEY_DELIMITER));
    const segments = mergeArgsExpr.split('[[');
    const expansionExpressions = Object.create(null);
    if (segments.length === 1) {
        return { mergeArgsExpr: mergeArgsExpr, expansionExpressions };
    }
    let finalSegments = [segments[0]];
    for (let i = 1; i < segments.length; i++) {
        const additionalSegments = segments[i].split(']]');
        if (additionalSegments.length !== 2) {
            throw new Error(`Each opening "[[" must be matched by a closing "]]" without nesting.`);
        }
        finalSegments = finalSegments.concat(additionalSegments);
    }
    let finalMergeArgsExpr = finalSegments[0];
    for (let i = 1; i < finalSegments.length - 1; i += 2) {
        const variableName = `${exports.EXPANSION_PREFIX}${(i - 1) / 2 + 1}`;
        expansionExpressions[variableName] = finalSegments[i];
        finalMergeArgsExpr += `\$${variableName}${finalSegments[i + 1]}`;
    }
    return { mergeArgsExpr: finalMergeArgsExpr, expansionExpressions };
}
exports.preparseMergeArgsExpr = preparseMergeArgsExpr;
