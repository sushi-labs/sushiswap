import { AggregateError } from '@graphql-tools/utils';
export function useHTTPValidationError() {
    return {
        onValidate() {
            return ({ valid, result }) => {
                if (!valid) {
                    result.forEach((error) => {
                        error.extensions.http = {
                            status: 400,
                        };
                    });
                    throw new AggregateError(result);
                }
            };
        },
    };
}
