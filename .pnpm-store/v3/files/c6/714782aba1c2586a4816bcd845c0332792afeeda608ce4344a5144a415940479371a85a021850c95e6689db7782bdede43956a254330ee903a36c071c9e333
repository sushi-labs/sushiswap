import { createGraphQLError } from '@graphql-tools/utils';
import { dset } from 'dset';
import { isContentTypeMatch } from './utils.js';
export function isPOSTMultipartRequest(request) {
    return (request.method === 'POST' &&
        isContentTypeMatch(request, 'multipart/form-data'));
}
export async function parsePOSTMultipartRequest(request) {
    var _a, _b;
    let requestBody;
    try {
        requestBody = await request.formData();
    }
    catch (e) {
        // Trick for cross-undici-fetch errors on Node.js
        // TODO: This needs a better solution
        if (e instanceof Error &&
            e.message.startsWith('File size limit exceeded: ')) {
            throw createGraphQLError(e.message, {
                extensions: {
                    http: {
                        status: 413,
                    },
                },
            });
        }
        throw e;
    }
    const operationsStr = ((_a = requestBody.get('operations')) === null || _a === void 0 ? void 0 : _a.toString()) || '{}';
    const operations = JSON.parse(operationsStr);
    const mapStr = ((_b = requestBody.get('map')) === null || _b === void 0 ? void 0 : _b.toString()) || '{}';
    const map = JSON.parse(mapStr);
    for (const fileIndex in map) {
        const file = requestBody.get(fileIndex);
        const keys = map[fileIndex];
        for (const key of keys) {
            dset(operations, key, file);
        }
    }
    return {
        operationName: operations.operationName,
        query: operations.query,
        variables: operations.variables,
        extensions: operations.extensions,
    };
}
