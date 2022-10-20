import * as OAuthMethods from "@octokit/oauth-methods";
export async function checkTokenWithState(state, options) {
    const result = await OAuthMethods.checkToken({
        // @ts-expect-error not worth the extra code to appease TS
        clientType: state.clientType,
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        request: state.octokit.request,
        ...options,
    });
    Object.assign(result.authentication, { type: "token", tokenType: "oauth" });
    return result;
}
