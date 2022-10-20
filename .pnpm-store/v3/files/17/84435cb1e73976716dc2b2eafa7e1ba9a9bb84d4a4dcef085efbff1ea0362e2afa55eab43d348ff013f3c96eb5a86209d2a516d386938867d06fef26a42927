import { Octokit as OctokitCore } from "@octokit/core";
export declare const Octokit: typeof OctokitCore & import("@octokit/core/dist-types/types").Constructor<{
    paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
} & import("@octokit/plugin-rest-endpoint-methods/dist-types/types").Api & {
    retry: {
        retryRequest: (error: import("@octokit/request-error").RequestError, retries: number, retryAfter: number) => import("@octokit/request-error").RequestError;
    };
}>;
export declare type Octokit = InstanceType<typeof Octokit>;
