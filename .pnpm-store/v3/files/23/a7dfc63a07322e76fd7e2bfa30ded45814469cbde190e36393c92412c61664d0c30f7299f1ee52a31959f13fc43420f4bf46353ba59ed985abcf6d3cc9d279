import { AggregateError } from '@graphql-tools/utils';
export function getAggregateErrorFromErrors(errors) {
    errors.forEach((error) => {
        error.extensions.http = {
            status: 400,
        };
    });
    throw new AggregateError(errors);
}
export function useHTTPValidationError() {
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
