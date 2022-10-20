import * as OAuthMethods from "@octokit/oauth-methods";
import { ClientType, State } from "../types";
export declare type ResetTokenOptions = {
    token: string;
};
export declare function resetTokenWithState(state: State, options: ResetTokenOptions): Promise<(OAuthMethods.ResetTokenOAuthAppResponse | OAuthMethods.ResetTokenGitHubAppResponse) & {
    authentication: {
        type: "token";
        tokenType: "oauth";
    };
}>;
export interface ResetTokenInterface<TClientType extends ClientType> {
    (options: ResetTokenOptions): TClientType extends "oauth-app" ? Promise<OAuthMethods.ResetTokenOAuthAppResponse & {
        authentication: {
            type: "token";
            tokenType: "oauth";
        };
    }> : Promise<OAuthMethods.ResetTokenGitHubAppResponse & {
        authentication: {
            type: "token";
            tokenType: "oauth";
        };
    }>;
}
