"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHTTPValidationError = exports.getAggregateErrorFromErrors = void 0;
const utils_1 = require("@graphql-tools/utils");
function getAggregateErrorFromErrors(errors) {
    errors.forEach((error) => {
        error.extensions.http = {
            status: 400,
        };
    });
    throw new utils_1.AggregateError(errors);
}
exports.getAggregateErrorFromErrors = getAggregateErrorFromErrors;
function useHTTPValidationError() {
    return {
        onValidate() {
            return ({ valid, result }) => {
                if (!valid) {
                    throw getAggregateErrorFromErrors(result);
                }
            };
        },
    };
}
exports.useHTTPValidationError = useHTTPValidationError;
