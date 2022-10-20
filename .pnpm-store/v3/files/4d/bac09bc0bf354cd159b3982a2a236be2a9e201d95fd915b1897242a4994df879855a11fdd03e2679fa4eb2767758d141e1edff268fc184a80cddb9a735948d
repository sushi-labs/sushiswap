import { App as DefaultApp } from "@octokit/app";
import { OAuthApp as DefaultOAuthApp } from "@octokit/oauth-app";
export declare const App: (new (...args: any[]) => {
    octokit: import("@octokit/core").Octokit & {
        paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
    } & import("@octokit/plugin-rest-endpoint-methods/dist-types/types").Api & {
        retry: {
            retryRequest: (error: import("@octokit/request-error").RequestError, retries: number, retryAfter: number) => import("@octokit/request-error").RequestError;
        };
    };
    webhooks: import("@octokit/webhooks").Webhooks<{
        octokit: import("@octokit/core").Octokit & {
            paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
        } & import("@octokit/plugin-rest-endpoint-methods/dist-types/types").Api & {
            retry: {
                retryRequest: (error: import("@octokit/request-error").RequestError, retries: number, retryAfter: number) => import("@octokit/request-error").RequestError;
            };
        };
    }>;
    oauth: DefaultOAuthApp<{
        clientType: "github-app";
        Octokit: typeof import("@octokit/core").Octokit & import("@octokit/core/dist-types/types").Constructor<{
            paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
        } & import("@octokit/plugin-rest-endpoint-methods/dist-types/types").Api & {
            retry: {
                retryRequest: (error: import("@octokit/request-error").RequestError, retries: number, retryAfter: number) => import("@octokit/request-error").RequestError;
            };
        }>;
    }>;
    getInstallationOctokit: import("@octokit/app/dist-types/types").GetInstallationOctokitInterface<import("@octokit/core").Octokit & {
        paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
    } & import("@octokit/plugin-rest-endpoint-methods/dist-types/types").Api & {
        retry: {
            retryRequest: (error: import("@octokit/request-error").RequestError, retries: number, retryAfter: number) => import("@octokit/request-error").RequestError;
        };
    }>;
    eachInstallation: import("@octokit/app/dist-types/types").EachInstallationInterface<import("@octokit/core").Octokit & {
        paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
    } & import("@octokit/plugin-rest-endpoint-methods/dist-types/types").Api & {
        retry: {
            retryRequest: (error: import("@octokit/request-error").RequestError, retries: number, retryAfter: number) => import("@octokit/request-error").RequestError;
        };
    }>;
    eachRepository: import("@octokit/app/dist-types/types").EachRepositoryInterface<import("@octokit/core").Octokit & {
        paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
    } & import("@octokit/plugin-rest-endpoint-methods/dist-types/types").Api & {
        retry: {
            retryRequest: (error: import("@octokit/request-error").RequestError, retries: number, retryAfter: number) => import("@octokit/request-error").RequestError;
        };
    }>;
    log: {
        [key: string]: unknown;
        debug: (message: string, additionalInfo?: object | undefined) => void;
        info: (message: string, additionalInfo?: object | undefined) => void;
        warn: (message: string, additionalInfo?: object | undefined) => void;
        error: (message: string, additionalInfo?: object | undefined) => void;
    };
}) & typeof DefaultApp;
export declare type App = InstanceType<typeof App>;
export declare const OAuthApp: (new (...args: any[]) => {
    type: "oauth-app";
    on: import("@octokit/oauth-app/dist-types/types").AddEventHandler<{
        Octokit: typeof import("@octokit/core").Octokit & import("@octokit/core/dist-types/types").Constructor<{
            paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
        } & import("@octokit/plugin-rest-endpoint-methods/dist-types/types").Api & {
            retry: {
                retryRequest: (error: import("@octokit/request-error").RequestError, retries: number, retryAfter: number) => import("@octokit/request-error").RequestError;
            };
        }>;
    }>;
    octokit: import("@octokit/core").Octokit & {
        paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
    } & import("@octokit/plugin-rest-endpoint-methods/dist-types/types").Api & {
        retry: {
            retryRequest: (error: import("@octokit/request-error").RequestError, retries: number, retryAfter: number) => import("@octokit/request-error").RequestError;
        };
    };
    getUserOctokit: import("@octokit/oauth-app/dist-types/methods/get-user-octokit").GetUserOctokitWithStateInterface<"oauth-app">;
    getWebFlowAuthorizationUrl: import("@octokit/oauth-app/dist-types/methods/get-web-flow-authorization-url").GetWebFlowAuthorizationUrlInterface<"oauth-app">;
    createToken: import("@octokit/oauth-app/dist-types/methods/create-token").CreateTokenInterface<"oauth-app">;
    checkToken: import("@octokit/oauth-app/dist-types/methods/check-token").CheckTokenInterface<"oauth-app">;
    resetToken: import("@octokit/oauth-app/dist-types/methods/reset-token").ResetTokenInterface<"oauth-app">;
    refreshToken: import("@octokit/oauth-app/dist-types/methods/refresh-token").RefreshTokenInterface;
    scopeToken: import("@octokit/oauth-app/dist-types/methods/scope-token").ScopeTokenInterface;
    deleteToken: import("@octokit/oauth-app/dist-types/methods/delete-token").DeleteTokenInterface;
    deleteAuthorization: import("@octokit/oauth-app/dist-types/methods/delete-authorization").DeleteAuthorizationInterface;
}) & typeof DefaultOAuthApp;
export declare type OAuthApp = InstanceType<typeof OAuthApp>;
export { createNodeMiddleware } from "@octokit/app";
