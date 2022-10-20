"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractVariables = void 0;
const graphql_1 = require("graphql");
function extractVariables(inputValue) {
    const path = [];
    const variablePaths = Object.create(null);
    const keyPathVisitor = {
        enter: (_node, key) => {
            if (typeof key === 'number') {
                path.push(key);
            }
        },
        leave: (_node, key) => {
            if (typeof key === 'number') {
                path.pop();
            }
        },
    };
    const fieldPathVisitor = {
        enter: (node) => {
            path.push(node.name.value);
        },
        leave: () => {
            path.pop();
        },
    };
    const variableVisitor = {
        enter: (node, key) => {
            if (typeof key === 'number') {
                variablePaths[node.name.value] = path.concat([key]);
            }
            else {
                variablePaths[node.name.value] = path.slice();
            }
            return {
                kind: graphql_1.Kind.NULL,
            };
        },
    };
    const newInputValue = (0, graphql_1.visit)(inputValue, {
        [graphql_1.Kind.OBJECT]: keyPathVisitor,
        [graphql_1.Kind.LIST]: keyPathVisitor,
        [graphql_1.Kind.OBJECT_FIELD]: fieldPathVisitor,
        [graphql_1.Kind.VARIABLE]: variableVisitor,
    });
    return {
        inputValue: newInputValue,
        variablePaths,
    };
}
exports.extractVariables = extractVariables;
