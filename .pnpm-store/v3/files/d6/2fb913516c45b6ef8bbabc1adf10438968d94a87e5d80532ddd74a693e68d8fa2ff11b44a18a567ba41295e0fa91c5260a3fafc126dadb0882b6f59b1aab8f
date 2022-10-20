"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isContentTypeMatch = exports.parseURLSearchParams = void 0;
function parseURLSearchParams(requestBody) {
    const searchParams = new URLSearchParams(requestBody);
    const operationName = searchParams.get('operationName') || undefined;
    const query = searchParams.get('query') || undefined;
    const variablesStr = searchParams.get('variables') || undefined;
    const extensionsStr = searchParams.get('extensions') || undefined;
    return {
        operationName,
        query,
        variables: variablesStr ? JSON.parse(variablesStr) : undefined,
        extensions: extensionsStr ? JSON.parse(extensionsStr) : undefined,
    };
}
exports.parseURLSearchParams = parseURLSearchParams;
function isContentTypeMatch(request, expectedContentType) {
    const contentType = request.headers.get('content-type');
    return (contentType === expectedContentType ||
        !!(contentType === null || contentType === void 0 ? void 0 : contentType.startsWith(`${expectedContentType};`)));
}
exports.isContentTypeMatch = isContentTypeMatch;
