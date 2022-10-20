'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const tslib = require('tslib');
const graphql = require('graphql');
const inspect = _interopDefault(require('object-inspect'));
const dependencyGraph = require('dependency-graph');

function keyMap(list, keyFn) {
    return list.reduce((map, item) => {
        map[keyFn(item)] = item;
        return map;
    }, Object.create(null));
}
function isEqual(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length)
            return false;
        for (var index = 0; index < a.length; index++) {
            if (!isEqual(a[index], b[index])) {
                return false;
            }
        }
        return true;
    }
    if (a && b && typeof a === 'object' && typeof b === 'object') {
        const aRecord = a;
        const bRecord = b;
        const aKeys = Object.keys(aRecord);
        const bKeys = Object.keys(bRecord);
        if (aKeys.length !== bKeys.length)
            return false;
        for (const key of aKeys) {
            if (!isEqual(aRecord[key], bRecord[key])) {
                return false;
            }
        }
        return true;
    }
    return a === b || (!a && !b);
}
function isNotEqual(a, b) {
    return !isEqual(a, b);
}
function isVoid(a) {
    return typeof a === 'undefined' || a === null;
}
function diffArrays(a, b) {
    return a.filter((c) => !b.some((d) => isEqual(d, c)));
}
function compareLists(oldList, newList, callbacks) {
    const oldMap = keyMap(oldList, ({ name }) => name);
    const newMap = keyMap(newList, ({ name }) => name);
    const added = [];
    const removed = [];
    const mutual = [];
    for (const oldItem of oldList) {
        const newItem = newMap[oldItem.name];
        if (newItem === undefined) {
            removed.push(oldItem);
        }
        else {
            mutual.push({
                newVersion: newItem,
                oldVersion: oldItem,
            });
        }
    }
    for (const newItem of newList) {
        if (oldMap[newItem.name] === undefined) {
            added.push(newItem);
        }
    }
    if (callbacks) {
        if (callbacks.onAdded) {
            added.forEach(callbacks.onAdded);
        }
        if (callbacks.onRemoved) {
            removed.forEach(callbacks.onRemoved);
        }
        if (callbacks.onMutual) {
            mutual.forEach(callbacks.onMutual);
        }
    }
    return {
        added,
        removed,
        mutual,
    };
}

function isDeprecated(fieldOrEnumValue) {
    var _a, _b;
    if ('isDeprecated' in fieldOrEnumValue) {
        return fieldOrEnumValue['isDeprecated'];
    }
    if (fieldOrEnumValue.deprecationReason != null) {
        return true;
    }
    if ((_b = (_a = fieldOrEnumValue.astNode) === null || _a === void 0 ? void 0 : _a.directives) === null || _b === void 0 ? void 0 : _b.some((directive) => directive.name.value === 'deprecated')) {
        return true;
    }
    return false;
}

function safeChangeForField(oldType, newType) {
    if (!graphql.isWrappingType(oldType) && !graphql.isWrappingType(newType)) {
        return oldType.toString() === newType.toString();
    }
    if (graphql.isNonNullType(newType)) {
        const ofType = graphql.isNonNullType(oldType) ? oldType.ofType : oldType;
        return safeChangeForField(ofType, newType.ofType);
    }
    if (graphql.isListType(oldType)) {
        return ((graphql.isListType(newType) &&
            safeChangeForField(oldType.ofType, newType.ofType)) ||
            (graphql.isNonNullType(newType) && safeChangeForField(oldType, newType.ofType)));
    }
    return false;
}
function safeChangeForInputValue(oldType, newType) {
    if (!graphql.isWrappingType(oldType) && !graphql.isWrappingType(newType)) {
        return oldType.toString() === newType.toString();
    }
    if (graphql.isListType(oldType) && graphql.isListType(newType)) {
        return safeChangeForInputValue(oldType.ofType, newType.ofType);
    }
    if (graphql.isNonNullType(oldType)) {
        const ofType = graphql.isNonNullType(newType) ? newType.ofType : newType;
        return safeChangeForInputValue(oldType.ofType, ofType);
    }
    return false;
}
function getKind(type) {
    const node = type.astNode;
    return (node && node.kind) || '';
}
function getTypePrefix(type) {
    const kind = getKind(type);
    const kindsMap = {
        [graphql.Kind.SCALAR_TYPE_DEFINITION]: 'scalar',
        [graphql.Kind.OBJECT_TYPE_DEFINITION]: 'type',
        [graphql.Kind.INTERFACE_TYPE_DEFINITION]: 'interface',
        [graphql.Kind.UNION_TYPE_DEFINITION]: 'union',
        [graphql.Kind.ENUM_TYPE_DEFINITION]: 'enum',
        [graphql.Kind.INPUT_OBJECT_TYPE_DEFINITION]: 'input',
    };
    return kindsMap[kind.toString()];
}
function isPrimitive(type) {
    return (['String', 'Int', 'Float', 'Boolean', 'ID'].indexOf(typeof type === 'string' ? type : type.name) !== -1);
}
function isForIntrospection(type) {
    return ([
        '__Schema',
        '__Type',
        '__TypeKind',
        '__Field',
        '__InputValue',
        '__EnumValue',
        '__Directive',
        '__DirectiveLocation',
    ].indexOf(typeof type === 'string' ? type : type.name) !== -1);
}
function findDeprecatedUsages(schema, ast) {
    const errors = [];
    const typeInfo = new graphql.TypeInfo(schema);
    graphql.visit(ast, graphql.visitWithTypeInfo(typeInfo, {
        Argument(node) {
            const argument = typeInfo.getArgument();
            if (argument) {
                const reason = argument.deprecationReason;
                if (reason) {
                    const fieldDef = typeInfo.getFieldDef();
                    if (fieldDef) {
                        errors.push(new graphql.GraphQLError(`The argument '${argument === null || argument === void 0 ? void 0 : argument.name}' of '${fieldDef.name}' is deprecated. ${reason}`, [node]));
                    }
                }
            }
        },
        Field(node) {
            const fieldDef = typeInfo.getFieldDef();
            if (fieldDef && isDeprecated(fieldDef)) {
                const parentType = typeInfo.getParentType();
                if (parentType) {
                    const reason = fieldDef.deprecationReason;
                    errors.push(new graphql.GraphQLError(`The field '${parentType.name}.${fieldDef.name}' is deprecated.${reason ? ' ' + reason : ''}`, [node]));
                }
            }
        },
        EnumValue(node) {
            const enumVal = typeInfo.getEnumValue();
            if (enumVal && isDeprecated(enumVal)) {
                const type = graphql.getNamedType(typeInfo.getInputType());
                if (type) {
                    const reason = enumVal.deprecationReason;
                    errors.push(new graphql.GraphQLError(`The enum value '${type.name}.${enumVal.name}' is deprecated.${reason ? ' ' + reason : ''}`, [node]));
                }
            }
        },
    }));
    return errors;
}
function removeFieldIfDirectives(node, directiveNames) {
    if (node.directives) {
        if (node.directives.some((d) => directiveNames.indexOf(d.name.value) !== -1)) {
            return null;
        }
    }
    return node;
}
function removeDirectives(node, directiveNames) {
    if (node.directives) {
        return Object.assign(Object.assign({}, node), { directives: node.directives.filter((d) => directiveNames.indexOf(d.name.value) === -1) });
    }
    return node;
}
function getReachableTypes(schema) {
    const reachableTypes = new Set();
    const collect = (type) => {
        const typeName = type.name;
        if (reachableTypes.has(typeName)) {
            return;
        }
        reachableTypes.add(typeName);
        if (graphql.isScalarType(type)) {
            return;
        }
        else if (graphql.isInterfaceType(type) || graphql.isObjectType(type)) {
            if (graphql.isInterfaceType(type)) {
                const { objects, interfaces } = schema.getImplementations(type);
                for (const child of objects) {
                    collect(child);
                }
                for (const child of interfaces) {
                    collect(child);
                }
            }
            const fields = type.getFields();
            for (const fieldName in fields) {
                const field = fields[fieldName];
                collect(resolveOutputType(field.type));
                const args = field.args;
                for (const argName in args) {
                    const arg = args[argName];
                    collect(resolveInputType(arg.type));
                }
            }
        }
        else if (graphql.isUnionType(type)) {
            const types = type.getTypes();
            for (const child of types) {
                collect(child);
            }
        }
        else if (graphql.isInputObjectType(type)) {
            const fields = type.getFields();
            for (const fieldName in fields) {
                const field = fields[fieldName];
                collect(resolveInputType(field.type));
            }
        }
    };
    for (const type of [
        schema.getQueryType(),
        schema.getMutationType(),
        schema.getSubscriptionType(),
    ]) {
        if (type) {
            collect(type);
        }
    }
    return reachableTypes;
}
function resolveOutputType(output) {
    if (graphql.isListType(output) || graphql.isNonNullType(output)) {
        return resolveOutputType(output.ofType);
    }
    return output;
}
function resolveInputType(input) {
    if (graphql.isListType(input) || graphql.isNonNullType(input)) {
        return resolveInputType(input.ofType);
    }
    return input;
}

(function (ChangeType) {
    // Argument
    ChangeType["FieldArgumentDescriptionChanged"] = "FIELD_ARGUMENT_DESCRIPTION_CHANGED";
    ChangeType["FieldArgumentDefaultChanged"] = "FIELD_ARGUMENT_DEFAULT_CHANGED";
    ChangeType["FieldArgumentTypeChanged"] = "FIELD_ARGUMENT_TYPE_CHANGED";
    // Directive
    ChangeType["DirectiveRemoved"] = "DIRECTIVE_REMOVED";
    ChangeType["DirectiveAdded"] = "DIRECTIVE_ADDED";
    ChangeType["DirectiveDescriptionChanged"] = "DIRECTIVE_DESCRIPTION_CHANGED";
    ChangeType["DirectiveLocationAdded"] = "DIRECTIVE_LOCATION_ADDED";
    ChangeType["DirectiveLocationRemoved"] = "DIRECTIVE_LOCATION_REMOVED";
    ChangeType["DirectiveArgumentAdded"] = "DIRECTIVE_ARGUMENT_ADDED";
    ChangeType["DirectiveArgumentRemoved"] = "DIRECTIVE_ARGUMENT_REMOVED";
    ChangeType["DirectiveArgumentDescriptionChanged"] = "DIRECTIVE_ARGUMENT_DESCRIPTION_CHANGED";
    ChangeType["DirectiveArgumentDefaultValueChanged"] = "DIRECTIVE_ARGUMENT_DEFAULT_VALUE_CHANGED";
    ChangeType["DirectiveArgumentTypeChanged"] = "DIRECTIVE_ARGUMENT_TYPE_CHANGED";
    // Enum
    ChangeType["EnumValueRemoved"] = "ENUM_VALUE_REMOVED";
    ChangeType["EnumValueAdded"] = "ENUM_VALUE_ADDED";
    ChangeType["EnumValueDescriptionChanged"] = "ENUM_VALUE_DESCRIPTION_CHANGED";
    ChangeType["EnumValueDeprecationReasonChanged"] = "ENUM_VALUE_DEPRECATION_REASON_CHANGED";
    ChangeType["EnumValueDeprecationReasonAdded"] = "ENUM_VALUE_DEPRECATION_REASON_ADDED";
    ChangeType["EnumValueDeprecationReasonRemoved"] = "ENUM_VALUE_DEPRECATION_REASON_REMOVED";
    // Field
    ChangeType["FieldRemoved"] = "FIELD_REMOVED";
    ChangeType["FieldAdded"] = "FIELD_ADDED";
    ChangeType["FieldDescriptionChanged"] = "FIELD_DESCRIPTION_CHANGED";
    ChangeType["FieldDescriptionAdded"] = "FIELD_DESCRIPTION_ADDED";
    ChangeType["FieldDescriptionRemoved"] = "FIELD_DESCRIPTION_REMOVED";
    ChangeType["FieldDeprecationAdded"] = "FIELD_DEPRECATION_ADDED";
    ChangeType["FieldDeprecationRemoved"] = "FIELD_DEPRECATION_REMOVED";
    ChangeType["FieldDeprecationReasonChanged"] = "FIELD_DEPRECATION_REASON_CHANGED";
    ChangeType["FieldDeprecationReasonAdded"] = "FIELD_DEPRECATION_REASON_ADDED";
    ChangeType["FieldDeprecationReasonRemoved"] = "FIELD_DEPRECATION_REASON_REMOVED";
    ChangeType["FieldTypeChanged"] = "FIELD_TYPE_CHANGED";
    ChangeType["FieldArgumentAdded"] = "FIELD_ARGUMENT_ADDED";
    ChangeType["FieldArgumentRemoved"] = "FIELD_ARGUMENT_REMOVED";
    // Input
    ChangeType["InputFieldRemoved"] = "INPUT_FIELD_REMOVED";
    ChangeType["InputFieldAdded"] = "INPUT_FIELD_ADDED";
    ChangeType["InputFieldDescriptionAdded"] = "INPUT_FIELD_DESCRIPTION_ADDED";
    ChangeType["InputFieldDescriptionRemoved"] = "INPUT_FIELD_DESCRIPTION_REMOVED";
    ChangeType["InputFieldDescriptionChanged"] = "INPUT_FIELD_DESCRIPTION_CHANGED";
    ChangeType["InputFieldDefaultValueChanged"] = "INPUT_FIELD_DEFAULT_VALUE_CHANGED";
    ChangeType["InputFieldTypeChanged"] = "INPUT_FIELD_TYPE_CHANGED";
    // Type
    ChangeType["ObjectTypeInterfaceAdded"] = "OBJECT_TYPE_INTERFACE_ADDED";
    ChangeType["ObjectTypeInterfaceRemoved"] = "OBJECT_TYPE_INTERFACE_REMOVED";
    // Schema
    ChangeType["SchemaQueryTypeChanged"] = "SCHEMA_QUERY_TYPE_CHANGED";
    ChangeType["SchemaMutationTypeChanged"] = "SCHEMA_MUTATION_TYPE_CHANGED";
    ChangeType["SchemaSubscriptionTypeChanged"] = "SCHEMA_SUBSCRIPTION_TYPE_CHANGED";
    // Type
    ChangeType["TypeRemoved"] = "TYPE_REMOVED";
    ChangeType["TypeAdded"] = "TYPE_ADDED";
    ChangeType["TypeKindChanged"] = "TYPE_KIND_CHANGED";
    ChangeType["TypeDescriptionChanged"] = "TYPE_DESCRIPTION_CHANGED";
    // TODO
    ChangeType["TypeDescriptionRemoved"] = "TYPE_DESCRIPTION_REMOVED";
    // TODO
    ChangeType["TypeDescriptionAdded"] = "TYPE_DESCRIPTION_ADDED";
    // Union
    ChangeType["UnionMemberRemoved"] = "UNION_MEMBER_REMOVED";
    ChangeType["UnionMemberAdded"] = "UNION_MEMBER_ADDED";
})(exports.ChangeType || (exports.ChangeType = {}));
(function (CriticalityLevel) {
    CriticalityLevel["Breaking"] = "BREAKING";
    CriticalityLevel["NonBreaking"] = "NON_BREAKING";
    CriticalityLevel["Dangerous"] = "DANGEROUS";
})(exports.CriticalityLevel || (exports.CriticalityLevel = {}));

function schemaQueryTypeChanged(oldSchema, newSchema) {
    const oldName = (oldSchema.getQueryType() || {}).name || 'unknown';
    const newName = (newSchema.getQueryType() || {}).name || 'unknown';
    return {
        criticality: {
            level: exports.CriticalityLevel.Breaking,
        },
        type: exports.ChangeType.SchemaQueryTypeChanged,
        message: `Schema query root has changed from '${oldName}' to '${newName}'`,
    };
}
function schemaMutationTypeChanged(oldSchema, newSchema) {
    const oldName = (oldSchema.getMutationType() || {}).name || 'unknown';
    const newName = (newSchema.getMutationType() || {}).name || 'unknown';
    return {
        criticality: {
            level: exports.CriticalityLevel.Breaking,
        },
        type: exports.ChangeType.SchemaMutationTypeChanged,
        message: `Schema mutation root has changed from '${oldName}' to '${newName}'`,
    };
}
function schemaSubscriptionTypeChanged(oldSchema, newSchema) {
    const oldName = (oldSchema.getSubscriptionType() || {}).name || 'unknown';
    const newName = (newSchema.getSubscriptionType() || {}).name || 'unknown';
    return {
        criticality: {
            level: exports.CriticalityLevel.Breaking,
        },
        type: exports.ChangeType.SchemaSubscriptionTypeChanged,
        message: `Schema subscription root has changed from '${oldName}' to '${newName}'`,
    };
}

function typeRemoved(type) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Breaking,
        },
        type: exports.ChangeType.TypeRemoved,
        message: `Type '${type.name}' was removed`,
        path: type.name,
    };
}
function typeAdded(type) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.TypeAdded,
        message: `Type '${type.name}' was added`,
        path: type.name,
    };
}
function typeKindChanged(oldType, newType) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Breaking,
            reason: `Changing the kind of a type is a breaking change because it can cause existing queries to error. For example, turning an object type to a scalar type would break queries that define a selection set for this type.`,
        },
        type: exports.ChangeType.TypeKindChanged,
        message: `'${oldType.name}' kind changed from '${getKind(oldType)}' to '${getKind(newType)}'`,
        path: oldType.name,
    };
}
function typeDescriptionChanged(oldType, newType) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.TypeDescriptionChanged,
        message: `Description '${oldType.description}' on type '${oldType.name}' has changed to '${newType.description}'`,
        path: oldType.name,
    };
}
function typeDescriptionRemoved(type) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.TypeDescriptionRemoved,
        message: `Description '${type.description}' was removed from object type '${type.name}'`,
        path: type.name,
    };
}
function typeDescriptionAdded(type) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.TypeDescriptionAdded,
        message: `Object type '${type.name}' has description '${type.description}'`,
        path: type.name,
    };
}

function directiveRemoved(directive) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Breaking,
        },
        type: exports.ChangeType.DirectiveRemoved,
        message: `Directive '${directive.name}' was removed`,
        path: `@${directive.name}`,
    };
}
function directiveAdded(directive) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.DirectiveAdded,
        message: `Directive '${directive.name}' was added`,
        path: `@${directive.name}`,
    };
}
function directiveDescriptionChanged(oldDirective, newDirective) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.DirectiveDescriptionChanged,
        message: `Directive '${oldDirective.name}' description changed from '${oldDirective.description}' to '${newDirective.description}'`,
        path: `@${oldDirective.name}`,
    };
}
function directiveLocationAdded(directive, location) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.DirectiveLocationAdded,
        message: `Location '${location}' was added to directive '${directive.name}'`,
        path: `@${directive.name}`,
    };
}
function directiveLocationRemoved(directive, location) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Breaking,
        },
        type: exports.ChangeType.DirectiveLocationRemoved,
        message: `Location '${location}' was removed from directive '${directive.name}'`,
        path: `@${directive.name}`,
    };
}
function directiveArgumentAdded(directive, arg) {
    return {
        criticality: {
            level: graphql.isNonNullType(arg.type)
                ? exports.CriticalityLevel.Breaking
                : exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.DirectiveArgumentAdded,
        message: `Argument '${arg.name}' was added to directive '${directive.name}'`,
        path: `@${directive.name}`,
    };
}
function directiveArgumentRemoved(directive, arg) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Breaking,
        },
        type: exports.ChangeType.DirectiveArgumentRemoved,
        message: `Argument '${arg.name}' was removed from directive '${directive.name}'`,
        path: `@${directive.name}.${arg.name}`,
    };
}
function directiveArgumentDescriptionChanged(directive, oldArg, newArg) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.DirectiveArgumentDescriptionChanged,
        message: `Description for argument '${oldArg.name}' on directive '${directive.name}' changed from '${oldArg.description}' to '${newArg.description}'`,
        path: `@${directive.name}.${oldArg.name}`,
    };
}
function directiveArgumentDefaultValueChanged(directive, oldArg, newArg) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Dangerous,
            reason: 'Changing the default value for an argument may change the runtime behaviour of a field if it was never provided.',
        },
        type: exports.ChangeType.DirectiveArgumentDefaultValueChanged,
        message: typeof oldArg.defaultValue === 'undefined'
            ? `Default value '${newArg.defaultValue}' was added to argument '${newArg.name}' on directive '${directive.name}'`
            : `Default value for argument '${oldArg.name}' on directive '${directive.name}' changed from '${oldArg.defaultValue}' to '${newArg.defaultValue}'`,
        path: `@${directive.name}.${oldArg.name}`,
    };
}
function directiveArgumentTypeChanged(directive, oldArg, newArg) {
    return {
        criticality: safeChangeForInputValue(oldArg.type, newArg.type)
            ? {
                level: exports.CriticalityLevel.NonBreaking,
                reason: 'Changing an input field from non-null to null is considered non-breaking.',
            }
            : {
                level: exports.CriticalityLevel.Breaking,
            },
        type: exports.ChangeType.DirectiveArgumentTypeChanged,
        message: `Type for argument '${oldArg.name}' on directive '${directive.name}' changed from '${oldArg.type}' to '${newArg.type}'`,
        path: `@${directive.name}.${oldArg.name}`,
    };
}

function enumValueRemoved(oldEnum, value) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Breaking,
            reason: `Removing an enum value will cause existing queries that use this enum value to error.`,
        },
        type: exports.ChangeType.EnumValueRemoved,
        message: `Enum value '${value.name}' ${isDeprecated(value) ? '(deprecated) ' : ''}was removed from enum '${oldEnum.name}'`,
        path: [oldEnum.name, value.name].join('.'),
    };
}
function enumValueAdded(newEnum, value) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Dangerous,
            reason: `Adding an enum value may break existing clients that were not programming defensively against an added case when querying an enum.`,
        },
        type: exports.ChangeType.EnumValueAdded,
        message: `Enum value '${value.name}' was added to enum '${newEnum.name}'`,
        path: [newEnum.name, value.name].join('.'),
    };
}
function enumValueDescriptionChanged(newEnum, oldValue, newValue) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.EnumValueDescriptionChanged,
        message: typeof oldValue.description === 'undefined'
            ? `Description '${newValue.description}' was added to enum value '${newEnum.name}.${newValue.name}'`
            : `Description for enum value '${newEnum.name}.${newValue.name}' changed from '${oldValue.description}' to '${newValue.description}'`,
        path: [newEnum.name, oldValue.name].join('.'),
    };
}
function enumValueDeprecationReasonChanged(newEnum, oldValue, newValue) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.EnumValueDeprecationReasonChanged,
        message: `Enum value '${newEnum.name}.${newValue.name}' deprecation reason changed from '${oldValue.deprecationReason}' to '${newValue.deprecationReason}'`,
        path: [newEnum.name, oldValue.name].join('.'),
    };
}
function enumValueDeprecationReasonAdded(newEnum, oldValue, newValue) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.EnumValueDeprecationReasonAdded,
        message: `Enum value '${newEnum.name}.${newValue.name}' was deprecated with reason '${newValue.deprecationReason}'`,
        path: [newEnum.name, oldValue.name].join('.'),
    };
}
function enumValueDeprecationReasonRemoved(newEnum, oldValue, newValue) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.EnumValueDeprecationReasonRemoved,
        message: `Deprecation reason was removed from enum value '${newEnum.name}.${newValue.name}'`,
        path: [newEnum.name, oldValue.name].join('.'),
    };
}

function changesInEnum(oldEnum, newEnum, addChange) {
    compareLists(oldEnum.getValues(), newEnum.getValues(), {
        onAdded(value) {
            addChange(enumValueAdded(newEnum, value));
        },
        onRemoved(value) {
            addChange(enumValueRemoved(oldEnum, value));
        },
        onMutual(value) {
            const oldValue = value.oldVersion;
            const newValue = value.newVersion;
            if (isNotEqual(oldValue.description, newValue.description)) {
                addChange(enumValueDescriptionChanged(newEnum, oldValue, newValue));
            }
            if (isNotEqual(oldValue.deprecationReason, newValue.deprecationReason)) {
                if (isVoid(oldValue.deprecationReason)) {
                    addChange(enumValueDeprecationReasonAdded(newEnum, oldValue, newValue));
                }
                else if (isVoid(newValue.deprecationReason)) {
                    addChange(enumValueDeprecationReasonRemoved(newEnum, oldValue, newValue));
                }
                else {
                    addChange(enumValueDeprecationReasonChanged(newEnum, oldValue, newValue));
                }
            }
        },
    });
}

function unionMemberRemoved(union, type) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Breaking,
            reason: 'Removing a union member from a union can cause existing queries that use this union member in a fragment spread to error.',
        },
        type: exports.ChangeType.UnionMemberRemoved,
        message: `Member '${type.name}' was removed from Union type '${union.name}'`,
        path: union.name,
    };
}
function unionMemberAdded(union, type) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Dangerous,
            reason: 'Adding a possible type to Unions may break existing clients that were not programming defensively against a new possible type.',
        },
        type: exports.ChangeType.UnionMemberAdded,
        message: `Member '${type.name}' was added to Union type '${union.name}'`,
        path: union.name,
    };
}

function changesInUnion(oldUnion, newUnion, addChange) {
    const oldTypes = oldUnion.getTypes();
    const newTypes = newUnion.getTypes();
    compareLists(oldTypes, newTypes, {
        onAdded(t) {
            addChange(unionMemberAdded(newUnion, t));
        },
        onRemoved(t) {
            addChange(unionMemberRemoved(oldUnion, t));
        },
    });
}

function compareTwoStrings(str1, str2) {
    if (!str1.length && !str2.length)
        return 1;
    if (!str1.length || !str2.length)
        return 0;
    if (str1.toUpperCase() === str2.toUpperCase())
        return 1;
    if (str1.length === 1 && str2.length === 1)
        return 0;
    const pairs1 = wordLetterPairs(str1);
    const pairs2 = wordLetterPairs(str2);
    const union = pairs1.length + pairs2.length;
    let intersection = 0;
    pairs1.forEach((pair1) => {
        for (let i = 0, pair2; (pair2 = pairs2[i]); i++) {
            if (pair1 !== pair2)
                continue;
            intersection++;
            pairs2.splice(i, 1);
            break;
        }
    });
    return (intersection * 2) / union;
}
function findBestMatch(mainString, targetStrings) {
    if (!areArgsValid(mainString, targetStrings))
        throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');
    const ratings = targetStrings.map((target) => ({
        target,
        rating: compareTwoStrings(mainString, target.value),
    }));
    const bestMatch = Array.from(ratings).sort((a, b) => b.rating - a.rating)[0];
    return { ratings, bestMatch };
}
function flattenDeep(arr) {
    return Array.isArray(arr)
        ? arr.reduce((a, b) => a.concat(flattenDeep(b)), [])
        : [arr];
}
function areArgsValid(mainString, targetStrings) {
    if (typeof mainString !== 'string')
        return false;
    if (!Array.isArray(targetStrings))
        return false;
    if (!targetStrings.length)
        return false;
    if (targetStrings.find((s) => typeof s.value !== 'string'))
        return false;
    return true;
}
function letterPairs(str) {
    const pairs = [];
    for (let i = 0, max = str.length - 1; i < max; i++)
        pairs[i] = str.substring(i, i + 2);
    return pairs;
}
function wordLetterPairs(str) {
    const pairs = str.toUpperCase().split(' ').map(letterPairs);
    return flattenDeep(pairs);
}
function safeString(obj) {
    return inspect(obj).replace(/\[Object\: null prototype\] /g, '').replace(/(^')|('$)/g, '');
}

function inputFieldRemoved(input, field) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Breaking,
            reason: 'Removing an input field will cause existing queries that use this input field to error.',
        },
        type: exports.ChangeType.InputFieldRemoved,
        message: `Input field '${field.name}' ${isDeprecated(field) ? '(deprecated) ' : ''}was removed from input object type '${input.name}'`,
        path: [input.name, field.name].join('.'),
    };
}
function inputFieldAdded(input, field) {
    return {
        criticality: graphql.isNonNullType(field.type)
            ? {
                level: exports.CriticalityLevel.Breaking,
                reason: 'Adding a required input field to an existing input object type is a breaking change because it will cause existing uses of this input object type to error.',
            }
            : {
                level: exports.CriticalityLevel.Dangerous,
            },
        type: exports.ChangeType.InputFieldAdded,
        message: `Input field '${field.name}' was added to input object type '${input.name}'`,
        path: [input.name, field.name].join('.'),
    };
}
function inputFieldDescriptionAdded(type, field) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.InputFieldDescriptionAdded,
        message: `Input field '${type.name}.${field.name}' has description '${field.description}'`,
        path: [type.name, field.name].join('.'),
    };
}
function inputFieldDescriptionRemoved(type, field) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.InputFieldDescriptionRemoved,
        message: `Description was removed from input field '${type.name}.${field.name}'`,
        path: [type.name, field.name].join('.'),
    };
}
function inputFieldDescriptionChanged(input, oldField, newField) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.InputFieldDescriptionChanged,
        message: `Input field '${input.name}.${oldField.name}' description changed from '${oldField.description}' to '${newField.description}'`,
        path: [input.name, oldField.name].join('.'),
    };
}
function inputFieldDefaultValueChanged(input, oldField, newField) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Dangerous,
            reason: 'Changing the default value for an argument may change the runtime behavior of a field if it was never provided.',
        },
        type: exports.ChangeType.InputFieldDefaultValueChanged,
        message: `Input field '${input.name}.${oldField.name}' default value changed from '${safeString(oldField.defaultValue)}' to '${safeString(newField.defaultValue)}'`,
        path: [input.name, oldField.name].join('.'),
    };
}
function inputFieldTypeChanged(input, oldField, newField) {
    return {
        criticality: safeChangeForInputValue(oldField.type, newField.type)
            ? {
                level: exports.CriticalityLevel.NonBreaking,
                reason: 'Changing an input field from non-null to null is considered non-breaking.',
            }
            : {
                level: exports.CriticalityLevel.Breaking,
                reason: 'Changing the type of an input field can cause existing queries that use this field to error.',
            },
        type: exports.ChangeType.InputFieldTypeChanged,
        message: `Input field '${input.name}.${oldField.name}' changed type from '${oldField.type.toString()}' to '${newField.type.toString()}'`,
        path: [input.name, oldField.name].join('.'),
    };
}

function changesInInputObject(oldInput, newInput, addChange) {
    const oldFields = oldInput.getFields();
    const newFields = newInput.getFields();
    compareLists(Object.values(oldFields), Object.values(newFields), {
        onAdded(field) {
            addChange(inputFieldAdded(newInput, field));
        },
        onRemoved(field) {
            addChange(inputFieldRemoved(oldInput, field));
        },
        onMutual(field) {
            changesInInputField(oldInput, field.oldVersion, field.newVersion, addChange);
        },
    });
}
function changesInInputField(input, oldField, newField, addChange) {
    if (isNotEqual(oldField.description, newField.description)) {
        if (isVoid(oldField.description)) {
            addChange(inputFieldDescriptionAdded(input, newField));
        }
        else if (isVoid(newField.description)) {
            addChange(inputFieldDescriptionRemoved(input, oldField));
        }
        else {
            addChange(inputFieldDescriptionChanged(input, oldField, newField));
        }
    }
    if (isNotEqual(oldField.defaultValue, newField.defaultValue)) {
        if (Array.isArray(oldField.defaultValue) &&
            Array.isArray(newField.defaultValue)) {
            if (diffArrays(oldField.defaultValue, newField.defaultValue).length > 0) {
                addChange(inputFieldDefaultValueChanged(input, oldField, newField));
            }
        }
        else if (JSON.stringify(oldField.defaultValue) !==
            JSON.stringify(newField.defaultValue)) {
            addChange(inputFieldDefaultValueChanged(input, oldField, newField));
        }
    }
    if (isNotEqual(oldField.type.toString(), newField.type.toString())) {
        addChange(inputFieldTypeChanged(input, oldField, newField));
    }
}

function objectTypeInterfaceAdded(iface, type) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Dangerous,
            reason: 'Adding an interface to an object type may break existing clients that were not programming defensively against a new possible type.',
        },
        type: exports.ChangeType.ObjectTypeInterfaceAdded,
        message: `'${type.name}' object implements '${iface.name}' interface`,
        path: type.name,
    };
}
function objectTypeInterfaceRemoved(iface, type) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Breaking,
            reason: 'Removing an interface from an object type can cause existing queries that use this in a fragment spread to error.',
        },
        type: exports.ChangeType.ObjectTypeInterfaceRemoved,
        message: `'${type.name}' object type no longer implements '${iface.name}' interface`,
        path: type.name,
    };
}

function fieldRemoved(type, field) {
    const entity = graphql.isInterfaceType(type) ? 'interface' : 'object type';
    return {
        criticality: {
            level: exports.CriticalityLevel.Breaking,
            reason: field.deprecationReason
                ? `Removing a deprecated field is a breaking change. Before removing it, you may want to look at the field's usage to see the impact of removing the field.`
                : `Removing a field is a breaking change. It is preferable to deprecate the field before removing it.`,
        },
        type: exports.ChangeType.FieldRemoved,
        message: `Field '${field.name}' ${isDeprecated(field) ? '(deprecated) ' : ''}was removed from ${entity} '${type.name}'`,
        path: [type.name, field.name].join('.'),
    };
}
function fieldAdded(type, field) {
    const entity = graphql.isInterfaceType(type) ? 'interface' : 'object type';
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.FieldAdded,
        message: `Field '${field.name}' was added to ${entity} '${type.name}'`,
        path: [type.name, field.name].join('.'),
    };
}
function fieldDescriptionChanged(type, oldField, newField) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.FieldDescriptionChanged,
        message: `Field '${type.name}.${oldField.name}' description changed from '${oldField.description}' to '${newField.description}'`,
        path: [type.name, oldField.name].join('.'),
    };
}
function fieldDescriptionAdded(type, field) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.FieldDescriptionAdded,
        message: `Field '${type.name}.${field.name}' has description '${field.description}'`,
        path: [type.name, field.name].join('.'),
    };
}
function fieldDescriptionRemoved(type, field) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.FieldDescriptionRemoved,
        message: `Description was removed from field '${type.name}.${field.name}'`,
        path: [type.name, field.name].join('.'),
    };
}
function fieldDeprecationAdded(type, field) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.FieldDeprecationAdded,
        message: `Field '${type.name}.${field.name}' is deprecated`,
        path: [type.name, field.name].join('.'),
    };
}
function fieldDeprecationRemoved(type, field) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Dangerous,
        },
        type: exports.ChangeType.FieldDeprecationRemoved,
        message: `Field '${type.name}.${field.name}' is no longer deprecated`,
        path: [type.name, field.name].join('.'),
    };
}
function fieldDeprecationReasonChanged(type, oldField, newField) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.FieldDeprecationReasonChanged,
        message: `Deprecation reason on field '${type.name}.${newField.name}' has changed from '${oldField.deprecationReason}' to '${newField.deprecationReason}'`,
        path: [type.name, oldField.name].join('.'),
    };
}
function fieldDeprecationReasonAdded(type, field) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.FieldDeprecationReasonAdded,
        message: `Field '${type.name}.${field.name}' has deprecation reason '${field.deprecationReason}'`,
        path: [type.name, field.name].join('.'),
    };
}
function fieldDeprecationReasonRemoved(type, field) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.FieldDeprecationReasonRemoved,
        message: `Deprecation reason was removed from field '${type.name}.${field.name}'`,
        path: [type.name, field.name].join('.'),
    };
}
function fieldTypeChanged(type, oldField, newField) {
    return {
        criticality: {
            level: safeChangeForField(oldField.type, newField.type)
                ? exports.CriticalityLevel.NonBreaking
                : exports.CriticalityLevel.Breaking,
        },
        type: exports.ChangeType.FieldTypeChanged,
        message: `Field '${type}.${oldField.name}' changed type from '${oldField.type}' to '${newField.type}'`,
        path: [type.name, oldField.name].join('.'),
    };
}
function fieldArgumentAdded(type, field, arg) {
    const isBreaking = graphql.isNonNullType(arg.type) && typeof arg.defaultValue === 'undefined';
    const defaultValueMsg = typeof arg.defaultValue !== 'undefined' ? ' (with default value) ' : ' ';
    return {
        criticality: isBreaking
            ? {
                level: exports.CriticalityLevel.Breaking,
                reason: `Adding a required argument to an existing field is a breaking change because it will cause existing uses of this field to error.`,
            }
            : {
                level: exports.CriticalityLevel.Dangerous,
                reason: `Adding a new argument to an existing field may involve a change in resolve function logic that potentially may cause some side effects.`,
            },
        type: exports.ChangeType.FieldArgumentAdded,
        message: `Argument '${arg.name}: ${arg.type}'${defaultValueMsg}added to field '${type.name}.${field.name}'`,
        path: [type.name, field.name, arg.name].join('.'),
    };
}
function fieldArgumentRemoved(type, field, arg) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Breaking,
            reason: `Removing a field argument is a breaking change because it will cause existing queries that use this argument to error.`,
        },
        type: exports.ChangeType.FieldArgumentRemoved,
        message: `Argument '${arg.name}: ${arg.type}' was removed from field '${type.name}.${field.name}'`,
        path: [type.name, field.name, arg.name].join('.'),
    };
}

function fieldArgumentDescriptionChanged(type, field, oldArg, newArg) {
    return {
        criticality: {
            level: exports.CriticalityLevel.NonBreaking,
        },
        type: exports.ChangeType.FieldArgumentDescriptionChanged,
        message: `Description for argument '${newArg.name}' on field '${type.name}.${field.name}' changed from '${oldArg.description}' to '${newArg.description}'`,
        path: [type.name, field.name, oldArg.name].join('.'),
    };
}
function fieldArgumentDefaultChanged(type, field, oldArg, newArg) {
    return {
        criticality: {
            level: exports.CriticalityLevel.Dangerous,
            reason: 'Changing the default value for an argument may change the runtime behaviour of a field if it was never provided.',
        },
        type: exports.ChangeType.FieldArgumentDefaultChanged,
        message: typeof oldArg.defaultValue === 'undefined'
            ? `Default value '${safeString(newArg.defaultValue)}' was added to argument '${newArg.name}' on field '${type.name}.${field.name}'`
            : `Default value for argument '${newArg.name}' on field '${type.name}.${field.name}' changed from '${safeString(oldArg.defaultValue)}' to '${safeString(newArg.defaultValue)}'`,
        path: [type.name, field.name, oldArg.name].join('.'),
    };
}
function fieldArgumentTypeChanged(type, field, oldArg, newArg) {
    return {
        criticality: safeChangeForInputValue(oldArg.type, newArg.type)
            ? {
                level: exports.CriticalityLevel.NonBreaking,
                reason: `Changing an input field from non-null to null is considered non-breaking.`,
            }
            : {
                level: exports.CriticalityLevel.Breaking,
                reason: `Changing the type of a field's argument can cause existing queries that use this argument to error.`,
            },
        type: exports.ChangeType.FieldArgumentTypeChanged,
        message: `Type for argument '${newArg.name}' on field '${type.name}.${field.name}' changed from '${oldArg.type}' to '${newArg.type}'`,
        path: [type.name, field.name, oldArg.name].join('.'),
    };
}

function changesInArgument(type, field, oldArg, newArg, addChange) {
    if (isNotEqual(oldArg.description, newArg.description)) {
        addChange(fieldArgumentDescriptionChanged(type, field, oldArg, newArg));
    }
    if (isNotEqual(oldArg.defaultValue, newArg.defaultValue)) {
        if (Array.isArray(oldArg.defaultValue) &&
            Array.isArray(newArg.defaultValue)) {
            const diff = diffArrays(oldArg.defaultValue, newArg.defaultValue);
            if (diff.length > 0) {
                addChange(fieldArgumentDefaultChanged(type, field, oldArg, newArg));
            }
        }
        else if (JSON.stringify(oldArg.defaultValue) !==
            JSON.stringify(newArg.defaultValue)) {
            addChange(fieldArgumentDefaultChanged(type, field, oldArg, newArg));
        }
    }
    if (isNotEqual(oldArg.type.toString(), newArg.type.toString())) {
        addChange(fieldArgumentTypeChanged(type, field, oldArg, newArg));
    }
}

function changesInField(type, oldField, newField, addChange) {
    if (isNotEqual(oldField.description, newField.description)) {
        if (isVoid(oldField.description)) {
            addChange(fieldDescriptionAdded(type, newField));
        }
        else if (isVoid(newField.description)) {
            addChange(fieldDescriptionRemoved(type, oldField));
        }
        else {
            addChange(fieldDescriptionChanged(type, oldField, newField));
        }
    }
    if (isNotEqual(isDeprecated(oldField), isDeprecated(newField))) {
        if (isDeprecated(newField)) {
            addChange(fieldDeprecationAdded(type, newField));
        }
        else {
            addChange(fieldDeprecationRemoved(type, oldField));
        }
    }
    if (isNotEqual(oldField.deprecationReason, newField.deprecationReason)) {
        if (isVoid(oldField.deprecationReason)) {
            addChange(fieldDeprecationReasonAdded(type, newField));
        }
        else if (isVoid(newField.deprecationReason)) {
            addChange(fieldDeprecationReasonRemoved(type, oldField));
        }
        else {
            addChange(fieldDeprecationReasonChanged(type, oldField, newField));
        }
    }
    if (isNotEqual(oldField.type.toString(), newField.type.toString())) {
        addChange(fieldTypeChanged(type, oldField, newField));
    }
    compareLists(oldField.args, newField.args, {
        onAdded(arg) {
            addChange(fieldArgumentAdded(type, newField, arg));
        },
        onRemoved(arg) {
            addChange(fieldArgumentRemoved(type, oldField, arg));
        },
        onMutual(arg) {
            changesInArgument(type, oldField, arg.oldVersion, arg.newVersion, addChange);
        },
    });
}

function changesInObject(oldType, newType, addChange) {
    const oldInterfaces = oldType.getInterfaces();
    const newInterfaces = newType.getInterfaces();
    const oldFields = oldType.getFields();
    const newFields = newType.getFields();
    compareLists(oldInterfaces, newInterfaces, {
        onAdded(i) {
            addChange(objectTypeInterfaceAdded(i, newType));
        },
        onRemoved(i) {
            addChange(objectTypeInterfaceRemoved(i, oldType));
        },
    });
    compareLists(Object.values(oldFields), Object.values(newFields), {
        onAdded(f) {
            addChange(fieldAdded(newType, f));
        },
        onRemoved(f) {
            addChange(fieldRemoved(oldType, f));
        },
        onMutual(f) {
            changesInField(oldType, f.oldVersion, f.newVersion, addChange);
        },
    });
}

function changesInInterface(oldInterface, newInterface, addChange) {
    compareLists(Object.values(oldInterface.getFields()), Object.values(newInterface.getFields()), {
        onAdded(field) {
            addChange(fieldAdded(newInterface, field));
        },
        onRemoved(field) {
            addChange(fieldRemoved(oldInterface, field));
        },
        onMutual(field) {
            changesInField(oldInterface, field.oldVersion, field.newVersion, addChange);
        },
    });
}

function changesInDirective(oldDirective, newDirective, addChange) {
    if (isNotEqual(oldDirective.description, newDirective.description)) {
        addChange(directiveDescriptionChanged(oldDirective, newDirective));
    }
    const locations = {
        added: diffArrays(newDirective.locations, oldDirective.locations),
        removed: diffArrays(oldDirective.locations, newDirective.locations),
    };
    // locations added
    locations.added.forEach((location) => addChange(directiveLocationAdded(newDirective, location)));
    // locations removed
    locations.removed.forEach((location) => addChange(directiveLocationRemoved(oldDirective, location)));
    compareLists(oldDirective.args, newDirective.args, {
        onAdded(arg) {
            addChange(directiveArgumentAdded(newDirective, arg));
        },
        onRemoved(arg) {
            addChange(directiveArgumentRemoved(oldDirective, arg));
        },
        onMutual(arg) {
            changesInDirectiveArgument(oldDirective, arg.oldVersion, arg.newVersion, addChange);
        },
    });
}
function changesInDirectiveArgument(directive, oldArg, newArg, addChange) {
    if (isNotEqual(oldArg.description, newArg.description)) {
        addChange(directiveArgumentDescriptionChanged(directive, oldArg, newArg));
    }
    if (isNotEqual(oldArg.defaultValue, newArg.defaultValue)) {
        addChange(directiveArgumentDefaultValueChanged(directive, oldArg, newArg));
    }
    if (isNotEqual(oldArg.type.toString(), newArg.type.toString())) {
        addChange(directiveArgumentTypeChanged(directive, oldArg, newArg));
    }
}

function diffSchema(oldSchema, newSchema) {
    const changes = [];
    function addChange(change) {
        changes.push(change);
    }
    changesInSchema(oldSchema, newSchema, addChange);
    compareLists(Object.values(oldSchema.getTypeMap()).filter((t) => !isPrimitive(t)), Object.values(newSchema.getTypeMap()).filter((t) => !isPrimitive(t)), {
        onAdded(type) {
            addChange(typeAdded(type));
        },
        onRemoved(type) {
            addChange(typeRemoved(type));
        },
        onMutual(type) {
            changesInType(type.oldVersion, type.newVersion, addChange);
        },
    });
    compareLists(oldSchema.getDirectives(), newSchema.getDirectives(), {
        onAdded(directive) {
            addChange(directiveAdded(directive));
        },
        onRemoved(directive) {
            addChange(directiveRemoved(directive));
        },
        onMutual(directive) {
            changesInDirective(directive.oldVersion, directive.newVersion, addChange);
        },
    });
    return changes;
}
function changesInSchema(oldSchema, newSchema, addChange) {
    var _a, _b, _c, _d, _e, _f;
    const defaultNames = {
        query: 'Query',
        mutation: 'Mutation',
        subscription: 'Subscription',
    };
    const oldRoot = {
        query: (_a = (oldSchema.getQueryType() || {}).name) !== null && _a !== void 0 ? _a : defaultNames.query,
        mutation: (_b = (oldSchema.getMutationType() || {}).name) !== null && _b !== void 0 ? _b : defaultNames.mutation,
        subscription: (_c = (oldSchema.getSubscriptionType() || {}).name) !== null && _c !== void 0 ? _c : defaultNames.subscription,
    };
    const newRoot = {
        query: (_d = (newSchema.getQueryType() || {}).name) !== null && _d !== void 0 ? _d : defaultNames.query,
        mutation: (_e = (newSchema.getMutationType() || {}).name) !== null && _e !== void 0 ? _e : defaultNames.mutation,
        subscription: (_f = (newSchema.getSubscriptionType() || {}).name) !== null && _f !== void 0 ? _f : defaultNames.subscription,
    };
    if (isNotEqual(oldRoot.query, newRoot.query)) {
        addChange(schemaQueryTypeChanged(oldSchema, newSchema));
    }
    if (isNotEqual(oldRoot.mutation, newRoot.mutation)) {
        addChange(schemaMutationTypeChanged(oldSchema, newSchema));
    }
    if (isNotEqual(oldRoot.subscription, newRoot.subscription)) {
        addChange(schemaSubscriptionTypeChanged(oldSchema, newSchema));
    }
}
function changesInType(oldType, newType, addChange) {
    if (graphql.isEnumType(oldType) && graphql.isEnumType(newType)) {
        changesInEnum(oldType, newType, addChange);
    }
    else if (graphql.isUnionType(oldType) && graphql.isUnionType(newType)) {
        changesInUnion(oldType, newType, addChange);
    }
    else if (graphql.isInputObjectType(oldType) && graphql.isInputObjectType(newType)) {
        changesInInputObject(oldType, newType, addChange);
    }
    else if (graphql.isObjectType(oldType) && graphql.isObjectType(newType)) {
        changesInObject(oldType, newType, addChange);
    }
    else if (graphql.isInterfaceType(oldType) && graphql.isInterfaceType(newType)) {
        changesInInterface(oldType, newType, addChange);
    }
    else if (graphql.isScalarType(oldType) && graphql.isScalarType(newType)) ;
    else {
        addChange(typeKindChanged(oldType, newType));
    }
    if (isNotEqual(oldType.description, newType.description)) {
        if (isVoid(oldType.description)) {
            addChange(typeDescriptionAdded(newType));
        }
        else if (isVoid(newType.description)) {
            addChange(typeDescriptionRemoved(oldType));
        }
        else {
            addChange(typeDescriptionChanged(oldType, newType));
        }
    }
}

const dangerousBreaking = ({ changes }) => {
    return changes.map((change) => {
        if (change.criticality.level === exports.CriticalityLevel.Dangerous) {
            return Object.assign(Object.assign({}, change), { criticality: Object.assign(Object.assign({}, change.criticality), { level: exports.CriticalityLevel.Breaking }) });
        }
        return change;
    });
};

function parsePath(path) {
    return path.split('.');
}

const suppressRemovalOfDeprecatedField = ({ changes, oldSchema, }) => {
    return changes.map((change) => {
        if (change.type === exports.ChangeType.FieldRemoved &&
            change.criticality.level === exports.CriticalityLevel.Breaking &&
            change.path) {
            const [typeName, fieldName] = parsePath(change.path);
            const type = oldSchema.getType(typeName);
            if (graphql.isObjectType(type) || graphql.isInterfaceType(type)) {
                const field = type.getFields()[fieldName];
                if (isDeprecated(field)) {
                    return Object.assign(Object.assign({}, change), { criticality: Object.assign(Object.assign({}, change.criticality), { level: exports.CriticalityLevel.Dangerous }) });
                }
            }
        }
        if (change.type === exports.ChangeType.EnumValueRemoved &&
            change.criticality.level === exports.CriticalityLevel.Breaking &&
            change.path) {
            const [enumName, enumItem] = parsePath(change.path);
            const type = oldSchema.getType(enumName);
            if (graphql.isEnumType(type)) {
                const item = type.getValue(enumItem);
                if (item && isDeprecated(item)) {
                    return Object.assign(Object.assign({}, change), { criticality: Object.assign(Object.assign({}, change.criticality), { level: exports.CriticalityLevel.Dangerous }) });
                }
            }
        }
        if (change.type === exports.ChangeType.InputFieldRemoved &&
            change.criticality.level === exports.CriticalityLevel.Breaking &&
            change.path) {
            const [inputName, inputItem] = parsePath(change.path);
            const type = oldSchema.getType(inputName);
            if (graphql.isInputObjectType(type)) {
                const item = type.getFields()[inputItem];
                if (item && isDeprecated(item)) {
                    return Object.assign(Object.assign({}, change), { criticality: Object.assign(Object.assign({}, change.criticality), { level: exports.CriticalityLevel.Dangerous }) });
                }
            }
        }
        return change;
    });
};

const descriptionChangeTypes = [
    exports.ChangeType.FieldArgumentDescriptionChanged,
    exports.ChangeType.DirectiveDescriptionChanged,
    exports.ChangeType.DirectiveArgumentDescriptionChanged,
    exports.ChangeType.EnumValueDescriptionChanged,
    exports.ChangeType.FieldDescriptionChanged,
    exports.ChangeType.FieldDescriptionAdded,
    exports.ChangeType.FieldDescriptionRemoved,
    exports.ChangeType.InputFieldDescriptionAdded,
    exports.ChangeType.InputFieldDescriptionRemoved,
    exports.ChangeType.InputFieldDescriptionChanged,
    exports.ChangeType.TypeDescriptionChanged,
];
const ignoreDescriptionChanges = ({ changes }) => {
    return changes.filter((change) => descriptionChangeTypes.indexOf(change.type) === -1);
};

const considerUsage = ({ changes, config, }) => tslib.__awaiter(void 0, void 0, void 0, function* () {
    if (!config) {
        throw new Error(`considerUsage rule is missing config`);
    }
    const collectedBreakingField = [];
    changes.forEach((change) => {
        if (change.criticality.level === exports.CriticalityLevel.Breaking && change.path) {
            const [typeName, fieldName, argumentName] = parsePath(change.path);
            collectedBreakingField.push({
                type: typeName,
                field: fieldName,
                argument: argumentName,
            });
        }
    });
    // True if safe to break, false otherwise
    const usageList = yield config.checkUsage(collectedBreakingField);
    // turns an array of booleans into an array of `Type.Field` strings
    // includes only those that are safe to break the api
    const suppressedPaths = collectedBreakingField
        .filter((_, i) => usageList[i] === true)
        .map(({ type, field, argument }) => [type, field, argument].filter(Boolean).join('.'));
    return changes.map((change) => {
        // Turns those "safe to break" changes into "dangerous"
        if (change.criticality.level === exports.CriticalityLevel.Breaking &&
            change.path &&
            suppressedPaths.some((p) => change.path.startsWith(p))) {
            return Object.assign(Object.assign({}, change), { criticality: Object.assign(Object.assign({}, change.criticality), { level: exports.CriticalityLevel.Dangerous }), message: `${change.message} (non-breaking based on usage)` });
        }
        return change;
    });
});

const safeUnreachable = ({ changes, oldSchema }) => {
    const reachable = getReachableTypes(oldSchema);
    return changes.map((change) => {
        if (change.criticality.level === exports.CriticalityLevel.Breaking && change.path) {
            const [typeName] = parsePath(change.path);
            if (!reachable.has(typeName)) {
                return Object.assign(Object.assign({}, change), { criticality: Object.assign(Object.assign({}, change.criticality), { level: exports.CriticalityLevel.NonBreaking }), message: 'Unreachable from root' });
            }
        }
        return change;
    });
};

const rules = /*#__PURE__*/Object.freeze({
    __proto__: null,
    dangerousBreaking: dangerousBreaking,
    suppressRemovalOfDeprecatedField: suppressRemovalOfDeprecatedField,
    ignoreDescriptionChanges: ignoreDescriptionChanges,
    considerUsage: considerUsage,
    safeUnreachable: safeUnreachable
});

const DiffRule = rules;
function diff(oldSchema, newSchema, rules = [], config) {
    const changes = diffSchema(oldSchema, newSchema);
    return rules.reduce((prev, rule) => tslib.__awaiter(this, void 0, void 0, function* () {
        const prevChanges = yield prev;
        return rule({
            changes: prevChanges,
            oldSchema,
            newSchema,
            config,
        });
    }), Promise.resolve(changes));
}

function readDocument(source) {
    const result = {
        source,
        fragments: [],
        operations: [],
        hasFragments: false,
        hasOperations: false,
    };
    const documentNode = graphql.parse(source.body);
    const filepath = source.name;
    const definitions = documentNode.definitions || [];
    definitions.forEach((node) => {
        if (isOperation(node)) {
            result.operations.push({
                node,
                source: filepath,
            });
        }
        else if (isFragment(node)) {
            result.fragments.push({
                node,
                source: filepath,
            });
        }
    });
    result.hasFragments = result.fragments.length > 0;
    result.hasOperations = result.operations.length > 0;
    return result;
}
function isOperation(node) {
    return node.kind === graphql.Kind.OPERATION_DEFINITION;
}
function isFragment(node) {
    return node.kind === graphql.Kind.FRAGMENT_DEFINITION;
}

function validateQueryDepth({ source, doc, maxDepth, fragmentGraph, }) {
    try {
        calculateDepth({
            node: doc,
            currentDepth: 0,
            maxDepth,
            getFragment(name) {
                return fragmentGraph.getNodeData(name);
            },
        });
    }
    catch (errorOrNode) {
        if (errorOrNode instanceof Error) {
            throw errorOrNode;
        }
        const node = errorOrNode;
        return new graphql.GraphQLError(`Query exceeds maximum depth of ${maxDepth}`, node, source, node.loc && node.loc.start ? [node.loc.start] : undefined);
    }
}
function calculateDepth({ node, currentDepth, maxDepth, getFragment, }) {
    if (maxDepth && currentDepth > maxDepth) {
        throw node;
    }
    switch (node.kind) {
        case graphql.Kind.FIELD: {
            if (node.name.value.startsWith('__') || !node.selectionSet) {
                return 0;
            }
            const maxInnerDepth = calculateDepth({
                node: node.selectionSet,
                currentDepth: currentDepth + 1,
                maxDepth,
                getFragment,
            });
            return 1 + maxInnerDepth;
        }
        case graphql.Kind.SELECTION_SET: {
            return Math.max(...node.selections.map((selection) => {
                return calculateDepth({
                    node: selection,
                    currentDepth: currentDepth,
                    maxDepth,
                    getFragment,
                });
            }));
        }
        case graphql.Kind.DOCUMENT: {
            return Math.max(...node.definitions.map((def) => {
                return calculateDepth({
                    node: def,
                    currentDepth: currentDepth,
                    maxDepth,
                    getFragment,
                });
            }));
        }
        case graphql.Kind.OPERATION_DEFINITION:
        case graphql.Kind.INLINE_FRAGMENT:
        case graphql.Kind.FRAGMENT_DEFINITION: {
            return Math.max(...node.selectionSet.selections.map((selection) => {
                return calculateDepth({
                    node: selection,
                    currentDepth,
                    maxDepth,
                    getFragment,
                });
            }));
        }
        case graphql.Kind.FRAGMENT_SPREAD:
            return calculateDepth({
                node: getFragment(node.name.value),
                currentDepth,
                maxDepth,
                getFragment,
            });
        default: {
            throw new Error(`Couldn't handle ${node.kind}`);
        }
    }
}

function transformDocumentWithApollo(doc, { keepClientFields }) {
    return graphql.visit(doc, {
        Field(node) {
            return keepClientFields
                ? removeDirectives(node, ['client'])
                : removeFieldIfDirectives(node, ['client']);
        },
    });
}
function transformSchemaWithApollo(schema) {
    return graphql.extendSchema(schema, graphql.parse(/* GraphQL */ `
      directive @connection(key: String!, filter: [String]) on FIELD
    `));
}

function validate(schema, sources, options) {
    const config = Object.assign({ strictDeprecated: true, strictFragments: true, keepClientFields: false, apollo: false }, options);
    const invalidDocuments = [];
    // read documents
    const documents = sources.map(readDocument);
    // keep all named fragments
    const fragments = [];
    const fragmentNames = [];
    const graph = new dependencyGraph.DepGraph({ circular: true });
    documents.forEach((doc) => {
        doc.fragments.forEach((fragment) => {
            fragmentNames.push(fragment.node.name.value);
            fragments.push(fragment);
            graph.addNode(fragment.node.name.value, fragment.node);
        });
    });
    fragments.forEach((fragment) => {
        const depends = extractFragments(graphql.print(fragment.node));
        if (depends) {
            depends.forEach((name) => {
                graph.addDependency(fragment.node.name.value, name);
            });
        }
    });
    documents
        // since we include fragments, validate only operations
        .filter((doc) => doc.hasOperations)
        .forEach((doc) => {
        const docWithOperations = {
            kind: graphql.Kind.DOCUMENT,
            definitions: doc.operations.map((d) => d.node),
        };
        const extractedFragments = (extractFragments(graphql.print(docWithOperations)) || [])
            // resolve all nested fragments
            .map((fragmentName) => resolveFragment(graph.getNodeData(fragmentName), graph))
            // flatten arrays
            .reduce((list, current) => list.concat(current), [])
            // remove duplicates
            .filter((def, i, all) => all.findIndex((item) => item.name.value === def.name.value) === i);
        const merged = {
            kind: graphql.Kind.DOCUMENT,
            definitions: [...docWithOperations.definitions, ...extractedFragments],
        };
        let transformedSchema = config.apollo
            ? transformSchemaWithApollo(schema)
            : schema;
        const transformedDoc = config.apollo
            ? transformDocumentWithApollo(merged, {
                keepClientFields: config.keepClientFields,
            })
            : merged;
        const errors = graphql.validate(transformedSchema, transformedDoc) || [];
        if (config.maxDepth) {
            const depthError = validateQueryDepth({
                source: doc.source,
                doc: transformedDoc,
                maxDepth: config.maxDepth,
                fragmentGraph: graph,
            });
            if (depthError) {
                errors.push(depthError);
            }
        }
        const deprecated = config.strictDeprecated
            ? findDeprecatedUsages(transformedSchema, transformedDoc)
            : [];
        const duplicatedFragments = config.strictFragments
            ? findDuplicatedFragments(fragmentNames)
            : [];
        if (sumLengths(errors, duplicatedFragments, deprecated) > 0) {
            invalidDocuments.push({
                source: doc.source,
                errors: [...errors, ...duplicatedFragments],
                deprecated,
            });
        }
    });
    return invalidDocuments;
}
function findDuplicatedFragments(fragmentNames) {
    return fragmentNames
        .filter((name, i, all) => all.indexOf(name) !== i)
        .map((name) => new graphql.GraphQLError(`Name of '${name}' fragment is not unique`));
}
//
// PostInfo -> AuthorInfo
// AuthorInfo -> None
//
function resolveFragment(fragment, graph) {
    return graph
        .dependenciesOf(fragment.name.value)
        .reduce((list, current) => [
        ...list,
        ...resolveFragment(graph.getNodeData(current), graph),
    ], [fragment]);
}
function extractFragments(document) {
    return (document.match(/[\.]{3}[a-z0-9\_]+\b/gi) || []).map((name) => name.replace('...', ''));
}
function sumLengths(...arrays) {
    return arrays.reduce((sum, { length }) => sum + length, 0);
}

function similar(schema, typeName, threshold = 0.4) {
    const typeMap = schema.getTypeMap();
    const targets = Object.keys(schema.getTypeMap())
        .filter((name) => !isPrimitive(name) && !isForIntrospection(name))
        .map((name) => ({
        typeId: name,
        value: stripType(typeMap[name]),
    }));
    const results = {};
    if (typeof typeName !== 'undefined' &&
        !targets.some((t) => t.typeId === typeName)) {
        throw new Error(`Type '${typeName}' doesn't exist`);
    }
    (typeName ? [{ typeId: typeName, value: '' }] : targets).forEach((source) => {
        const sourceType = schema.getType(source.typeId);
        const matchWith = targets.filter((target) => schema.getType(target.typeId).astNode.kind ===
            sourceType.astNode.kind && target.typeId !== source.typeId);
        if (matchWith.length > 0) {
            const found = similarTo(sourceType, matchWith, threshold);
            if (found) {
                results[source.typeId] = found;
            }
        }
    });
    return results;
}
function similarTo(type, targets, threshold) {
    const types = targets.filter((target) => target.typeId !== type.name);
    const result = findBestMatch(stripType(type), types);
    if (result.bestMatch.rating < threshold) {
        return;
    }
    return {
        bestMatch: result.bestMatch,
        ratings: result.ratings
            .filter((r) => r.rating >= threshold && r.target !== result.bestMatch.target)
            .sort((a, b) => a.rating - b.rating)
            .reverse(),
    };
}
function stripType(type) {
    return graphql.printType(type)
        .trim()
        .replace(/^[a-z]+ [^\{]+\{/g, '')
        .replace(/\}$/g, '')
        .trim()
        .split('\n')
        .map((s) => s.trim())
        .sort((a, b) => a.localeCompare(b))
        .join(' ');
}

function coverage(schema, sources) {
    const coverage = {
        sources,
        types: {},
    };
    const typeMap = schema.getTypeMap();
    const typeInfo = new graphql.TypeInfo(schema);
    const visitor = (source) => ({
        Field(node) {
            const fieldDef = typeInfo.getFieldDef();
            const parent = typeInfo.getParentType();
            if (parent &&
                parent.name &&
                !isForIntrospection(parent.name) &&
                fieldDef &&
                fieldDef.name &&
                fieldDef.name !== '__typename' &&
                fieldDef.name !== '__schema') {
                const sourceName = source.name;
                const typeCoverage = coverage.types[parent.name];
                const fieldCoverage = typeCoverage.children[fieldDef.name];
                const locations = fieldCoverage.locations[sourceName];
                typeCoverage.hits++;
                fieldCoverage.hits++;
                if (node.loc) {
                    fieldCoverage.locations[sourceName] = [
                        node.loc,
                        ...(locations || []),
                    ];
                }
                if (node.arguments) {
                    for (const argNode of node.arguments) {
                        const argCoverage = fieldCoverage.children[argNode.name.value];
                        argCoverage.hits++;
                        if (argNode.loc) {
                            argCoverage.locations[sourceName] = [
                                argNode.loc,
                                ...(argCoverage.locations[sourceName] || []),
                            ];
                        }
                    }
                }
            }
        },
    });
    for (const typename in typeMap) {
        if (!isForIntrospection(typename) && !isPrimitive(typename)) {
            const type = typeMap[typename];
            if (graphql.isObjectType(type) || graphql.isInterfaceType(type)) {
                const typeCoverage = {
                    hits: 0,
                    type,
                    children: {},
                };
                const fieldMap = type.getFields();
                for (const fieldname in fieldMap) {
                    const field = fieldMap[fieldname];
                    typeCoverage.children[field.name] = {
                        hits: 0,
                        locations: {},
                        children: {},
                    };
                    for (const arg of field.args) {
                        typeCoverage.children[field.name].children[arg.name] = {
                            hits: 0,
                            locations: {},
                        };
                    }
                }
                coverage.types[type.name] = typeCoverage;
            }
        }
    }
    const documents = coverage.sources.map(readDocument);
    documents.forEach((doc, i) => {
        const source = coverage.sources[i];
        doc.operations.forEach((op) => {
            graphql.visit(op.node, graphql.visitWithTypeInfo(typeInfo, visitor(source)));
        });
        doc.fragments.forEach((fr) => {
            graphql.visit(fr.node, graphql.visitWithTypeInfo(typeInfo, visitor(source)));
        });
    });
    return coverage;
}

exports.DiffRule = DiffRule;
exports.coverage = coverage;
exports.diff = diff;
exports.getTypePrefix = getTypePrefix;
exports.similar = similar;
exports.validate = validate;
