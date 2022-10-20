import { createLogger } from "./createLogger";
import { createEventHandler } from "./event-handler/index";
import { sign } from "./sign";
import { verify } from "./verify";
import { verifyAndReceive } from "./verify-and-receive";
export { createNodeMiddleware } from "./middleware/node/index";
export { emitterEventNames } from "./generated/webhook-names";
// U holds the return value of `transform` function in Options
class Webhooks {
    constructor(options) {
        if (!options || !options.secret) {
            throw new Error("[@octokit/webhooks] options.secret required");
        }
        const state = {
            eventHandler: createEventHandler(options),
            secret: options.secret,
            hooks: {},
            log: createLogger(options.log),
        };
        this.sign = sign.bind(null, options.secret);
        this.verify = verify.bind(null, options.secret);
        this.on = state.eventHandler.on;
        this.onAny = state.eventHandler.onAny;
        this.onError = state.eventHandler.onError;
        this.removeListener = state.eventHandler.removeListener;
        this.receive = state.eventHandler.receive;
        this.verifyAndReceive = verifyAndReceive.bind(null, state);
    }
}
export { createEventHandler, Webhooks, };
