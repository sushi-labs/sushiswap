import { Deprecation } from "deprecation";
import { getAppAuthentication } from "./get-app-authentication";
import { getInstallationAuthentication } from "./get-installation-authentication";
export async function auth(state, authOptions) {
    switch (authOptions.type) {
        case "app":
            return getAppAuthentication(state);
        // @ts-expect-error "oauth" is not supperted in types
        case "oauth":
            state.log.warn(
            // @ts-expect-error `log.warn()` expects string
            new Deprecation(`[@octokit/auth-app] {type: "oauth"} is deprecated. Use {type: "oauth-app"} instead`));
        case "oauth-app":
            return state.oauthApp({ type: "oauth-app" });
        case "installation":
            authOptions;
            return getInstallationAuthentication(state, {
                ...authOptions,
                type: "installation",
            });
        case "oauth-user":
            // @ts-expect-error TODO: infer correct auth options type based on type. authOptions should be typed as "WebFlowAuthOptions | OAuthAppDeviceFlowAuthOptions | GitHubAppDeviceFlowAuthOptions"
            return state.oauthApp(authOptions);
        default:
            // @ts-expect-error type is "never" at this point
            throw new Error(`Invalid auth type: ${authOptions.type}`);
    }
}
