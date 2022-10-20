import { RequestInterface, Endpoints } from "@octokit/types";
import { OAuthAppAuthentication, GitHubAppAuthenticationWithExpirationEnabled, GitHubAppAuthenticationWithExpirationDisabled } from "./types";
export declare type ResetTokenOAuthAppOptions = {
    clientType: "oauth-app";
    clientId: string;
    clientSecret: string;
    token: string;
    request?: RequestInterface;
};
export declare type ResetTokenGitHubAppOptions = {
    clientType: "github-app";
    clientId: string;
    clientSecret: string;
    token: string;
    request?: RequestInterface;
};
export declare type ResetTokenOAuthAppResponse = Endpoints["PATCH /applications/{client_id}/token"]["response"] & {
    authentication: OAuthAppAuthentication;
};
export declare type ResetTokenGitHubAppResponse = Endpoints["PATCH /applications/{client_id}/token"]["response"] & {
    authentication: GitHubAppAuthenticationWithExpirationEnabled | GitHubAppAuthenticationWithExpirationDisabled;
};
export declare function resetToken(options: ResetTokenOAuthAppOptions): Promise<ResetTokenOAuthAppResponse>;
export declare function resetToken(options: ResetTokenGitHubAppOptions): Promise<ResetTokenGitHubAppResponse>;
