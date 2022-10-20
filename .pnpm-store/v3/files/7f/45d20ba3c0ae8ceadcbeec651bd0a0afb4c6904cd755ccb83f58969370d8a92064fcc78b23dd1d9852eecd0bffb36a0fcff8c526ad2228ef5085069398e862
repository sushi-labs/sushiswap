export const useExtendContext = (contextFactory) => ({
    async onContextBuilding({ context, extendContext }) {
        extendContext((await contextFactory(context)));
    },
});
