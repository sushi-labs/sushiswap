export declare type OAuthAppAuthentication = {
    clientType: "oauth-app";
    clientId: string;
    clientSecret: string;
    token: string;
    scopes: string[];
};
export declare type GitHubAppAuthenticationWithExpirationDisabled = {
    clientType: "github-app";
    clientId: string;
    clientSecret: string;
    token: string;
};
export declare type GitHubAppAuthenticationWithExpirationEnabled = GitHubAppAuthenticationWithExpirationDisabled & {
    expiresAt: string;
};
export declare type GitHubAppAuthenticationWithRefreshToken = GitHubAppAuthenticationWithExpirationEnabled & {
    refreshToken: string;
    refreshTokenExpiresAt: string;
};
/**
 * @deprecated Use `GitHubAppAuthenticationWithExpirationDisabled` or
 * `GitHubAppAuthenticationWithExpirationEnabled` instead.
 */
export declare type GitHubAppAuthentication = {
    clientType: "github-app";
    clientId: string;
    clientSecret: string;
    token: string;
};
/**
 * @deprecated Use `GitHubAppAuthenticationWithRefreshToken` instead.
 */
export declare type GitHubAppAuthenticationWithExpiration = {
    clientType: "github-app";
    clientId: string;
    clientSecret: string;
    token: string;
    refreshToken: string;
    expiresAt: string;
    refreshTokenExpiresAt: string;
};
export declare type OAuthAppCreateTokenResponseData = {
    access_token: string;
    scope: string;
    token_type: "bearer";
};
export declare type GitHubAppCreateTokenResponseData = {
    access_token: string;
    token_type: "bearer";
};
export declare type GitHubAppCreateTokenWithExpirationResponseData = {
    access_token: string;
    token_type: "bearer";
    expires_in: number;
    refresh_token: string;
    refresh_token_expires_in: number;
};
