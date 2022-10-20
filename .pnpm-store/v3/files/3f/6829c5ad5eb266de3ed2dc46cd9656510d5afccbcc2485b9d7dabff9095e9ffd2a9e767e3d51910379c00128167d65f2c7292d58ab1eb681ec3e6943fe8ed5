"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stitchingDirectivesValidator = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("@graphql-tools/utils");
const defaultStitchingDirectiveOptions_js_1 = require("./defaultStitchingDirectiveOptions.js");
const parseMergeArgsExpr_js_1 = require("./parseMergeArgsExpr.js");
const dottedNameRegEx = /^[_A-Za-z][_0-9A-Za-z]*(.[_A-Za-z][_0-9A-Za-z]*)*$/;
function stitchingDirectivesValidator(options = {}) {
    const { keyDirectiveName, computedDirectiveName, mergeDirectiveName, pathToDirectivesInExtensions } = {
        ...defaultStitchingDirectiveOptions_js_1.defaultStitchingDirectiveOptions,
        ...options,
    };
    return (schema) => {
        var _a;
        const queryTypeName = (_a = schema.getQueryType()) === null || _a === void 0 ? void 0 : _a.name;
        (0, utils_1.mapSchema)(schema, {
            [utils_1.MapperKind.OBJECT_TYPE]: type => {
                var _a;
                const keyDirective = (_a = (0, utils_1.getDirective)(schema, type, keyDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (keyDirective != null) {
                    (0, utils_1.parseSelectionSet)(keyDirective['selectionSet']);
                }
                return undefined;
            },
            [utils_1.MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
                var _a, _b, _c;
                const computedDirective = (_a = (0, utils_1.getDirective)(schema, fieldConfig, computedDirectiveName, pathToDirectivesInExtensions)) === null || _a === void 0 ? void 0 : _a[0];
                if (computedDirective != null) {
                    (0, utils_1.parseSelectionSet)(computedDirective['selectionSet']);
                }
                const mergeDirective = (_b = (0, utils_1.getDirective)(schema, fieldConfig, mergeDirectiveName, pathToDirectivesInExtensions)) === null || _b === void 0 ? void 0 : _b[0];
                if (mergeDirective != null) {
                    if (typeName !== queryTypeName) {
                        throw new Error('@merge directive may be used only for root fields of the root Query type.');
                    }
                    let returnType = (0, graphql_1.getNullableType)(fieldConfig.type);
                    if ((0, graphql_1.isListType)(returnType)) {
                        returnType = (0, graphql_1.getNullableType)(returnType.ofType);
                    }
                    if (!(0, graphql_1.isNamedType)(returnType)) {
                        throw new Error('@merge directive must be used on a field that returns an object or a list of objects.');
                    }
                    const mergeArgsExpr = mergeDirective['argsExpr'];
                    if (mergeArgsExpr != null) {
                        (0, parseMergeArgsExpr_js_1.parseMergeArgsExpr)(mergeArgsExpr);
                    }
                    const args = Object.keys((_c = fieldConfig.args) !== null && _c !== void 0 ? _c : {});
                    const keyArg = mergeDirective['keyArg'];
                    if (keyArg == null) {
                        if (!mergeArgsExpr && args.length !== 1) {
                            throw new Error('Cannot use @merge directive without `keyArg` argument if resolver takes more than one argument.');
                        }
                    }
                    else if (!keyArg.match(dottedNameRegEx)) {
                        throw new Error('`keyArg` argument for @merge directive must be a set of valid GraphQL SDL names separated by periods.');
                        // TODO: ideally we should check that the arg exists for the resolver
                    }
                    const keyField = mergeDirective['keyField'];
                    if (keyField != null && !keyField.match(dottedNameRegEx)) {
                        throw new Error('`keyField` argument for @merge directive must be a set of valid GraphQL SDL names separated by periods.');
                        // TODO: ideally we should check that it is part of the key
                    }
                    const key = mergeDirective['key'];
                    if (key != null) {
                        if (keyField != null) {
                            throw new Error('Cannot use @merge directive with both `keyField` and `key` arguments.');
                        }
                        for (const keyDef of key) {
                            let [aliasOrKeyPath, keyPath] = keyDef.split(':');
                            let aliasPath;
                            if (keyPath == null) {
                                keyPath = aliasPath = aliasOrKeyPath;
                            }
                            else {
                                aliasPath = aliasOrKeyPath;
                            }
                            if (keyPath != null && !keyPath.match(dottedNameRegEx)) {
                                throw new Error('Each partial key within the `key` argument for @merge directive must be a set of valid GraphQL SDL names separated by periods.');
                                // TODO: ideally we should check that it is part of the key
                            }
                            if (aliasPath != null && !aliasOrKeyPath.match(dottedNameRegEx)) {
                                throw new Error('Each alias within the `key` argument for @merge directive must be a set of valid GraphQL SDL names separated by periods.');
                                // TODO: ideally we should check that the arg exists within the resolver
                            }
                        }
                    }
                    const additionalArgs = mergeDirective['additionalArgs'];
                    if (additionalArgs != null) {
                        (0, graphql_1.parseValue)(`{ ${additionalArgs} }`, { noLocation: true });
                    }
                    if (mergeArgsExpr != null && (keyArg != null || additionalArgs != null)) {
                        throw new Error('Cannot use @merge directive with both `argsExpr` argument and any additional argument.');
                    }
                    if (!(0, graphql_1.isInterfaceType)(returnType) && !(0, graphql_1.isUnionType)(returnType) && !(0, graphql_1.isObjectType)(returnType)) {
                        throw new Error('@merge directive may be used only with resolver that return an object, interface, or union.');
                    }
                    const typeNames = mergeDirective['types'];
                    if (typeNames != null) {
                        if (!(0, graphql_1.isAbstractType)(returnType)) {
                            throw new Error('Types argument can only be used with a field that returns an abstract type.');
                        }
                        const implementingTypes = (0, graphql_1.isInterfaceType)(returnType)
                            ? (0, utils_1.getImplementingTypes)(returnType.name, schema).map(typeName => schema.getType(typeName))
                            : returnType.getTypes();
                        const implementingTypeNames = implementingTypes.map(type => type === null || type === void 0 ? void 0 : type.name).filter(utils_1.isSome);
                        for (const typeName of typeNames) {
                            if (!implementingTypeNames.includes(typeName)) {
                                throw new Error(`Types argument can only include only type names that implement the field return type's abstract type.`);
                            }
                        }
                    }
                }
                return undefined;
            },
        });
        return schema;
    };
}
exports.stitchingDirectivesValidator = stitchingDirectivesValidator;
