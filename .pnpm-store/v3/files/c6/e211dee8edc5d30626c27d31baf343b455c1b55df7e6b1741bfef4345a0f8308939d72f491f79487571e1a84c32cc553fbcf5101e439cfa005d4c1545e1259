export declare type TypedEvent = Event & {
    data?: unknown;
};
export interface TypedEventListener<TEvent extends TypedEvent> extends EventListener {
    (evt: TEvent): void;
}
export interface TypedEventListenerObject<TEvent extends TypedEvent> extends EventListener {
    handleEvent(object: TEvent): void;
}
export declare type TypedEventListenerOrEventListenerObject<TEvent extends TypedEvent> = TypedEventListener<TEvent> | TypedEventListenerObject<TEvent>;
export interface TypedEventTarget<TEvent extends TypedEvent> extends EventTarget {
    addEventListener(type: string, callback: TypedEventListenerOrEventListenerObject<TEvent>, options?: AddEventListenerOptions | boolean): void;
    dispatchEvent(event: TEvent): boolean;
    removeEventListener(type: string, callback: TypedEventListenerOrEventListenerObject<TEvent>, options?: EventListenerOptions | boolean): void;
}
export declare type EventAPI = {
    Event: typeof Event;
    EventTarget: typeof EventTarget;
};
export declare const resolveGlobalConfig: (api?: EventAPI) => EventAPI;
