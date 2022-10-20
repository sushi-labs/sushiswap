"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRequest = void 0;
const graphql_1 = require("graphql");
async function processRequest({ request, params, enveloped, fetchAPI, onResultProcessHooks, }) {
    // Parse GraphQLParams
    const document = enveloped.parse(params.query);
    // Validate parsed Document Node
    enveloped.validate(enveloped.schema, document);
    // Build the context for the execution
    const contextValue = (await enveloped.contextFactory());
    const executionArgs = {
        schema: enveloped.schema,
        document,
        contextValue,
        variableValues: params.variables,
        operationName: params.operationName,
    };
    // Get the actual operation
    const operation = (0, graphql_1.getOperationAST)(document, params.operationName);
    // Choose the right executor
    const executeFn = (operation === null || operation === void 0 ? void 0 : operation.operation) === 'subscription'
        ? enveloped.subscribe
        : enveloped.execute;
    // Get the result to be processed
    const result = await executeFn(executionArgs);
    let resultProcessor;
    for (const onResultProcessHook of onResultProcessHooks) {
        await onResultProcessHook({
            request,
            result,
            resultProcessor,
            setResultProcessor(newResultProcessor) {
                resultProcessor = newResultProcessor;
            },
        });
    }
    // If no result processor found for this result, return an error
    if (!resultProcessor) {
        return new fetchAPI.Response(null, {
            status: 406,
            statusText: 'Not Acceptable',
        });
    }
    return resultProcessor(result, fetchAPI);
}
exports.processRequest = processRequest;
