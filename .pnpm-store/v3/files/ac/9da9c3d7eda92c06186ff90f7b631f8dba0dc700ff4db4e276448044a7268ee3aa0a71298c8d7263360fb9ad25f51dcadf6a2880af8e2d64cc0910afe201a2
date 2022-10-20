import { isContentTypeMatch } from './utils.js';
export function isPOSTJsonRequest(request) {
    return (request.method === 'POST' &&
        (isContentTypeMatch(request, 'application/json') ||
            isContentTypeMatch(request, 'application/graphql+json')));
}
export async function parsePOSTJsonRequest(request) {
    const requestBody = await request.json();
    return {
        operationName: requestBody.operationName,
        query: requestBody.query,
        variables: requestBody.variables,
        extensions: requestBody.extensions,
    };
}
