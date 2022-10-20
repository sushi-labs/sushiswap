"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMergeArgsExpr = void 0;
const graphql_1 = require("graphql");
const extractVariables_js_1 = require("./extractVariables.js");
const preparseMergeArgsExpr_js_1 = require("./preparseMergeArgsExpr.js");
const properties_js_1 = require("./properties.js");
const getSourcePaths_js_1 = require("./getSourcePaths.js");
function parseMergeArgsExpr(mergeArgsExpr, selectionSet) {
    const { mergeArgsExpr: newMergeArgsExpr, expansionExpressions } = (0, preparseMergeArgsExpr_js_1.preparseMergeArgsExpr)(mergeArgsExpr);
    const inputValue = (0, graphql_1.parseValue)(`{ ${newMergeArgsExpr} }`, { noLocation: true });
    const { inputValue: newInputValue, variablePaths } = (0, extractVariables_js_1.extractVariables)(inputValue);
    if (!Object.keys(expansionExpressions).length) {
        if (!Object.keys(variablePaths).length) {
            throw new Error('Merge arguments must declare a key.');
        }
        const mappingInstructions = getMappingInstructions(variablePaths);
        const usedProperties = (0, properties_js_1.propertyTreeFromPaths)((0, getSourcePaths_js_1.getSourcePaths)(mappingInstructions, selectionSet));
        return { args: (0, graphql_1.valueFromASTUntyped)(newInputValue), usedProperties, mappingInstructions };
    }
    const expansionRegEx = new RegExp(`^${preparseMergeArgsExpr_js_1.EXPANSION_PREFIX}[0-9]+$`);
    for (const variableName in variablePaths) {
        if (!variableName.match(expansionRegEx)) {
            throw new Error('Expansions cannot be mixed with single key declarations.');
        }
    }
    const expansions = [];
    const sourcePaths = [];
    for (const variableName in expansionExpressions) {
        const str = expansionExpressions[variableName];
        const valuePath = variablePaths[variableName];
        const { inputValue: expansionInputValue, variablePaths: expansionVariablePaths } = (0, extractVariables_js_1.extractVariables)((0, graphql_1.parseValue)(`${str}`, { noLocation: true }));
        if (!Object.keys(expansionVariablePaths).length) {
            throw new Error('Merge arguments must declare a key.');
        }
        const mappingInstructions = getMappingInstructions(expansionVariablePaths);
        const value = (0, graphql_1.valueFromASTUntyped)(expansionInputValue);
        sourcePaths.push(...(0, getSourcePaths_js_1.getSourcePaths)(mappingInstructions, selectionSet));
        assertNotWithinList(valuePath);
        expansions.push({
            valuePath,
            value,
            mappingInstructions,
        });
    }
    const usedProperties = (0, properties_js_1.propertyTreeFromPaths)(sourcePaths);
    return { args: (0, graphql_1.valueFromASTUntyped)(newInputValue), usedProperties, expansions };
}
exports.parseMergeArgsExpr = parseMergeArgsExpr;
function getMappingInstructions(variablePaths) {
    const mappingInstructions = [];
    for (const keyPath in variablePaths) {
        const valuePath = variablePaths[keyPath];
        const splitKeyPath = keyPath.split(preparseMergeArgsExpr_js_1.KEY_DELIMITER).slice(1);
        assertNotWithinList(valuePath);
        mappingInstructions.push({
            destinationPath: valuePath,
            sourcePath: splitKeyPath,
        });
    }
    return mappingInstructions;
}
function assertNotWithinList(path) {
    for (const pathSegment of path) {
        if (typeof pathSegment === 'number') {
            throw new Error('Insertions cannot be made into a list.');
        }
    }
}
