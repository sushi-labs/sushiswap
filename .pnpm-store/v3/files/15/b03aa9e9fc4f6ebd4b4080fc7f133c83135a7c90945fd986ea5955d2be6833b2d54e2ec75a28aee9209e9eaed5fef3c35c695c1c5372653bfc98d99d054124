"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExtendContext = void 0;
const useExtendContext = (contextFactory) => ({
    async onContextBuilding({ context, extendContext }) {
        extendContext((await contextFactory(context)));
    },
});
exports.useExtendContext = useExtendContext;
