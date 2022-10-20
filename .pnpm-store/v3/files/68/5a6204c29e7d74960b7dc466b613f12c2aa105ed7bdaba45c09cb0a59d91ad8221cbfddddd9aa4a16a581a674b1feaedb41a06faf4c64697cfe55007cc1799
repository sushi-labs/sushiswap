import { Observable } from "rxjs";
export declare enum ConnectionState {
    DISCONNECTED = 0,
    CONNECTING = 1,
    CONNECTED = 2
}
/**
 * Rx-ified WebSocket
 */
export declare class RxWebSocket<T = object> {
    private readonly WebSocketClass;
    private readonly url;
    private webSocket;
    private connectionStateSubject;
    private incomingDataSubject;
    /**
     * Constructor
     * @param url WebSocket server URL
     * @param [WebSocketClass] Custom WebSocket implementation
     */
    constructor(url: string, WebSocketClass?: typeof WebSocket);
    /**
     * Make a websocket connection
     * @returns an Observable that completes when connected
     */
    connect(): Observable<void>;
    /**
     * Disconnect from server
     */
    disconnect(): void;
    /**
     * Emit current connection state and subsequent changes
     * @returns an Observable for the connection state
     */
    get connectionState$(): Observable<ConnectionState>;
    /**
     * Emit incoming data from server
     * @returns an Observable for the data received
     */
    get incomingData$(): Observable<string>;
    /**
     * Emit incoming JSON data from server. non-JSON data are ignored
     * @returns an Observable for parsed JSON data
     */
    get incomingJSONData$(): Observable<T>;
    /**
     * Send data to server
     * @param data text to send
     */
    sendData(data: string): void;
    private clearWebSocket;
}
