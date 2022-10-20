"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericSdkVisitor = void 0;
const tslib_1 = require("tslib");
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
const auto_bind_1 = tslib_1.__importDefault(require("auto-bind"));
const graphql_1 = require("graphql");
function isStreamOperation(operationAST) {
    var _a;
    if (operationAST.operation === 'subscription') {
        return true;
    }
    if (operationAST.operation === 'query' &&
        ((_a = operationAST.directives) === null || _a === void 0 ? void 0 : _a.some(directiveNode => directiveNode.name.value === 'live'))) {
        return true;
    }
    return false;
}
class GenericSdkVisitor extends visitor_plugin_common_1.ClientSideBaseVisitor {
    constructor(schema, fragments, rawConfig) {
        super(schema, fragments, rawConfig, {
            usingObservableFrom: rawConfig.usingObservableFrom,
            rawRequest: (0, visitor_plugin_common_1.getConfigValue)(rawConfig.rawRequest, false),
        });
        this._operationsToInclude = [];
        (0, auto_bind_1.default)(this);
        if (this.config.usingObservableFrom) {
            this._additionalImports.push(this.config.usingObservableFrom);
        }
        const importType = this.config.useTypeImports ? 'import type' : 'import';
        if (this.config.documentMode !== visitor_plugin_common_1.DocumentMode.string) {
            this._additionalImports.push(`${importType} { DocumentNode${this.config.rawRequest ? ', ExecutionResult' : ''} } from 'graphql';`);
        }
        else if (this.config.rawRequest) {
            this._additionalImports.push(`${importType} { ExecutionResult } from 'graphql';`);
        }
    }
    buildOperation(node, documentVariableName, operationType, operationResultType, operationVariablesTypes) {
        if (node.name == null) {
            throw new Error("Plugin 'generic-sdk' cannot generate SDK for unnamed operation.\n\n" + (0, graphql_1.print)(node));
        }
        else {
            this._operationsToInclude.push({
                node,
                documentVariableName,
                operationType,
                operationResultType,
                operationVariablesTypes,
            });
        }
        return null;
    }
    get sdkContent() {
        const usingObservable = !!this.config.usingObservableFrom;
        const allPossibleActions = this._operationsToInclude
            .map(o => {
            const optionalVariables = !o.node.variableDefinitions ||
                o.node.variableDefinitions.length === 0 ||
                o.node.variableDefinitions.every(v => v.type.kind !== graphql_1.Kind.NON_NULL_TYPE || v.defaultValue);
            const returnType = isStreamOperation(o.node) ? (usingObservable ? 'Observable' : 'AsyncIterable') : 'Promise';
            const resultData = this.config.rawRequest
                ? `ExecutionResult<${o.operationResultType}, E>`
                : o.operationResultType;
            return `${o.node.name.value}(variables${optionalVariables ? '?' : ''}: ${o.operationVariablesTypes}, options?: C): ${returnType}<${resultData}> {
  return requester<${o.operationResultType}, ${o.operationVariablesTypes}>(${o.documentVariableName}, variables, options) as ${returnType}<${resultData}>;
}`;
        })
            .map(s => (0, visitor_plugin_common_1.indentMultiline)(s, 2));
        const documentNodeType = this.config.documentMode === visitor_plugin_common_1.DocumentMode.string ? 'string' : 'DocumentNode';
        const resultData = this.config.rawRequest ? 'ExecutionResult<R, E>' : 'R';
        const returnType = `Promise<${resultData}> | ${usingObservable ? 'Observable' : 'AsyncIterable'}<${resultData}>`;
        return `export type Requester<C = {}, E = unknown> = <R, V>(doc: ${documentNodeType}, vars?: V, options?: C) => ${returnType}
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
${allPossibleActions.join(',\n')}
  };
}
export type Sdk = ReturnType<typeof getSdk>;`;
    }
}
exports.GenericSdkVisitor = GenericSdkVisitor;
