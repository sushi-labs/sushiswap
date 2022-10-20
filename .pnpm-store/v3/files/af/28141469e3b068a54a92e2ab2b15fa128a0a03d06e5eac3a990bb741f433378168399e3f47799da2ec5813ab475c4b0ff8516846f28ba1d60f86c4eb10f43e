"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExtendedValidation = void 0;
const graphql_1 = require("graphql");
const symbolExtendedValidationRules = Symbol('extendedValidationContext');
const useExtendedValidation = (options) => {
    let schemaTypeInfo;
    function getTypeInfo() {
        return schemaTypeInfo;
    }
    return {
        onSchemaChange({ schema }) {
            schemaTypeInfo = new graphql_1.TypeInfo(schema);
        },
        onContextBuilding({ context, extendContext }) {
            // We initialize the validationRules context in onContextBuilding as onExecute is already too late!
            let validationRulesContext = context[symbolExtendedValidationRules];
            if (validationRulesContext === undefined) {
                validationRulesContext = {
                    rules: [],
                    didRun: false,
                };
                extendContext({
                    [symbolExtendedValidationRules]: validationRulesContext,
                });
            }
            validationRulesContext.rules.push(...options.rules);
        },
        onSubscribe: buildHandler('subscribe', getTypeInfo, options.onValidationFailed),
        onExecute: buildHandler('execute', getTypeInfo, options.onValidationFailed),
    };
};
exports.useExtendedValidation = useExtendedValidation;
function buildHandler(name, getTypeInfo, onValidationFailed) {
    return function handler({ args, setResultAndStopExecution, }) {
        var _a;
        // We hook into onExecute/onSubscribe even though this is a validation pattern. The reasoning behind
        // it is that hooking right after validation and before execution has started is the
        // same as hooking into the validation step. The benefit of this approach is that
        // we may use execution context in the validation rules.
        const validationRulesContext = args.contextValue[symbolExtendedValidationRules];
        if (validationRulesContext === undefined) {
            throw new Error('Plugin has not been properly set up. ' +
                `The 'contextFactory' function is not invoked and the result has not been passed to '${name}'.`);
        }
        // we only want to run the extended execution once.
        if (validationRulesContext.didRun === false) {
            validationRulesContext.didRun = true;
            if (validationRulesContext.rules.length !== 0) {
                const errors = [];
                // We replicate the default validation step manually before execution starts.
                const typeInfo = (_a = getTypeInfo()) !== null && _a !== void 0 ? _a : new graphql_1.TypeInfo(args.schema);
                const validationContext = new graphql_1.ValidationContext(args.schema, args.document, typeInfo, e => {
                    errors.push(e);
                });
                const visitor = (0, graphql_1.visitInParallel)(validationRulesContext.rules.map(rule => rule(validationContext, args)));
                (0, graphql_1.visit)(args.document, (0, graphql_1.visitWithTypeInfo)(typeInfo, visitor));
                if (errors.length > 0) {
                    let result = {
                        data: null,
                        errors,
                    };
                    if (onValidationFailed) {
                        onValidationFailed({ args, result, setResult: newResult => (result = newResult) });
                    }
                    setResultAndStopExecution(result);
                }
            }
        }
    };
}
