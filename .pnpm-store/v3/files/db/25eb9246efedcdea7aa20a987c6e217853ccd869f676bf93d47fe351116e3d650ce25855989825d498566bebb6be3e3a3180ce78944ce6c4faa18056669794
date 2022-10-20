import { OctokitResponse, RequestInterface } from "@octokit/types";
import { GitHubAppAuthenticationWithRefreshToken, GitHubAppCreateTokenWithExpirationResponseData } from "./types";
export declare type RefreshTokenOptions = {
    clientType: "github-app";
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    request?: RequestInterface;
};
export declare type RefreshTokenResponse = OctokitResponse<GitHubAppCreateTokenWithExpirationResponseData> & {
    authentication: GitHubAppAuthenticationWithRefreshToken;
};
export declare function refreshToken(options: RefreshTokenOptions): Promise<RefreshTokenResponse>;
