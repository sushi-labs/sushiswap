import { isContentTypeMatch } from './utils.js';
export function isPOSTGraphQLStringRequest(request) {
    return (request.method === 'POST' &&
        isContentTypeMatch(request, 'application/graphql'));
}
export async function parsePOSTGraphQLStringRequest(request) {
    const requestBody = await request.text();
    return {
        query: requestBody,
    };
}
