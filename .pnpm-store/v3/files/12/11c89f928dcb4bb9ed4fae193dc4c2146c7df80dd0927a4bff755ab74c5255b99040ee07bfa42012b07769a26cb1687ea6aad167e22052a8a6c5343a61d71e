import { githubAppJwt } from "universal-github-app-jwt";
export async function getAppAuthentication({ appId, privateKey, timeDifference, }) {
    try {
        const appAuthentication = await githubAppJwt({
            id: +appId,
            privateKey,
            now: timeDifference && Math.floor(Date.now() / 1000) + timeDifference,
        });
        return {
            type: "app",
            token: appAuthentication.token,
            appId: appAuthentication.appId,
            expiresAt: new Date(appAuthentication.expiration * 1000).toISOString(),
        };
    }
    catch (error) {
        if (privateKey === "-----BEGIN RSA PRIVATE KEY-----") {
            throw new Error("The 'privateKey` option contains only the first line '-----BEGIN RSA PRIVATE KEY-----'. If you are setting it using a `.env` file, make sure it is set on a single line with newlines replaced by '\n'");
        }
        else {
            throw error;
        }
    }
}
