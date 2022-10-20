import btoa from "btoa-lite";
import { requiresBasicAuth } from "@octokit/auth-oauth-user";
export async function hook(state, request, route, parameters) {
    let endpoint = request.endpoint.merge(route, parameters);
    // Do not intercept OAuth Web/Device flow request
    if (/\/login\/(oauth\/access_token|device\/code)$/.test(endpoint.url)) {
        return request(endpoint);
    }
    if (state.clientType === "github-app" && !requiresBasicAuth(endpoint.url)) {
        throw new Error(`[@octokit/auth-oauth-app] GitHub Apps cannot use their client ID/secret for basic authentication for endpoints other than "/applications/{client_id}/**". "${endpoint.method} ${endpoint.url}" is not supported.`);
    }
    const credentials = btoa(`${state.clientId}:${state.clientSecret}`);
    endpoint.headers.authorization = `basic ${credentials}`;
    try {
        return await request(endpoint);
    }
    catch (error) {
        /* istanbul ignore if */
        if (error.status !== 401)
            throw error;
        error.message = `[@octokit/auth-oauth-app] "${endpoint.method} ${endpoint.url}" does not support clientId/clientSecret basic authentication.`;
        throw error;
    }
}
