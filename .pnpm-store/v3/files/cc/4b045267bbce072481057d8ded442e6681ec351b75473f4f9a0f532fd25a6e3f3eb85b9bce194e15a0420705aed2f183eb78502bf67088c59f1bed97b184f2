"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEnvelop = void 0;
const useEnvelop = (envelop) => {
    return {
        onPluginInit({ addPlugin }) {
            for (const plugin of envelop._plugins) {
                addPlugin(plugin);
            }
        },
    };
};
exports.useEnvelop = useEnvelop;
