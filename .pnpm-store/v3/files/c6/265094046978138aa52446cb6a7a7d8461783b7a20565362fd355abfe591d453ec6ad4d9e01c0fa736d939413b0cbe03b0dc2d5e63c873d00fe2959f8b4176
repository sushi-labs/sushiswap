import * as OctokitTypes from "@octokit/types";
import LRUCache from "lru-cache";
import * as OAuthAppAuth from "@octokit/auth-oauth-app";
declare type OAuthStrategyOptions = {
    clientId?: string;
    clientSecret?: string;
};
declare type CommonStrategyOptions = {
    appId: number | string;
    privateKey: string;
    installationId?: number | string;
    request?: OctokitTypes.RequestInterface;
    cache?: Cache;
    log?: {
        warn: (message: string, additionalInfo?: object) => any;
        [key: string]: any;
    };
};
export declare type StrategyOptions = OAuthStrategyOptions & CommonStrategyOptions & Record<string, unknown>;
export declare type AppAuthOptions = {
    type: "app";
};
/**
Users SHOULD only enter repositoryIds || repositoryNames.
However, this moduke still passes both to the backend API to
let the API decide how to handle the logic. We just throw the
reponse back to the client making the request.
**/
export declare type InstallationAuthOptions = {
    type: "installation";
    installationId?: number | string;
    repositoryIds?: number[];
    repositoryNames?: string[];
    permissions?: Permissions;
    refresh?: boolean;
    factory?: never;
    [key: string]: unknown;
};
export declare type InstallationAuthOptionsWithFactory<T> = {
    type: "installation";
    installationId?: number | string;
    repositoryIds?: number[];
    repositoryNames?: string[];
    permissions?: Permissions;
    refresh?: boolean;
    factory: FactoryInstallation<T>;
    [key: string]: unknown;
};
export declare type OAuthAppAuthOptions = OAuthAppAuth.AppAuthOptions;
export declare type OAuthWebFlowAuthOptions = OAuthAppAuth.WebFlowAuthOptions;
export declare type OAuthDeviceFlowAuthOptions = OAuthAppAuth.GitHubAppDeviceFlowAuthOptions;
export declare type Authentication = AppAuthentication | OAuthAppAuthentication | InstallationAccessTokenAuthentication | GitHubAppUserAuthentication | GitHubAppUserAuthenticationWithExpiration;
export declare type FactoryInstallationOptions = StrategyOptions & Omit<InstallationAuthOptions, "type">;
export interface FactoryInstallation<T> {
    (options: FactoryInstallationOptions): T;
}
export interface AuthInterface {
    (options: AppAuthOptions): Promise<AppAuthentication>;
    (options: OAuthAppAuthOptions): Promise<OAuthAppAuthentication>;
    (options: InstallationAuthOptions): Promise<InstallationAccessTokenAuthentication>;
    <T = unknown>(options: InstallationAuthOptionsWithFactory<T>): Promise<T>;
    (options: OAuthWebFlowAuthOptions): Promise<GitHubAppUserAuthentication | GitHubAppUserAuthenticationWithExpiration>;
    (options: OAuthDeviceFlowAuthOptions): Promise<GitHubAppUserAuthentication | GitHubAppUserAuthenticationWithExpiration>;
    <T = unknown>(options: OAuthWebFlowAuthOptions & {
        factory: OAuthAppAuth.FactoryGitHubWebFlow<T>;
    }): Promise<T>;
    <T = unknown>(options: OAuthDeviceFlowAuthOptions & {
        factory: OAuthAppAuth.FactoryGitHubDeviceFlow<T>;
    }): Promise<T>;
    hook(request: RequestInterface, route: Route | EndpointOptions, parameters?: RequestParameters): Promise<OctokitTypes.OctokitResponse<any>>;
}
export declare type AnyResponse = OctokitTypes.OctokitResponse<any>;
export declare type EndpointDefaults = OctokitTypes.EndpointDefaults;
export declare type EndpointOptions = OctokitTypes.EndpointOptions;
export declare type RequestParameters = OctokitTypes.RequestParameters;
export declare type Route = OctokitTypes.Route;
export declare type RequestInterface = OctokitTypes.RequestInterface;
export declare type Cache = LRUCache<string, string> | {
    get: (key: string) => string;
    set: (key: string, value: string) => any;
};
export declare type APP_TYPE = "app";
export declare type TOKEN_TYPE = "token";
export declare type INSTALLATION_TOKEN_TYPE = "installation";
export declare type OAUTH_TOKEN_TYPE = "oauth";
export declare type REPOSITORY_SELECTION = "all" | "selected";
export declare type JWT = string;
export declare type ACCESS_TOKEN = string;
export declare type UTC_TIMESTAMP = string;
export declare type AppAuthentication = {
    type: APP_TYPE;
    token: JWT;
    appId: number;
    expiresAt: string;
};
export declare type InstallationAccessTokenData = {
    token: ACCESS_TOKEN;
    createdAt: UTC_TIMESTAMP;
    expiresAt: UTC_TIMESTAMP;
    permissions: Permissions;
    repositorySelection: REPOSITORY_SELECTION;
    repositoryIds?: number[];
    repositoryNames?: string[];
    singleFileName?: string;
};
export declare type CacheData = InstallationAccessTokenData;
export declare type InstallationAccessTokenAuthentication = InstallationAccessTokenData & {
    type: TOKEN_TYPE;
    tokenType: INSTALLATION_TOKEN_TYPE;
    installationId: number;
};
export declare type OAuthAppAuthentication = OAuthAppAuth.AppAuthentication;
export declare type GitHubAppUserAuthentication = OAuthAppAuth.GitHubAppUserAuthentication;
export declare type GitHubAppUserAuthenticationWithExpiration = OAuthAppAuth.GitHubAppUserAuthenticationWithExpiration;
export declare type FactoryOptions = Required<Omit<StrategyOptions, keyof State>> & State;
export declare type Permissions = Record<string, string>;
export declare type WithInstallationId = {
    installationId: number;
};
export declare type State = Required<Omit<CommonStrategyOptions, "installationId">> & {
    installationId?: number;
} & OAuthStrategyOptions & {
    oauthApp: OAuthAppAuth.GitHubAuthInterface;
};
export {};
