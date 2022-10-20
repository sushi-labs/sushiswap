// @ts-ignore - requires esModuleInterop flag
import fromEntries from "fromentries";
export async function handleRequest(app, { pathPrefix = "/api/github/oauth" }, request) {
    if (request.method === "OPTIONS") {
        return {
            status: 200,
            headers: {
                "access-control-allow-origin": "*",
                "access-control-allow-methods": "*",
                "access-control-allow-headers": "Content-Type, User-Agent, Authorization",
            },
        };
    }
    // request.url may include ?query parameters which we don't want for `route`
    // hence the workaround using new URL()
    const { pathname } = new URL(request.url, "http://localhost");
    const route = [request.method, pathname].join(" ");
    const routes = {
        getLogin: `GET ${pathPrefix}/login`,
        getCallback: `GET ${pathPrefix}/callback`,
        createToken: `POST ${pathPrefix}/token`,
        getToken: `GET ${pathPrefix}/token`,
        patchToken: `PATCH ${pathPrefix}/token`,
        patchRefreshToken: `PATCH ${pathPrefix}/refresh-token`,
        scopeToken: `POST ${pathPrefix}/token/scoped`,
        deleteToken: `DELETE ${pathPrefix}/token`,
        deleteGrant: `DELETE ${pathPrefix}/grant`,
    };
    // handle unknown routes
    if (!Object.values(routes).includes(route)) {
        return null;
    }
    let json;
    try {
        const text = await request.text();
        json = text ? JSON.parse(text) : {};
    }
    catch (error) {
        return {
            status: 400,
            headers: {
                "content-type": "application/json",
                "access-control-allow-origin": "*",
            },
            text: JSON.stringify({
                error: "[@octokit/oauth-app] request error",
            }),
        };
    }
    const { searchParams } = new URL(request.url, "http://localhost");
    const query = fromEntries(searchParams);
    const headers = request.headers;
    try {
        if (route === routes.getLogin) {
            const { url } = app.getWebFlowAuthorizationUrl({
                state: query.state,
                scopes: query.scopes ? query.scopes.split(",") : undefined,
                allowSignup: query.allowSignup !== "false",
                redirectUrl: query.redirectUrl,
            });
            return { status: 302, headers: { location: url } };
        }
        if (route === routes.getCallback) {
            if (query.error) {
                throw new Error(`[@octokit/oauth-app] ${query.error} ${query.error_description}`);
            }
            if (!query.code) {
                throw new Error('[@octokit/oauth-app] "code" parameter is required');
            }
            const { authentication: { token }, } = await app.createToken({
                code: query.code,
            });
            return {
                status: 200,
                headers: {
                    "content-type": "text/html",
                },
                text: `<h1>Token created successfull</h1>
    
<p>Your token is: <strong>${token}</strong>. Copy it now as it cannot be shown again.</p>`,
            };
        }
        if (route === routes.createToken) {
            const { code, redirectUrl } = json;
            if (!code) {
                throw new Error('[@octokit/oauth-app] "code" parameter is required');
            }
            const result = await app.createToken({
                code,
                redirectUrl,
            });
            // @ts-ignore
            delete result.authentication.clientSecret;
            return {
                status: 201,
                headers: {
                    "content-type": "application/json",
                    "access-control-allow-origin": "*",
                },
                text: JSON.stringify(result),
            };
        }
        if (route === routes.getToken) {
            const token = headers.authorization?.substr("token ".length);
            if (!token) {
                throw new Error('[@octokit/oauth-app] "Authorization" header is required');
            }
            const result = await app.checkToken({
                token,
            });
            // @ts-ignore
            delete result.authentication.clientSecret;
            return {
                status: 200,
                headers: {
                    "content-type": "application/json",
                    "access-control-allow-origin": "*",
                },
                text: JSON.stringify(result),
            };
        }
        if (route === routes.patchToken) {
            const token = headers.authorization?.substr("token ".length);
            if (!token) {
                throw new Error('[@octokit/oauth-app] "Authorization" header is required');
            }
            const result = await app.resetToken({ token });
            // @ts-ignore
            delete result.authentication.clientSecret;
            return {
                status: 200,
                headers: {
                    "content-type": "application/json",
                    "access-control-allow-origin": "*",
                },
                text: JSON.stringify(result),
            };
        }
        if (route === routes.patchRefreshToken) {
            const token = headers.authorization?.substr("token ".length);
            if (!token) {
                throw new Error('[@octokit/oauth-app] "Authorization" header is required');
            }
            const { refreshToken } = json;
            if (!refreshToken) {
                throw new Error("[@octokit/oauth-app] refreshToken must be sent in request body");
            }
            const result = await app.refreshToken({ refreshToken });
            // @ts-ignore
            delete result.authentication.clientSecret;
            return {
                status: 200,
                headers: {
                    "content-type": "application/json",
                    "access-control-allow-origin": "*",
                },
                text: JSON.stringify(result),
            };
        }
        if (route === routes.scopeToken) {
            const token = headers.authorization?.substr("token ".length);
            if (!token) {
                throw new Error('[@octokit/oauth-app] "Authorization" header is required');
            }
            const result = await app.scopeToken({
                token,
                ...json,
            });
            // @ts-ignore
            delete result.authentication.clientSecret;
            return {
                status: 200,
                headers: {
                    "content-type": "application/json",
                    "access-control-allow-origin": "*",
                },
                text: JSON.stringify(result),
            };
        }
        if (route === routes.deleteToken) {
            const token = headers.authorization?.substr("token ".length);
            if (!token) {
                throw new Error('[@octokit/oauth-app] "Authorization" header is required');
            }
            await app.deleteToken({
                token,
            });
            return {
                status: 204,
                headers: { "access-control-allow-origin": "*" },
            };
        }
        // route === routes.deleteGrant
        const token = headers.authorization?.substr("token ".length);
        if (!token) {
            throw new Error('[@octokit/oauth-app] "Authorization" header is required');
        }
        await app.deleteAuthorization({
            token,
        });
        return {
            status: 204,
            headers: { "access-control-allow-origin": "*" },
        };
    }
    catch (error) {
        return {
            status: 400,
            headers: {
                "content-type": "application/json",
                "access-control-allow-origin": "*",
            },
            text: JSON.stringify({ error: error.message }),
        };
    }
}
