import { GraphQLError, GraphQLInputObjectType, GraphQLNonNull, isListType, getNamedType, } from 'graphql';
import { getArgumentValues } from '@graphql-tools/utils';
import { getDirectiveFromAstNode } from '../common.js';
export const ONE_OF_DIRECTIVE_SDL = /* GraphQL */ `
  directive @oneOf on INPUT_OBJECT | FIELD_DEFINITION
`;
export const OneOfInputObjectsRule = (validationContext, executionArgs) => {
    return {
        Field: node => {
            var _a, _b;
            if ((_a = node.arguments) === null || _a === void 0 ? void 0 : _a.length) {
                const fieldType = validationContext.getFieldDef();
                if (!fieldType) {
                    return;
                }
                const values = getArgumentValues(fieldType, node, executionArgs.variableValues || undefined);
                const isOneOfFieldType = ((_b = fieldType.extensions) === null || _b === void 0 ? void 0 : _b.oneOf) || (fieldType.astNode && getDirectiveFromAstNode(fieldType.astNode, 'oneOf'));
                if (isOneOfFieldType && Object.keys(values).length !== 1) {
                    validationContext.reportError(new GraphQLError(`Exactly one key must be specified for input for field "${fieldType.type.toString()}.${node.name.value}"`, [node]));
                }
                for (const arg of node.arguments) {
                    const argType = fieldType.args.find(typeArg => typeArg.name === arg.name.value);
                    if (argType) {
                        traverseVariables(validationContext, arg, argType.type, values[arg.name.value]);
                    }
                }
            }
        },
    };
};
function getNonNullType(ttype) {
    if (ttype instanceof GraphQLNonNull) {
        return ttype.ofType;
    }
    return ttype;
}
function traverseVariables(validationContext, arg, graphqlType, currentValue) {
    var _a;
    // if the current value is empty we don't need to traverse deeper
    // if it shouldn't be empty, the "original" validation phase should complain.
    if (currentValue == null) {
        return;
    }
    const unwrappedType = getNonNullType(graphqlType);
    if (isListType(unwrappedType)) {
        if (!Array.isArray(currentValue)) {
            // because of graphql type coercion a single object should be treated as an array of one object
            currentValue = [currentValue];
        }
        currentValue.forEach(value => {
            traverseVariables(validationContext, arg, unwrappedType.ofType, value);
        });
        return;
    }
    if (typeof currentValue !== 'object' || currentValue == null) {
        // in case the value is not an object, the "original" validation phase should complain.
        return;
    }
    const inputType = getNamedType(graphqlType);
    const isOneOfInputType = ((_a = inputType.extensions) === null || _a === void 0 ? void 0 : _a.oneOf) || (inputType.astNode && getDirectiveFromAstNode(inputType.astNode, 'oneOf'));
    if (isOneOfInputType && Object.keys(currentValue).length !== 1) {
        validationContext.reportError(new GraphQLError(`Exactly one key must be specified for input type "${inputType.name}"`, [arg]));
    }
    if (inputType instanceof GraphQLInputObjectType) {
        for (const [name, fieldConfig] of Object.entries(inputType.getFields())) {
            traverseVariables(validationContext, arg, fieldConfig.type, currentValue[name]);
        }
    }
}
