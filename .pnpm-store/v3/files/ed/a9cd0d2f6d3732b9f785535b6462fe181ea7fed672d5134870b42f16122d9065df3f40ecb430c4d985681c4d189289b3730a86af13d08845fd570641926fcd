"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGraphiQL = exports.renderGraphiQL = exports.shouldRenderGraphiQL = void 0;
const tslib_1 = require("tslib");
const graphiql_html_js_1 = tslib_1.__importDefault(require("../graphiql-html.js"));
function shouldRenderGraphiQL({ headers, method }) {
    return method === 'GET' && !!headers?.get('accept')?.includes('text/html');
}
exports.shouldRenderGraphiQL = shouldRenderGraphiQL;
const renderGraphiQL = (opts) => graphiql_html_js_1.default
    .replace('__TITLE__', opts?.title || 'Yoga GraphiQL')
    .replace('__OPTS__', JSON.stringify(opts ?? {}));
exports.renderGraphiQL = renderGraphiQL;
function useGraphiQL(config) {
    const logger = config.logger ?? console;
    let graphiqlOptionsFactory;
    if (typeof config?.options === 'function') {
        graphiqlOptionsFactory = config?.options;
    }
    else if (typeof config?.options === 'object') {
        graphiqlOptionsFactory = () => config?.options;
    }
    else if (config?.options === false) {
        graphiqlOptionsFactory = () => false;
    }
    else {
        graphiqlOptionsFactory = () => ({});
    }
    const renderer = config?.render ?? exports.renderGraphiQL;
    return {
        async onRequest({ request, serverContext, fetchAPI, endResponse, url }) {
            if (shouldRenderGraphiQL(request) &&
                config.graphqlEndpoint === url.pathname) {
                logger.debug(`Rendering GraphiQL`);
                const graphiqlOptions = graphiqlOptionsFactory(request, serverContext);
                if (graphiqlOptions) {
                    const graphiQLBody = await renderer({
                        endpoint: config.graphqlEndpoint,
                        ...(graphiqlOptions === true ? {} : graphiqlOptions),
                    });
                    const response = new fetchAPI.Response(graphiQLBody, {
                        headers: {
                            'Content-Type': 'text/html',
                        },
                        status: 200,
                    });
                    endResponse(response);
                }
            }
        },
    };
}
exports.useGraphiQL = useGraphiQL;
