import { createOAuthUserAuth, } from "@octokit/auth-oauth-user";
import { emitEvent } from "../emit-event";
export async function getUserOctokitWithState(state, options) {
    return state.octokit.auth({
        type: "oauth-user",
        ...options,
        async factory(options) {
            const octokit = new state.Octokit({
                authStrategy: createOAuthUserAuth,
                auth: options,
            });
            const authentication = (await octokit.auth({
                type: "get",
            }));
            await emitEvent(state, {
                name: "token",
                action: "created",
                token: authentication.token,
                scopes: authentication.scopes,
                authentication,
                octokit,
            });
            return octokit;
        },
    });
}
