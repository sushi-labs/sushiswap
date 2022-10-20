import { Kind, visit } from 'graphql';
export function extractVariables(inputValue) {
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
                kind: Kind.NULL,
            };
        },
    };
    const newInputValue = visit(inputValue, {
        [Kind.OBJECT]: keyPathVisitor,
        [Kind.LIST]: keyPathVisitor,
        [Kind.OBJECT_FIELD]: fieldPathVisitor,
        [Kind.VARIABLE]: variableVisitor,
    });
    return {
        inputValue: newInputValue,
        variablePaths,
    };
}
