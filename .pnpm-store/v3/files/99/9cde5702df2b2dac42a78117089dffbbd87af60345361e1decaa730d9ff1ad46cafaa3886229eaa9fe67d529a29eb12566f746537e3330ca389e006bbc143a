import { isContentTypeMatch, parseURLSearchParams } from './utils.js';
export function isPOSTFormUrlEncodedRequest(request) {
    return (request.method === 'POST' &&
        isContentTypeMatch(request, 'application/x-www-form-urlencoded'));
}
export async function parsePOSTFormUrlEncodedRequest(request) {
    const requestBody = await request.text();
    return parseURLSearchParams(requestBody);
}
