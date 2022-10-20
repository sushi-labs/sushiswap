"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUnhandledRoute = void 0;
const tslib_1 = require("tslib");
const landing_page_html_js_1 = tslib_1.__importDefault(require("../landing-page-html.js"));
function useUnhandledRoute(args) {
    return {
        onRequest({ request, fetchAPI, endResponse, url }) {
            const { pathname: requestPath } = url;
            if (requestPath !== args.graphqlEndpoint) {
                if (args.showLandingPage === true &&
                    request.method === 'GET' &&
                    !!request.headers?.get('accept')?.includes('text/html')) {
                    endResponse(new fetchAPI.Response(landing_page_html_js_1.default
                        .replace(/__GRAPHIQL_LINK__/g, args.graphqlEndpoint)
                        .replace(/__REQUEST_PATH__/g, requestPath), {
                        headers: {
                            'Content-Type': 'text/html',
                        },
                    }));
                    return;
                }
                endResponse(new fetchAPI.Response('', {
                    status: 404,
                    statusText: 'Not Found',
                }));
            }
        },
    };
}
exports.useUnhandledRoute = useUnhandledRoute;
