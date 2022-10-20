import { parseSelectionSet } from '@graphql-tools/utils';
import { Kind } from 'graphql';
export const forwardArgsToSelectionSet = (selectionSet, mapping) => {
    const selectionSetDef = parseSelectionSet(selectionSet, { noLocation: true });
    return (field) => {
        const selections = selectionSetDef.selections.map((selectionNode) => {
            var _a, _b;
            if (selectionNode.kind === Kind.FIELD) {
                if (!mapping) {
                    return { ...selectionNode, arguments: (_a = field.arguments) === null || _a === void 0 ? void 0 : _a.slice() };
                }
                else if (selectionNode.name.value in mapping) {
                    const selectionArgs = mapping[selectionNode.name.value];
                    return {
                        ...selectionNode,
                        arguments: (_b = field.arguments) === null || _b === void 0 ? void 0 : _b.filter((arg) => selectionArgs.includes(arg.name.value)),
                    };
                }
            }
            return selectionNode;
        });
        return { ...selectionSetDef, selections };
    };
};
