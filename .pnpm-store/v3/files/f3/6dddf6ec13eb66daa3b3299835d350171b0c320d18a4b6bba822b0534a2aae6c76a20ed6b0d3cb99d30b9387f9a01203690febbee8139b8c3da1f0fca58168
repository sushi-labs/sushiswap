"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptResolversVisitor = exports.ENUM_RESOLVERS_SIGNATURE = void 0;
const tslib_1 = require("tslib");
const auto_bind_1 = tslib_1.__importDefault(require("auto-bind"));
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
const typescript_1 = require("@graphql-codegen/typescript");
exports.ENUM_RESOLVERS_SIGNATURE = 'export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };';
class TypeScriptResolversVisitor extends visitor_plugin_common_1.BaseResolversVisitor {
    constructor(pluginConfig, schema) {
        super(pluginConfig, {
            avoidOptionals: (0, visitor_plugin_common_1.getConfigValue)(pluginConfig.avoidOptionals, false),
            useIndexSignature: (0, visitor_plugin_common_1.getConfigValue)(pluginConfig.useIndexSignature, false),
            wrapFieldDefinitions: (0, visitor_plugin_common_1.getConfigValue)(pluginConfig.wrapFieldDefinitions, false),
            allowParentTypeOverride: (0, visitor_plugin_common_1.getConfigValue)(pluginConfig.allowParentTypeOverride, false),
            optionalInfoArgument: (0, visitor_plugin_common_1.getConfigValue)(pluginConfig.optionalInfoArgument, false),
        }, schema);
        (0, auto_bind_1.default)(this);
        this.setVariablesTransformer(new typescript_1.TypeScriptOperationVariablesToObject(this.scalars, this.convertName, this.config.avoidOptionals, this.config.immutableTypes, this.config.namespacedImportName, [], this.config.enumPrefix, this.config.enumValues));
        if (this.config.useIndexSignature) {
            this._declarationBlockConfig = {
                blockTransformer(block) {
                    return `ResolversObject<${block}>`;
                },
            };
        }
    }
    transformParentGenericType(parentType) {
        if (this.config.allowParentTypeOverride) {
            return `ParentType = ${parentType}`;
        }
        return `ParentType extends ${parentType} = ${parentType}`;
    }
    formatRootResolver(schemaTypeName, resolverType, declarationKind) {
        var _a, _b;
        const avoidOptionals = (_b = (_a = this.config.avoidOptionals) === null || _a === void 0 ? void 0 : _a.resolvers) !== null && _b !== void 0 ? _b : this.config.avoidOptionals === true;
        return `${schemaTypeName}${avoidOptionals ? '' : '?'}: ${resolverType}${this.getPunctuation(declarationKind)}`;
    }
    clearOptional(str) {
        if (str.startsWith('Maybe')) {
            return str.replace(/Maybe<(.*?)>$/, '$1');
        }
        return str;
    }
    ListType(node) {
        return `Maybe<${super.ListType(node)}>`;
    }
    wrapWithListType(str) {
        return `${this.config.immutableTypes ? 'ReadonlyArray' : 'Array'}<${str}>`;
    }
    getParentTypeForSignature(node) {
        if (this._federation.isResolveReferenceField(node) && this.config.wrapFieldDefinitions) {
            return 'UnwrappedObject<ParentType>';
        }
        return 'ParentType';
    }
    NamedType(node) {
        return `Maybe<${super.NamedType(node)}>`;
    }
    NonNullType(node) {
        const baseValue = super.NonNullType(node);
        return this.clearOptional(baseValue);
    }
    getPunctuation(_declarationKind) {
        return ';';
    }
    buildEnumResolverContentBlock(node, mappedEnumType) {
        const valuesMap = `{ ${(node.values || [])
            .map(v => `${v.name}${this.config.avoidOptionals ? '' : '?'}: any`)
            .join(', ')} }`;
        this._globalDeclarations.add(exports.ENUM_RESOLVERS_SIGNATURE);
        return `EnumResolverSignature<${valuesMap}, ${mappedEnumType}>`;
    }
    buildEnumResolversExplicitMappedValues(node, valuesMapping) {
        return `{ ${(node.values || [])
            .map(v => {
            const valueName = v.name;
            const mappedValue = valuesMapping[valueName];
            return `${valueName}: ${typeof mappedValue === 'number' ? mappedValue : `'${mappedValue}'`}`;
        })
            .join(', ')} }`;
    }
}
exports.TypeScriptResolversVisitor = TypeScriptResolversVisitor;
