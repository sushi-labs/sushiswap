"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@walletconnect/utils");
class EventManager {
    constructor() {
        this._eventEmitters = [];
    }
    subscribe(eventEmitter) {
        this._eventEmitters.push(eventEmitter);
    }
    unsubscribe(event) {
        this._eventEmitters = this._eventEmitters.filter(x => x.event !== event);
    }
    trigger(payload) {
        let eventEmitters = [];
        let event;
        if ((0, utils_1.isJsonRpcRequest)(payload)) {
            event = payload.method;
        }
        else if ((0, utils_1.isJsonRpcResponseSuccess)(payload) || (0, utils_1.isJsonRpcResponseError)(payload)) {
            event = `response:${payload.id}`;
        }
        else if ((0, utils_1.isInternalEvent)(payload)) {
            event = payload.event;
        }
        else {
            event = "";
        }
        if (event) {
            eventEmitters = this._eventEmitters.filter((eventEmitter) => eventEmitter.event === event);
        }
        if ((!eventEmitters || !eventEmitters.length) &&
            !(0, utils_1.isReservedEvent)(event) &&
            !(0, utils_1.isInternalEvent)(event)) {
            eventEmitters = this._eventEmitters.filter((eventEmitter) => eventEmitter.event === "call_request");
        }
        eventEmitters.forEach((eventEmitter) => {
            if ((0, utils_1.isJsonRpcResponseError)(payload)) {
                const error = new Error(payload.error.message);
                eventEmitter.callback(error, null);
            }
            else {
                eventEmitter.callback(null, payload);
            }
        });
    }
}
exports.default = EventManager;
//# sourceMappingURL=events.js.map