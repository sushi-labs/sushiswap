import { envelopIsIntrospectionSymbol, isIntrospectionOperationString } from '../utils.js';
const DEFAULT_OPTIONS = {
    logFn: console.log,
};
export const useLogger = (rawOptions = DEFAULT_OPTIONS) => {
    const options = {
        DEFAULT_OPTIONS,
        ...rawOptions,
    };
    return {
        onParse({ extendContext, params }) {
            if (options.skipIntrospection && isIntrospectionOperationString(params.source)) {
                extendContext({
                    [envelopIsIntrospectionSymbol]: true,
                });
            }
        },
        onExecute({ args }) {
            if (args.contextValue[envelopIsIntrospectionSymbol]) {
                return;
            }
            options.logFn('execute-start', { args });
            return {
                onExecuteDone: ({ result }) => {
                    options.logFn('execute-end', { args, result });
                },
            };
        },
        onSubscribe({ args }) {
            if (args.contextValue[envelopIsIntrospectionSymbol]) {
                return;
            }
            options.logFn('subscribe-start', { args });
            return {
                onSubscribeResult: ({ result }) => {
                    options.logFn('subscribe-end', { args, result });
                },
            };
        },
    };
};
