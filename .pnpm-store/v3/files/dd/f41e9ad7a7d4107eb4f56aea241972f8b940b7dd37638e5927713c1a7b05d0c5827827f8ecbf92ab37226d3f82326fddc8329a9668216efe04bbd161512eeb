import { ClientSideBaseVisitor, DocumentMode, getConfigValue, indentMultiline, } from '@graphql-codegen/visitor-plugin-common';
import autoBind from 'auto-bind';
import { Kind, print } from 'graphql';
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
export class GenericSdkVisitor extends ClientSideBaseVisitor {
    constructor(schema, fragments, rawConfig) {
        super(schema, fragments, rawConfig, {
            usingObservableFrom: rawConfig.usingObservableFrom,
            rawRequest: getConfigValue(rawConfig.rawRequest, false),
        });
        this._operationsToInclude = [];
        autoBind(this);
        if (this.config.usingObservableFrom) {
            this._additionalImports.push(this.config.usingObservableFrom);
        }
        const importType = this.config.useTypeImports ? 'import type' : 'import';
        if (this.config.documentMode !== DocumentMode.string) {
            this._additionalImports.push(`${importType} { DocumentNode${this.config.rawRequest ? ', ExecutionResult' : ''} } from 'graphql';`);
        }
        else if (this.config.rawRequest) {
            this._additionalImports.push(`${importType} { ExecutionResult } from 'graphql';`);
        }
    }
    buildOperation(node, documentVariableName, operationType, operationResultType, operationVariablesTypes) {
        if (node.name == null) {
            throw new Error("Plugin 'generic-sdk' cannot generate SDK for unnamed operation.\n\n" + print(node));
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
                o.node.variableDefinitions.every(v => v.type.kind !== Kind.NON_NULL_TYPE || v.defaultValue);
            const returnType = isStreamOperation(o.node) ? (usingObservable ? 'Observable' : 'AsyncIterable') : 'Promise';
            const resultData = this.config.rawRequest
                ? `ExecutionResult<${o.operationResultType}, E>`
                : o.operationResultType;
            return `${o.node.name.value}(variables${optionalVariables ? '?' : ''}: ${o.operationVariablesTypes}, options?: C): ${returnType}<${resultData}> {
  return requester<${o.operationResultType}, ${o.operationVariablesTypes}>(${o.documentVariableName}, variables, options) as ${returnType}<${resultData}>;
}`;
        })
            .map(s => indentMultiline(s, 2));
        const documentNodeType = this.config.documentMode === DocumentMode.string ? 'string' : 'DocumentNode';
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
