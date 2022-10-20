"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRequest = exports.processResult = void 0;
const graphql_1 = require("graphql");
async function processResult({ request, result, fetchAPI, onResultProcessHooks, }) {
    let resultProcessor;
    const acceptableMediaTypes = new Set();
    let acceptedMediaType = '*/*';
    for (const onResultProcessHook of onResultProcessHooks) {
        await onResultProcessHook({
            request,
            acceptableMediaTypes,
            result,
            resultProcessor,
            setResultProcessor(newResultProcessor, newAcceptedMimeType) {
                resultProcessor = newResultProcessor;
                acceptedMediaType = newAcceptedMimeType;
            },
        });
    }
    // If no result processor found for this result, return an error
    if (!resultProcessor) {
        return new fetchAPI.Response(null, {
            status: 406,
            statusText: 'Not Acceptable',
            headers: {
                accept: [...acceptableMediaTypes].join('; charset=utf-8, '),
            },
        });
    }
    return resultProcessor(result, fetchAPI, acceptedMediaType);
}
exports.processResult = processResult;
async function processRequest({ params, enveloped, }) {
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
    const executeFn = operation?.operation === 'subscription'
        ? enveloped.subscribe
        : enveloped.execute;
    // Get the result to be processed
    return executeFn(executionArgs);
}
exports.processRequest = processRequest;
