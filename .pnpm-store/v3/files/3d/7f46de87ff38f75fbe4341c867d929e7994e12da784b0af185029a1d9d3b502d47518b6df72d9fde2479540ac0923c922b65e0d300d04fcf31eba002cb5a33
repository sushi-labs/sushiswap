import { Observable } from "rxjs";
import { DiagnosticLogger } from "./DiagnosticLogger";
import { ServerMessageEvent } from "./ServerMessage";
import { SessionConfig } from "./SessionConfig";
/**
 * Coinbase Wallet Connection
 */
export declare class WalletSDKConnection {
    private sessionId;
    private sessionKey;
    private diagnostic?;
    private ws;
    private subscriptions;
    private destroyed;
    private lastHeartbeatResponse;
    private nextReqId;
    private connectedSubject;
    private linkedSubject;
    private sessionConfigSubject;
    /**
     * Constructor
     * @param sessionId Session ID
     * @param sessionKey Session Key
     * @param linkAPIUrl Coinbase Wallet link server URL
     * @param [WebSocketClass] Custom WebSocket implementation
     */
    constructor(sessionId: string, sessionKey: string, linkAPIUrl: string, diagnostic?: DiagnosticLogger | undefined, WebSocketClass?: typeof WebSocket);
    /**
     * Make a connection to the server
     */
    connect(): void;
    /**
     * Terminate connection, and mark as destroyed. To reconnect, create a new
     * instance of WalletSDKConnection
     */
    destroy(): void;
    get isDestroyed(): boolean;
    /**
     * Emit true if connected and authenticated, else false
     * @returns an Observable
     */
    get connected$(): Observable<boolean>;
    /**
     * Emit once connected
     * @returns an Observable
     */
    get onceConnected$(): Observable<void>;
    /**
     * Emit true if linked (a guest has joined before)
     * @returns an Observable
     */
    get linked$(): Observable<boolean>;
    /**
     * Emit once when linked
     * @returns an Observable
     */
    get onceLinked$(): Observable<void>;
    /**
     * Emit current session config if available, and subsequent updates
     * @returns an Observable for the session config
     */
    get sessionConfig$(): Observable<SessionConfig>;
    /**
     * Emit incoming Event messages
     * @returns an Observable for the messages
     */
    get incomingEvent$(): Observable<ServerMessageEvent>;
    /**
     * Set session metadata in SessionConfig object
     * @param key
     * @param value
     * @returns an Observable that completes when successful
     */
    setSessionMetadata(key: string, value: string | null): Observable<void>;
    /**
     * Publish an event and emit event ID when successful
     * @param event event name
     * @param data event data
     * @param callWebhook whether the webhook should be invoked
     * @returns an Observable that emits event ID when successful
     */
    publishEvent(event: string, data: string, callWebhook?: boolean): Observable<string>;
    private sendData;
    private updateLastHeartbeat;
    private heartbeat;
    private makeRequest;
    private authenticate;
    private sendIsLinked;
    private sendGetSessionConfig;
}
