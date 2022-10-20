import * as OAuthAppAuth from "@octokit/auth-oauth-app";
import { State, AppAuthOptions, AppAuthentication, OAuthAppAuthentication, OAuthAppAuthOptions, InstallationAuthOptions, InstallationAccessTokenAuthentication, GitHubAppUserAuthentication, GitHubAppUserAuthenticationWithExpiration, OAuthWebFlowAuthOptions, OAuthDeviceFlowAuthOptions } from "./types";
/** GitHub App authentication */
export declare function auth(state: State, authOptions: AppAuthOptions): Promise<AppAuthentication>;
/** OAuth App authentication */
export declare function auth(state: State, authOptions: OAuthAppAuthOptions): Promise<OAuthAppAuthentication>;
/** Installation authentication */
export declare function auth(state: State, authOptions: InstallationAuthOptions): Promise<InstallationAccessTokenAuthentication>;
/** User Authentication via OAuth web flow */
export declare function auth(state: State, authOptions: OAuthWebFlowAuthOptions): Promise<GitHubAppUserAuthentication | GitHubAppUserAuthenticationWithExpiration>;
/** GitHub App Web flow with `factory` option */
export declare function auth<T = unknown>(state: State, authOptions: OAuthWebFlowAuthOptions & {
    factory: OAuthAppAuth.FactoryGitHubWebFlow<T>;
}): Promise<T>;
/** User Authentication via OAuth Device flow */
export declare function auth(state: State, authOptions: OAuthDeviceFlowAuthOptions): Promise<GitHubAppUserAuthentication | GitHubAppUserAuthenticationWithExpiration>;
/** GitHub App Device flow with `factory` option */
export declare function auth<T = unknown>(state: State, authOptions: OAuthDeviceFlowAuthOptions & {
    factory: OAuthAppAuth.FactoryGitHubDeviceFlow<T>;
}): Promise<T>;
