import graphiqlHTML from '../graphiql-html.js';
export function shouldRenderGraphiQL({ headers, method }) {
    return method === 'GET' && !!headers?.get('accept')?.includes('text/html');
}
export const renderGraphiQL = (opts) => graphiqlHTML
    .replace('__TITLE__', opts?.title || 'Yoga GraphiQL')
    .replace('__OPTS__', JSON.stringify(opts ?? {}));
export function useGraphiQL(config) {
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
    const renderer = config?.render ?? renderGraphiQL;
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
