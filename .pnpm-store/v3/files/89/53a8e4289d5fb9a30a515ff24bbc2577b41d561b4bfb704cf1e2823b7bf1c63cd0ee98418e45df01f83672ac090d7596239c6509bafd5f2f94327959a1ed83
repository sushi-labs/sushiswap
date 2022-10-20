import { isPluginEnabled } from './enable-if.js';
import { createEnvelopOrchestrator } from './orchestrator.js';
import { traceOrchestrator } from './traced-orchestrator.js';
export function envelop(options) {
    const plugins = options.plugins.filter(isPluginEnabled);
    let orchestrator = createEnvelopOrchestrator(plugins);
    if (options.enableInternalTracing) {
        orchestrator = traceOrchestrator(orchestrator);
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
