import { IntNumber } from "../types";
export interface ClientMessage {
    type: string;
    id: IntNumber;
}
export interface ClientMessageHostSession extends ClientMessage {
    type: "HostSession";
    sessionId: string;
    sessionKey: string;
}
export declare function ClientMessageHostSession(params: Omit<ClientMessageHostSession, "type">): ClientMessageHostSession;
export interface ClientMessageIsLinked extends ClientMessage {
    type: "IsLinked";
    sessionId: string;
}
export declare function ClientMessageIsLinked(params: Omit<ClientMessageIsLinked, "type">): ClientMessageIsLinked;
export interface ClientMessageGetSessionConfig extends ClientMessage {
    type: "GetSessionConfig";
    sessionId: string;
}
export declare function ClientMessageGetSessionConfig(params: Omit<ClientMessageGetSessionConfig, "type">): ClientMessageGetSessionConfig;
export interface ClientMessageSetSessionConfig extends ClientMessage {
    type: "SetSessionConfig";
    id: IntNumber;
    sessionId: string;
    webhookId?: string | null;
    webhookUrl?: string | null;
    metadata?: {
        [key: string]: string | null;
    };
}
export declare function ClientMessageSetSessionConfig(params: Omit<ClientMessageSetSessionConfig, "type">): ClientMessageSetSessionConfig;
export interface ClientMessagePublishEvent extends ClientMessage {
    type: "PublishEvent";
    sessionId: string;
    event: string;
    data: string;
    callWebhook: boolean;
}
export declare function ClientMessagePublishEvent(params: Omit<ClientMessagePublishEvent, "type">): ClientMessagePublishEvent;
