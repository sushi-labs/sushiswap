import { IInternalEvent, IJsonRpcResponseSuccess, IJsonRpcResponseError, IJsonRpcRequest, IEventEmitter } from "@walletconnect/types";
declare class EventManager {
    private _eventEmitters;
    constructor();
    subscribe(eventEmitter: IEventEmitter): void;
    unsubscribe(event: string): void;
    trigger(payload: IJsonRpcRequest | IJsonRpcResponseSuccess | IJsonRpcResponseError | IInternalEvent): void;
}
export default EventManager;
//# sourceMappingURL=events.d.ts.map