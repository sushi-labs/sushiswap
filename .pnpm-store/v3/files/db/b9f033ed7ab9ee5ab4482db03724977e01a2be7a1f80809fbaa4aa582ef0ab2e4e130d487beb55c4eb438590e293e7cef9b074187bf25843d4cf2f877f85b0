import { isJsonRpcRequest, isJsonRpcResponseSuccess, isJsonRpcResponseError, isInternalEvent, isReservedEvent, } from "@walletconnect/utils";
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
        if (isJsonRpcRequest(payload)) {
            event = payload.method;
        }
        else if (isJsonRpcResponseSuccess(payload) || isJsonRpcResponseError(payload)) {
            event = `response:${payload.id}`;
        }
        else if (isInternalEvent(payload)) {
            event = payload.event;
        }
        else {
            event = "";
        }
        if (event) {
            eventEmitters = this._eventEmitters.filter((eventEmitter) => eventEmitter.event === event);
        }
        if ((!eventEmitters || !eventEmitters.length) &&
            !isReservedEvent(event) &&
            !isInternalEvent(event)) {
            eventEmitters = this._eventEmitters.filter((eventEmitter) => eventEmitter.event === "call_request");
        }
        eventEmitters.forEach((eventEmitter) => {
            if (isJsonRpcResponseError(payload)) {
                const error = new Error(payload.error.message);
                eventEmitter.callback(error, null);
            }
            else {
                eventEmitter.callback(null, payload);
            }
        });
    }
}
export default EventManager;
//# sourceMappingURL=events.js.map