"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneOfInputObjectsRule = exports.ONE_OF_DIRECTIVE_SDL = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const common_js_1 = require("../common.js");
exports.ONE_OF_DIRECTIVE_SDL = `
  directive @oneOf on INPUT_OBJECT | FIELD_DEFINITION
`;
const OneOfInputObjectsRule = (validationContext, executionArgs) => {
    return {
        Field: node => {
            var _a, _b;
            if ((_a = node.arguments) === null || _a === void 0 ? void 0 : _a.length) {
                const fieldType = validationContext.getFieldDef();
                if (!fieldType) {
                    return;
                }
                const values = (0, utils_1.getArgumentValues)(fieldType, node, executionArgs.variableValues || undefined);
                const isOneOfFieldType = ((_b = fieldType.extensions) === null || _b === void 0 ? void 0 : _b.oneOf) || (fieldType.astNode && (0, common_js_1.getDirectiveFromAstNode)(fieldType.astNode, 'oneOf'));
                if (isOneOfFieldType && Object.keys(values).length !== 1) {
                    validationContext.reportError(new graphql_1.GraphQLError(`Exactly one key must be specified for input for field "${fieldType.type.toString()}.${node.name.value}"`, [node]));
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
exports.OneOfInputObjectsRule = OneOfInputObjectsRule;
function getNonNullType(ttype) {
    if (ttype instanceof graphql_1.GraphQLNonNull) {
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
    if ((0, graphql_1.isListType)(unwrappedType)) {
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
    const inputType = (0, graphql_1.getNamedType)(graphqlType);
    const isOneOfInputType = ((_a = inputType.extensions) === null || _a === void 0 ? void 0 : _a.oneOf) || (inputType.astNode && (0, common_js_1.getDirectiveFromAstNode)(inputType.astNode, 'oneOf'));
    if (isOneOfInputType && Object.keys(currentValue).length !== 1) {
        validationContext.reportError(new graphql_1.GraphQLError(`Exactly one key must be specified for input type "${inputType.name}"`, [arg]));
    }
    if (inputType instanceof graphql_1.GraphQLInputObjectType) {
        for (const [name, fieldConfig] of Object.entries(inputType.getFields())) {
            traverseVariables(validationContext, arg, fieldConfig.type, currentValue[name]);
        }
    }
}
