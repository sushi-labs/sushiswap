import graphiqlHTML from '../graphiqlHTML.js';
export function shouldRenderGraphiQL({ headers, method }) {
    var _a;
    return method === 'GET' && !!((_a = headers === null || headers === void 0 ? void 0 : headers.get('accept')) === null || _a === void 0 ? void 0 : _a.includes('text/html'));
}
export const renderGraphiQL = (opts) => graphiqlHTML
    .replace('__TITLE__', (opts === null || opts === void 0 ? void 0 : opts.title) || 'Yoga GraphiQL')
    .replace('__OPTS__', JSON.stringify(opts !== null && opts !== void 0 ? opts : {}));
export function useGraphiQL(config) {
    var _a, _b;
    const logger = (_a = config === null || config === void 0 ? void 0 : config.logger) !== null && _a !== void 0 ? _a : console;
    let graphiqlOptionsFactory;
    if (typeof (config === null || config === void 0 ? void 0 : config.options) === 'function') {
        graphiqlOptionsFactory = config === null || config === void 0 ? void 0 : config.options;
    }
    else if (typeof (config === null || config === void 0 ? void 0 : config.options) === 'object') {
        graphiqlOptionsFactory = () => config === null || config === void 0 ? void 0 : config.options;
    }
    else if ((config === null || config === void 0 ? void 0 : config.options) === false) {
        graphiqlOptionsFactory = () => false;
    }
    else {
        graphiqlOptionsFactory = () => ({});
    }
    const renderer = (_b = config === null || config === void 0 ? void 0 : config.render) !== null && _b !== void 0 ? _b : renderGraphiQL;
    return {
        async onRequest({ request, serverContext, fetchAPI, endResponse }) {
            const requestPath = request.url.split('?')[0];
            if ((config === null || config === void 0 ? void 0 : config.endpoint) != null && !requestPath.endsWith(config === null || config === void 0 ? void 0 : config.endpoint)) {
                logger.debug(`Responding 404 Not Found`);
                const response = new fetchAPI.Response(`Unable to ${request.method} ${requestPath}`, {
                    status: 404,
                    statusText: `Not Found`,
                });
                endResponse(response);
            }
            else if (shouldRenderGraphiQL(request)) {
                logger.debug(`Rendering GraphiQL`);
                const graphiqlOptions = graphiqlOptionsFactory(request, serverContext);
                if (graphiqlOptions) {
                    const graphiQLBody = await renderer({
                        endpoint: config === null || config === void 0 ? void 0 : config.endpoint,
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
