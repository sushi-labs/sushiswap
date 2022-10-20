'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const CachePolicy = _interopDefault(require('http-cache-semantics'));

function fetchFactory({ fetch, Response, cache }) {
    return async (input, init, ...rest) => {
        let url;
        let method = 'GET';
        let headers = {};
        if (typeof input === 'object' && 'json' in input) {
            url = input.url;
            method = input.method;
            headers = input.headers;
        }
        else {
            url = input.toString();
            if (init != null) {
                method = init.method || method;
                headers = init.headers || headers;
            }
        }
        const cacheKey = url;
        const entry = await cache.get(cacheKey);
        const policyRequest = policyRequestFrom(url, method, headers);
        if (!entry) {
            const response = await fetch(input, init, ...rest);
            const policy = new CachePolicy(policyRequest, policyResponseFrom(response));
            return storeResponseAndReturnClone(cache, response, policy, cacheKey);
        }
        const { policy: policyRaw, bytes } = typeof entry === 'string' ? JSON.parse(entry) : entry;
        const policy = CachePolicy.fromObject(policyRaw);
        // Remove url from the policy, because otherwise it would never match a request with a custom cache key
        policy._url = undefined;
        const bodyInit = new Uint8Array(bytes);
        if (policy.satisfiesWithoutRevalidation(policyRequest)) {
            const headers = policy.responseHeaders();
            return new Response(bodyInit, {
                url: policy._url,
                status: policy._status,
                headers,
            });
        }
        else {
            const revalidationHeaders = policy.revalidationHeaders(policyRequest);
            const revalidationResponse = await fetch(url, {
                ...init,
                method,
                headers: {
                    ...headers,
                    ...revalidationHeaders,
                },
            }, ...rest);
            const revalidationPolicyRequest = policyRequestFrom(url, method, revalidationHeaders);
            const { policy: revalidatedPolicy, modified } = policy.revalidatedPolicy(revalidationPolicyRequest, policyResponseFrom(revalidationResponse));
            const newArrayBuffer = await revalidationResponse.arrayBuffer();
            const newBody = modified ? newArrayBuffer : bodyInit;
            return storeResponseAndReturnClone(cache, new Response(newBody, {
                url: revalidatedPolicy._url,
                status: revalidatedPolicy._status,
                headers: revalidatedPolicy.responseHeaders(),
            }), revalidatedPolicy, cacheKey);
        }
    };
    async function storeResponseAndReturnClone(cache, response, policy, cacheKey) {
        let ttl = Math.round(policy.timeToLive() / 1000);
        if (ttl <= 0)
            return response;
        // If a response can be revalidated, we don't want to remove it from the cache right after it expires.
        // We may be able to use better heuristics here, but for now we'll take the max-age times 2.
        if (canBeRevalidated(response)) {
            ttl *= 2;
        }
        const arrayBuffer = await response.arrayBuffer();
        const uint8array = new Uint8Array(arrayBuffer);
        const entry = {
            policy: policy.toObject(),
            bytes: Array.from(uint8array),
        };
        await cache.set(cacheKey, entry, {
            ttl,
        });
        // We have to clone the response before returning it because the
        // body can only be used once.
        // To avoid https://github.com/bitinn/node-fetch/issues/151, we don't use
        // response.clone() but create a new response from the consumed body
        return new Response(uint8array, response);
    }
}
function canBeRevalidated(response) {
    return response.headers.has('ETag');
}
function policyRequestFrom(url, method, headers) {
    return {
        url,
        method,
        headers: headersToObject(headers),
    };
}
function policyResponseFrom(response) {
    return {
        status: response.status,
        headers: headersToObject(response.headers),
    };
}
function headersToObject(headers) {
    const object = Object.create(null);
    if (headers != null) {
        if ('forEach' in headers && typeof headers.forEach === 'function') {
            headers === null || headers === void 0 ? void 0 : headers.forEach((val, key) => {
                object[key] = val;
            });
        }
        else {
            return headers;
        }
    }
    return object;
}

exports.fetchFactory = fetchFactory;
