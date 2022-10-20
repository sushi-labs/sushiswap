"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveGlobalConfig = void 0;
const resolveGlobalConfig = (api = globalThis) => {
    if (!api.Event || !api.EventTarget) {
        throw new Error(`
[@graphql-yoga/subscription] 'createPubSub' uses the Event and EventTarget APIs.

In modern JavaScript environments those are part of the global scope. However, if you are using an older version of Node.js (< 16.x.x), those APIs must be polyfilled.
You can provide polyfills to the 'createPubSub' function:

\`\`\`
// yarn install --exact event-target-polyfill@0.0.3
import 'event-target-polyfill'

const pubSub = createPubSub()
\`\`\`

Alternatively, you can provide your own custom implementation.

\`\`\`
const pubSub = createPubSub({
  event: {
    Event,
    EventTarget,
  }
})
\`\`\`
`);
    }
    return globalThis;
};
exports.resolveGlobalConfig = resolveGlobalConfig;
