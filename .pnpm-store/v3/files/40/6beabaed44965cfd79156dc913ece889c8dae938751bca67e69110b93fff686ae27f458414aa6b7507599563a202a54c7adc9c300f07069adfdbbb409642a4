import { parseURLSearchParams } from './utils.js';
export function isGETRequest(request) {
    return request.method === 'GET';
}
export function parseGETRequest(request) {
    const [, searchParamsStr] = request.url.split('?');
    return parseURLSearchParams(searchParamsStr);
}
