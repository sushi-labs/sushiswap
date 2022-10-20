"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envelop = void 0;
const enable_if_js_1 = require("./enable-if.js");
const orchestrator_js_1 = require("./orchestrator.js");
const traced_orchestrator_js_1 = require("./traced-orchestrator.js");
function envelop(options) {
    const plugins = options.plugins.filter(enable_if_js_1.isPluginEnabled);
    let orchestrator = (0, orchestrator_js_1.createEnvelopOrchestrator)(plugins);
    if (options.enableInternalTracing) {
        orchestrator = (0, traced_orchestrator_js_1.traceOrchestrator)(orchestrator);
    }
    const getEnveloped = (initialContext = {}) => {
        const typedOrchestrator = orchestrator;
        typedOrchestrator.init(initialContext);
        return {
            parse: typedOrchestrator.parse(initialContext),
            validate: typedOrchestrator.validate(initialContext),
            contextFactory: typedOrchestrator.contextFactory(initialContext),
            execute: typedOrchestrator.execute,
            subscribe: typedOrchestrator.subscribe,
            schema: typedOrchestrator.getCurrentSchema(),
        };
    };
    getEnveloped._plugins = plugins;
    return getEnveloped;
}
exports.envelop = envelop;
