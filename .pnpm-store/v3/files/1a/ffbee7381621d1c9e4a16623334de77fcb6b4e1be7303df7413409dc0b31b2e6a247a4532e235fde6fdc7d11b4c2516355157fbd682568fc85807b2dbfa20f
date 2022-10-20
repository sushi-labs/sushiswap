import { Web3RequestMessage } from "../relay/Web3RequestMessage";
import { Web3ResponseMessage } from "../relay/Web3ResponseMessage";
import { ConnectionState } from "./RxWebSocket";
import { ServerMessage, ServerMessageIsLinkedOK } from "./ServerMessage";
export declare type LogProperties = {
    addresses_length?: number;
    alreadyDestroyed?: boolean;
    eventId?: Web3RequestMessage["id"] | Web3ResponseMessage["id"];
    isSessionMismatched?: string;
    linked?: ServerMessageIsLinkedOK["linked"];
    message?: string;
    metadata_keys?: string[];
    method?: string;
    onlineGuests?: number;
    sessionIdHash?: string;
    sessionMetadataChange?: string;
    state?: ConnectionState;
    storedSessionIdHash?: string;
    type?: ServerMessage["type"];
    value?: string;
};
declare type Keys = keyof typeof EVENTS;
export declare type EventType = typeof EVENTS[Keys];
export interface DiagnosticLogger {
    log(eventType: EventType, logProperties?: LogProperties): void;
}
export declare const EVENTS: {
    STARTED_CONNECTING: string;
    CONNECTED_STATE_CHANGE: string;
    DISCONNECTED: string;
    METADATA_DESTROYED: string;
    LINKED: string;
    FAILURE: string;
    SESSION_CONFIG_RECEIVED: string;
    ETH_ACCOUNTS_STATE: string;
    SESSION_STATE_CHANGE: string;
    UNLINKED_ERROR_STATE: string;
    SKIPPED_CLEARING_SESSION: string;
    GENERAL_ERROR: string;
    WEB3_REQUEST: string;
    WEB3_REQUEST_PUBLISHED: string;
    WEB3_RESPONSE: string;
    UNKNOWN_ADDRESS_ENCOUNTERED: string;
};
export {};
