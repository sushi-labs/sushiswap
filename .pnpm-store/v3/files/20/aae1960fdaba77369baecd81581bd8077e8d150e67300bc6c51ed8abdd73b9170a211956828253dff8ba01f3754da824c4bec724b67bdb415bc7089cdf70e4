"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHTTPValidationError = void 0;
const utils_1 = require("@graphql-tools/utils");
function useHTTPValidationError() {
    return {
        onValidate() {
            return ({ valid, result }) => {
                if (!valid) {
                    result.forEach((error) => {
                        error.extensions.http = {
                            status: 400,
                        };
                    });
                    throw new utils_1.AggregateError(result);
                }
            };
        },
    };
}
exports.useHTTPValidationError = useHTTPValidationError;
