import * as OAuthMethods from "@octokit/oauth-methods";
import { emitEvent } from "../emit-event";
import { createOAuthUserAuth } from "@octokit/auth-oauth-user";
export async function resetTokenWithState(state, options) {
    const optionsWithDefaults = {
        clientId: state.clientId,
        clientSecret: state.clientSecret,
        request: state.octokit.request,
        ...options,
    };
    if (state.clientType === "oauth-app") {
        const response = await OAuthMethods.resetToken({
            clientType: "oauth-app",
            ...optionsWithDefaults,
        });
        const authentication = Object.assign(response.authentication, {
            type: "token",
            tokenType: "oauth",
        });
        await emitEvent(state, {
            name: "token",
            action: "reset",
            token: response.authentication.token,
            scopes: response.authentication.scopes || undefined,
            authentication: authentication,
            octokit: new state.Octokit({
                authStrategy: createOAuthUserAuth,
                auth: {
                    clientType: state.clientType,
                    clientId: state.clientId,
                    clientSecret: state.clientSecret,
                    token: response.authentication.token,
                    scopes: response.authentication.scopes,
                },
            }),
        });
        return { ...response, authentication };
    }
    const response = await OAuthMethods.resetToken({
        clientType: "github-app",
        ...optionsWithDefaults,
    });
    const authentication = Object.assign(response.authentication, {
        type: "token",
        tokenType: "oauth",
    });
    await emitEvent(state, {
        name: "token",
        action: "reset",
        token: response.authentication.token,
        authentication: authentication,
        octokit: new state.Octokit({
            authStrategy: createOAuthUserAuth,
            auth: {
                clientType: state.clientType,
                clientId: state.clientId,
                clientSecret: state.clientSecret,
                token: response.authentication.token,
            },
        }),
    });
    return { ...response, authentication };
}
