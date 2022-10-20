export const useEnvelop = (envelop) => {
    return {
        onPluginInit({ addPlugin }) {
            for (const plugin of envelop._plugins) {
                addPlugin(plugin);
            }
        },
    };
};
