import { getUserAgent } from 'universal-user-agent';
import { request } from '@octokit/request';
import btoa from 'btoa-lite';
import { createOAuthUserAuth, requiresBasicAuth } from '@octokit/auth-oauth-user';
export { createOAuthUserAuth } from '@octokit/auth-oauth-user';

async function auth(state, authOptions) {
    if (authOptions.type === "oauth-app") {
        return {
            type: "oauth-app",
            clientId: state.clientId,
            clientSecret: state.clientSecret,
            clientType: state.clientType,
            headers: {
                authorization: `basic ${btoa(`${state.clientId}:${state.clientSecret}`)}`,
            },
        };
    }
    if ("factory" in authOptions) {
        const { type, ...options } = {
            ...authOptions,
            ...state,
        };
        // @ts-expect-error TODO: `option` cannot be never, is this a bug?
        return authOptions.factory(options);
    }
    const common = {
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        request: state.request,
        ...authOptions,
    };
    // TS: Look what you made me do
    const userAuth = state.clientType === "oauth-app"
        ? await createOAuthUserAuth({
            ...common,
            clientType: state.clientType,
        })
        : await createOAuthUserAuth({
            ...common,
            clientType: state.clientType,
        });
    return userAuth();
}

async function hook(state, request, route, parameters) {
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

const VERSION = "5.0.1";

function createOAuthAppAuth(options) {
    const state = Object.assign({
        request: request.defaults({
            headers: {
                "user-agent": `octokit-auth-oauth-app.js/${VERSION} ${getUserAgent()}`,
            },
        }),
        clientType: "oauth-app",
    }, options);
    // @ts-expect-error not worth the extra code to appease TS
    return Object.assign(auth.bind(null, state), {
        hook: hook.bind(null, state),
    });
}

export { createOAuthAppAuth };
//# sourceMappingURL=index.js.map
